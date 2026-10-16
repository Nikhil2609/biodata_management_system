import { sequelize } from '../config/database';
import { Taluka } from './Taluka';
import { Gam } from './Gam';
import { Admin } from './Admin';
import { Biodata } from './Biodata';
import { BiodataPhoto } from './BiodataPhoto';

// Associations
Taluka.hasMany(Gam, { foreignKey: 'talukaId', as: 'gams' });
Gam.belongsTo(Taluka, { foreignKey: 'talukaId', as: 'taluka' });

Taluka.hasMany(Biodata, { foreignKey: 'talukaId', as: 'biodatas' });
Biodata.belongsTo(Taluka, { foreignKey: 'talukaId', as: 'taluka' });

Gam.hasMany(Biodata, { foreignKey: 'gamId', as: 'biodatas' });
Biodata.belongsTo(Gam, { foreignKey: 'gamId', as: 'gam' });

Biodata.hasMany(BiodataPhoto, { foreignKey: 'biodataId', as: 'photos', onDelete: 'CASCADE' });
BiodataPhoto.belongsTo(Biodata, { foreignKey: 'biodataId', as: 'biodata' });

Admin.hasMany(Biodata, { foreignKey: 'createdById', as: 'createdBiodatas' });
Biodata.belongsTo(Admin, { foreignKey: 'createdById', as: 'creator' });

export { sequelize, Taluka, Gam, Admin, Biodata, BiodataPhoto };
