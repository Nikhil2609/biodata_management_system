import { Taluka, Gam } from './master.types';

export type GenderType = 'boy' | 'girl';
export type MaritalStatusType = 'unmarried' | 'divorced' | 'widowed';
export type OccupationType = 'business' | 'private_job' | 'govt_job' | 'other';
export type BiodataStatusType = 'enabled' | 'disabled';

export interface BiodataPhoto {
  id: number;
  biodataId: number;
  photoUrl: string;
  isPrimary: boolean;
  orderNo: number;
}

export interface Biodata {
  id: number;
  registrationNo: string;
  gender: GenderType;
  fullName: string;
  fullNameGu?: string | null;
  birthDate: string; // YYYY-MM-DD
  age?: number;
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
  taluka?: Taluka;
  gam?: Gam;

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

  // Job / Business
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

  // Status & photos
  status: BiodataStatusType;
  isFeatured: boolean;
  notes?: string | null;
  photos?: BiodataPhoto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BiodataFilterQuery {
  gender?: GenderType | '';
  talukaId?: number | '';
  gamId?: number | '';
  search?: string;
  minAge?: number | '';
  maxAge?: number | '';
  maritalStatus?: string;
  occupationType?: string;
  status?: BiodataStatusType | '';
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
