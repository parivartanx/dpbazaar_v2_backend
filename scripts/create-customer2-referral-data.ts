import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCustomer2ReferralData() {
  try {
    console.log('Creating customer2 and referral system data...');

    // Get the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dpbazaar.com' },
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please run user creation script first.');
    }

    // Create customer2 user
    const customer2User = await prisma.user.upsert({
      where: { email: 'customer2@dpbazaar.com' },
      update: {},
      create: {
        email: 'customer2@dpbazaar.com',
        password: '$2b$10$9cQ3eQ6yBx7KJyY4rVhZ7.3q2k5p8j6n9w4e7r1y2u5i8o5p0a9s1', // Customer1@ (hashed)
        phone: '+919876543214',
        firstName: 'Customer2',
        lastName: 'User',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer2 user created:', customer2User.email);

    // Create customer2 profile
    const customer2 = await prisma.customer.upsert({
      where: { userId: customer2User.id },
      update: {},
      create: {
        userId: customer2User.id,
        firstName: customer2User.firstName,
        lastName: customer2User.lastName,
        gender: 'OTHER',
        dateOfBirth: new Date('1990-01-01'),
        avatar: 'https://example.com/customer2-profile.jpg',
        totalSpent: 0,
        totalOrders: 0,
        lastOrderAt: null,
        tier: 'BRONZE',
        loyaltyPoints: 0,
        lifetimeValue: 0,
        preferences: { newsletter: true, smsAlerts: true },
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer2 profile created:', customer2.id);

    // Get an existing subscription card to use
    let subscriptionCard = await prisma.subscriptionCard.findFirst();
    if (!subscriptionCard) {
      console.log('No subscription card found, creating one...');
      subscriptionCard = await prisma.subscriptionCard.create({
        data: {
          name: 'Bronze Card',
          price: 1000,
          targetAmount: 10000,
          rewardPercent: 5,
          capPercentage: 100,
          benefitDays: ['MONDAY', 'WEDNESDAY'],
          referralRewardPercent: 2,
          referralRewardAmount: 100,
          validityDays: 365,
          status: 'ACTIVE',
          visibility: 'PUBLIC',
          images: ['https://example.com/bronze-card.jpg'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log('Created subscription card:', subscriptionCard.name);
    }

    // Create user subscription card for customer2
    const userSubscriptionCard = await prisma.userSubscriptionCard.create({
      data: {
        customerId: customer2.id,
        cardId: subscriptionCard.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        currentAmount: 0,
        purchasedAt: new Date(),
        activatedAt: new Date(),
        expiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
    console.log('User subscription card created for customer2:', userSubscriptionCard.id);

    // Create referral code for customer2
    const referralCode = await prisma.referralCode.upsert({
      where: { customerId: customer2.id },
      update: {},
      create: {
        customerId: customer2.id,
        code: `REF${Date.now()}`,
        isActive: true,
        createdAt: new Date(),
        deactivatedAt: null,
      },
    });
    console.log('Referral code created for customer2:', referralCode.code);

    // Get the first customer (customer@dpbazaar.com) to be the referred user
    const firstCustomerUser = await prisma.user.findUnique({
      where: { email: 'customer@dpbazaar.com' },
    });

    if (firstCustomerUser) {
      const firstCustomer = await prisma.customer.findUnique({
        where: { userId: firstCustomerUser.id },
      });

      if (firstCustomer) {
        // Create referral history where firstCustomer is the referred user by customer2
        const referralHistory = await prisma.referralHistory.create({
          data: {
            referralCodeId: referralCode.id,
            referrerId: customer2.id,
            referredUserId: firstCustomer.id,
            referrerSubscriptionId: userSubscriptionCard.id,
            triggeredCardId: subscriptionCard.id,
            status: 'REWARDED',
            rewardAmount: 100,
            rewardedAt: new Date(),
            expiredAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
          },
        });
        console.log('Referral history created:', referralHistory.id);

        // Create wallet for customer2
        const wallet = await prisma.wallet.upsert({
          where: {
            customerId_type: {
              customerId: customer2.id,
              type: 'SHOPPING',
            }
          },
          update: {
            balance: 100,
            updatedAt: new Date(),
          },
          create: {
            customerId: customer2.id,
            type: 'SHOPPING',
            balance: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log('Wallet created for customer2');

        // Create wallet transaction for referral reward
        await prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            customerId: customer2.id,
            type: 'CREDIT',
            reason: 'SUBSCRIPTION_REFERRAL',
            status: 'SUCCESS',
            amount: 100,
            balanceBefore: 0,
            balanceAfter: 100,
            referralId: referralHistory.id,
            metadata: { source: 'referral', referrerId: firstCustomer.id },
            createdAt: new Date(),
          },
        });
        console.log('Referral reward wallet transaction created for customer2');
      }
    }

    // Create another referral code for the first customer as well (for symmetry)
    const firstCustomer = await prisma.customer.findUnique({
      where: { userId: (await prisma.user.findUnique({ where: { email: 'customer@dpbazaar.com' } }))!.id },
    });

    if (firstCustomer) {
      const firstCustomerReferralCode = await prisma.referralCode.upsert({
        where: { customerId: firstCustomer.id },
        update: {},
        create: {
          customerId: firstCustomer.id,
          code: `REF${Date.now()}A`,
          isActive: true,
          createdAt: new Date(),
          deactivatedAt: null,
        },
      });
      console.log('Referral code created for first customer:', firstCustomerReferralCode.code);
    }

    console.log('\nCustomer2 and referral system data created successfully!');
    console.log('\nCreated:');
    console.log('- Customer2 user account with profile');
    console.log('- Subscription card for customer2');
    console.log('- Referral code for customer2');
    console.log('- Referral history (if first customer exists)');
    console.log('- Wallet and referral reward transaction');
  } catch (error) {
    console.error('Error creating customer2 and referral data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createCustomer2ReferralData();