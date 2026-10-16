import { Biodata } from '../../models/Biodata';
import { BiodataPhoto } from '../../models/BiodataPhoto';
import { Taluka } from '../../models/Taluka';
import { Gam } from '../../models/Gam';
import { calculateAge } from '../../utils/ageCalculator';

export class DashboardService {
  async getStats() {
    const [
      totalBiodata,
      totalBoys,
      totalGirls,
      totalEnabled,
      totalDisabled,
      totalTalukas,
      totalGams,
      recentRecords,
    ] = await Promise.all([
      Biodata.count(),
      Biodata.count({ where: { gender: 'boy' } }),
      Biodata.count({ where: { gender: 'girl' } }),
      Biodata.count({ where: { status: 'enabled' } }),
      Biodata.count({ where: { status: 'disabled' } }),
      Taluka.count(),
      Gam.count(),
      Biodata.findAll({
        limit: 6,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Taluka, as: 'taluka', attributes: ['nameGu', 'nameEn'] },
          { model: Gam, as: 'gam', attributes: ['nameGu', 'nameEn'] },
          { model: BiodataPhoto, as: 'photos', attributes: ['photoUrl', 'isPrimary'] },
        ],
      }),
    ]);

    const enrichedRecent = recentRecords.map((r: any) => {
      const plain = r.toJSON();
      return {
        ...plain,
        age: calculateAge(plain.birthDate),
      };
    });

    return {
      counts: {
        totalBiodata,
        totalBoys,
        totalGirls,
        totalEnabled,
        totalDisabled,
        totalTalukas,
        totalGams,
      },
      recentBiodata: enrichedRecent,
    };
  }
}

export const dashboardService = new DashboardService();
