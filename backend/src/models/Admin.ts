import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AdminAttributes {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'role' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  declare id: number;
  declare email: string;
  declare username: string;
  declare passwordHash: string;
  declare name: string;
  declare role: 'admin' | 'superadmin';
  declare isActive: boolean;
  declare lastLoginAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'superadmin'),
      allowNull: false,
      defaultValue: 'admin',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'admins',
    indexes: [
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['username'] },
    ],
  }
);
