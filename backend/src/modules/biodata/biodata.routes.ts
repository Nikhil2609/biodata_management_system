import { Router } from 'express';
import { biodataController } from './biodata.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';
import { uploadPhotos } from '../../middlewares/upload.middleware';

const router = Router();

// ==========================================
// Public Routes
// ==========================================
router.get('/biodata', (req, res, next) => biodataController.getPublicList(req, res, next));
router.get('/biodata/:id', (req, res, next) => biodataController.getPublicDetail(req, res, next));

// ==========================================
// Protected Admin Routes
// ==========================================
router.get('/admin/biodata', authenticateAdmin, (req, res, next) => biodataController.getAdminList(req, res, next));
router.post('/admin/biodata', authenticateAdmin, (req, res, next) => biodataController.create(req, res, next));
router.get('/admin/biodata/:id', authenticateAdmin, (req, res, next) => biodataController.getAdminDetail(req, res, next));
router.put('/admin/biodata/:id', authenticateAdmin, (req, res, next) => biodataController.update(req, res, next));
router.patch('/admin/biodata/:id/status', authenticateAdmin, (req, res, next) => biodataController.toggleStatus(req, res, next));
router.delete('/admin/biodata/:id', authenticateAdmin, (req, res, next) => biodataController.delete(req, res, next));

// Admin Photo Management
router.post(
  '/admin/biodata/:id/photos',
  authenticateAdmin,
  uploadPhotos.array('photos', 5),
  (req, res, next) => biodataController.uploadPhotos(req, res, next)
);
router.patch(
  '/admin/biodata/:id/photos/:photoId/primary',
  authenticateAdmin,
  (req, res, next) => biodataController.setPrimaryPhoto(req, res, next)
);
router.delete(
  '/admin/biodata/:id/photos/:photoId',
  authenticateAdmin,
  (req, res, next) => biodataController.deletePhoto(req, res, next)
);

export default router;
