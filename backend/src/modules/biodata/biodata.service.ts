import { Op } from 'sequelize';
import { Biodata, GenderType, BiodataStatusType } from '../../models/Biodata';
import { BiodataPhoto } from '../../models/BiodataPhoto';
import { Taluka } from '../../models/Taluka';
import { Gam } from '../../models/Gam';
import { calculateAge } from '../../utils/ageCalculator';
import { storageService } from '../../utils/fileStorage';

export interface BiodataFilterParams {
  gender?: GenderType;
  talukaId?: number;
  gamId?: number;
  search?: string;
  minAge?: number;
  maxAge?: number;
  maritalStatus?: string;
  occupationType?: string;
  page?: number;
  limit?: number;
  sort?: string;
  status?: BiodataStatusType; // Admin only
}

export class BiodataService {
  /**
   * Helper to add calculated age to a biodata object or plain JSON
   */
  private enrichWithAge(biodataInstance: any) {
    const plain = typeof biodataInstance.toJSON === 'function' ? biodataInstance.toJSON() : biodataInstance;
    const age = calculateAge(plain.birthDate);
    return {
      ...plain,
      age,
    };
  }

  /**
   * Build date range for minAge and maxAge filters
   */
  private getDobRange(minAge?: number, maxAge?: number) {
    const now = new Date();
    const dobCondition: any = {};

    if (minAge !== undefined && !isNaN(minAge)) {
      // If someone is at least minAge (e.g. 25), they were born on or before today - 25 years
      const maxDob = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
      dobCondition[Op.lte] = maxDob.toISOString().split('T')[0];
    }

    if (maxAge !== undefined && !isNaN(maxAge)) {
      // If someone is at most maxAge (e.g. 30), they were born after today - (maxAge + 1) years
      const minDob = new Date(now.getFullYear() - (maxAge + 1), now.getMonth(), now.getDate());
      dobCondition[Op.gte] = minDob.toISOString().split('T')[0];
    }

    return dobCondition;
  }

