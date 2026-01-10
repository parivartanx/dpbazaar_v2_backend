import { Prisma, Category } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to build path from parent path and slug
function buildPath(parentPath: string | null, slug: string): string {
  if (!parentPath) {
    return `/${slug}`;
  }
  return `${parentPath}/${slug}`;
}

// Helper function to calculate level from path
function calculateLevel(path: string): number {
  return path.split('/').filter(Boolean).length - 1;
}

export class CategoryRepository implements ICategoryRepository {
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    // Extract parentId from data (it might be in parent.connect or as direct field)
    const inputData = data as any;
    const parentId = inputData.parentId || (inputData.parent?.connect?.id);
    
    // Generate slug from name if not provided
    const slug = (data.slug as string) || generateSlug(data.name as string);
    
    // Get parent category if parentId is provided
    let parent: Category | null = null;
    let parentPath: string | null = null;
    let calculatedLevel = 0;
    
    if (parentId) {
      parent = await prisma.category.findUnique({
        where: { id: parentId },
      });
      
      if (!parent) {
        throw new Error(`Parent category with ID "${parentId}" not found`);
      }
      
      parentPath = parent.path;
      calculatedLevel = calculateLevel(parentPath) + 1;
    }
    
    // Calculate path from parent path and slug
    const calculatedPath = buildPath(parentPath, slug);
    
    // Build category data with proper parent relation
    const categoryData: any = {
      ...data,
      slug,
      path: (data.path as string) || calculatedPath,
      level: (data.level as number) ?? calculatedLevel,
    };
    
    // Handle parent relation properly
    if (parentId) {
      categoryData.parent = { connect: { id: parentId } };
      delete categoryData.parentId; // Remove if it exists as direct field
    } else {
      categoryData.parent = undefined;
    }
    
    return prisma.category.create({
      data: categoryData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: [
        { level: 'asc' },
        { displayOrder: 'asc' },
      ],
    });
  }

  async filterCategories(params: {
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    parentId?: string;
    level?: number;
    page?: number;
    limit?: number;
    flat?: boolean;
  }): Promise<Category[]> {
    const {
      search,
      isActive,
      isFeatured,
      parentId,
      level,
      page = 1,
      limit = 20,
      flat = false,
    } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (parentId !== undefined) {
      where.parentId = parentId || null;
    }

    if (level !== undefined) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { path: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const includeConfig: any = {
      parent: {
        select: {
          id: true,
          name: true,
          slug: true,
          level: true,
          path: true,
        },
      },
    };

    // If flat list, don't include nested children (just direct children count)
    if (!flat) {
      includeConfig.children = {
        where: { isActive: true },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy: { displayOrder: 'asc' },
      };
    }

    return prisma.category.findMany({
      where,
      include: includeConfig,
      orderBy: [
        { level: 'asc' },
        { displayOrder: 'asc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countFilteredCategories(params: {
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    parentId?: string;
    level?: number;
  }): Promise<number> {
    const { search, isActive, isFeatured, parentId, level } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (parentId !== undefined) {
      where.parentId = parentId || null;
    }

    if (level !== undefined) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { path: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.category.count({ where });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category> {
    // Get current category
    const currentCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!currentCategory) {
      throw new Error(`Category with ID "${id}" not found`);
    }
    
    // Extract parentId from update data
    const updateData = data as any;
    const newParentId = updateData.parentId !== undefined 
      ? (updateData.parentId || (updateData.parent?.connect?.id) || (updateData.parent?.set === null ? null : undefined))
      : undefined;
    
    // Handle parentId change - recalculate level and path
    if (newParentId !== undefined) {
      // Validate parent exists if parentId is provided
      if (newParentId) {
        const parent = await prisma.category.findUnique({
          where: { id: newParentId },
        });
        
        if (!parent) {
          throw new Error(`Parent category with ID "${newParentId}" not found`);
        }
        
        // Prevent setting parent to itself
        if (newParentId === id) {
          throw new Error('Category cannot be its own parent');
        }
        
        // Prevent circular reference (check if new parent is a descendant)
        const isDescendant = await this.isDescendant(newParentId, id);
        if (isDescendant) {
          throw new Error('Cannot set parent: would create circular reference');
        }
        
        // Calculate new level and path
        const newLevel = calculateLevel(parent.path) + 1;
        const newPath = buildPath(parent.path, currentCategory.slug);
        
        updateData.level = newLevel;
        updateData.path = newPath;
        
        // Set parent relation
        updateData.parent = { connect: { id: newParentId } };
        delete updateData.parentId;
        
        // Update all children's paths and levels
        await this.updateChildrenPaths(id, newPath, newLevel);
      } else {
        // Setting to root (no parent)
        const newPath = `/${currentCategory.slug}`;
        updateData.level = 0;
        updateData.path = newPath;
        updateData.parent = { disconnect: true };
        delete updateData.parentId;
        
        // Update all children's paths and levels
        await this.updateChildrenPaths(id, newPath, 0);
      }
    }
    
    // If slug is being updated, recalculate path
    if (updateData.slug && updateData.slug !== currentCategory.slug) {
      const parentPath = currentCategory.parentId
        ? (await prisma.category.findUnique({ where: { id: currentCategory.parentId } }))?.path || null
        : null;
      const newPath = buildPath(parentPath, updateData.slug as string);
      updateData.path = newPath;
      
      // Update all children's paths
      await this.updateChildrenPaths(id, newPath, currentCategory.level);
    }
    
    return prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  // Helper method to check if a category is a descendant of another
  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    let currentId: string | null = descendantId;
    const visited = new Set<string>();
    
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const category: { parentId: string | null } | null = await prisma.category.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });
      
      if (!category || !category.parentId) {
        return false;
      }
      
      if (category.parentId === ancestorId) {
        return true;
      }
      
      currentId = category.parentId;
    }
    
    return false;
  }

  // Helper method to recursively update children paths and levels
  private async updateChildrenPaths(parentId: string, parentPath: string, parentLevel: number): Promise<void> {
    const children = await prisma.category.findMany({
      where: { parentId },
    });
    
    for (const child of children) {
      const newPath = buildPath(parentPath, child.slug);
      const newLevel = parentLevel + 1;
      
      await prisma.category.update({
        where: { id: child.id },
        data: {
          path: newPath,
          level: newLevel,
        },
      });
      
      // Recursively update grandchildren
      await this.updateChildrenPaths(child.id, newPath, newLevel);
    }
  }

  async delete(id: string): Promise<void> {
    // Check if category has children
    const childrenCount = await prisma.category.count({
      where: { parentId: id },
    });
    
    if (childrenCount > 0) {
      throw new Error(`Cannot delete category: it has ${childrenCount} child categor${childrenCount > 1 ? 'ies' : 'y'}. Please delete or reassign children first.`);
    }
    
    // Check if category has products
    const productsCount = await prisma.productCategory.count({
      where: { categoryId: id },
    });
    
    if (productsCount > 0) {
      throw new Error(`Cannot delete category: it has ${productsCount} product${productsCount > 1 ? 's' : ''} associated. Please remove products first.`);
    }
    
    await prisma.category.delete({ where: { id } });
  }

  async toggleFeature(id: string, isFeatured: boolean): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isFeatured },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            path: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }
}
