import { sequelize, Taluka, Gam } from '../models';
import { masterTalukasAndGams } from './masterData';
import { seedAdmin } from './adminSeed';
import { seedBiodata } from './biodataSeed';

export const runAllSeeds = async () => {
  try {
    console.log('🔄 Connecting to database and synchronizing schema...');
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized.');

    console.log('\n📍 Seeding Talukas and Gams from official Samaj document image...');
    let totalTalukasInserted = 0;
    let totalGamsInserted = 0;

    for (const t of masterTalukasAndGams) {
      const [taluka, created] = await Taluka.findOrCreate({
        where: { nameGu: t.nameGu },
        defaults: {
          nameGu: t.nameGu,
          nameEn: t.nameEn,
          district: t.district,
          districtGu: t.districtGu,
          state: t.state,
          stateGu: t.stateGu,
          orderNo: t.orderNo,
        },
      });

      if (created) totalTalukasInserted++;

      for (const g of t.gams) {
        const [, gamCreated] = await Gam.findOrCreate({
          where: { talukaId: taluka.id, nameGu: g.nameGu },
          defaults: {
            talukaId: taluka.id,
            nameGu: g.nameGu,
            nameEn: g.nameEn,
            orderNo: g.orderNo,
          },
        });
        if (gamCreated) totalGamsInserted++;
      }
    }

    const currentTalukaCount = await Taluka.count();
    const currentGamCount = await Gam.count();
    console.log(`✅ Master Data Ready: ${currentTalukaCount} Talukas, ${currentGamCount} Gams in database.`);

    console.log('\n👤 Seeding Admin credentials...');
    await seedAdmin();

    console.log('\n📄 Seeding Sample Biodata...');
    await seedBiodata();

    console.log('\n🎉 ALL DATABASE SEEDING COMPLETED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runAllSeeds().then(() => {
    process.exit(0);
  });
}
