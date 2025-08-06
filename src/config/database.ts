import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

// MongoDB Configuration
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dpbazaar';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Prisma Configuration
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const connectPrisma = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully');
  } catch (error) {
    console.error('Prisma connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
export const disconnectDatabases = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    await prisma.$disconnect();
    console.log('Databases disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting databases:', error);
  }
}; 