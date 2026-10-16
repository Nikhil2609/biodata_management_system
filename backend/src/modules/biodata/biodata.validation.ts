import * as yup from 'yup';

export const biodataSchema = yup.object({
  gender: yup.string().oneOf(['boy', 'girl'], 'Gender must be either boy or girl').required('Gender is required'),
  fullName: yup.string().required('Full name is required').trim().min(2),
  fullNameGu: yup.string().nullable().optional(),
  birthDate: yup.string().required('Date of birth is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  birthTime: yup.string().nullable().optional(),
  birthPlace: yup.string().nullable().optional(),
  height: yup.string().required('Height is required'),
  weight: yup.string().nullable().optional(),
  bloodGroup: yup.string().nullable().optional(),
  maritalStatus: yup.string().oneOf(['unmarried', 'divorced', 'widowed']).default('unmarried'),
  education: yup.string().required('Education is required'),
  educationDetail: yup.string().nullable().optional(),
  motherTongue: yup.string().default('Gujarati'),
  religion: yup.string().default('Hindu'),
  caste: yup.string().default('Patidar Panchal'),
  subCaste: yup.string().nullable().optional(),

  // Location
  talukaId: yup.number().positive().required('Taluka is required'),
  gamId: yup.number().positive().required('Gam is required'),
  district: yup.string().default('Banaskantha'),
  state: yup.string().default('Gujarat'),
  currentCity: yup.string().nullable().optional(),

  // Family
  fatherName: yup.string().required("Father's name is required"),
  fatherOccupation: yup.string().required("Father's occupation is required"),
  motherName: yup.string().required("Mother's name is required"),
  motherOccupation: yup.string().required("Mother's occupation is required"),
  numberOfBrothers: yup.number().min(0).default(0),
  brothersMarried: yup.number().min(0).default(0),
  numberOfSisters: yup.number().min(0).default(0),
  sistersMarried: yup.number().min(0).default(0),
  familyType: yup.string().nullable().optional(),
  maternalGam: yup.string().nullable().optional(),
  maternalFamilyName: yup.string().nullable().optional(),
  familyDetails: yup.string().nullable().optional(),

  // Occupation
  occupationType: yup.string().oneOf(['business', 'private_job', 'govt_job', 'other']).required('Occupation type is required'),
  occupationTitle: yup.string().required('Job or business title is required'),
  companyName: yup.string().nullable().optional(),
  workLocation: yup.string().required('Work location is required'),
  annualIncome: yup.string().nullable().optional(),
  professionalDetails: yup.string().nullable().optional(),

  // Contact
  contactPerson: yup.string().required('Contact person is required'),
  contactNumber: yup.string().required('Contact number is required'),
  alternateContactNumber: yup.string().nullable().optional(),
  address: yup.string().nullable().optional(),
  email: yup.string().email('Invalid email').nullable().optional(),

  // Status
  status: yup.string().oneOf(['enabled', 'disabled']).default('enabled'),
  isFeatured: yup.boolean().default(false),
  notes: yup.string().nullable().optional(),
});
