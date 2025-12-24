import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDummyData() {
  try {
    console.log('Creating comprehensive dummy data...');

    // Get existing users, products, and other required entities
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dpbazaar.com' },
    });

    const customerUser = await prisma.user.findUnique({
      where: { email: 'customer@dpbazaar.com' },
    });

    const employeeUser = await prisma.user.findUnique({
      where: { email: 'employee@dpbazaar.com' },
    });

    const customer = await prisma.customer.findUnique({
      where: { userId: customerUser!.id },
    });

    const product = await prisma.product.findFirst({
      include: {
        variants: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    const variant = await prisma.productVariant.findFirst({
      where: { productId: product!.id }
    });

    if (!adminUser || !customerUser || !employeeUser || !customer || !product || !variant) {
      throw new Error('Required entities not found. Please run user and product creation scripts first.');
    }

    // Create Warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { code: 'WH001' },
      update: {},
      create: {
        code: `WH${Date.now()}`,
        name: 'Main Warehouse',
        type: 'MAIN',
        address: {
          addressLine1: '123 Warehouse Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001',
        },
        lat: 19.0760,
        lng: 72.8777,
        contactPhone: '+919876543210',
        contactEmail: 'warehouse@dpbazaar.com',
        totalCapacity: 10000,
        usedCapacity: 5000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Warehouse created:', warehouse.name);

    // Create Inventory
    const inventory = await prisma.inventory.upsert({
      where: {
        productId_variantId_warehouseId: {
          productId: product.id,
          variantId: variant.id,
          warehouseId: warehouse.id,
        }
      },
      update: {
        availableQuantity: 100,
        reservedQuantity: 10,
        damagedQuantity: 2,
        minStockLevel: 20,
        maxStockLevel: 500,
        reorderPoint: 30,
        reorderQuantity: 100,
        rack: 'A1',
        shelf: '2',
        bin: 'B001',
        lastCountedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        productId: product.id,
        variantId: variant.id,
        warehouseId: warehouse.id,
        availableQuantity: 100,
        reservedQuantity: 10,
        damagedQuantity: 2,
        minStockLevel: 20,
        maxStockLevel: 500,
        reorderPoint: 30,
        reorderQuantity: 100,
        rack: 'A1',
        shelf: '2',
        bin: 'B001',
        lastRestockedAt: new Date(),
        lastCountedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Inventory created for product:', product.name);

    // Create Stock Movement
    const stockMovement = await prisma.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        warehouseId: warehouse.id,
        type: 'IN',
        quantity: 100,
        referenceType: 'PURCHASE_ORDER',
        referenceId: 'PO-001',
        reason: 'Initial stock',
        notes: 'Initial stock received',
        performedBy: adminUser.id,
        performedAt: new Date(),
      },
    });
    console.log('Stock movement created:', stockMovement.type);

    // Create Price History
    await prisma.priceHistory.create({
      data: {
        productId: product.id,
        oldMrp: 130000,
        newMrp: 134900,
        oldSellingPrice: 125000,
        newSellingPrice: 129900,
        reason: 'Price increase',
        changedBy: adminUser.id,
        createdAt: new Date(),
      },
    });
    console.log('Price history created for product:', product.name);

    // Create Discount
    const discount = await prisma.discount.upsert({
      where: { code: 'WELCOME10' },
      update: {
        description: 'Welcome discount for new customers',
        type: 'PERCENTAGE',
        value: 10,
        minOrderAmount: 1000,
        maxDiscountAmount: 500,
        usageLimit: 1000,
        usagePerCustomer: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicableCategories: [product.categories[0] ? product.categories[0].category.slug : 'electronics'],
        applicableProducts: [product.id],
        applicableBrands: [product.brandId || ''],
        customerSegments: ['NEW'],
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        code: `DISC${Date.now()}`,
        description: 'Welcome discount for new customers',
        type: 'PERCENTAGE',
        value: 10,
        minOrderAmount: 1000,
        maxDiscountAmount: 500,
        usageLimit: 1000,
        usagePerCustomer: 1,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        applicableCategories: [product.categories[0] ? product.categories[0].category.slug : 'electronics'],
        applicableProducts: [product.id],
        applicableBrands: [product.brandId || ''],
        customerSegments: ['NEW'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Discount created:', discount.code);

    // Create or update Cart
    const cart = await prisma.cart.upsert({
      where: { customerId: customer.id },
      update: {
        itemCount: 2,
        totalMrp: 135000,
        totalDiscount: 5000,
        totalAmount: 130000,
        discountCode: discount.code,
        discountAmount: 5000,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        updatedAt: new Date(),
      },
      create: {
        customerId: customer.id,
        itemCount: 2,
        totalMrp: 135000,
        totalDiscount: 5000,
        totalAmount: 130000,
        discountCode: discount.code,
        discountAmount: 5000,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Cart created/updated for customer:', customerUser.email);

    // Create Cart Items
    await prisma.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId: product.id,
          variantId: variant.id,
        }
      },
      update: {
        quantity: 1,
        mrp: product.mrp,
        sellingPrice: product.sellingPrice,
        discount: 5000,
        updatedAt: new Date(),
      },
      create: {
        cartId: cart.id,
        productId: product.id,
        variantId: variant.id,
        quantity: 1,
        mrp: product.mrp,
        sellingPrice: product.sellingPrice,
        discount: 5000,
        addedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Cart item created for product:', product.name);

    // Create Order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD${Date.now()}`,
        customerId: customer.id,
        itemsTotal: product.sellingPrice,
        taxAmount: product.sellingPrice.mul(0.18),
        shippingCharges: 100,
        codCharges: 0,
        discount: 5000,
        totalAmount: product.sellingPrice.add(product.sellingPrice.mul(0.18)).add(100).sub(5000),
        status: 'CONFIRMED',
        paymentStatus: 'SUCCESS',
        shippingAddress: {
          addressLine1: '456 Customer Street',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110001',
        },
        billingAddress: {
          addressLine1: '456 Customer Street',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          postalCode: '110001',
        },
        customerName: customer.firstName + ' ' + customer.lastName,
        customerEmail: customerUser.email,
        customerPhone: customerUser.phone || '+919876543213',
        source: 'WEBSITE',
        deviceInfo: { browser: 'Chrome', os: 'Windows', device: 'Desktop' },
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmedAt: new Date(),
      },
    });
    console.log('Order created:', order.orderNumber);

    // Create Order Item
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        productSku: product.sku,
        variantName: variant.variantName,
        productImage: 'https://example.com/product-image.jpg',
        mrp: product.mrp,
        sellingPrice: product.sellingPrice,
        quantity: 1,
        discount: 5000,
        taxRate: product.taxRate,
        taxAmount: product.sellingPrice.mul(product.taxRate.div(100)),
        totalAmount: product.sellingPrice.sub(5000).add(product.sellingPrice.mul(product.taxRate.div(100))),
        vendorId: product.vendorId || null,
        vendorCommission: product.vendorId ? 10 : null,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Order item created for order:', order.orderNumber);

    // Create Payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'INR',
        method: 'RAZORPAY',
        status: 'SUCCESS',
        gatewayName: 'razorpay',
        gatewayOrderId: `rzp_${Date.now()}`,
        gatewayPaymentId: `pay_${Date.now()}`,
        gatewaySignature: 'signature_' + Date.now(),
        cardLast4: '1234',
        cardBrand: 'Visa',
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Payment created for order:', order.orderNumber);

    // Create Delivery Agent
    const deliveryAgent = await prisma.deliveryAgent.upsert({
      where: { phone: '+919876543219' },
      update: {
        firstName: 'Delivery',
        lastName: 'Agent',
        email: `delivery${Date.now()}@dpbazaar.com`,
        vehicleType: 'BIKE',
        vehicleNumber: 'MH-12-AB-1234',
        licenseNumber: 'DL-1234567890',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        zones: ['Mumbai', 'Navi Mumbai'],
        currentZone: 'Mumbai',
        isAvailable: true,
        rating: 4.5,
        totalDeliveries: 50,
        successfulDeliveries: 48,
        updatedAt: new Date(),
      },
      create: {
        agentCode: `DA${Date.now()}`,
        firstName: 'Delivery',
        lastName: 'Agent',
        email: `delivery${Date.now()}@dpbazaar.com`,
        phone: '+919876543219',
        vehicleType: 'BIKE',
        vehicleNumber: 'MH-12-AB-1234',
        licenseNumber: 'DL-1234567890',
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        zones: ['Mumbai', 'Navi Mumbai'],
        currentZone: 'Mumbai',
        isAvailable: true,
        rating: 4.5,
        totalDeliveries: 50,
        successfulDeliveries: 48,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Delivery agent created:', deliveryAgent.firstName);

    // Create Delivery
    await prisma.delivery.create({
      data: {
        orderId: order.id,
        deliveryAgentId: deliveryAgent.id,
        trackingId: `TRK${Date.now()}`,
        deliveryType: 'HOME_DELIVERY',
        status: 'PENDING',
        deliveryAddress: JSON.parse(JSON.stringify(order.shippingAddress)),
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledSlot: '10AM-2PM',
        deliveryCharge: 100,
        codAmount: order.totalAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Delivery created for order:', order.orderNumber);

    // Create Review
    await prisma.review.upsert({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: product.id,
        }
      },
      update: {
        orderId: order.id,
        rating: 5,
        title: 'Excellent product!',
        comment: 'Very satisfied with the quality and service.',
        pros: ['Good quality', 'Fast delivery'],
        cons: [],
        images: ['https://example.com/review-image.jpg'],
        videos: [],
        isVerifiedPurchase: true,
        helpfulCount: 5,
        notHelpfulCount: 0,
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        customerId: customer.id,
        productId: product.id,
        orderId: order.id,
        rating: 5,
        title: 'Excellent product!',
        comment: 'Very satisfied with the quality and service.',
        pros: ['Good quality', 'Fast delivery'],
        cons: [],
        images: ['https://example.com/review-image.jpg'],
        videos: [],
        isVerifiedPurchase: true,
        helpfulCount: 5,
        notHelpfulCount: 0,
        status: 'APPROVED',
        approvedBy: adminUser.id,
        approvedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Review created for product:', product.name);

    // Create Wishlist
    const wishlist = await prisma.wishlist.upsert({
      where: {
        customerId_name: {
          customerId: customer.id,
          name: 'My Wishlist',
        }
      },
      update: {
        isDefault: true,
        isPublic: false,
        updatedAt: new Date(),
      },
      create: {
        customerId: customer.id,
        name: 'My Wishlist',
        isDefault: true,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Wishlist created for customer:', customerUser.email);

    // Create Wishlist Item
    await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: product.id,
        }
      },
      update: {
        priority: 1,
      },
      create: {
        wishlistId: wishlist.id,
        productId: product.id,
        priority: 1,
        addedAt: new Date(),
      },
    });
    console.log('Wishlist item created for product:', product.name);

    // Create Search History
    await prisma.searchHistory.create({
      data: {
        customerId: customer.id,
        query: 'iPhone',
        resultsCount: 10,
        deviceType: 'Mobile',
        source: 'SEARCH_BAR',
        createdAt: new Date(),
      },
    });
    console.log('Search history created for customer:', customerUser.email);

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: customerUser.id,
        type: 'EMAIL',
        title: 'Order Confirmation',
        message: `Your order ${order.orderNumber} has been confirmed.`,
        isRead: false,
        sentViaEmail: true,
        sentViaSms: false,
        sentViaPush: true,
        createdAt: new Date(),
      },
    });
    console.log('Notification created for user:', customerUser.email);

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: 'CREATE',
        entityType: 'Order',
        entityId: order.id,
        newValues: { orderNumber: order.orderNumber, status: order.status },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; AdminBot/1.0)',
        createdAt: new Date(),
      },
    });
    console.log('Audit log created for order:', order.orderNumber);

    // Create Invoice
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV${Date.now()}`,
        orderId: order.id,
        type: 'TAX_INVOICE',
        subtotal: order.itemsTotal,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        taxDetails: {
          sgst: order.taxAmount.div(2),
          cgst: order.taxAmount.div(2),
          igst: 0,
          hsnCode: product.hsnCode,
        },
        status: 'ISSUED',
        issuedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Invoice created for order:', order.orderNumber);

    // Create Address
    await prisma.address.create({
      data: {
        customerId: customer.id,
        type: 'HOME',
        isDefault: true,
        fullName: `${customer.firstName} ${customer.lastName}`,
        phone: customerUser.phone || '+919876543213',
        addressLine1: '789 Customer Street',
        addressLine2: 'Customer Area',
        landmark: 'Near Customer Landmark',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110001',
        lat: 28.6139,
        lng: 77.2090,
        deliveryInstructions: 'Leave at reception if not home',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Address created for customer:', customerUser.email);

    // Create Wallet Transaction
    const wallet = await prisma.wallet.upsert({
      where: {
        customerId_type: {
          customerId: customer.id,
          type: 'SHOPPING',
        }
      },
      update: {
        balance: 1000,
        updatedAt: new Date(),
      },
      create: {
        customerId: customer.id,
        type: 'SHOPPING',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Wallet created for customer:', customerUser.email);

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        customerId: customer.id,
        type: 'CREDIT',
        reason: 'REWARD',
        status: 'SUCCESS',
        amount: 1000,
        balanceBefore: 0,
        balanceAfter: 1000,
        metadata: { source: 'signup' },
        createdAt: new Date(),
      },
    });
    console.log('Wallet transaction created for customer:', customerUser.email);

    console.log('\nAll comprehensive dummy data has been created successfully!');
    console.log('\nCreated various entities including:');
    console.log('- Warehouse and Inventory management');
    console.log('- Pricing and Discount systems');
    console.log('- Shopping cart and order management');
    console.log('- Payment and delivery systems');
    console.log('- Customer engagement features');
    console.log('- Audit logs and notifications');
    console.log('- Financial and wallet systems');

  } catch (error) {
    console.error('Error creating dummy data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createDummyData();