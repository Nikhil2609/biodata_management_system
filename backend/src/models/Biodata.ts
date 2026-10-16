import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type GenderType = 'boy' | 'girl';
export type MaritalStatusType = 'unmarried' | 'divorced' | 'widowed';
export type OccupationType = 'business' | 'private_job' | 'govt_job' | 'other';
export type BiodataStatusType = 'enabled' | 'disabled';

export interface BiodataAttributes {
  id: number;
  registrationNo: string;
  gender: GenderType;
  fullName: string;
  fullNameGu?: string | null;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string | null;
  birthPlace?: string | null;
  height: string;
  weight?: string | null;
  bloodGroup?: string | null;
  maritalStatus: MaritalStatusType;
  education: string;
  educationDetail?: string | null;
  motherTongue: string;
  religion: string;
  caste: string;
  subCaste?: string | null;

  // Location
  talukaId: number;
  gamId: number;
  district: string;
  state: string;
  currentCity?: string | null;

  // Family
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  numberOfBrothers: number;
  brothersMarried: number;
  numberOfSisters: number;
  sistersMarried: number;
  familyType?: string | null;
  maternalGam?: string | null; // મોસાળ
  maternalFamilyName?: string | null;
  familyDetails?: string | null;

  // Business / Job
  occupationType: OccupationType;
  occupationTitle: string;
  companyName?: string | null;
  workLocation: string;
  annualIncome?: string | null;
  professionalDetails?: string | null;

  // Contact
  contactPerson: string;
  contactNumber: string;
  alternateContactNumber?: string | null;
  address?: string | null;
  email?: string | null;

  // Status & Control
  status: BiodataStatusType;
  isFeatured: boolean;
  notes?: string | null;
  createdById?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface BiodataCreationAttributes extends Optional<
  BiodataAttributes,
  | 'id'
  | 'registrationNo'
  | 'fullNameGu'
  | 'birthTime'
  | 'birthPlace'
  | 'weight'
  | 'bloodGroup'
  | 'maritalStatus'
  | 'educationDetail'
  | 'motherTongue'
  | 'religion'
  | 'caste'
  | 'subCaste'
  | 'district'
  | 'state'
  | 'currentCity'
  | 'numberOfBrothers'
  | 'brothersMarried'
  | 'numberOfSisters'
  | 'sistersMarried'
  | 'familyType'
  | 'maternalGam'
  | 'maternalFamilyName'
  | 'familyDetails'
  | 'companyName'
  | 'annualIncome'
  | 'professionalDetails'
  | 'alternateContactNumber'
  | 'address'
  | 'email'
  | 'status'
  | 'isFeatured'
  | 'notes'
  | 'createdById'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> {}

export class Biodata extends Model<BiodataAttributes, BiodataCreationAttributes> implements BiodataAttributes {
  declare id: number;
  declare registrationNo: string;
  declare gender: GenderType;
  declare fullName: string;
  declare fullNameGu: string | null;
  declare birthDate: string;
  declare birthTime: string | null;
  declare birthPlace: string | null;
  declare height: string;
  declare weight: string | null;
  declare bloodGroup: string | null;
  declare maritalStatus: MaritalStatusType;
  declare education: string;
  declare educationDetail: string | null;
  declare motherTongue: string;
  declare religion: string;
  declare caste: string;
  declare subCaste: string | null;

  declare talukaId: number;
  declare gamId: number;
  declare district: string;
  declare state: string;
  declare currentCity: string | null;

  declare fatherName: string;
  declare fatherOccupation: string;
  declare motherName: string;
  declare motherOccupation: string;
  declare numberOfBrothers: number;
  declare brothersMarried: number;
  declare numberOfSisters: number;
  declare sistersMarried: number;
  declare familyType: string | null;
  declare maternalGam: string | null;
  declare maternalFamilyName: string | null;
  declare familyDetails: string | null;

  declare occupationType: OccupationType;
  declare occupationTitle: string;
  declare companyName: string | null;
  declare workLocation: string;
  declare annualIncome: string | null;
  declare professionalDetails: string | null;

  declare contactPerson: string;
  declare contactNumber: string;
  declare alternateContactNumber: string | null;
  declare address: string | null;
  declare email: string | null;

  declare status: BiodataStatusType;
  declare isFeatured: boolean;
  declare notes: string | null;
  declare createdById: number | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date | null;
}

Biodata.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    registrationNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: () => `BD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    gender: {
      type: DataTypes.ENUM('boy', 'girl'),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    fullNameGu: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    birthTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    birthPlace: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    height: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bloodGroup: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    maritalStatus: {
      type: DataTypes.ENUM('unmarried', 'divorced', 'widowed'),
      allowNull: false,
      defaultValue: 'unmarried',
    },
    education: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    educationDetail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    motherTongue: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Gujarati',
    },
    religion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Hindu',
    },
    caste: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Patidar Panchal',
    },
    subCaste: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // Location
    talukaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'talukas', key: 'id' },
    },
    gamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'gams', key: 'id' },
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Banaskantha',
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Gujarat',
    },
    currentCity: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    // Family
    fatherName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    fatherOccupation: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    motherName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    motherOccupation: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    numberOfBrothers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    brothersMarried: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    numberOfSisters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sistersMarried: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    familyType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Joint',
    },
    maternalGam: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    maternalFamilyName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    familyDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Business / Job
    occupationType: {
      type: DataTypes.ENUM('business', 'private_job', 'govt_job', 'other'),
      allowNull: false,
      defaultValue: 'private_job',
    },
    occupationTitle: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    workLocation: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    annualIncome: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    professionalDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Contact
    contactPerson: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    alternateContactNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    // Status
    status: {
      type: DataTypes.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'enabled',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'admins', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'biodata',
    paranoid: true,
    indexes: [
      { fields: ['gender'] },
      { fields: ['status'] },
      { fields: ['taluka_id'] },
      { fields: ['gam_id'] },
      { fields: ['full_name'] },
      { fields: ['birth_date'] },
      { fields: ['marital_status'] },
      { fields: ['occupation_type'] },
      { fields: ['created_at'] },
    ],
  }
);
