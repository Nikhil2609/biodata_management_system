import { Request, Response, NextFunction } from 'express';
import { biodataService } from './biodata.service';
import { biodataSchema } from './biodata.validation';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class BiodataController {
  // Public List
  async getPublicList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        gender: req.query.gender as any,
        talukaId: req.query.talukaId ? Number(req.query.talukaId) : undefined,
        gamId: req.query.gamId ? Number(req.query.gamId) : undefined,
        search: req.query.search as string,
        minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
        maxAge: req.query.maxAge ? Number(req.query.maxAge) : undefined,
        maritalStatus: req.query.maritalStatus as string,
        occupationType: req.query.occupationType as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 12,
        sort: req.query.sort as string,
      };

      const result = await biodataService.getPublicBiodata(filters);
      res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Public Detail
  async getPublicDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid biodata ID.' });
        return;
      }

      const result = await biodataService.getPublicBiodataById(id);
      res.status(200).json({
        success: true,
        data: result.biodata,
        related: result.related,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin List
  async getAdminList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        status: req.query.status as any,
        gender: req.query.gender as any,
        talukaId: req.query.talukaId ? Number(req.query.talukaId) : undefined,
        gamId: req.query.gamId ? Number(req.query.gamId) : undefined,
        search: req.query.search as string,
        minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
        maxAge: req.query.maxAge ? Number(req.query.maxAge) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 15,
      };

      const result = await biodataService.getAdminBiodata(filters);
      res.status(200).json({
        success: true,
        data: result.records,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Detail
  async getAdminDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid biodata ID.' });
        return;
      }

      const biodata = await biodataService.getAdminBiodataById(id);
      res.status(200).json({
        success: true,
        data: biodata,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Create
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await biodataSchema.validate(req.body, { abortEarly: false });
      const biodata = await biodataService.createBiodata(validated, req.user?.id);

      res.status(201).json({
        success: true,
        message: 'Biodata created successfully.',
        data: biodata,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Update
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ success: false, message: 'Invalid biodata ID.' });
        return;
      }

      const validated = await biodataSchema.validate(req.body, { abortEarly: false });
      const updated = await biodataService.updateBiodata(id, validated);

      res.status(200).json({
        success: true,
        message: 'Biodata updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Toggle Status
  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const updated = await biodataService.toggleStatus(id, status);

      res.status(200).json({
        success: true,
        message: `Biodata status changed to ${updated.status}.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Delete
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await biodataService.deleteBiodata(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Upload Photos
  async uploadPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'Please select at least one photo to upload.' });
        return;
      }

      const photos = await biodataService.addPhotos(id, files);
      res.status(201).json({
        success: true,
        message: 'Photos uploaded successfully.',
        data: photos,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Set Primary Photo
  async setPrimaryPhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const photoId = Number(req.params.photoId);

      const photo = await biodataService.setPrimaryPhoto(id, photoId);
      res.status(200).json({
        success: true,
        message: 'Primary photo updated.',
        data: photo,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin Delete Photo
  async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const photoId = Number(req.params.photoId);

      const result = await biodataService.deletePhoto(id, photoId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const biodataController = new BiodataController();
