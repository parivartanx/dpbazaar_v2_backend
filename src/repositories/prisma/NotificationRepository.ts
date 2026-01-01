import { Notification } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { INotificationRepository } from '../interfaces/INotificationRepository';



export class NotificationRepository implements INotificationRepository {
  async create(data: any): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async update(id: string, data: any): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });
  }

  async getAll(filters?: any): Promise<Notification[]> {
    const { page, limit, userId, type, isRead } = filters || {};
    const where: any = {};

    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const query: any = {
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.notification.findMany(query);
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }
}
