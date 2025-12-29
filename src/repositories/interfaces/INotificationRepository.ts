import { Notification, NotificationType } from '@prisma/client';

export interface INotificationRepository {
  create(data: any): Promise<Notification>;
  update(id: string, data: any): Promise<Notification>;
  delete(id: string): Promise<Notification>;
  getById(id: string): Promise<Notification | null>;
  getAll(filters?: any): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<void>;
}
