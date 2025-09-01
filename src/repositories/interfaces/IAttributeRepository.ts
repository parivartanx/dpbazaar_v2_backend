import {
  AttributeType,
  ProductAttribute,
  CategoryAttribute,
} from '@prisma/client';

export interface IAttributeRepository {
  // Attribute Types
  getAllTypes(): Promise<AttributeType[]>;
  getTypeById(id: string): Promise<AttributeType | null>;
  createType(data: any): Promise<AttributeType>;
  updateType(id: string, data: any): Promise<AttributeType>;
  deleteType(id: string): Promise<void>;

  // Product Attributes
  addToProduct(
    productId: string,
    attributeTypeId: string,
    value: string
  ): Promise<ProductAttribute>;
  removeFromProduct(id: string): Promise<void>;

  // Category Attributes
  assignToCategory(
    categoryId: string,
    attributeTypeId: string
  ): Promise<CategoryAttribute>;
  removeFromCategory(
    categoryId: string,
    attributeTypeId: string
  ): Promise<void>;
}
