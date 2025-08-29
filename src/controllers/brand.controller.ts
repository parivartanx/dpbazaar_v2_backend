import { BrandRepository } from '../repositories/prisma/BrandRepository';
import { Request, Response } from 'express';

export class BrandController {
  private brandRepo: BrandRepository;

  constructor() {
    this.brandRepo = new BrandRepository();
  }

  createBrand = async (req: Request, res: Response) => {
    try {
      const brand = await this.brandRepo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Brand created successfully',
        data: { brand },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getAllBrands = async (_: Request, res: Response) => {
    try {
      const brands = await this.brandRepo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Brands fetched successfully',
        data: { brands },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      const brand = await this.brandRepo.findById(id);
      if (!brand) return res.status(404).json({ message: 'Brand not found' });
      return res.status(200).json({
        success: true,
        message: 'Brand fetched successfully',
        data: { brand },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      const updated = await this.brandRepo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Brand updated successfully',
        data: { updated },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  deleteBrand = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });

      await this.brandRepo.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unknown error' });
    }
  };
}
