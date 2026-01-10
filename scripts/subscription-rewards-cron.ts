import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

/**
 * Cron job to distribute subscription rewards to customers
 * Runs Monday to Friday at midnight (00:00)
 * Distributes rewardPercent amount daily until total reaches targetAmount
 */
async function distributeSubscriptionRewards() {
  console.log(`Starting subscription rewards distribution: ${new Date().toISOString()}`);

  try {
    // Get the current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = new Date().getDay();
    
    // Only run on Monday to Friday (1-5)
    if (currentDay === 0 || currentDay === 6) {
      console.log('Skipping rewards distribution - weekend day');
      return;
    }

    // Get all active user subscription cards
    const activeSubscriptions = await prisma.userSubscriptionCard.findMany({
      where: {
        status: 'ACTIVE',
        startDate: { lte: new Date() }, // Started
        endDate: { gte: new Date() }, // Not expired
      },
      include: {
        customer: true,
        card: {
          select: {
            rewardPercent: true,
            targetAmount: true,
          }
        }
      }
    });

    console.log(`Found ${activeSubscriptions.length} active subscriptions to process`);

    for (const subscription of activeSubscriptions) {
      // Calculate reward amount for this subscription
      const rewardPercent = Number(subscription.card.rewardPercent);
      const targetAmount = Number(subscription.card.targetAmount);
      const currentAmount = Number(subscription.currentAmount || 0);

      // Calculate remaining amount to reach target
      const remainingAmount = targetAmount - currentAmount;

      // If already reached target, skip
      if (remainingAmount <= 0) {
        console.log(`Subscription ${subscription.id} for customer ${subscription.customerId} has already reached target amount`);
        continue;
      }

      // Calculate daily reward amount
      let dailyReward = rewardPercent;

      // If remaining amount is less than daily reward, use remaining amount instead
      if (remainingAmount < dailyReward) {
        dailyReward = remainingAmount;
      }

      // Create wallet transaction for the reward
      const wallet = await prisma.wallet.upsert({
        where: {
          customerId_type: {
            customerId: subscription.customerId,
            type: 'SHOPPING',
          }
        },
        update: {
          balance: { increment: dailyReward },
          updatedAt: new Date(),
        },
        create: {
          customerId: subscription.customerId,
          type: 'SHOPPING',
          balance: dailyReward,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create wallet transaction record
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          customerId: subscription.customerId,
          type: 'CREDIT',
          reason: 'REWARD',
          status: 'SUCCESS',
          amount: dailyReward,
          balanceBefore: Number(wallet.balance) - dailyReward,
          balanceAfter: Number(wallet.balance),
          subscriptionId: subscription.id,
          metadata: {
            subscriptionCardId: subscription.cardId,
            rewardDate: new Date().toISOString(),
            rewardAmount: dailyReward.toString(),
          },
          createdAt: new Date(),
        },
      });

      // Update the current amount in user subscription card
      await prisma.userSubscriptionCard.update({
        where: { id: subscription.id },
        data: {
          currentAmount: { increment: dailyReward },
        },
      });

      console.log(`Distributed reward of ${dailyReward} to customer ${subscription.customerId} for subscription ${subscription.id}`);
    }

    console.log(`Subscription rewards distribution completed successfully`);
  } catch (error) {
    console.error('Error in subscription rewards distribution:', error);
  }
}

// Initialize cron job
function initializeCronJob() {
  console.log('Initializing subscription rewards cron job...');
  
  // Schedule the job to run every weekday (Monday to Friday) at midnight
  // Cron expression: second minute hour day month dayOfWeek
  // Run at 00:00 every weekday: 0 0 * * 1-5
  cron.schedule('0 0 * * 1-5', () => {
    distributeSubscriptionRewards();
  }, {
    timezone: "Asia/Kolkata" // Set to your preferred timezone
  });

  console.log('Subscription rewards cron job scheduled to run every weekday at midnight');
}

// If running this script directly, execute immediately and then start cron
if (require.main === module) {
  console.log('Running subscription rewards distribution now...');
  
  // Run once immediately for testing
  distributeSubscriptionRewards()
    .then(() => {
      console.log('Immediate run completed, starting cron job...');
      initializeCronJob();
    })
    .catch((error) => {
      console.error('Error in immediate run:', error);
      process.exit(1);
    });
}

export { distributeSubscriptionRewards, initializeCronJob };