  /**
   * Public Biodata List - Enabled records only
   */
  async getPublicBiodata(params: BiodataFilterParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 12));
    const offset = (page - 1) * limit;

    const where: any = {
      status: 'enabled',
    };

    if (params.gender) {
      where.gender = params.gender;
    }

    if (params.talukaId) {
      where.talukaId = Number(params.talukaId);
    }

    if (params.gamId) {
      where.gamId = Number(params.gamId);
    }

    if (params.maritalStatus) {
      where.maritalStatus = params.maritalStatus;
    }

    if (params.occupationType) {
      where.occupationType = params.occupationType;
    }

    if (params.minAge || params.maxAge) {
      const dobRange = this.getDobRange(params.minAge, params.maxAge);
      if (Object.keys(dobRange).length > 0) {
        where.birthDate = dobRange;
      }
    }

    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      where[Op.or] = [
        { fullName: { [Op.iLike]: q } },
        { fullNameGu: { [Op.iLike]: q } },
        { education: { [Op.iLike]: q } },
        { occupationTitle: { [Op.iLike]: q } },
        { currentCity: { [Op.iLike]: q } },
      ];
    }

    // Sorting
    let order: any[] = [['isFeatured', 'DESC'], ['createdAt', 'DESC']];
    if (params.sort === 'oldest') {
      order = [['createdAt', 'ASC']];
    } else if (params.sort === 'age_asc') {
      // Younger first = later birthDate
      order = [['birthDate', 'DESC']];
    } else if (params.sort === 'age_desc') {
      // Older first = earlier birthDate
      order = [['birthDate', 'ASC']];
    }

    const { rows, count } = await Biodata.findAndCountAll({
      where,
      limit,
      offset,
      order,
      attributes: {
        exclude: ['notes', 'createdById', 'deletedAt'],
      },
      include: [
        {
          model: Taluka,
          as: 'taluka',
          attributes: ['id', 'nameGu', 'nameEn', 'district', 'districtGu'],
        },
        {
          model: Gam,
          as: 'gam',
          attributes: ['id', 'nameGu', 'nameEn'],
        },
        {
          model: BiodataPhoto,
          as: 'photos',
          attributes: ['id', 'photoUrl', 'isPrimary', 'orderNo'],
        },
      ],
      distinct: true,
    });

    const enrichedRows = rows.map((r) => this.enrichWithAge(r));

    return {
      records: enrichedRows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Public Single Biodata Detail
   */
  async getPublicBiodataById(id: number) {
    const biodata = await Biodata.findOne({
      where: { id, status: 'enabled' },
      attributes: {
        exclude: ['notes', 'createdById', 'deletedAt'],
      },
      include: [
        {
          model: Taluka,
          as: 'taluka',
          attributes: ['id', 'nameGu', 'nameEn', 'district', 'districtGu', 'state'],
        },
        {
          model: Gam,
          as: 'gam',
          attributes: ['id', 'nameGu', 'nameEn'],
        },
        {
          model: BiodataPhoto,
          as: 'photos',
          attributes: ['id', 'photoUrl', 'isPrimary', 'orderNo'],
        },
      ],
      order: [[{ model: BiodataPhoto, as: 'photos' }, 'isPrimary', 'DESC'], [{ model: BiodataPhoto, as: 'photos' }, 'orderNo', 'ASC']],
    });

    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found or is currently inactive.', isOperational: true };
    }

    // Related profiles recommendation (same gender or opposite, similar age)
    const related = await Biodata.findAll({
      where: {
        id: { [Op.ne]: id },
        gender: biodata.gender,
        status: 'enabled',
      },
      limit: 4,
      attributes: ['id', 'registrationNo', 'fullName', 'fullNameGu', 'gender', 'birthDate', 'education', 'occupationTitle'],
      include: [
        { model: Taluka, as: 'taluka', attributes: ['nameGu', 'nameEn'] },
        { model: Gam, as: 'gam', attributes: ['nameGu', 'nameEn'] },
        { model: BiodataPhoto, as: 'photos', attributes: ['photoUrl', 'isPrimary'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      biodata: this.enrichWithAge(biodata),
      related: related.map((r) => this.enrichWithAge(r)),
    };
  }

  /**
   * Admin Biodata List - Returns enabled and disabled, with full filters
   */
  async getAdminBiodata(params: BiodataFilterParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 15));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.gender) {
      where.gender = params.gender;
    }

    if (params.talukaId) {
      where.talukaId = Number(params.talukaId);
    }

    if (params.gamId) {
      where.gamId = Number(params.gamId);
    }

    if (params.minAge || params.maxAge) {
      const dobRange = this.getDobRange(params.minAge, params.maxAge);
      if (Object.keys(dobRange).length > 0) {
        where.birthDate = dobRange;
      }
    }

    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim()}%`;
      where[Op.or] = [
        { registrationNo: { [Op.iLike]: q } },
        { fullName: { [Op.iLike]: q } },
        { fullNameGu: { [Op.iLike]: q } },
        { contactPerson: { [Op.iLike]: q } },
        { contactNumber: { [Op.iLike]: q } },
      ];
    }

    const { rows, count } = await Biodata.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Taluka,
          as: 'taluka',
          attributes: ['id', 'nameGu', 'nameEn'],
        },
        {
          model: Gam,
          as: 'gam',
          attributes: ['id', 'nameGu', 'nameEn'],
        },
        {
          model: BiodataPhoto,
          as: 'photos',
          attributes: ['id', 'photoUrl', 'isPrimary'],
        },
      ],
      distinct: true,
    });

    return {
      records: rows.map((r) => this.enrichWithAge(r)),
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Admin Biodata By ID
   */
  async getAdminBiodataById(id: number) {
    const biodata = await Biodata.findByPk(id, {
      include: [
        { model: Taluka, as: 'taluka' },
        { model: Gam, as: 'gam' },
        { model: BiodataPhoto, as: 'photos' },
      ],
      order: [[{ model: BiodataPhoto, as: 'photos' }, 'isPrimary', 'DESC'], [{ model: BiodataPhoto, as: 'photos' }, 'orderNo', 'ASC']],
    });

    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found', isOperational: true };
    }

    return this.enrichWithAge(biodata);
  }

  /**
   * Create Biodata
   */
  async createBiodata(data: any, adminId?: number) {
    // Generate Registration Number
    const count = await Biodata.count({ paranoid: false });
    const prefix = data.gender === 'girl' ? 'G' : 'B';
    const regNo = `BD-${new Date().getFullYear()}-${prefix}${String(count + 1).padStart(3, '0')}`;

    const newBiodata = await Biodata.create({
      ...data,
      registrationNo: regNo,
      createdById: adminId || null,
    });

    return await this.getAdminBiodataById(newBiodata.id);
  }

  /**
   * Update Biodata
   */
  async updateBiodata(id: number, data: any) {
    const biodata = await Biodata.findByPk(id);
    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found', isOperational: true };
    }

    // Do not allow registrationNo to be overwritten maliciously
    delete data.registrationNo;
    delete data.id;

    await biodata.update(data);
    return await this.getAdminBiodataById(id);
  }

  /**
   * Toggle Enable / Disable status
   */
  async toggleStatus(id: number, status?: BiodataStatusType) {
    const biodata = await Biodata.findByPk(id);
    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found', isOperational: true };
    }

    const nextStatus = status || (biodata.status === 'enabled' ? 'disabled' : 'enabled');
    biodata.status = nextStatus;
    await biodata.save();

    return biodata;
  }

  /**
   * Soft Delete Biodata
   */
  async deleteBiodata(id: number) {
    const biodata = await Biodata.findByPk(id);
    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found', isOperational: true };
    }

    await biodata.destroy(); // Soft delete via paranoid mode
    return { success: true, message: 'Biodata deleted successfully.' };
  }

  /**
   * Photo Management: Add photos
   */
  async addPhotos(biodataId: number, files: Express.Multer.File[]) {
    const biodata = await Biodata.findByPk(biodataId);
    if (!biodata) {
      throw { statusCode: 404, message: 'Biodata record not found', isOperational: true };
    }

    const currentPhotos = await BiodataPhoto.findAll({ where: { biodataId } });
    const hasPrimary = currentPhotos.some((p) => p.isPrimary);

    const savedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photoUrl = await storageService.saveFile(file);
      const isPrimary = !hasPrimary && i === 0;

      const photoRecord = await BiodataPhoto.create({
        biodataId,
        photoUrl,
        isPrimary,
        orderNo: currentPhotos.length + i,
      });
      savedPhotos.push(photoRecord);
    }

    return savedPhotos;
  }

  /**
   * Photo Management: Set Primary Photo
   */
  async setPrimaryPhoto(biodataId: number, photoId: number) {
    const photo = await BiodataPhoto.findOne({ where: { id: photoId, biodataId } });
    if (!photo) {
      throw { statusCode: 404, message: 'Photo not found for this biodata', isOperational: true };
    }

    // Set all other photos to false
    await BiodataPhoto.update({ isPrimary: false }, { where: { biodataId } });

    photo.isPrimary = true;
    await photo.save();

    return photo;
  }

  /**
   * Photo Management: Delete Photo
   */
  async deletePhoto(biodataId: number, photoId: number) {
    const photo = await BiodataPhoto.findOne({ where: { id: photoId, biodataId } });
    if (!photo) {
      throw { statusCode: 404, message: 'Photo not found', isOperational: true };
    }

    await storageService.deleteFile(photo.photoUrl);
    const wasPrimary = photo.isPrimary;
    await photo.destroy();

    // If deleted photo was primary, make the first remaining photo primary
    if (wasPrimary) {
      const nextPhoto = await BiodataPhoto.findOne({ where: { biodataId }, order: [['orderNo', 'ASC']] });
      if (nextPhoto) {
        nextPhoto.isPrimary = true;
        await nextPhoto.save();
      }
    }

    return { success: true, message: 'Photo deleted successfully' };
  }
}

export const biodataService = new BiodataService();
