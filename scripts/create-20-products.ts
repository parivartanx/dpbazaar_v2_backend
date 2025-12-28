import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function create20Products() {
  try {
    console.log('Creating 20 new products with comprehensive data and stock...');

    // Get existing categories and brands
    const electronicsCategory = await prisma.category.findFirst({ where: { slug: 'electronics' } });
    const fashionCategory = await prisma.category.findFirst({ where: { slug: 'fashion' } });
    const homeCategory = await prisma.category.findFirst({ where: { slug: 'home-kitchen' } });
    const booksCategory = await prisma.category.findFirst({ where: { slug: 'books' } });
    
    if (!electronicsCategory || !fashionCategory || !homeCategory || !booksCategory) {
      throw new Error('Required categories not found. Please run create-products script first.');
    }

    const appleBrand = await prisma.brand.findFirst({ where: { slug: 'apple' } });
    const nikeBrand = await prisma.brand.findFirst({ where: { slug: 'nike' } });
    
    if (!appleBrand || !nikeBrand) {
      throw new Error('Required brands not found. Please run create-products script first.');
    }

    // Create or get a default warehouse
    let warehouse = await prisma.warehouse.findFirst();
    if (!warehouse) {
      warehouse = await prisma.warehouse.create({
        data: {
          code: 'MAIN-WH-001',
          name: 'Main Warehouse',
          type: 'MAIN',
          address: {
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001',
          },
          contactPhone: '+91-9876543210',
          contactEmail: 'warehouse@dpbazaar.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log('Warehouse created:', warehouse.name);
    } else {
      console.log('Using existing warehouse:', warehouse.name);
    }

    // Create new brands if they don't exist
    const samsungBrand = await prisma.brand.upsert({
      where: { slug: 'samsung' },
      update: {},
      create: {
        name: 'Samsung',
        slug: 'samsung',
        description: 'Samsung Electronics is a South Korean multinational electronics corporation.',
        logo: 'https://example.com/samsung-logo.jpg',
        website: 'https://www.samsung.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand:', samsungBrand.name, '(', samsungBrand.id, ')');

    const adidasBrand = await prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Adidas SE is a German multinational corporation that designs and manufactures shoes, clothing and accessories.',
        logo: 'https://example.com/adidas-logo.jpg',
        website: 'https://www.adidas.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand:', adidasBrand.name, '(', adidasBrand.id, ')');

    const sonyBrand = await prisma.brand.upsert({
      where: { slug: 'sony' },
      update: {},
      create: {
        name: 'Sony',
        slug: 'sony',
        description: 'Sony Corporation is a Japanese multinational conglomerate corporation.',
        logo: 'https://example.com/sony-logo.jpg',
        website: 'https://www.sony.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand:', sonyBrand.name, '(', sonyBrand.id, ')');

    const lgBrand = await prisma.brand.upsert({
      where: { slug: 'lg' },
      update: {},
      create: {
        name: 'LG',
        slug: 'lg',
        description: 'LG Electronics Inc. is a South Korean multinational electronics company.',
        logo: 'https://example.com/lg-logo.jpg',
        website: 'https://www.lg.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Brand:', lgBrand.name, '(', lgBrand.id, ')');

    // Create 20 new products with stock
    const newProducts = [
      {
        name: 'MacBook Pro 14-inch',
        slug: 'macbook-pro-14-inch-' + Date.now(),
        sku: 'AP-MBP-14M-' + Date.now(),
        barcode: 'BAR' + Date.now() + '01',
        description: 'Powerful MacBook Pro with M3 chip and advanced features.',
        shortDescription: 'Professional laptop with M3 chip',
        mrp: 249900,
        sellingPrice: 229900,
        costPrice: 200000,
        brandId: appleBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['laptop', 'apple', 'macbook', 'm3'],
        hsnCode: '84713020',
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh1000xm5-headphones-' + Date.now(),
        sku: 'SN-WHXM5-' + Date.now(),
        barcode: 'BAR' + Date.now() + '02',
        description: 'Industry-leading noise canceling with premium sound quality.',
        shortDescription: 'Premium noise canceling headphones',
        mrp: 39990,
        sellingPrice: 34990,
        costPrice: 28000,
        brandId: sonyBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
        hsnCode: '85183000',
      },
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22-' + Date.now(),
        sku: 'AD-UB22-' + Date.now(),
        barcode: 'BAR' + Date.now() + '03',
        description: 'Comfortable running shoes with responsive cushioning.',
        shortDescription: 'Premium running shoes',
        mrp: 18999,
        sellingPrice: 15199,
        costPrice: 12000,
        brandId: adidasBrand.id,
        categoryId: fashionCategory.id,
        tags: ['shoes', 'adidas', 'running', 'ultraboost'],
        hsnCode: '64051000',
      },
      {
        name: 'LG 65 inch 4K Smart TV',
        slug: 'lg-65-inch-4k-smart-tv-' + Date.now(),
        sku: 'LG-65TV-' + Date.now(),
        barcode: 'BAR' + Date.now() + '04',
        description: '4K Ultra HD Smart TV with AI ThinQ.',
        shortDescription: 'Premium 4K Smart TV',
        mrp: 89999,
        sellingPrice: 74999,
        costPrice: 65000,
        brandId: lgBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['tv', 'lg', '4k', 'smart-tv'],
        hsnCode: '85287200',
      },
      {
        name: 'KitchenAid Pro 600 Stand Mixer',
        slug: 'kitchenaid-pro-600-stand-mixer-' + Date.now(),
        sku: 'KA-P600-' + Date.now(),
        barcode: 'BAR' + Date.now() + '05',
        description: 'Professional-grade stand mixer with 6-quart bowl.',
        shortDescription: 'Professional stand mixer',
        mrp: 49999,
        sellingPrice: 44999,
        costPrice: 38000,
        brandId: null, // No brand
        categoryId: homeCategory.id,
        tags: ['kitchen', 'mixer', 'appliance', 'kitchenaid'],
        hsnCode: '85094000',
      },
      {
        name: 'The Psychology of Money',
        slug: 'psychology-of-money-' + Date.now(),
        sku: 'BK-TPM-' + Date.now(),
        barcode: 'BAR' + Date.now() + '06',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        shortDescription: 'Essential book on money psychology',
        mrp: 399,
        sellingPrice: 299,
        costPrice: 180,
        brandId: null,
        categoryId: booksCategory.id,
        tags: ['finance', 'psychology', 'book', 'investing'],
        hsnCode: '49019900',
      },
      {
        name: 'iPad Air 5th Gen',
        slug: 'ipad-air-5th-gen-' + Date.now(),
        sku: 'AP-IPA5-' + Date.now(),
        barcode: 'BAR' + Date.now() + '07',
        description: 'Powerful and versatile iPad with M1 chip.',
        shortDescription: 'Versatile iPad with M1 chip',
        mrp: 59900,
        sellingPrice: 54900,
        costPrice: 48000,
        brandId: appleBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['tablet', 'apple', 'ipad', 'm1'],
        hsnCode: '84701000',
      },
      {
        name: 'Nike Dri-FIT T-Shirt',
        slug: 'nike-dri-fit-t-shirt-' + Date.now(),
        sku: 'NK-DFS-' + Date.now(),
        barcode: 'BAR' + Date.now() + '08',
        description: 'Comfortable and breathable Dri-FIT t-shirt.',
        shortDescription: 'Athletic t-shirt',
        mrp: 2495,
        sellingPrice: 1996,
        costPrice: 1200,
        brandId: nikeBrand.id,
        categoryId: fashionCategory.id,
        tags: ['shirt', 'nike', 'dri-fit', 'athletic'],
        hsnCode: '61091000',
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        slug: 'instant-pot-duo-7-in-1-' + Date.now(),
        sku: 'IP-DUO-' + Date.now(),
        barcode: 'BAR' + Date.now() + '09',
        description: 'Multi-functional electric pressure cooker.',
        shortDescription: 'Multi-functional pressure cooker',
        mrp: 11999,
        sellingPrice: 8999,
        costPrice: 6500,
        brandId: null,
        categoryId: homeCategory.id,
        tags: ['kitchen', 'pressure-cooker', 'multi-cooker', 'instant-pot'],
        hsnCode: '85166000',
      },
      {
        name: 'Atomic Habits',
        slug: 'atomic-habits-' + Date.now(),
        sku: 'BK-AH-' + Date.now(),
        barcode: 'BAR' + Date.now() + '10',
        description: 'An easy & proven way to build good habits & break bad ones.',
        shortDescription: 'Guide to building good habits',
        mrp: 499,
        sellingPrice: 399,
        costPrice: 250,
        brandId: null,
        categoryId: booksCategory.id,
        tags: ['self-help', 'habits', 'book', 'productivity'],
        hsnCode: '49019900',
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra-' + Date.now(),
        sku: 'SS-GS24U-' + Date.now(),
        barcode: 'BAR' + Date.now() + '11',
        description: 'Flagship smartphone with AI capabilities and premium features.',
        shortDescription: 'Premium flagship smartphone',
        mrp: 124999,
        sellingPrice: 114999,
        costPrice: 95000,
        brandId: samsungBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['smartphone', 'samsung', 'galaxy', 'flagship'],
        hsnCode: '85171200',
      },
      {
        name: 'Sony PlayStation 5',
        slug: 'sony-playstation-5-' + Date.now(),
        sku: 'SN-PS5-' + Date.now(),
        barcode: 'BAR' + Date.now() + '12',
        description: 'Next-generation gaming console with ultra-high speed SSD.',
        shortDescription: 'Next-generation gaming console',
        mrp: 59990,
        sellingPrice: 54990,
        costPrice: 48000,
        brandId: sonyBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['gaming', 'console', 'sony', 'playstation'],
        hsnCode: '95045000',
      },
      {
        name: 'Adidas Originals Hoodie',
        slug: 'adidas-originals-hoodie-' + Date.now(),
        sku: 'AD-ORH-' + Date.now(),
        barcode: 'BAR' + Date.now() + '13',
        description: 'Classic Adidas hoodie with comfortable fit.',
        shortDescription: 'Classic hoodie',
        mrp: 4999,
        sellingPrice: 3999,
        costPrice: 2500,
        brandId: adidasBrand.id,
        categoryId: fashionCategory.id,
        tags: ['hoodie', 'adidas', 'casual', 'originals'],
        hsnCode: '61022000',
      },
      {
        name: 'Dyson V15 Detect Vacuum',
        slug: 'dyson-v15-detect-vacuum-' + Date.now(),
        sku: 'DY-V15-' + Date.now(),
        barcode: 'BAR' + Date.now() + '14',
        description: 'Intelligent cordless vacuum with laser dust detection.',
        shortDescription: 'Smart cordless vacuum',
        mrp: 74990,
        sellingPrice: 67491,
        costPrice: 58000,
        brandId: null,
        categoryId: homeCategory.id,
        tags: ['vacuum', 'dyson', 'cordless', 'cleaning'],
        hsnCode: '85092000',
      },
      {
        name: 'Think and Grow Rich',
        slug: 'think-and-grow-rich-' + Date.now(),
        sku: 'BK-TAGR-' + Date.now(),
        barcode: 'BAR' + Date.now() + '15',
        description: 'Classic book on wealth building and success principles.',
        shortDescription: 'Classic book on wealth building',
        mrp: 299,
        sellingPrice: 239,
        costPrice: 150,
        brandId: null,
        categoryId: booksCategory.id,
        tags: ['finance', 'success', 'book', 'wealth'],
        hsnCode: '49019900',
      },
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9-' + Date.now(),
        sku: 'AP-AWS9-' + Date.now(),
        barcode: 'BAR' + Date.now() + '16',
        description: 'Advanced smartwatch with health monitoring features.',
        shortDescription: 'Advanced smartwatch',
        mrp: 49900,
        sellingPrice: 44900,
        costPrice: 38000,
        brandId: appleBrand.id,
        categoryId: electronicsCategory.id,
        tags: ['smartwatch', 'apple', 'health', 'fitness'],
        hsnCode: '91021900',
      },
      {
        name: 'Nike Air Force 1',
        slug: 'nike-air-force-1-' + Date.now(),
        sku: 'NK-AF1-' + Date.now(),
        barcode: 'BAR' + Date.now() + '17',
        description: 'Iconic basketball shoe with heritage style.',
        shortDescription: 'Iconic basketball shoe',
        mrp: 9995,
        sellingPrice: 7996,
        costPrice: 5500,
        brandId: nikeBrand.id,
        categoryId: fashionCategory.id,
        tags: ['shoes', 'nike', 'air-force', 'basketball'],
        hsnCode: '64051000',
      },
      {
        name: 'Nespresso Vertuo Next Coffee Machine',
        slug: 'nespresso-vertuo-next-coffee-machine-' + Date.now(),
        sku: 'NS-VN-' + Date.now(),
        barcode: 'BAR' + Date.now() + '18',
        description: 'Premium coffee machine with Centrifusion technology.',
        shortDescription: 'Premium coffee machine',
        mrp: 19990,
        sellingPrice: 17991,
        costPrice: 14000,
        brandId: null,
        categoryId: homeCategory.id,
        tags: ['coffee', 'machine', 'nespresso', 'kitchen'],
        hsnCode: '85167100',
      },
      {
        name: 'Rich Dad Poor Dad',
        slug: 'rich-dad-poor-dad-' + Date.now(),
        sku: 'BK-RDPD-' + Date.now(),
        barcode: 'BAR' + Date.now() + '19',
        description: 'Teaches the basics of financial literacy and investing.',
        shortDescription: 'Guide to financial literacy',
        mrp: 399,
        sellingPrice: 319,
        costPrice: 180,
        brandId: null,
        categoryId: booksCategory.id,
        tags: ['finance', 'investing', 'book', 'education'],
        hsnCode: '49019900',
      },
      {
        name: 'Bose QuietComfort 45 Headphones',
        slug: 'bose-quietcomfort-45-headphones-' + Date.now(),
        sku: 'BS-QC45-' + Date.now(),
        barcode: 'BAR' + Date.now() + '20',
        description: 'Premium noise cancelling headphones with exceptional sound quality.',
        shortDescription: 'Premium noise cancelling headphones',
        mrp: 29990,
        sellingPrice: 24990,
        costPrice: 20000,
        brandId: null, // No brand for this example
        categoryId: electronicsCategory.id,
        tags: ['headphones', 'bose', 'wireless', 'noise-canceling'],
        hsnCode: '85183000',
      },
    ];

    for (const [index, productData] of newProducts.entries()) {
      // Create product
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.slug,
          sku: productData.sku,
          barcode: productData.barcode, // Use barcode from productData
          description: productData.description,
          shortDescription: productData.shortDescription,
          mrp: productData.mrp,
          sellingPrice: productData.sellingPrice,
          costPrice: productData.costPrice,
          taxRate: productData.categoryId === booksCategory.id ? 12 : 18,
          hsnCode: productData.hsnCode,
          brandId: productData.brandId,
          status: 'ACTIVE',
          stockStatus: 'IN_STOCK',
          weight: productData.tags.includes('book') ? 0.5 : 1.5,
          dimensions: { length: 20, width: 15, height: 5, unit: 'cm' },
          isFeatured: index < 5,
          isNewArrival: true,
          isBestSeller: index < 7,
          isReturnable: true,
          returnPeriodDays: productData.categoryId === booksCategory.id ? 10 : 30,
          viewCount: Math.floor(Math.random() * 1000),
          salesCount: Math.floor(Math.random() * 100),
          avgRating: 4.0 + Math.random() * 0.9,
          totalReviews: Math.floor(Math.random() * 50),
          tags: productData.tags,
          metaTitle: `${productData.name} - DPBazaar`,
          metaDescription: `Buy ${productData.name} at best price in India`,
          metaKeywords: productData.tags,
          metadata: { 
            color: productData.tags.includes('black') || productData.tags.includes('black') ? 'Black' : 
                   productData.tags.includes('white') || productData.tags.includes('white') ? 'White' : 
                   'N/A' 
          },
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`Product ${index + 1} created:`, product.name);

      // Create a variant for the product
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          variantSku: productData.sku + '-VAR',
          variantName: productData.name + ' Standard',
          mrp: productData.mrp,
          sellingPrice: productData.sellingPrice,
          attributes: { color: 'Standard', size: 'One Size' },
          weight: productData.tags.includes('book') ? 0.5 : 1.5,
          dimensions: { length: 20, width: 15, height: 5, unit: 'cm' },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create product image
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://example.com/${productData.slug}.jpg`,
          thumbnailUrl: `https://example.com/${productData.slug}-thumb.jpg`,
          alt: productData.name,
          caption: productData.name,
          displayOrder: 1,
          isPrimary: true,
          createdAt: new Date(),
        },
      });

      // Link to category
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: productData.categoryId,
          isPrimary: true,
        },
      });

      // Create inventory record with stock
      await prisma.inventory.create({
        data: {
          productId: product.id,
          variantId: null, // Use the product's default variant
          warehouseId: warehouse.id,
          availableQuantity: Math.floor(Math.random() * 50) + 10, // Random available stock between 10-60
          reservedQuantity: 0,
          damagedQuantity: 0,
          minStockLevel: 5,
          maxStockLevel: 100,
          reorderPoint: 10,
          reorderQuantity: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log('\nSuccessfully created 20 new products with comprehensive data and stock!');
    console.log('\nCreated:');
    console.log('- 20 New Products with variants, images, category associations, and stock');
    console.log('- Stock levels between 10-60 units for each product');
    console.log('- All products linked to appropriate categories and warehouses');

  } catch (error) {
    console.error('Error creating 20 products:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

create20Products();