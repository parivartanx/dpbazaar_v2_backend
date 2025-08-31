import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/prisma/CategoryRepository';

export class CategoryController {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryRepo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryRepo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: { categories },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      const category = await this.categoryRepo.findById(id);
      if (!category)
        return res.status(404).json({ message: 'Category not found' });

      return res.status(200).json({
        success: true,
        message: 'Category fetched successfully',
        data: { category },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      const updated = await this.categoryRepo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { updated },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      await this.categoryRepo.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  toggleFeature = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;

      if (!id) return res.status(400).json({ error: 'Id is required' });
      if (typeof isFeatured !== 'boolean') {
        return res.status(400).json({ error: 'isFeatured must be boolean' });
      }

      const category = await this.categoryRepo.toggleFeature(id, isFeatured);
      return res.status(200).json({
        success: true,
        message: 'Category feature flag updated',
        data: { category },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  toggleActive = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (!id) return res.status(400).json({ error: 'Id is required' });
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: 'isActive must be boolean' });
      }

      const category = await this.categoryRepo.toggleActive(id, isActive);
      return res.status(200).json({
        success: true,
        message: 'Category active status updated',
        data: { category },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };
}
