import { BrandRepository } from '../repositories/prisma/BrandRepository';
import { Request, Response } from 'express';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

export class BrandController {
  private brandRepo: BrandRepository;
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  constructor() {
    this.brandRepo = new BrandRepository();
  }

  createBrand = async (req: Request, res: Response) => {
    try {
      const brand = await this.brandRepo.create(req.body);
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = this.imageUrlTransformer.transformCommonImageFields(brand);
      
      return res.status(201).json({
        success: true,
        message: 'Brand created successfully',
        data: { brand: transformedBrand },
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
      
      // Transform image keys to public URLs in the brands response
      const transformedBrands = this.imageUrlTransformer.transformCommonImageFields(brands);
      
      return res.status(200).json({
        success: true,
        message: 'Brands fetched successfully',
        data: { brands: transformedBrands },
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
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = this.imageUrlTransformer.transformCommonImageFields(brand);
      
      return res.status(200).json({
        success: true,
        message: 'Brand fetched successfully',
        data: { brand: transformedBrand },
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
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = this.imageUrlTransformer.transformCommonImageFields(updated);
      
      return res.status(200).json({
        success: true,
        message: 'Brand updated successfully',
        data: { updated: transformedBrand },
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
