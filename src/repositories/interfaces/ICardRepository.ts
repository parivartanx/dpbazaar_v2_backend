// src/interfaces/ICardRepository.ts
import { CardManagement } from '@prisma/client';

export interface ICardRepository {
  list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    visibility?: string;
  }): Promise<CardManagement[]>;

  findById(id: string): Promise<CardManagement | null>;

  create(
    data: Omit<CardManagement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<CardManagement>;

  update(
    id: string,
    data: Partial<
      Omit<CardManagement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >
  ): Promise<CardManagement>;

  softDelete(id: string): Promise<CardManagement>;

  restore(id: string): Promise<CardManagement>;
}
