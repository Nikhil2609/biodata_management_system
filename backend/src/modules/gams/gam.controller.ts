import { Request, Response, NextFunction } from 'express';
import { gamService } from './gam.service';

export class GamController {
  async getTalukas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const talukas = await gamService.getAllTalukas();
      res.status(200).json({
        success: true,
        data: talukas,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const talukaId = req.query.talukaId ? Number(req.query.talukaId) : undefined;
      const search = req.query.search ? String(req.query.search) : undefined;

      const gams = await gamService.getGams(talukaId, search);
      res.status(200).json({
        success: true,
        count: gams.length,
        data: gams,
      });
    } catch (error) {
      next(error);
    }
  }

  async createGam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { talukaId, nameGu, nameEn, orderNo } = req.body;
      if (!talukaId || !nameGu || !nameEn) {
        res.status(400).json({ success: false, message: 'talukaId, nameGu, and nameEn are required.' });
        return;
      }
      const newGam = await gamService.createGam({ talukaId: Number(talukaId), nameGu, nameEn, orderNo });
      res.status(201).json({
        success: true,
        message: 'Gam created successfully',
        data: newGam,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const gamController = new GamController();
