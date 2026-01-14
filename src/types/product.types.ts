/**
 * Comprehensive Product Creation DTOs
 *
 * These types define the structure for creating a product with all
 * related entities (variants, images, attributes, inventory) in a single request.
 */

import { ProductStatus, StockStatus } from '@prisma/client';

// ═══════════════════════════════════════════════════════════
// INVENTORY DTO (shared for product/variant inventory)
// ═══════════════════════════════════════════════════════════

export interface InventoryDTO {
  warehouseId: string; // CUID of warehouse (required)

  // Stock Levels
  availableQuantity: number; // ≥0, required
  reservedQuantity?: number; // ≥0, default: 0
  damagedQuantity?: number; // ≥0, default: 0

  // Thresholds
  minStockLevel?: number; // ≥0, default: 10
  maxStockLevel?: number; // ≥0, default: 1000
  reorderPoint?: number; // ≥0, default: 20
  reorderQuantity?: number; // ≥0, default: 100

  // Warehouse Location
  rack?: string; // Rack identifier
  shelf?: string; // Shelf identifier
  bin?: string; // Bin identifier
}

// ═══════════════════════════════════════════════════════════
// IMAGE DTO
// ═══════════════════════════════════════════════════════════

export interface ProductImageDTO {
  imageKey: string; // R2 storage key (from pre-upload)
  isPrimary?: boolean; // Default: first image is primary
  alt?: string; // Alt text for accessibility
  caption?: string; // Image caption
}

// ═══════════════════════════════════════════════════════════
// ATTRIBUTE DTO
// ═══════════════════════════════════════════════════════════

export interface ProductAttributeDTO {
  attributeTypeId: string; // CUID of AttributeType
  value: string; // Attribute value
}

// ═══════════════════════════════════════════════════════════
// VARIANT DTO
// ═══════════════════════════════════════════════════════════

export interface ProductVariantDTO {
  variantSku: string; // Max 50 chars, unique
  variantName: string; // 2-100 chars
  attributes: Record<string, any>; // e.g., { "color": "Red", "size": "XL" }
  mrp?: number; // Variant-specific MRP
  sellingPrice?: number; // Variant-specific selling price
  weight?: number;
  dimensions?: DimensionsDTO;
  isActive?: boolean; // Default: true

  // Variant Inventory (optional)
  inventory?: InventoryDTO;
}

// ═══════════════════════════════════════════════════════════
// DIMENSIONS DTO
// ═══════════════════════════════════════════════════════════

export interface DimensionsDTO {
  length?: number;
  width?: number;
  height?: number;
  unit?: string; // e.g., "cm", "in"
}

// ═══════════════════════════════════════════════════════════
// MAIN DTO: CREATE PRODUCT COMPLETE
// ═══════════════════════════════════════════════════════════

export interface CreateProductCompleteDTO {
  // ═══════════════════════════════════════════════════════════
  // REQUIRED FIELDS
  // ═══════════════════════════════════════════════════════════

  name: string; // 2-100 chars, product display name
  sku: string; // Max 50 chars, unique stock keeping unit
  slug: string; // URL-friendly identifier (unique)
  description: string; // Min 5 chars, full product description
  mrp: number; // ≥0, Maximum Retail Price
  sellingPrice: number; // ≥0, actual selling price
  categoryId: string; // CUID of primary category (required)
  brandId: string; // CUID of brand (required)

  // ═══════════════════════════════════════════════════════════
  // OPTIONAL FIELDS
  // ═══════════════════════════════════════════════════════════

  // Basic Info
  shortDescription?: string; // Max 255 chars
  barcode?: string; // Max 50 chars (unique if provided)

  // Pricing & Tax
  costPrice?: number; // ≥0, internal cost
  taxRate?: number; // 0-100, tax percentage
  hsnCode?: string; // Max 20 chars, HSN code

  // Relations (optional)
  vendorId?: string; // CUID of vendor

  // Status
  status?: ProductStatus; // Default: DRAFT
  stockStatus?: StockStatus; // Default: OUT_OF_STOCK

  // Physical Attributes
  weight?: number; // ≥0, product weight
  dimensions?: DimensionsDTO;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  // Flags
  isFeatured?: boolean; // Default: false
  isNewArrival?: boolean; // Default: false
  isBestSeller?: boolean; // Default: false
  isReturnable?: boolean; // Default: true
  returnPeriodDays?: number; // ≥0, Default: 7

  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  publishedAt?: string | Date; // ISO date string or Date object

  // ═══════════════════════════════════════════════════════════
  // NESTED OBJECTS (Optional)
  // ═══════════════════════════════════════════════════════════

  // Product Images
  images?: ProductImageDTO[];

  // Product Attributes
  attributes?: ProductAttributeDTO[];

  // Product Variants (with optional nested inventory)
  variants?: ProductVariantDTO[];

  // Base Product Inventory (if no variants)
  inventory?: InventoryDTO;
}

// ═══════════════════════════════════════════════════════════
// RESPONSE TYPE
// ═══════════════════════════════════════════════════════════

export interface CreateProductCompleteResponse {
  id: string;
  sku: string;
  name: string;
  slug: string;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  variants: Array<{
    id: string;
    variantSku: string;
    variantName: string;
  }>;
  attributes: Array<{
    id: string;
    attributeTypeId: string;
    value: string;
  }>;
  inventory: Array<{
    id: string;
    warehouseId: string;
    availableQuantity: number;
  }>;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
}
