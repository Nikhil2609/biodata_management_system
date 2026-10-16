import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface GamAttributes {
  id: number;
  talukaId: number;
  nameGu: string;
  nameEn: string;
  orderNo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GamCreationAttributes extends Optional<GamAttributes, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'> {}

export class Gam extends Model<GamAttributes, GamCreationAttributes> implements GamAttributes {
  declare id: number;
  declare talukaId: number;
  declare nameGu: string;
  declare nameEn: string;
  declare orderNo: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Gam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    talukaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'talukas',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    nameGu: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    nameEn: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    orderNo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'gams',
    indexes: [
      { fields: ['taluka_id'] },
      { fields: ['name_gu'] },
      { fields: ['name_en'] },
      { unique: true, fields: ['taluka_id', 'name_gu'] },
    ],
  }
);
