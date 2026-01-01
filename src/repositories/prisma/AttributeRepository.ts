import {
  AttributeType,
  ProductAttribute,
  CategoryAttribute,
} from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IAttributeRepository } from '../interfaces/IAttributeRepository';


export class AttributeRepository implements IAttributeRepository {
  async getAllTypes(): Promise<AttributeType[]> {
    return prisma.attributeType.findMany();
  }

  async getTypeById(id: string): Promise<AttributeType | null> {
    return prisma.attributeType.findUnique({ where: { id } });
  }

  async createType(data: any): Promise<AttributeType> {
    return prisma.attributeType.create({ data });
  }

  async updateType(id: string, data: any): Promise<AttributeType> {
    return prisma.attributeType.update({ where: { id }, data });
  }

  async deleteType(id: string): Promise<void> {
    await prisma.attributeType.delete({ where: { id } });
  }

  async addToProduct(
    productId: string,
    attributeTypeId: string,
    value: string
  ): Promise<ProductAttribute> {
    return prisma.productAttribute.create({
      data: { productId, attributeTypeId, value },
    });
  }

  async removeFromProduct(id: string): Promise<void> {
    await prisma.productAttribute.delete({ where: { id } });
  }

  async assignToCategory(
    categoryId: string,
    attributeTypeId: string
  ): Promise<CategoryAttribute> {
    return prisma.categoryAttribute.create({
      data: { categoryId, attributeTypeId },
    });
  }

  async removeFromCategory(
    categoryId: string,
    attributeTypeId: string
  ): Promise<void> {
    await prisma.categoryAttribute.delete({
      where: { categoryId_attributeTypeId: { categoryId, attributeTypeId } },
    });
  }
}
