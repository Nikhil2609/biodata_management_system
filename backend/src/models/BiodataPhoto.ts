import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface BiodataPhotoAttributes {
  id: number;
  biodataId: number;
  photoUrl: string;
  isPrimary: boolean;
  orderNo: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BiodataPhotoCreationAttributes
  extends Optional<BiodataPhotoAttributes, 'id' | 'isPrimary' | 'orderNo' | 'createdAt' | 'updatedAt'> {}

export class BiodataPhoto
  extends Model<BiodataPhotoAttributes, BiodataPhotoCreationAttributes>
  implements BiodataPhotoAttributes
{
  declare id: number;
  declare biodataId: number;
  declare photoUrl: string;
  declare isPrimary: boolean;
  declare orderNo: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BiodataPhoto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    biodataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'biodata',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    orderNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'biodata_photos',
    indexes: [
      { fields: ['biodata_id'] },
      { fields: ['is_primary'] },
    ],
  }
);
