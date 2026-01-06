import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CategoryInput {
  name: string;
  slug: string;
  level: number;
  path: string;
  parentSlug?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  description?: string;
  commissionRate?: number;
}

async function createCategory(
  data: CategoryInput,
  parentId: string | null = null,
  parentSlug?: string
) {
  // Check if category already exists
  const existing = await prisma.category.findUnique({
    where: { slug: data.slug },
    include: {
      parent: {
        select: { id: true, slug: true, name: true },
      },
      children: {
        select: { id: true, slug: true, name: true },
      },
    },
  });

  if (existing) {
    // Verify parent relationship is correct
    if (parentId && existing.parentId !== parentId) {
      console.log(
        `⚠️  Category "${data.name}" (${data.slug}) exists but has different parent. Updating parent relationship...`
      );
      const updated = await prisma.category.update({
        where: { slug: data.slug },
        data: {
          parentId: parentId,
          level: data.level,
          path: data.path,
        },
        include: {
          parent: {
            select: { id: true, slug: true, name: true },
          },
        },
      });
      console.log(
        `✓ Updated: ${data.name} (${data.slug}) - Parent: ${updated.parent?.name || 'None'}`
      );
      return updated;
    }
    console.log(
      `✓ Exists: ${data.name} (${data.slug}) - Level ${existing.level} - Parent: ${existing.parent?.name || 'None'}`
    );
    return existing;
  }

  // Validate parent exists if parentId is provided
  if (parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: parentId },
    });
    if (!parent) {
      throw new Error(`Parent category with ID "${parentId}" not found for "${data.name}"`);
    }
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      level: data.level,
      path: data.path,
      parentId: parentId,
      displayOrder: data.displayOrder || 0,
      isFeatured: data.isFeatured || false,
      description: data.description || null,
      commissionRate: data.commissionRate || null,
      isActive: true,
    },
    include: {
      parent: {
        select: { id: true, slug: true, name: true },
      },
    },
  });

  const parentInfo = category.parent ? ` - Parent: ${category.parent.name}` : ' - Root category';
  console.log(
    `✓ Created: ${data.name} (${data.slug}) - Level ${data.level} - Path: ${data.path}${parentInfo}`
  );
  return category;
}

