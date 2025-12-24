import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProducts() {
  try {
    console.log('Creating categories and products with comprehensive data...');

    // Get the admin user who will create these products
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dpbazaar.com' },
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please run create-users script first.');
    }

    // Create Categories
    const electronicsCategory = await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://example.com/electronics-category.jpg',
        icon: '📱',
        path: '/electronics',
        level: 0,
        isActive: true,
        isFeatured: true,
        displayOrder: 1,
        metaTitle: 'Electronics - DPBazaar',
        metaDescription: 'Shop the latest electronics at DPBazaar',
        metaKeywords: ['electronics', 'gadgets', 'devices'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Category created:', electronicsCategory.name);

    const fashionCategory = await prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        image: 'https://example.com/fashion-category.jpg',
        icon: '👕',
        path: '/fashion',
        level: 0,
        isActive: true,
        isFeatured: true,
        displayOrder: 2,
        metaTitle: 'Fashion - DPBazaar',
        metaDescription: 'Latest fashion trends at DPBazaar',
        metaKeywords: ['fashion', 'clothing', 'accessories'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Category created:', fashionCategory.name);

    const homeCategory = await prisma.category.create({
      data: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Home and kitchen essentials',
        image: 'https://example.com/home-kitchen-category.jpg',
        icon: '🏠',
        path: '/home-kitchen',
        level: 0,
        isActive: true,
        isFeatured: true,
        displayOrder: 3,
        metaTitle: 'Home & Kitchen - DPBazaar',
        metaDescription: 'Home and kitchen products at DPBazaar',
        metaKeywords: ['home', 'kitchen', 'furniture'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Category created:', homeCategory.name);

    const booksCategory = await prisma.category.create({
      data: {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        image: 'https://example.com/books-category.jpg',
        icon: '📚',
        path: '/books',
        level: 0,
        isActive: true,
        isFeatured: false,
        displayOrder: 4,
        metaTitle: 'Books - DPBazaar',
        metaDescription: 'Books and educational materials at DPBazaar',
        metaKeywords: ['books', 'education', 'reading'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Category created:', booksCategory.name);

    // Create Brands
    const appleBrand = await prisma.brand.create({
      data: {
        name: 'Apple',
        slug: 'apple',
        description: 'Apple Inc. is an American multinational technology company.',
        logo: 'https://example.com/apple-logo.jpg',
        website: 'https://www.apple.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand created:', appleBrand.name);

    const nikeBrand = await prisma.brand.create({
      data: {
        name: 'Nike',
        slug: 'nike',
        description: 'Nike, Inc. is an American multinational corporation.',
        logo: 'https://example.com/nike-logo.jpg',
        website: 'https://www.nike.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand created:', nikeBrand.name);

    // Create Products with variants, images, and attributes
    const iphoneProduct = await prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        sku: 'IPH-15PRO-128GB-NAT',
        description: 'The latest iPhone 15 Pro with advanced features and titanium design.',
        shortDescription: 'Premium smartphone with titanium design',
        barcode: '1234567890123',
        mrp: 134900,
        sellingPrice: 129900,
        costPrice: 115000,
        taxRate: 18,
        hsnCode: '85171200',
        brandId: appleBrand.id,
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK',
        weight: 187,
        dimensions: { length: 147.6, width: 70.6, height: 8.25, unit: 'mm' },
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isReturnable: true,
        returnPeriodDays: 7,
        viewCount: 150,
        salesCount: 25,
        avgRating: 4.8,
        totalReviews: 12,
        tags: ['smartphone', 'apple', 'iphone', 'premium'],
        metaTitle: 'iPhone 15 Pro - DPBazaar',
        metaDescription: 'Buy iPhone 15 Pro at best price in India',
        metaKeywords: ['iphone', 'smartphone', 'apple', 'mobile'],
        metadata: { color: 'Natural Titanium', storage: '128GB' },
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product created:', iphoneProduct.name);

    // Create product variants for iPhone
    const iphoneVariant1 = await prisma.productVariant.create({
      data: {
        productId: iphoneProduct.id,
        variantSku: 'IPH-15PRO-128GB-NAT',
        variantName: '128GB Natural Titanium',
        mrp: 134900,
        sellingPrice: 129900,
        attributes: { color: 'Natural Titanium', storage: '128GB', connectivity: '5G' },
        weight: 187,
        dimensions: { length: 147.6, width: 70.6, height: 8.25, unit: 'mm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', iphoneVariant1.variantName);

    const iphoneVariant2 = await prisma.productVariant.create({
      data: {
        productId: iphoneProduct.id,
        variantSku: 'IPH-15PRO-256GB-BLUE',
        variantName: '256GB Blue Titanium',
        mrp: 144900,
        sellingPrice: 139900,
        attributes: { color: 'Blue Titanium', storage: '256GB', connectivity: '5G' },
        weight: 187,
        dimensions: { length: 147.6, width: 70.6, height: 8.25, unit: 'mm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', iphoneVariant2.variantName);

    // Create product images for iPhone
    await prisma.productImage.create({
      data: {
        productId: iphoneProduct.id,
        url: 'https://example.com/iphone15pro-front.jpg',
        thumbnailUrl: 'https://example.com/iphone15pro-front-thumb.jpg',
        alt: 'iPhone 15 Pro front view',
        caption: 'Front view of iPhone 15 Pro',
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', iphoneProduct.name);

    await prisma.productImage.create({
      data: {
        productId: iphoneProduct.id,
        url: 'https://example.com/iphone15pro-back.jpg',
        thumbnailUrl: 'https://example.com/iphone15pro-back-thumb.jpg',
        alt: 'iPhone 15 Pro back view',
        caption: 'Back view of iPhone 15 Pro',
        displayOrder: 2,
        isPrimary: false,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', iphoneProduct.name);

    // Link iPhone to Electronics category as primary
    await prisma.productCategory.create({
      data: {
        productId: iphoneProduct.id,
        categoryId: electronicsCategory.id,
        isPrimary: true,
      },
    });
    console.log('Product category link created for:', iphoneProduct.name);

    // Create a second product - Nike shoes
    const nikeShoesProduct = await prisma.product.create({
      data: {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        sku: 'NK-AM270-RED-UK9',
        description: 'Comfortable and stylish Nike Air Max 270 shoes with air cushioning technology.',
        shortDescription: 'Premium running shoes with air cushioning',
        barcode: '2345678901234',
        mrp: 15995,
        sellingPrice: 12796,
        costPrice: 9500,
        taxRate: 12,
        hsnCode: '64041100',
        brandId: nikeBrand.id,
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK',
        weight: 350,
        dimensions: { length: 30, width: 12, height: 10, unit: 'cm' },
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isReturnable: true,
        returnPeriodDays: 30,
        viewCount: 320,
        salesCount: 45,
        avgRating: 4.6,
        totalReviews: 28,
        tags: ['shoes', 'nike', 'sports', 'casual'],
        metaTitle: 'Nike Air Max 270 - DPBazaar',
        metaDescription: 'Buy Nike Air Max 270 at best price in India',
        metaKeywords: ['nike', 'shoes', 'air max', 'sports'],
        metadata: { gender: 'Men', category: 'Running' },
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product created:', nikeShoesProduct.name);

    // Create variants for Nike shoes
    const nikeShoesVariant1 = await prisma.productVariant.create({
      data: {
        productId: nikeShoesProduct.id,
        variantSku: 'NK-AM270-RED-UK7',
        variantName: 'Red UK Size 7',
        mrp: 15995,
        sellingPrice: 12796,
        attributes: { color: 'Red', size: 'UK 7', gender: 'Men' },
        weight: 350,
        dimensions: { length: 30, width: 12, height: 10, unit: 'cm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', nikeShoesVariant1.variantName);

    const nikeShoesVariant2 = await prisma.productVariant.create({
      data: {
        productId: nikeShoesProduct.id,
        variantSku: 'NK-AM270-BLK-UK9',
        variantName: 'Black UK Size 9',
        mrp: 15995,
        sellingPrice: 12796,
        attributes: { color: 'Black', size: 'UK 9', gender: 'Men' },
        weight: 350,
        dimensions: { length: 30, width: 12, height: 10, unit: 'cm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', nikeShoesVariant2.variantName);

    // Create product images for Nike shoes
    await prisma.productImage.create({
      data: {
        productId: nikeShoesProduct.id,
        url: 'https://example.com/nike-airmax270-red.jpg',
        thumbnailUrl: 'https://example.com/nike-airmax270-red-thumb.jpg',
        alt: 'Nike Air Max 270 Red',
        caption: 'Red Nike Air Max 270',
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', nikeShoesProduct.name);

    // Link Nike shoes to Fashion category as primary
    await prisma.productCategory.create({
      data: {
        productId: nikeShoesProduct.id,
        categoryId: fashionCategory.id,
        isPrimary: true,
      },
    });
    console.log('Product category link created for:', nikeShoesProduct.name);

    // Create a third product - Kitchen mixer
    const mixerProduct = await prisma.product.create({
      data: {
        name: 'KitchenAid Artisan Stand Mixer',
        slug: 'kitchenaid-artisan-stand-mixer',
        sku: 'KA-ASM-RED-5QT',
        description: 'Premium stand mixer with 5 quart bowl and multiple attachments.',
        shortDescription: 'Professional stand mixer for home use',
        barcode: '3456789012345',
        mrp: 32999,
        sellingPrice: 29699,
        costPrice: 24000,
        taxRate: 18,
        hsnCode: '85094000',
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK',
        weight: 11.2,
        dimensions: { length: 34.9, width: 20.3, height: 35.6, unit: 'cm' },
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: false,
        isReturnable: true,
        returnPeriodDays: 15,
        viewCount: 89,
        salesCount: 8,
        avgRating: 4.9,
        totalReviews: 5,
        tags: ['kitchen', 'mixer', 'appliance', 'kitchenaid'],
        metaTitle: 'KitchenAid Artisan Stand Mixer - DPBazaar',
        metaDescription: 'Buy KitchenAid Artisan Stand Mixer at best price in India',
        metaKeywords: ['kitchenaid', 'mixer', 'kitchen appliance'],
        metadata: { color: 'Classic Red', warranty: '2 years' },
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product created:', mixerProduct.name);

    // Create variants for mixer
    const mixerVariant1 = await prisma.productVariant.create({
      data: {
        productId: mixerProduct.id,
        variantSku: 'KA-ASM-RED-5QT',
        variantName: 'Classic Red 5 Quart',
        mrp: 32999,
        sellingPrice: 29699,
        attributes: { color: 'Classic Red', capacity: '5 Quart', attachments: 'Standard Set' },
        weight: 11.2,
        dimensions: { length: 34.9, width: 20.3, height: 35.6, unit: 'cm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', mixerVariant1.variantName);

    // Create product images for mixer
    await prisma.productImage.create({
      data: {
        productId: mixerProduct.id,
        url: 'https://example.com/kitchenaid-mixer-red.jpg',
        thumbnailUrl: 'https://example.com/kitchenaid-mixer-red-thumb.jpg',
        alt: 'KitchenAid Artisan Stand Mixer Red',
        caption: 'Red KitchenAid Artisan Stand Mixer',
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', mixerProduct.name);

    // Link mixer to Home & Kitchen category as primary
    await prisma.productCategory.create({
      data: {
        productId: mixerProduct.id,
        categoryId: homeCategory.id,
        isPrimary: true,
      },
    });
    console.log('Product category link created for:', mixerProduct.name);

    // Create a fourth product - Programming book
    const bookProduct = await prisma.product.create({
      data: {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        slug: 'clean-code-agile-software-craftsmanship',
        sku: 'BK-CC-2008-HB',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        shortDescription: 'Essential guide to writing clean code',
        barcode: '4567890123456',
        mrp: 699,
        sellingPrice: 559,
        costPrice: 350,
        taxRate: 12,
        hsnCode: '49019900',
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK',
        weight: 0.5,
        dimensions: { length: 23.5, width: 19, height: 2.3, unit: 'cm' },
        isFeatured: false,
        isNewArrival: false,
        isBestSeller: true,
        isReturnable: true,
        returnPeriodDays: 10,
        viewCount: 560,
        salesCount: 120,
        avgRating: 4.7,
        totalReviews: 42,
        tags: ['programming', 'software', 'development', 'book'],
        metaTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship - DPBazaar',
        metaDescription: 'Buy Clean Code book at best price in India',
        metaKeywords: ['clean code', 'programming', 'software development', 'book'],
        metadata: { author: 'Robert C. Martin', pages: 464, binding: 'Hardcover' },
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product created:', bookProduct.name);

    // Create product images for book
    await prisma.productImage.create({
      data: {
        productId: bookProduct.id,
        url: 'https://example.com/clean-code-book.jpg',
        thumbnailUrl: 'https://example.com/clean-code-book-thumb.jpg',
        alt: 'Clean Code Book Cover',
        caption: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', bookProduct.name);

    // Link book to Books category as primary
    await prisma.productCategory.create({
      data: {
        productId: bookProduct.id,
        categoryId: booksCategory.id,
        isPrimary: true,
      },
    });
    console.log('Product category link created for:', bookProduct.name);

    // Create a fifth product - Smart Watch
    const smartWatchProduct = await prisma.product.create({
      data: {
        name: 'Samsung Galaxy Watch 6',
        slug: 'samsung-galaxy-watch-6',
        sku: 'SS-GW6-40MM-BLK',
        description: 'Advanced smartwatch with health monitoring and fitness tracking features.',
        shortDescription: 'Premium smartwatch with health monitoring',
        barcode: '5678901234567',
        mrp: 34999,
        sellingPrice: 29999,
        costPrice: 25000,
        taxRate: 18,
        hsnCode: '85176200',
        status: 'ACTIVE',
        stockStatus: 'IN_STOCK',
        weight: 30,
        dimensions: { length: 44.5, width: 44.5, height: 11.6, unit: 'mm' },
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        isReturnable: true,
        returnPeriodDays: 7,
        viewCount: 210,
        salesCount: 15,
        avgRating: 4.5,
        totalReviews: 8,
        tags: ['smartwatch', 'samsung', 'fitness', 'health'],
        metaTitle: 'Samsung Galaxy Watch 6 - DPBazaar',
        metaDescription: 'Buy Samsung Galaxy Watch 6 at best price in India',
        metaKeywords: ['samsung', 'smartwatch', 'galaxy watch', 'fitness tracker'],
        metadata: { color: 'Black', size: '40mm', connectivity: 'Bluetooth + LTE' },
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product created:', smartWatchProduct.name);

    // Create variants for smart watch
    const smartWatchVariant1 = await prisma.productVariant.create({
      data: {
        productId: smartWatchProduct.id,
        variantSku: 'SS-GW6-40MM-BLK',
        variantName: '40mm Black Bluetooth',
        mrp: 34999,
        sellingPrice: 29999,
        attributes: { color: 'Black', size: '40mm', connectivity: 'Bluetooth' },
        weight: 30,
        dimensions: { length: 44.5, width: 44.5, height: 11.6, unit: 'mm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', smartWatchVariant1.variantName);

    const smartWatchVariant2 = await prisma.productVariant.create({
      data: {
        productId: smartWatchProduct.id,
        variantSku: 'SS-GW6-44MM-SLV-LTE',
        variantName: '44mm Silver LTE',
        mrp: 39999,
        sellingPrice: 34999,
        attributes: { color: 'Silver', size: '44mm', connectivity: 'LTE' },
        weight: 32,
        dimensions: { length: 48.5, width: 48.5, height: 11.6, unit: 'mm' },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Product variant created:', smartWatchVariant2.variantName);

    // Create product images for smart watch
    await prisma.productImage.create({
      data: {
        productId: smartWatchProduct.id,
        url: 'https://example.com/samsung-galaxy-watch6.jpg',
        thumbnailUrl: 'https://example.com/samsung-galaxy-watch6-thumb.jpg',
        alt: 'Samsung Galaxy Watch 6',
        caption: 'Samsung Galaxy Watch 6',
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      },
    });
    console.log('Product image created for:', smartWatchProduct.name);

    // Link smart watch to Electronics category as primary
    await prisma.productCategory.create({
      data: {
        productId: smartWatchProduct.id,
        categoryId: electronicsCategory.id,
        isPrimary: true,
      },
    });
    console.log('Product category link created for:', smartWatchProduct.name);

    console.log('\nAll categories and products with comprehensive data have been created successfully!');
    console.log('\nCreated:');
    console.log('- 4 Categories: Electronics, Fashion, Home & Kitchen, Books');
    console.log('- 2 Brands: Apple, Nike');
    console.log('- 5 Products with variants, images, and category associations');

  } catch (error) {
    console.error('Error creating products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createProducts();