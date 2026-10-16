import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TalukaGamSelect } from '../gams/TalukaGamSelect';
import { Biodata } from '../../types/biodata.types';
import { User, MapPin, Users, Briefcase, Phone, Save, ArrowLeft, Camera, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BiodataFormProps {
  initialValues?: Partial<Biodata>;
  onSubmit: (values: any, photos?: File[]) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

const validationSchema = Yup.object({
  gender: Yup.string().oneOf(['boy', 'girl']).required('જાતિ પસંદ કરવી ફરજિયાત છે (Gender required)'),
  fullName: Yup.string().required('અંગ્રેજીમાં પૂરું નામ ફરજિયાત છે (Full name required)').min(2),
  fullNameGu: Yup.string().nullable(),
  birthDate: Yup.string().required('જન્મ તારીખ ફરજિયાત છે (DOB required)'),
  birthTime: Yup.string().nullable(),
  birthPlace: Yup.string().nullable(),
  height: Yup.string().required('ઊંચાઈ ફરજિયાત છે (Height required)'),
  weight: Yup.string().nullable(),
  bloodGroup: Yup.string().nullable(),
  maritalStatus: Yup.string().oneOf(['unmarried', 'divorced', 'widowed']).default('unmarried'),
  education: Yup.string().required('શિક્ષણ ફરજિયાત છે (Education required)'),
  educationDetail: Yup.string().nullable(),
  motherTongue: Yup.string().default('Gujarati'),
  religion: Yup.string().default('Hindu'),
  caste: Yup.string().default('Patidar Panchal'),
  subCaste: Yup.string().nullable(),

  talukaId: Yup.number().positive('તાલુકો પસંદ કરવો ફરજિયાત છે').required('તાલુકો ફરજિયાત છે'),
  gamId: Yup.number().positive('ગામ પસંદ કરવું ફરજિયાત છે').required('ગામ ફરજિયાત છે'),
  district: Yup.string().default('Banaskantha'),
  state: Yup.string().default('Gujarat'),
  currentCity: Yup.string().nullable(),

  fatherName: Yup.string().required("પિતાનું નામ ફરજિયાત છે (Father's name required)"),
  fatherOccupation: Yup.string().required('પિતાનો વ્યવસાય ફરજિયાત છે'),
  motherName: Yup.string().required("માતાનું નામ ફરજિયાત છે (Mother's name required)"),
  motherOccupation: Yup.string().required('માતાનો વ્યવસાય ફરજિયાત છે'),
  numberOfBrothers: Yup.number().min(0).default(0),
  brothersMarried: Yup.number().min(0).default(0),
  numberOfSisters: Yup.number().min(0).default(0),
  sistersMarried: Yup.number().min(0).default(0),
  familyType: Yup.string().nullable(),
  maternalGam: Yup.string().nullable(),
  maternalFamilyName: Yup.string().nullable(),
  familyDetails: Yup.string().nullable(),

  occupationType: Yup.string().oneOf(['business', 'private_job', 'govt_job', 'other']).required('વ્યવસાય પ્રકાર ફરજિયાત છે'),
  occupationTitle: Yup.string().required('હોદ્દો / વ્યવસાય ફરજિયાત છે'),
  companyName: Yup.string().nullable(),
  workLocation: Yup.string().required('કામ કરવાનું સ્થળ ફરજિયાત છે'),
  annualIncome: Yup.string().nullable(),
  professionalDetails: Yup.string().nullable(),

  contactPerson: Yup.string().required('સંપર્ક વ્યક્તિનું નામ ફરજિયાત છે'),
  contactNumber: Yup.string().required('સંપર્ક નંબર ફરજિયાત છે'),
  alternateContactNumber: Yup.string().nullable(),
  address: Yup.string().nullable(),
  email: Yup.string().email('માન્ય ઈમેઇલ દાખલ કરો').nullable(),

  status: Yup.string().oneOf(['enabled', 'disabled']).default('enabled'),
  isFeatured: Yup.boolean().default(false),
  notes: Yup.string().nullable(),
});

export const BiodataForm: React.FC<BiodataFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  isEdit = false,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  const defaultValues = {
    gender: 'boy' as const,
    fullName: '',
    fullNameGu: '',
    birthDate: '1998-01-01',
    birthTime: '',
    birthPlace: '',
    height: "5' 8\"",
    weight: '',
    bloodGroup: 'B+',
    maritalStatus: 'unmarried' as const,
    education: '',
    educationDetail: '',
    motherTongue: 'Gujarati',
    religion: 'Hindu',
    caste: 'Patidar Panchal',
    subCaste: '',
    talukaId: '' as any,
    gamId: '' as any,
    district: 'Banaskantha',
    state: 'Gujarat',
    currentCity: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: 'Homemaker',
    numberOfBrothers: 0,
    brothersMarried: 0,
    numberOfSisters: 0,
    sistersMarried: 0,
    familyType: 'Joint',
    maternalGam: '',
    maternalFamilyName: '',
    familyDetails: '',
    occupationType: 'private_job' as const,
    occupationTitle: '',
    companyName: '',
    workLocation: '',
    annualIncome: '',
    professionalDetails: '',
    contactPerson: '',
    contactNumber: '',
    alternateContactNumber: '',
    address: '',
    email: '',
    status: 'enabled' as const,
    isFeatured: false,
    notes: '',
    ...initialValues,
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values, selectedPhotos);
    },
  });

  // Calculate live age display from birthDate
  const calculatedAge = React.useMemo(() => {
    if (!formik.values.birthDate) return 0;
    const dob = new Date(formik.values.birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return Math.max(0, age);
  }, [formik.values.birthDate]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedPhotos((prev) => [...prev, ...files]);

      const newUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeSelectedPhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'A', name: '૧. મૂળભૂત વિગતો (Basic Info)', icon: User },
    { id: 'B', name: '૨. ગામ અને સરનામું (Location)', icon: MapPin },
    { id: 'C', name: '૩. પારિવારિક વિગતો (Family)', icon: Users },
    { id: 'D', name: '૪. શિક્ષણ અને વ્યવસાય (Career)', icon: Briefcase },
    { id: 'E', name: '૫. સંપર્ક અને સ્થિતિ (Contact)', icon: Phone },
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-stone-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/biodata"
            className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              {isEdit ? 'બાયોડેટા સંપાદિત કરો (Edit Biodata)' : 'નવો બાયોડેટા ઉમેરો (Add New Biodata)'}
            </h2>
            <p className="text-xs text-stone-500">
              તમામ માહિતી ચોકસાઈપૂર્વક ભરો. લાલ તારાંકિત (*) ફિલ્ડ્સ ફરજિયાત છે.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status selector */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-stone-600">સ્થિતિ (Status):</span>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className={`text-xs font-bold px-2 py-1 rounded-lg border-0 focus:ring-0 ${
                formik.values.status === 'enabled'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <option value="enabled">સક્રિય (Enabled)</option>
              <option value="disabled">નિષ્ક્રિય (Disabled)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? 'સાચવી રહ્યું છે...' : isEdit ? 'અપડેટ કરો' : 'બાયોડેટા સાચવો'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 bg-white border border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6 space-y-6">
        {/* SECTION A: BASIC INFO */}
        {activeTab === 'A' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              <span>વિભાગ ૧: મૂળભૂત અને શારીરિક માહિતી (Basic & Personal Info)</span>
            </h3>

            {/* Gender Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                જાતિ (Gender) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 max-w-sm gap-3">
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('gender', 'boy')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formik.values.gender === 'boy'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>👦 યુવક (Boy)</span>
                  {formik.values.gender === 'boy' && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue('gender', 'girl')}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    formik.values.gender === 'girl'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>👧 યુવતી (Girl)</span>
                  {formik.values.gender === 'girl' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  પૂરું નામ અંગ્રેજીમાં (Full Name in English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Patel Harshil Rameshbhai"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-xs text-rose-500">{formik.errors.fullName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  પૂરું નામ ગુજરાતીમાં (Full Name in Gujarati)
                </label>
                <input
                  type="text"
                  name="fullNameGu"
                  placeholder="દા.ત. પટેલ હર્ષિલ રમેશભાઈ"
                  value={formik.values.fullNameGu || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* DOB & Calculated Age & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  જન્મ તારીખ (Date of Birth) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formik.values.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <p className="text-xs text-rose-500">{formik.errors.birthDate}</p>
                )}
              </div>

              {/* Automatically calculated age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  ગણતરી કરેલી ઉંમર (Auto Calculated Age)
                </label>
                <div className="px-3.5 py-2.5 bg-orange-50/60 border border-orange-200 rounded-xl text-sm font-bold text-orange-900">
                  {calculatedAge} વર્ષ ({calculatedAge} Years)
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  ઊંચાઈ (Height) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="height"
                  placeholder="e.g. 5' 9&quot; or 172 cm"
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.height && formik.errors.height && (
                  <p className="text-xs text-rose-500">{formik.errors.height}</p>
                )}
              </div>
            </div>

            {/* Birth Time, Place, Marital Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">જન્મ સમય (Birth Time)</label>
                <input
                  type="text"
                  name="birthTime"
                  placeholder="e.g. 08:30 AM"
                  value={formik.values.birthTime || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">જન્મ સ્થળ (Birth Place)</label>
                <input
                  type="text"
                  name="birthPlace"
                  placeholder="e.g. Palanpur"
                  value={formik.values.birthPlace || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">લગ્ન સ્થિતિ (Marital Status)</label>
                <select
                  name="maritalStatus"
                  value={formik.values.maritalStatus}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="unmarried">અપરિણીત (Unmarried)</option>
                  <option value="divorced">છૂટાછેડા (Divorced)</option>
                  <option value="widowed">વિધવા / વિધુર (Widowed)</option>
                </select>
              </div>
            </div>

            {/* Caste, Religion, Mother Tongue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">જ્ઞાતિ (Community / Caste)</label>
                <input
                  type="text"
                  name="caste"
                  value={formik.values.caste}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">ધર્મ (Religion)</label>
                <input
                  type="text"
                  name="religion"
                  value={formik.values.religion}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">માતૃભાષા (Mother Tongue)</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formik.values.motherTongue}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Photo Uploader */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">
                ફોટા અપલોડ કરો (Profile Photos)
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-stone-300 hover:border-orange-500 rounded-2xl cursor-pointer bg-stone-50 hover:bg-orange-50/30 transition-all">
                  <Camera className="w-6 h-6 text-stone-400 group-hover:text-orange-500" />
                  <span className="text-[11px] font-semibold text-stone-600 mt-2 text-center">
                    ફોટો પસંદ કરો
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>

                {previewUrls.map((url, i) => (
                  <div key={i} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-stone-200 group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedPhoto(i)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 text-xs transition-colors"
                    >
                      ✕
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 right-1 text-center bg-orange-600 text-white text-[10px] font-bold py-0.5 rounded">
                        મુખ્ય ફોટો (Primary)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('B')}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors"
              >
                આગળ: ગામ અને સરનામું (Next: Location) →
              </button>
            </div>
          </div>
        )}

        {/* SECTION B: LOCATION */}
        {activeTab === 'B' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>વિભાગ ૨: ગામ અને સ્થાનિક વિગતો (Gam & Location Info)</span>
            </h3>

            {/* Dependent Taluka & Gam */}
            <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-2">
              <p className="text-xs text-orange-950 font-medium">
                * નોંધ: આપેલ અધિકૃત યાદીમાંથી તાલુકો પસંદ કરો, જેથી તેના અંતર્ગત આવતા તમામ માન્ય ગામોની યાદી જોવા મળશે.
              </p>
              <TalukaGamSelect
                required
                selectedTalukaId={formik.values.talukaId}
                selectedGamId={formik.values.gamId}
                onTalukaChange={(talukaId) => formik.setFieldValue('talukaId', talukaId)}
                onGamChange={(gamId) => formik.setFieldValue('gamId', gamId)}
                talukaError={formik.touched.talukaId ? (formik.errors.talukaId as string) : undefined}
                gamError={formik.touched.gamId ? (formik.errors.gamId as string) : undefined}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">જિલ્લો (District)</label>
                <input
                  type="text"
                  name="district"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">રાજ્ય (State)</label>
                <input
                  type="text"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">હાલનું શહેર (Current City)</label>
                <input
                  type="text"
                  name="currentCity"
                  placeholder="e.g. Ahmedabad, Surat, Palanpur"
                  value={formik.values.currentCity || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('A')}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors"
              >
                ← પાછળ (Back)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('C')}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors"
              >
                આગળ: પરિવારની વિગતો (Next: Family) →
              </button>
            </div>
          </div>
        )}

        {/* SECTION C: FAMILY */}
        {activeTab === 'C' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>વિભાગ ૩: પારિવારિક વિગતો (Family Details)</span>
            </h3>

            {/* Father Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  પિતાનું પૂરું નામ (Father's Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="e.g. Rameshbhai Ambalal Patel"
                  value={formik.values.fatherName}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.fatherName && formik.errors.fatherName && (
                  <p className="text-xs text-rose-500">{formik.errors.fatherName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  પિતાનો વ્યવસાય (Father's Occupation) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherOccupation"
                  placeholder="e.g. Farming / Business / Government Job"
                  value={formik.values.fatherOccupation}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Mother Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  માતાનું નામ (Mother's Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="e.g. Geetaben Rameshbhai Patel"
                  value={formik.values.motherName}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.motherName && formik.errors.motherName && (
                  <p className="text-xs text-rose-500">{formik.errors.motherName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  માતાનો વ્યવસાય (Mother's Occupation) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherOccupation"
                  placeholder="e.g. Homemaker / Teacher"
                  value={formik.values.motherOccupation}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Siblings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">ભાઈઓની સંખ્યા (Brothers)</label>
                <input
                  type="number"
                  name="numberOfBrothers"
                  min="0"
                  value={formik.values.numberOfBrothers}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">પરણિત ભાઈઓ (Married)</label>
                <input
                  type="number"
                  name="brothersMarried"
                  min="0"
                  value={formik.values.brothersMarried}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">બહેનોની સંખ્યા (Sisters)</label>
                <input
                  type="number"
                  name="numberOfSisters"
                  min="0"
                  value={formik.values.numberOfSisters}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">પરણિત બહેનો (Married)</label>
                <input
                  type="number"
                  name="sistersMarried"
                  min="0"
                  value={formik.values.sistersMarried}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Mosal / Maternal Gam & Family type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">મોસાળ પક્ષનું ગામ (Mosal Gam)</label>
                <input
                  type="text"
                  name="maternalGam"
                  placeholder="e.g. છાપી (Chhapi) / જગાણા"
                  value={formik.values.maternalGam || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">મોસાળ પક્ષની અટક (Maternal Family)</label>
                <input
                  type="text"
                  name="maternalFamilyName"
                  placeholder="e.g. Panchal / Patel"
                  value={formik.values.maternalFamilyName || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">પરિવારનો પ્રકાર (Family Type)</label>
                <select
                  name="familyType"
                  value={formik.values.familyType || 'Joint'}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Joint">સંયુક્ત કુટુંબ (Joint Family)</option>
                  <option value="Nuclear">વિભક્ત કુટુંબ (Nuclear Family)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                પરિવાર વિશે વધારાની વિગત (Additional Family Details)
              </label>
              <textarea
                name="familyDetails"
                rows={3}
                placeholder="ખેતીની જમીન, મકાન અથવા પરિવાર વિશે અન્ય નોંધ..."
                value={formik.values.familyDetails || ''}
                onChange={formik.handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('B')}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors"
              >
                ← પાછળ (Back)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('D')}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors"
              >
                આગળ: શિક્ષણ અને વ્યવસાય (Next: Career) →
              </button>
            </div>
          </div>
        )}

        {/* SECTION D: CAREER & JOB */}
        {activeTab === 'D' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <span>વિભાગ ૪: શિક્ષણ અને નોકરી / ધંધો (Education & Career)</span>
            </h3>

            {/* Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  મુખ્ય શિક્ષણ (Education Degree) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="education"
                  placeholder="e.g. B.E. Computer, M.B.B.S., C.A., M.Sc."
                  value={formik.values.education}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.education && formik.errors.education && (
                  <p className="text-xs text-rose-500">{formik.errors.education}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">કોલેજ / યુનિવર્સિટી (College)</label>
                <input
                  type="text"
                  name="educationDetail"
                  placeholder="e.g. L.D. College of Engineering, Ahmedabad"
                  value={formik.values.educationDetail || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Occupation Type & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  વ્યવસાય પ્રકાર (Occupation Type) <span className="text-rose-500">*</span>
                </label>
                <select
                  name="occupationType"
                  value={formik.values.occupationType}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                >
                  <option value="private_job">પ્રાઈવેટ જોબ (Private Job)</option>
                  <option value="business">સ્વતંત્ર વ્યવસાય / ધંધો (Business)</option>
                  <option value="govt_job">સરકારી નોકરી (Government Job)</option>
                  <option value="other">અન્ય (Other)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  હોદ્દો / ડેસિગ્નેશન (Designation / Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="occupationTitle"
                  placeholder="e.g. Senior Software Engineer / Proprietor"
                  value={formik.values.occupationTitle}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.occupationTitle && formik.errors.occupationTitle && (
                  <p className="text-xs text-rose-500">{formik.errors.occupationTitle}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">કંપની / પેઢીનું નામ (Company)</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. TCS / Self Owned Firm"
                  value={formik.values.companyName || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Work Location & Annual Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  કામ કરવાનું સ્થળ (Work Location) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="workLocation"
                  placeholder="e.g. Ahmedabad, Gandhinagar, Palanpur"
                  value={formik.values.workLocation}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">વાર્ષિક આવક (Annual Income)</label>
                <input
                  type="text"
                  name="annualIncome"
                  placeholder="e.g. 12 Lakh PA / 15-18 LPA"
                  value={formik.values.annualIncome || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                વ્યવસાય અંગે વધારાની વિગતો (Professional Details)
              </label>
              <textarea
                name="professionalDetails"
                rows={3}
                placeholder="અનુભવ, કૌશલ્યો અથવા બિઝનેસ નેટવર્ક વિશે..."
                value={formik.values.professionalDetails || ''}
                onChange={formik.handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('C')}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors"
              >
                ← પાછળ (Back)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('E')}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors"
              >
                આગળ: સંપર્ક વિગતો (Next: Contact) →
              </button>
            </div>
          </div>
        )}

        {/* SECTION E: CONTACT & ADMIN CONTROLS */}
        {activeTab === 'E' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-600" />
              <span>વિભાગ ૫: સંપર્ક અને ગોપનીયતા નિયંત્રણ (Contact & Privacy Controls)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  સંપર્ક વ્યક્તિ (Contact Person) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="e.g. Rameshbhai (Father)"
                  value={formik.values.contactPerson}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.contactPerson && formik.errors.contactPerson && (
                  <p className="text-xs text-rose-500">{formik.errors.contactPerson}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  મોબાઈલ નંબર (Contact Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="e.g. 98250 12345"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
                {formik.touched.contactNumber && formik.errors.contactNumber && (
                  <p className="text-xs text-rose-500">{formik.errors.contactNumber}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">વૈકલ્પિક નંબર (Alternate Number)</label>
                <input
                  type="text"
                  name="alternateContactNumber"
                  placeholder="e.g. 94280 67890"
                  value={formik.values.alternateContactNumber || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">ઈમેઇલ (Email Address)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. family@gmail.com"
                  value={formik.values.email || ''}
                  onChange={formik.handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  વિશેષ પ્રોફાઇલ (Featured Profile)
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    હોમ પેજ પર મુખ્ય બાયોડેટા તરીકે દર્શાવો (Show on Homepage Featured list)
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">રહેઠાણનું સરનામું (Residential Address)</label>
              <textarea
                name="address"
                rows={2}
                placeholder="મકાન નંબર, સોસાયટી, રોડ, શહેર..."
                value={formik.values.address || ''}
                onChange={formik.handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                એડમિન આંતરિક નોંધ (Internal Admin Notes - Never shown to public)
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="માત્ર સંચાલકો માટેની ખાનગી નોંધ..."
                value={formik.values.notes || ''}
                onChange={formik.handleChange}
                className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('D')}
                className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200 transition-colors"
              >
                ← પાછળ (Back)
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'સાચવી રહ્યું છે...' : isEdit ? 'બાયોડેટા અપડેટ કરો' : 'બાયોડેટા સબમિટ કરો'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