async function createCategories() {
  try {
    console.log('Creating categories with hierarchy (Level 0, 1, 2)...\n');

    // Store created categories by slug for parent lookup
    const categoryMap = new Map<string, { id: string; slug: string }>();

    // ============================================
    // LEVEL 0: Root Categories
    // ============================================
    console.log('--- Creating Level 0 Categories ---\n');

    const level0Categories: CategoryInput[] = [
      {
        name: 'Fashion',
        slug: 'fashion',
        level: 0,
        path: '/fashion',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        level: 0,
        path: '/electronics',
        isFeatured: true,
        displayOrder: 2,
      },
      {
        name: 'Home & Furniture',
        slug: 'home-furniture',
        level: 0,
        path: '/home-furniture',
        displayOrder: 3,
      },
      {
        name: 'Grocery',
        slug: 'grocery',
        level: 0,
        path: '/grocery',
        displayOrder: 4,
      },
    ];

    for (const catData of level0Categories) {
      const category = await createCategory(catData, null, undefined);
      categoryMap.set(catData.slug, { id: category.id, slug: category.slug });
    }

    // ============================================
    // LEVEL 1: Subcategories
    // ============================================
    console.log('\n--- Creating Level 1 Categories ---\n');

    const level1Categories: CategoryInput[] = [
      // Fashion Level 1
      {
        name: "Men's Top Wear",
        slug: 'mens-top-wear',
        parentSlug: 'fashion',
        level: 1,
        path: '/fashion/mens-top-wear',
        displayOrder: 1,
      },
      {
        name: "Men's Bottom Wear",
        slug: 'mens-bottom-wear',
        parentSlug: 'fashion',
        level: 1,
        path: '/fashion/mens-bottom-wear',
        displayOrder: 2,
      },
      {
        name: 'Women Ethnic',
        slug: 'women-ethnic',
        parentSlug: 'fashion',
        level: 1,
        path: '/fashion/women-ethnic',
        displayOrder: 3,
      },
      {
        name: 'Women Footwear',
        slug: 'women-footwear',
        parentSlug: 'fashion',
        level: 1,
        path: '/fashion/women-footwear',
        displayOrder: 4,
      },
      {
        name: 'Men Footwear',
        slug: 'men-footwear',
        parentSlug: 'fashion',
        level: 1,
        path: '/fashion/men-footwear',
        displayOrder: 5,
      },
      // Electronics Level 1
      {
        name: 'Mobiles & Accessories',
        slug: 'mobiles-accessories',
        parentSlug: 'electronics',
        level: 1,
        path: '/electronics/mobiles-accessories',
        displayOrder: 1,
      },
      {
        name: 'Laptops & Computers',
        slug: 'laptops-computers',
        parentSlug: 'electronics',
        level: 1,
        path: '/electronics/laptops-computers',
        displayOrder: 2,
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        parentSlug: 'electronics',
        level: 1,
        path: '/electronics/audio-headphones',
        displayOrder: 3,
      },
      {
        name: 'TV & Entertainment',
        slug: 'tv-entertainment',
        parentSlug: 'electronics',
        level: 1,
        path: '/electronics/tv-entertainment',
        displayOrder: 4,
      },
      {
        name: 'Cameras & Photography',
        slug: 'cameras-photography',
        parentSlug: 'electronics',
        level: 1,
        path: '/electronics/cameras-photography',
        displayOrder: 5,
      },
      // Home & Furniture Level 1
      {
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        parentSlug: 'home-furniture',
        level: 1,
        path: '/home-furniture/kitchen-appliances',
        displayOrder: 1,
      },
      {
        name: 'Home Decor',
        slug: 'home-decor',
        parentSlug: 'home-furniture',
        level: 1,
        path: '/home-furniture/home-decor',
        displayOrder: 2,
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        parentSlug: 'home-furniture',
        level: 1,
        path: '/home-furniture/furniture',
        displayOrder: 3,
      },
      {
        name: 'Bedding & Bath',
        slug: 'bedding-bath',
        parentSlug: 'home-furniture',
        level: 1,
        path: '/home-furniture/bedding-bath',
        displayOrder: 4,
      },
      // Grocery Level 1
      {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        parentSlug: 'grocery',
        level: 1,
        path: '/grocery/fruits-vegetables',
        displayOrder: 1,
      },
      {
        name: 'Dairy & Eggs',
        slug: 'dairy-eggs',
        parentSlug: 'grocery',
        level: 1,
        path: '/grocery/dairy-eggs',
        displayOrder: 2,
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        parentSlug: 'grocery',
        level: 1,
        path: '/grocery/beverages',
        displayOrder: 3,
      },
      {
        name: 'Snacks & Packaged Foods',
        slug: 'snacks-packaged-foods',
        parentSlug: 'grocery',
        level: 1,
        path: '/grocery/snacks-packaged-foods',
        displayOrder: 4,
      },
      {
        name: 'Personal Care',
        slug: 'personal-care',
        parentSlug: 'grocery',
        level: 1,
        path: '/grocery/personal-care',
        displayOrder: 5,
      },
    ];

    for (const catData of level1Categories) {
      const parent = categoryMap.get(catData.parentSlug!);
      if (!parent) {
        console.error(`❌ Parent category "${catData.parentSlug}" not found for "${catData.name}"`);
        continue;
      }
      const category = await createCategory(catData, parent.id, catData.parentSlug);
      categoryMap.set(catData.slug, { id: category.id, slug: category.slug });
    }

    // ============================================
    // LEVEL 2: Sub-subcategories
    // ============================================
    console.log('\n--- Creating Level 2 Categories ---\n');

    const level2Categories: CategoryInput[] = [
      // Fashion - Women Footwear Level 2
      {
        name: 'All',
        slug: 'all',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/all',
        displayOrder: 1,
      },
      {
        name: 'Women Flats',
        slug: 'women-flats',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-flats',
        displayOrder: 2,
      },
      {
        name: 'Women Heels',
        slug: 'women-heels',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-heels',
        displayOrder: 3,
      },
      {
        name: 'Women Wedges',
        slug: 'women-wedges',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-wedges',
        displayOrder: 4,
      },
      {
        name: 'Women Casual Shoes',
        slug: 'women-casual-shoes',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-casual-shoes',
        displayOrder: 5,
      },
      {
        name: 'Women Sports Shoes',
        slug: 'women-sports-shoes',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-sports-shoes',
        displayOrder: 6,
      },
      {
        name: 'Women Sneakers',
        slug: 'women-sneakers',
        parentSlug: 'women-footwear',
        level: 2,
        path: '/fashion/women-footwear/women-sneakers',
        displayOrder: 7,
      },
      // Electronics - Mobiles & Accessories Level 2
      {
        name: 'Smartphones',
        slug: 'smartphones',
        parentSlug: 'mobiles-accessories',
        level: 2,
        path: '/electronics/mobiles-accessories/smartphones',
        displayOrder: 1,
      },
      {
        name: 'Mobile Cases & Covers',
        slug: 'mobile-cases-covers',
        parentSlug: 'mobiles-accessories',
        level: 2,
        path: '/electronics/mobiles-accessories/mobile-cases-covers',
        displayOrder: 2,
      },
      {
        name: 'Mobile Chargers & Cables',
        slug: 'mobile-chargers-cables',
        parentSlug: 'mobiles-accessories',
        level: 2,
        path: '/electronics/mobiles-accessories/mobile-chargers-cables',
        displayOrder: 3,
      },
      {
        name: 'Power Banks',
        slug: 'power-banks',
        parentSlug: 'mobiles-accessories',
        level: 2,
        path: '/electronics/mobiles-accessories/power-banks',
        displayOrder: 4,
      },
      // Electronics - Audio & Headphones Level 2
      {
        name: 'Headphones & Earphones',
        slug: 'headphones-earphones',
        parentSlug: 'audio-headphones',
        level: 2,
        path: '/electronics/audio-headphones/headphones-earphones',
        displayOrder: 1,
      },
      {
        name: 'Speakers',
        slug: 'speakers',
        parentSlug: 'audio-headphones',
        level: 2,
        path: '/electronics/audio-headphones/speakers',
        displayOrder: 2,
      },
      {
        name: 'Soundbars',
        slug: 'soundbars',
        parentSlug: 'audio-headphones',
        level: 2,
        path: '/electronics/audio-headphones/soundbars',
        displayOrder: 3,
      },
      // Home & Furniture - Kitchen Appliances Level 2
      {
        name: 'Coffee & Tea Makers',
        slug: 'coffee-tea-makers',
        parentSlug: 'kitchen-appliances',
        level: 2,
        path: '/home-furniture/kitchen-appliances/coffee-tea-makers',
        displayOrder: 1,
      },
      {
        name: 'Cookware & Bakeware',
        slug: 'cookware-bakeware',
        parentSlug: 'kitchen-appliances',
        level: 2,
        path: '/home-furniture/kitchen-appliances/cookware-bakeware',
        displayOrder: 2,
      },
      {
        name: 'Small Kitchen Appliances',
        slug: 'small-kitchen-appliances',
        parentSlug: 'kitchen-appliances',
        level: 2,
        path: '/home-furniture/kitchen-appliances/small-kitchen-appliances',
        displayOrder: 3,
      },
      {
        name: 'Mixers & Grinders',
        slug: 'mixers-grinders',
        parentSlug: 'kitchen-appliances',
        level: 2,
        path: '/home-furniture/kitchen-appliances/mixers-grinders',
        displayOrder: 4,
      },
      // Grocery - Beverages Level 2
      {
        name: 'Soft Drinks',
        slug: 'soft-drinks',
        parentSlug: 'beverages',
        level: 2,
        path: '/grocery/beverages/soft-drinks',
        displayOrder: 1,
      },
      {
        name: 'Juices',
        slug: 'juices',
        parentSlug: 'beverages',
        level: 2,
        path: '/grocery/beverages/juices',
        displayOrder: 2,
      },
      {
        name: 'Tea & Coffee',
        slug: 'tea-coffee',
        parentSlug: 'beverages',
        level: 2,
        path: '/grocery/beverages/tea-coffee',
        displayOrder: 3,
      },
      {
        name: 'Energy Drinks',
        slug: 'energy-drinks',
        parentSlug: 'beverages',
        level: 2,
        path: '/grocery/beverages/energy-drinks',
        displayOrder: 4,
      },
      {
        name: 'Water & Health Drinks',
        slug: 'water-health-drinks',
        parentSlug: 'beverages',
        level: 2,
        path: '/grocery/beverages/water-health-drinks',
        displayOrder: 5,
      },
    ];

    for (const catData of level2Categories) {
      const parent = categoryMap.get(catData.parentSlug!);
      if (!parent) {
        console.error(`❌ Parent category "${catData.parentSlug}" not found for "${catData.name}"`);
        continue;
      }
      const category = await createCategory(catData, parent.id, catData.parentSlug);
      categoryMap.set(catData.slug, { id: category.id, slug: category.slug });
    }

    // ============================================
    // Verify Parent-Child Relationships
    // ============================================
    console.log('\n--- Verifying Parent-Child Relationships ---\n');

    // Verify Fashion
    const fashionCategory = categoryMap.get('fashion');
    if (fashionCategory) {
      const fashionWithChildren = await prisma.category.findUnique({
        where: { id: fashionCategory.id },
        include: {
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (fashionWithChildren) {
        console.log(`✓ Fashion has ${fashionWithChildren.children.length} children:`);
        fashionWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Women Footwear
    const womenFootwear = categoryMap.get('women-footwear');
    if (womenFootwear) {
      const womenFootwearWithChildren = await prisma.category.findUnique({
        where: { id: womenFootwear.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (womenFootwearWithChildren) {
        console.log(
          `\n✓ Women Footwear (Parent: ${womenFootwearWithChildren.parent?.name || 'None'}) has ${womenFootwearWithChildren.children.length} children:`
        );
        womenFootwearWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Electronics
    const electronicsCategory = categoryMap.get('electronics');
    if (electronicsCategory) {
      const electronicsWithChildren = await prisma.category.findUnique({
        where: { id: electronicsCategory.id },
        include: {
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (electronicsWithChildren) {
        console.log(`\n✓ Electronics has ${electronicsWithChildren.children.length} children:`);
        electronicsWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Mobiles & Accessories
    const mobilesAccessories = categoryMap.get('mobiles-accessories');
    if (mobilesAccessories) {
      const mobilesWithChildren = await prisma.category.findUnique({
        where: { id: mobilesAccessories.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (mobilesWithChildren) {
        console.log(
          `\n✓ Mobiles & Accessories (Parent: ${mobilesWithChildren.parent?.name || 'None'}) has ${mobilesWithChildren.children.length} children:`
        );
        mobilesWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Audio & Headphones
    const audioHeadphones = categoryMap.get('audio-headphones');
    if (audioHeadphones) {
      const audioWithChildren = await prisma.category.findUnique({
        where: { id: audioHeadphones.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (audioWithChildren) {
        console.log(
          `\n✓ Audio & Headphones (Parent: ${audioWithChildren.parent?.name || 'None'}) has ${audioWithChildren.children.length} children:`
        );
        audioWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Home & Furniture
    const homeFurniture = categoryMap.get('home-furniture');
    if (homeFurniture) {
      const homeWithChildren = await prisma.category.findUnique({
        where: { id: homeFurniture.id },
        include: {
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (homeWithChildren) {
        console.log(`\n✓ Home & Furniture has ${homeWithChildren.children.length} children:`);
        homeWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Kitchen Appliances
    const kitchenAppliances = categoryMap.get('kitchen-appliances');
    if (kitchenAppliances) {
      const kitchenWithChildren = await prisma.category.findUnique({
        where: { id: kitchenAppliances.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (kitchenWithChildren) {
        console.log(
          `\n✓ Kitchen Appliances (Parent: ${kitchenWithChildren.parent?.name || 'None'}) has ${kitchenWithChildren.children.length} children:`
        );
        kitchenWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Grocery
    const groceryCategory = categoryMap.get('grocery');
    if (groceryCategory) {
      const groceryWithChildren = await prisma.category.findUnique({
        where: { id: groceryCategory.id },
        include: {
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (groceryWithChildren) {
        console.log(`\n✓ Grocery has ${groceryWithChildren.children.length} children:`);
        groceryWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // Verify Beverages
    const beverages = categoryMap.get('beverages');
    if (beverages) {
      const beveragesWithChildren = await prisma.category.findUnique({
        where: { id: beverages.id },
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true, level: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      });
      if (beveragesWithChildren) {
        console.log(
          `\n✓ Beverages (Parent: ${beveragesWithChildren.parent?.name || 'None'}) has ${beveragesWithChildren.children.length} children:`
        );
        beveragesWithChildren.children.forEach((child) => {
          console.log(`   - ${child.name} (Level ${child.level})`);
        });
      }
    }

    // ============================================
    // Summary
    // ============================================
    console.log('\n✅ All categories created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Level 0 (Root): ${level0Categories.length} categories`);
    console.log(`   - Level 1 (Subcategories): ${level1Categories.length} categories`);
    console.log(`   - Level 2 (Sub-subcategories): ${level2Categories.length} categories`);
    console.log(
      `   - Total: ${level0Categories.length + level1Categories.length + level2Categories.length} categories`
    );
    console.log('\n📋 Breakdown by Root Category:');
    console.log(`   - Fashion: 5 Level 1, 7 Level 2`);
    console.log(`   - Electronics: 5 Level 1, 7 Level 2`);
    console.log(`   - Home & Furniture: 4 Level 1, 4 Level 2`);
    console.log(`   - Grocery: 5 Level 1, 5 Level 2`);
    console.log('\n🔗 Parent-Child relationships verified and established!');

  } catch (error) {
    console.error('❌ Error creating categories:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
