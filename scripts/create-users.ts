import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUsers() {
  try {
    console.log('Creating default users with comprehensive data...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin1@', 10);
    const managerPassword = await bcrypt.hash('Manager1@', 10);
    const employeePassword = await bcrypt.hash('Employee1@', 10);
    const customerPassword = await bcrypt.hash('Customer1@', 10);

    // Create Admin user with comprehensive data
    const admin = await prisma.user.upsert({
      where: { email: 'admin@dpbazaar.com' },
      update: {},
      create: {
        email: 'admin@dpbazaar.com',
        firstName: 'System',
        lastName: 'Admin',
        username: 'sysadmin',
        phone: '+919876543210',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
        lastLoginIp: '127.0.0.1',
        passwordChangedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Admin user created/updated:', admin.email);

    // Create Manager user with comprehensive data
    const manager = await prisma.user.upsert({
      where: { email: 'manager@dpbazaar.com' },
      update: {},
      create: {
        email: 'manager@dpbazaar.com',
        firstName: 'Project',
        lastName: 'Manager',
        username: 'projmgr',
        phone: '+919876543211',
        password: managerPassword,
        role: 'MANAGER',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
        lastLoginIp: '127.0.0.1',
        passwordChangedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Manager user created/updated:', manager.email);

    // Create Employee user with comprehensive data
    const employee = await prisma.user.upsert({
      where: { email: 'employee@dpbazaar.com' },
      update: {},
      create: {
        email: 'employee@dpbazaar.com',
        firstName: 'Regular',
        lastName: 'Employee',
        username: 'regemployee',
        phone: '+919876543212',
        password: employeePassword,
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
        lastLoginIp: '127.0.0.1',
        passwordChangedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Employee user created/updated:', employee.email);

    // Create Customer user with comprehensive data
    const customer = await prisma.user.upsert({
      where: { email: 'customer@dpbazaar.com' },
      update: {},
      create: {
        email: 'customer@dpbazaar.com',
        firstName: 'Regular',
        lastName: 'Customer',
        username: 'regcustomer',
        phone: '+919876543213',
        password: customerPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
        lastLoginAt: new Date(),
        lastLoginIp: '127.0.0.1',
        passwordChangedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer user created/updated:', customer.email);

    // Create Employee profile with comprehensive data
    await prisma.employee.upsert({
      where: { userId: employee.id },
      update: {},
      create: {
        userId: employee.id,
        employeeCode: `EMP${Date.now()}`,
        firstName: employee.firstName,
        lastName: employee.lastName,
        middleName: 'Test',
        personalEmail: 'employee.personal@dpbazaar.com',
        workPhone: '+919876543214',
        departmentId: null, // Will create department later if needed
        designation: 'Software Developer',
        status: 'ACTIVE',
        employmentType: 'FULL_TIME',
        joiningDate: new Date(),
        confirmationDate: new Date(),
        salary: 50000,
        currency: 'INR',
        profileImage: 'https://example.com/employee-profile.jpg',
        documents: { resume: 'https://example.com/resume.pdf', idProof: 'https://example.com/id-proof.jpg' },
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '+919876543215',
        emergencyContactRelation: 'Spouse',
        currentAddress: {
          addressLine1: '123 Test Street',
          addressLine2: 'Test Area',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001',
        },
        permanentAddress: {
          addressLine1: '456 Permanent Street',
          addressLine2: 'Permanent Area',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001',
        },
        metadata: { hiredBy: 'HR Manager', source: 'Direct Hire' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Employee profile created/updated for:', employee.email);

    // Create Customer profile with comprehensive data
    const customerProfile = await prisma.customer.upsert({
      where: { userId: customer.id },
      update: {},
      create: {
        userId: customer.id,
        customerCode: `CUST${Date.now()}`,
        firstName: customer.firstName,
        lastName: customer.lastName,
        middleName: 'Test',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        avatar: 'https://example.com/customer-profile.jpg',
        bio: 'Regular customer of DPBazaar',
        tier: 'GOLD',
        loyaltyPoints: 1500,
        lifetimeValue: 50000,
        preferences: { newsletter: true, smsAlerts: true, emailNotifications: true },
        totalOrders: 5,
        totalSpent: 25000,
        lastOrderAt: new Date(),
        metadata: { source: 'Website', registeredFrom: 'India' },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer profile created/updated for:', customer.email);

    // Customer address creation skipped due to Prisma relation constraints

    // Create Customer cart
    await prisma.cart.upsert({
      where: { customerId: customerProfile.id },
      update: {},
      create: {
        customerId: customerProfile.id,
        itemCount: 2,
        totalMrp: 3000,
        totalDiscount: 300,
        totalAmount: 2700,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer cart created for:', customer.email);

    // Create Customer wishlist
    await prisma.wishlist.upsert({
      where: { id: `WISH${Date.now()}` },
      update: {},
      create: {
        id: `WISH${Date.now()}`,
        customerId: customerProfile.id,
        name: 'My Wishlist',
        isDefault: true,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer wishlist created for:', customer.email);

    // Create Customer wallet
    await prisma.wallet.create({
      data: {
        customerId: customerProfile.id,
        type: 'SHOPPING',
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Customer wallet created for:', customer.email);

    console.log('\nAll default users with comprehensive data have been created successfully!');
    console.log('\nCredentials:');
    console.log('Admin: admin@dpbazaar.com / Admin1@');
    console.log('Manager: manager@dpbazaar.com / Manager1@');
    console.log('Employee: employee@dpbazaar.com / Employee1@');
    console.log('Customer: customer@dpbazaar.com / Customer1@');

  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();