import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface TalukaAttributes {
  id: number;
  nameGu: string;
  nameEn: string;
  district: string;
  districtGu: string;
  state: string;
  stateGu: string;
  orderNo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TalukaCreationAttributes extends Optional<TalukaAttributes, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'> {}

export class Taluka extends Model<TalukaAttributes, TalukaCreationAttributes> implements TalukaAttributes {
  declare id: number;
  declare nameGu: string;
  declare nameEn: string;
  declare district: string;
  declare districtGu: string;
  declare state: string;
  declare stateGu: string;
  declare orderNo: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Taluka.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameGu: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    nameEn: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Banaskantha',
    },
    districtGu: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'બનાસકાંઠા',
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Gujarat',
    },
    stateGu: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'ગુજરાત',
    },
    orderNo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'talukas',
    indexes: [
      { fields: ['name_gu'] },
      { fields: ['name_en'] },
    ],
  }
);
