import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { DeliveryAgentRepository } from '../repositories/prisma/DeliveryAgentRepository';
import { DeliveryRepository } from '../repositories/prisma/DeliveryRepository';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

const deliveryAgentRepository = new DeliveryAgentRepository();
const deliveryRepository = new DeliveryRepository();

export class DeliveryAgentController {
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });
  
  getAllDeliveryAgents = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = { ...req.query };
      if (filters.page) filters.page = Number(filters.page);
      if (filters.limit) filters.limit = Number(filters.limit);

      const agents = await deliveryAgentRepository.getAll(filters);
      
      // Transform image keys to public URLs in the agents response
      const transformedAgents = await this.imageUrlTransformer.transformCommonImageFields(agents);
      
      const response: ApiResponse = {
        success: true,
        data: { agents: transformedAgents },
        message: 'Delivery agents retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllDeliveryAgents: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching delivery agents', error: (error as Error).message });
    }
  };

  getDeliveryAgentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      const agent = await deliveryAgentRepository.getById(id);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent not found' });
        return;
      }

      // Transform image keys to public URLs in the agent response
      const transformedAgent = await this.imageUrlTransformer.transformCommonImageFields(agent);
      
      const response: ApiResponse = {
        success: true,
        data: { agent: transformedAgent },
        message: 'Delivery agent retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDeliveryAgentById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching delivery agent', error: (error as Error).message });
    }
  };

  createDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for duplicate agent code explicitly if needed, but DB will catch it.
      // Let's rely on DB constraint for atomicity.
      
      const agent = await deliveryAgentRepository.create(req.body);
      
      // Transform image keys to public URLs in the agent response
      const transformedAgent = await this.imageUrlTransformer.transformCommonImageFields(agent);
      
      const response: ApiResponse = {
        success: true,
        data: { agent: transformedAgent },
        message: 'Delivery agent created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error: any) {
      logger.error(`Error in createDeliveryAgent: ${error}`);
      if (error.code === 'P2002') {
         const target = error.meta?.target;
         res.status(400).json({ success: false, message: `Unique constraint violation on field(s): ${target}` });
         return;
      }
      res.status(500).json({ success: false, message: 'Problem in creating delivery agent', error: error.message });
    }
  };

  updateDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      const agent = await deliveryAgentRepository.update(id, req.body);
      
      // Transform image keys to public URLs in the agent response
      const transformedAgent = await this.imageUrlTransformer.transformCommonImageFields(agent);
      
      const response: ApiResponse = {
        success: true,
        data: { agent: transformedAgent },
        message: 'Delivery agent updated successfully',
        timestamp: new Date().toISOString(),
        
      };
      res.status(200).json(response);
    } catch (error: any) {
      logger.error(`Error in updateDeliveryAgent: ${error}`);
      if (error.code === 'P2002') {
         const target = error.meta?.target;
         res.status(400).json({ success: false, message: `Unique constraint violation on field(s): ${target}` });
         return;
      }
      res.status(500).json({ success: false, message: 'Problem in updating delivery agent', error: error.message });
    }
  };

  deleteDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      await deliveryAgentRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Delivery agent deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteDeliveryAgent: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting delivery agent', error: (error as Error).message });
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
         res.status(401).json({ success: false, message: 'Unauthorized' });
         return;
      }

      const agent = await deliveryAgentRepository.findByEmail(email);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent profile not found' });
        return;
      }

      // Transform image keys to public URLs in the agent response
      const transformedAgent = await this.imageUrlTransformer.transformCommonImageFields(agent);
      
      const response: ApiResponse = {
        success: true,
        data: { agent: transformedAgent },
        message: 'Profile retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getMe: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching profile', error: (error as Error).message });
    }
  };

  toggleAvailability = async (req: Request, res: Response): Promise<void> => {
     try {
      const email = (req as any).user?.email;
      if (!email) {
         res.status(401).json({ success: false, message: 'Unauthorized' });
         return;
      }

      const agent = await deliveryAgentRepository.findByEmail(email);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent profile not found' });
        return;
      }

      const { isAvailable } = req.body;
      if (typeof isAvailable !== 'boolean') {
         res.status(400).json({ success: false, message: 'isAvailable must be a boolean' });
         return;
      }

      const updatedAgent = await deliveryAgentRepository.update(agent.id, { isAvailable });
      
      // Transform image keys to public URLs in the agent response
      const transformedAgent = await this.imageUrlTransformer.transformCommonImageFields(updatedAgent);
      
      const response: ApiResponse = {
        success: true,
        data: { agent: transformedAgent },
        message: 'Availability updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);

     } catch (error) {
      logger.error(`Error in toggleAvailability: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating availability', error: (error as Error).message });
    }
  };

  getMyDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
         res.status(401).json({ success: false, message: 'Unauthorized' });
         return;
      }

      const agent = await deliveryAgentRepository.findByEmail(email);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent profile not found' });
        return;
      }

      const filters = { ...req.query, agentId: agent.id };
      const deliveries = await deliveryRepository.getAll(filters);

      const response: ApiResponse = {
        success: true,
        data: { deliveries },
        message: 'Assigned deliveries retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getMyDeliveries: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching deliveries', error: (error as Error).message });
    }
  };

  updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = (req as any).user?.email;
      if (!email) {
         res.status(401).json({ success: false, message: 'Unauthorized' });
         return;
      }

      const agent = await deliveryAgentRepository.findByEmail(email);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent profile not found' });
        return;
      }

      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ success: false, message: 'Delivery ID is required' });
        return;
      }
      const { status, deliveryProof, deliveryOtp } = req.body;

      // Verify delivery is assigned to this agent
      const delivery = await deliveryRepository.getById(idParam);
      if (!delivery) {
        res.status(404).json({ success: false, message: 'Delivery not found' });
        return;
      }

      if (delivery.deliveryAgentId !== agent.id) {
        res.status(403).json({ success: false, message: 'This delivery is not assigned to you' });
        return;
      }

      // Update delivery
      const updateData: any = {};
      if (status) updateData.status = status;
      if (deliveryProof) updateData.deliveryProof = deliveryProof;
      if (deliveryOtp) updateData.deliveryOtp = deliveryOtp;

      const updatedDelivery = await deliveryRepository.update(idParam, updateData);

      const response: ApiResponse = {
        success: true,
        data: { delivery: updatedDelivery },
        message: 'Delivery status updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);

    } catch (error) {
      logger.error(`Error in updateDeliveryStatus: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating delivery status', error: (error as Error).message });
    }
  };
}
