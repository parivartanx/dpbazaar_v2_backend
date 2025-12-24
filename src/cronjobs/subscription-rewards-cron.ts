import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';
import { Decimal } from '@prisma/client/runtime/library';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Cron job to distribute subscription rewards to customers
 * Runs Monday to Friday at midnight (00:00)
 * Distributes rewardPercent amount daily until total reaches targetAmount
 */
async function distributeSubscriptionRewards() {
  const executionDate = new Date();
  executionDate.setHours(0, 0, 0, 0); // Set to start of day for uniqueness
  
  // Check if job already ran today to prevent duplicates
  const existingJob = await prisma.jobExecution.findUnique({
    where: {
      jobName_executionDate: {
        jobName: 'subscription-rewards-distribution',
        executionDate: executionDate,
      }
    }
  });
  
  if (existingJob) {
    logger.info(`Subscription rewards distribution already executed for ${executionDate.toISOString()}, skipping.`);
    return;
  }
  
  // Create job execution record
  const jobExecution = await prisma.jobExecution.create({
    data: {
      jobName: 'subscription-rewards-distribution',
      executionDate: executionDate,
      status: 'RUNNING',
      startedAt: new Date(),
    }
  });
  
  logger.info(`Starting subscription rewards distribution: ${executionDate.toISOString()}`);

  try {
    // Get the current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = new Date().getDay();
    
    // Only run on Monday to Friday (1-5)
    if (currentDay === 0 || currentDay === 6) {
      logger.info('Skipping rewards distribution - weekend day');
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

    logger.info(`Found ${activeSubscriptions.length} active subscriptions to process`);

    for (const subscription of activeSubscriptions) {
      // Calculate reward amount for this subscription
      const rewardPercent = new Decimal(subscription.card.rewardPercent);
      const targetAmount = new Decimal(subscription.card.targetAmount);
      const currentAmount = new Decimal(subscription.currentAmount || 0);

      // Calculate remaining amount to reach target
      const remainingAmount = targetAmount.minus(currentAmount);

      // If already reached target, skip
      if (remainingAmount.lte(0)) {
        logger.info(`Subscription ${subscription.id} for customer ${subscription.customerId} has already reached target amount`);
        continue;
      }

      // Calculate daily reward amount
      let dailyReward = rewardPercent;

      // If remaining amount is less than daily reward, use remaining amount instead
      if (remainingAmount.lt(dailyReward)) {
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
          balanceBefore: wallet.balance.minus(dailyReward),
          balanceAfter: wallet.balance,
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

      logger.info(`Distributed reward of ${dailyReward} to customer ${subscription.customerId} for subscription ${subscription.id}`);
    }

    logger.info(`Subscription rewards distribution completed successfully`);
    
    // Update job execution status to success
    await prisma.jobExecution.update({
      where: { id: jobExecution.id },
      data: {
        status: 'SUCCESS',
        completedAt: new Date(),
        result: {
          processedSubscriptions: activeSubscriptions.length,
          executionDate: executionDate.toISOString(),
        }
      }
    });
    
  } catch (error: any) {
    logger.error('Error in subscription rewards distribution:', error);
    
    // Update job execution status to failed
    await prisma.jobExecution.update({
      where: { id: jobExecution.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage: error.message || 'Unknown error',
      }
    });
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

// Export the cron job initialization function to be used in the server
export { distributeSubscriptionRewards, initializeCronJob };