import { Op } from 'sequelize';
import { Taluka } from '../../models/Taluka';
import { Gam } from '../../models/Gam';

export class GamService {
  async getAllTalukas() {
    return await Taluka.findAll({
      order: [['orderNo', 'ASC'], ['id', 'ASC']],
      include: [
        {
          model: Gam,
          as: 'gams',
          attributes: ['id', 'nameGu', 'nameEn', 'orderNo'],
        },
      ],
    });
  }

  async getGams(talukaId?: number, search?: string) {
    const whereClause: any = {};

    if (talukaId) {
      whereClause.talukaId = talukaId;
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { nameGu: { [Op.iLike]: q } },
        { nameEn: { [Op.iLike]: q } },
      ];
    }

    return await Gam.findAll({
      where: whereClause,
      include: [
        {
          model: Taluka,
          as: 'taluka',
          attributes: ['id', 'nameGu', 'nameEn', 'district', 'districtGu'],
        },
      ],
      order: [
        ['talukaId', 'ASC'],
        ['orderNo', 'ASC'],
        ['nameGu', 'ASC'],
      ],
    });
  }

  async getGamById(id: number) {
    return await Gam.findByPk(id, {
      include: [{ model: Taluka, as: 'taluka' }],
    });
  }

  async createTaluka(data: { nameGu: string; nameEn: string; district?: string; districtGu?: string; state?: string; stateGu?: string }) {
    return await Taluka.create({
      nameGu: data.nameGu,
      nameEn: data.nameEn,
      district: data.district || 'Banaskantha',
      districtGu: data.districtGu || 'બનાસકાંઠા',
      state: data.state || 'Gujarat',
      stateGu: data.stateGu || 'ગુજરાત',
    });
  }

  async createGam(data: { talukaId: number; nameGu: string; nameEn: string; orderNo?: number }) {
    const taluka = await Taluka.findByPk(data.talukaId);
    if (!taluka) {
      throw { statusCode: 404, message: 'Taluka not found', isOperational: true };
    }
    return await Gam.create(data);
  }
}

export const gamService = new GamService();
