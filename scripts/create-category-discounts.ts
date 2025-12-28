import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function createCategoryDiscounts() {
  try {
    console.log('Creating category-based discounts...');

    // Get some existing categories to use for discounts
    const categories = await prisma.category.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
      }
    });

    if (categories.length === 0) {
      console.log('No categories found in the database. Please create some categories first.');
      return;
    }

    // Create discount for Electronics category
    if (categories.some(cat => cat.name.toLowerCase().includes('electronic') || cat.name.toLowerCase().includes('mobile'))) {
      const electronicsCategory = categories.find(cat => cat.name.toLowerCase().includes('electronic') || cat.name.toLowerCase().includes('mobile'));
      
      const electronicsDiscount = await prisma.discount.create({
        data: {
          code: 'ELEC20',
          description: '20% off on all electronics items',
          type: 'PERCENTAGE',
          value: new Decimal('20.00'),
          minOrderAmount: new Decimal('1000.00'),
          maxDiscountAmount: new Decimal('500.00'),
          usageLimit: 100,
          usagePerCustomer: 1,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          applicableCategories: [electronicsCategory!.id],
          applicableProducts: [],
          applicableBrands: [],
          customerSegments: [],
          isActive: true
        }
      });
      console.log(`Created discount: ${electronicsDiscount.code} for category ${electronicsCategory?.name}`);
    }

    // Create discount for Fashion/Apparel category
    if (categories.some(cat => cat.name.toLowerCase().includes('fashion') || cat.name.toLowerCase().includes('clothing') || cat.name.toLowerCase().includes('apparel'))) {
      const fashionCategory = categories.find(cat => cat.name.toLowerCase().includes('fashion') || cat.name.toLowerCase().includes('clothing') || cat.name.toLowerCase().includes('apparel'));
      
      const fashionDiscount = await prisma.discount.create({
        data: {
          code: 'FASH15',
          description: '15% off on all fashion items',
          type: 'PERCENTAGE',
          value: new Decimal('15.00'),
          minOrderAmount: new Decimal('500.00'),
          maxDiscountAmount: new Decimal('300.00'),
          usageLimit: 200,
          usagePerCustomer: 2,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
          applicableCategories: [fashionCategory!.id],
          applicableProducts: [],
          applicableBrands: [],
          customerSegments: [],
          isActive: true
        }
      });
      console.log(`Created discount: ${fashionDiscount.code} for category ${fashionCategory?.name}`);
    }

    // Create discount for Books category
    if (categories.some(cat => cat.name.toLowerCase().includes('book') || cat.name.toLowerCase().includes('education'))) {
      const booksCategory = categories.find(cat => cat.name.toLowerCase().includes('book') || cat.name.toLowerCase().includes('education'));
      
      const booksDiscount = await prisma.discount.create({
        data: {
          code: 'BOOKS10',
          description: 'Rs. 50 off on all books',
          type: 'FIXED_AMOUNT',
          value: new Decimal('50.00'),
          minOrderAmount: new Decimal('200.00'),
          usageLimit: 150,
          usagePerCustomer: 3,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          applicableCategories: [booksCategory!.id],
          applicableProducts: [],
          applicableBrands: [],
          customerSegments: [],
          isActive: true
        }
      });
      console.log(`Created discount: ${booksDiscount.code} for category ${booksCategory?.name}`);
    }

    // Create discount for multiple categories (Home & Kitchen)
    const homeAndKitchenCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes('home') || 
      cat.name.toLowerCase().includes('kitchen') || 
      cat.name.toLowerCase().includes('furniture')
    );

    if (homeAndKitchenCategories.length > 0) {
      const homeAndKitchenIds = homeAndKitchenCategories.map(cat => cat.id);
      
      const homeDiscount = await prisma.discount.create({
        data: {
          code: 'HOME25',
          description: '25% off on Home & Kitchen items',
          type: 'PERCENTAGE',
          value: new Decimal('25.00'),
          minOrderAmount: new Decimal('1500.00'),
          maxDiscountAmount: new Decimal('800.00'),
          usageLimit: 75,
          usagePerCustomer: 1,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
          applicableCategories: homeAndKitchenIds,
          applicableProducts: [],
          applicableBrands: [],
          customerSegments: [],
          isActive: true
        }
      });
      console.log(`Created discount: ${homeDiscount.code} for categories: ${homeAndKitchenCategories.map(cat => cat.name).join(', ')}`);
    }

    // Create discount for Sports category
    const sportsCategory = categories.find(cat => cat.name.toLowerCase().includes('sports') || cat.name.toLowerCase().includes('fitness'));
    if (sportsCategory) {
      const sportsDiscount = await prisma.discount.create({
        data: {
          code: 'SPORTS30',
          description: '30% off on Sports & Fitness items',
          type: 'PERCENTAGE',
          value: new Decimal('30.00'),
          minOrderAmount: new Decimal('800.00'),
          maxDiscountAmount: new Decimal('1000.00'),
          usageLimit: 50,
          usagePerCustomer: 1,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
          applicableCategories: [sportsCategory.id],
          applicableProducts: [],
          applicableBrands: [],
          customerSegments: [],
          isActive: true
        }
      });
      console.log(`Created discount: ${sportsDiscount.code} for category ${sportsCategory.name}`);
    }

    console.log('Successfully created category-based discounts!');
  } catch (error) {
    console.error('Error creating category discounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createCategoryDiscounts()
  .then(() => {
    console.log('Category discounts creation completed.');
  })
  .catch((error) => {
    console.error('Error in category discounts creation:', error);
    process.exit(1);
  });