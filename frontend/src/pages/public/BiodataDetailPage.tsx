import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPublicBiodataDetail } from '../../features/biodata/biodataSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { PhotoGalleryModal } from '../../components/PhotoGalleryModal';
import { BiodataCard } from '../../components/BiodataCard';
import {
  ArrowLeft,
  User,
  MapPin,
  Users,
  Briefcase,
  Phone,
  Printer,
  Calendar,
  Ruler,
  Share2,
  CheckCircle2,
  Maximize2,
  MessageCircle,
} from 'lucide-react';

export const BiodataDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentBiodata, relatedBiodata, loading, error } = useAppSelector((state) => state.biodata);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPublicBiodataDetail(Number(id)));
      setSelectedPhotoIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, dispatch]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="બાયોડેટા વિગતો લોડ થઈ રહી છે..." />;
  }

  if (error || !currentBiodata) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-stone-900">બાયોડેટા મળ્યો નથી</h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          {error || 'આ બાયોડેટા અસ્તિત્વમાં નથી અથવા સંચાલક દ્વારા અસ્થાયી રૂપે નિષ્ક્રિય કરેલ છે.'}
        </p>
        <Link
          to="/biodata"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>બાયોડેટા યાદી પર પાછા જાઓ</span>
        </Link>
      </div>
    );
  }

  const isBoy = currentBiodata.gender === 'boy';
  const photos = currentBiodata.photos || [];
  const currentPhotoUrl =
    photos[selectedPhotoIndex]?.photoUrl ||
    (isBoy
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');

  // Format clean whatsapp link
  const cleanPhone = currentBiodata.contactNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=નમસ્તે, અમે શ્રી ધાણધાર પાટીદાર પંચાલ સેવા સમાજ પોર્ટલ પર ${currentBiodata.fullName} (Reg: ${currentBiodata.registrationNo}) નો લગ્ન બાયોડેટા જોયો છે.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <Link
          to="/biodata"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>પાછા જાઓ (Back to Listing)</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" />
            <span>{copySuccess ? 'લિંક કોપી થઈ ગઈ!' : 'શેર કરો (Share)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-800 hover:bg-stone-900 px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>પ્રિન્ટ (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* MAIN BIODATA CARD CONTAINER */}
      <div id="printable-biodata" className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
        {/* Sacred Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 text-center relative">
          <div className="text-xs font-bold tracking-widest text-orange-100">
            ॥ શ્રી ગણેશાય નમઃ ॥ શ્રી કુળદેવી માતાયૈ નમઃ ॥
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
            શ્રી ધાણધાર પાટીદાર પંચાલ સેવા સમાજ — લગ્ન બાયોડેટા
          </h2>
          <div className="text-xs font-medium text-orange-100 mt-1">
            રજીસ્ટ્રેશન નંબર: <span className="font-bold underline">{currentBiodata.registrationNo}</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Photo Gallery (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group shadow-inner">
              <img
                src={currentPhotoUrl}
                alt={currentBiodata.fullName}
                className="w-full h-full object-cover object-top"
              />
              {photos.length > 0 && (
                <button
                  type="button"
                  onClick={() => setGalleryOpen(true)}
                  className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-xs transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>મોટો ફોટો જુઓ</span>
                </button>
              )}

              <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wide rounded-full text-white shadow-md ${
                  isBoy ? 'bg-blue-600' : 'bg-rose-600'
                }`}
              >
                {isBoy ? 'યુવક (Boy)' : 'યુવતી (Girl)'}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {photos.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      idx === selectedPhotoIndex ? 'border-orange-600 scale-105' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={p.photoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Direct Contact Card */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Phone className="w-4 h-4 text-orange-600" />
                <span>સંપર્ક માહિતી (Contact Information)</span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-700">
                <div>
                  <span className="font-semibold text-stone-500">સંપર્ક વ્યક્તિ: </span>
                  <span className="font-bold text-stone-900">{currentBiodata.contactPerson}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-500">મોબાઈલ નંબર: </span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="font-extrabold text-orange-700 hover:underline"
                  >
                    {currentBiodata.contactNumber}
                  </a>
                </div>
                {currentBiodata.alternateContactNumber && (
                  <div>
                    <span className="font-semibold text-stone-500">બીજો નંબર: </span>
                    <span className="font-semibold text-stone-800">
                      {currentBiodata.alternateContactNumber}
                    </span>
                  </div>
                )}
                {currentBiodata.address && (
                  <div className="pt-1">
                    <span className="font-semibold text-stone-500 block">રહેઠાણનું સરનામું:</span>
                    <span className="font-medium text-stone-800 leading-tight block mt-0.5">
                      {currentBiodata.address}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>કૉલ કરો (Call Family)</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp પર વાત કરો</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Sections (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header info */}
            <div className="border-b border-stone-200 pb-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {currentBiodata.fullNameGu || currentBiodata.fullName}
              </h1>
              {currentBiodata.fullNameGu && (
                <div className="text-sm font-semibold text-stone-500 mt-0.5">
                  {currentBiodata.fullName}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-stone-600">
                <span className="inline-flex items-center gap-1 font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                  <Calendar className="w-3.5 h-3.5" />
                  {currentBiodata.age} વર્ષ (Age {currentBiodata.age})
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                  <Ruler className="w-3.5 h-3.5 text-stone-500" />
                  ઊંચાઈ: {currentBiodata.height}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  ગામ: {currentBiodata.gam?.nameGu} ({currentBiodata.taluka?.nameGu})
                </span>
              </div>
            </div>

            {/* SECTION 1: Personal & Physical */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-orange-900 bg-orange-50/70 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-orange-100">
                <User className="w-4 h-4 text-orange-600" />
                <span>૧. વ્યક્તિગત અને શારીરિક વિગતો (Personal Details)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-2">
                <div>
                  <span className="text-stone-400 block">જન્મ તારીખ:</span>
                  <span className="font-bold text-stone-800">{currentBiodata.birthDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">જન્મ સમય / સ્થળ:</span>
                  <span className="font-bold text-stone-800">
                    {currentBiodata.birthTime || '—'} {currentBiodata.birthPlace ? `(${currentBiodata.birthPlace})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">લગ્ન સ્થિતિ:</span>
                  <span className="font-bold text-stone-800">
                    {currentBiodata.maritalStatus === 'unmarried'
                      ? 'અપરિણીત (Unmarried)'
                      : currentBiodata.maritalStatus}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">જ્ઞાતિ (Community):</span>
                  <span className="font-bold text-stone-800">{currentBiodata.caste}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">ધર્મ / માતૃભાષા:</span>
                  <span className="font-bold text-stone-800">
                    {currentBiodata.religion} / {currentBiodata.motherTongue}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">બ્લડ ગ્રૂપ / વજન:</span>
                  <span className="font-bold text-stone-800">
                    {currentBiodata.bloodGroup || '—'} / {currentBiodata.weight || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: Native Gam & Location */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 bg-stone-100 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-stone-200">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>૨. મૂળ વતન અને સ્થાનિક માહિતી (Native Village & Location)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-2">
                <div>
                  <span className="text-stone-400 block">મૂળ ગામ (Gam):</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {currentBiodata.gam?.nameGu} ({currentBiodata.gam?.nameEn})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">તાલુકો (Taluka):</span>
                  <span className="font-bold text-stone-900">
                    {currentBiodata.taluka?.nameGu} ({currentBiodata.taluka?.nameEn})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">જિલ્લો (District):</span>
                  <span className="font-bold text-stone-800">{currentBiodata.district}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">હાલનું શહેર (City):</span>
                  <span className="font-bold text-stone-800">{currentBiodata.currentCity || '—'}</span>
                </div>
              </div>
            </div>

            {/* SECTION 3: Education & Career */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 bg-stone-100 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-stone-200">
                <Briefcase className="w-4 h-4 text-orange-600" />
                <span>૩. શિક્ષણ અને નોકરી / વ્યવસાય (Education & Profession)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-2">
                <div>
                  <span className="text-stone-400 block">શિક્ષણ (Degree):</span>
                  <span className="font-bold text-stone-900 text-sm">{currentBiodata.education}</span>
                  {currentBiodata.educationDetail && (
                    <span className="text-stone-500 block mt-0.5">{currentBiodata.educationDetail}</span>
                  )}
                </div>
                <div>
                  <span className="text-stone-400 block">વ્યવસાય હોદ્દો (Designation):</span>
                  <span className="font-bold text-stone-900 text-sm">{currentBiodata.occupationTitle}</span>
                  {currentBiodata.companyName && (
                    <span className="text-stone-500 block mt-0.5">{currentBiodata.companyName}</span>
                  )}
                </div>
                <div>
                  <span className="text-stone-400 block">કામ કરવાનું સ્થળ (Work Location):</span>
                  <span className="font-bold text-stone-800">{currentBiodata.workLocation}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">વાર્ષિક આવક (Annual Income):</span>
                  <span className="font-bold text-emerald-700">{currentBiodata.annualIncome || '—'}</span>
                </div>
              </div>
              {currentBiodata.professionalDetails && (
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                  {currentBiodata.professionalDetails}
                </p>
              )}
            </div>

            {/* SECTION 4: Family Details & Mosal */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900 bg-stone-100 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-stone-200">
                <Users className="w-4 h-4 text-orange-600" />
                <span>૪. પારિવારિક માહિતી અને મોસાળ પક્ષ (Family Details)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-2">
                <div>
                  <span className="text-stone-400 block">પિતાનું નામ અને વ્યવસાય:</span>
                  <span className="font-bold text-stone-900">
                    {currentBiodata.fatherName} ({currentBiodata.fatherOccupation})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">માતાનું નામ અને વ્યવસાય:</span>
                  <span className="font-bold text-stone-900">
                    {currentBiodata.motherName} ({currentBiodata.motherOccupation})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">ભાઈઓ (Brothers):</span>
                  <span className="font-bold text-stone-800">
                    કુલ: {currentBiodata.numberOfBrothers} (પરણિત: {currentBiodata.brothersMarried})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">બહેનો (Sisters):</span>
                  <span className="font-bold text-stone-800">
                    કુલ: {currentBiodata.numberOfSisters} (પરણિત: {currentBiodata.sistersMarried})
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">મોસાળ પક્ષનું ગામ (Mosal Gam):</span>
                  <span className="font-bold text-orange-900">
                    {currentBiodata.maternalGam || '—'}{' '}
                    {currentBiodata.maternalFamilyName ? `(${currentBiodata.maternalFamilyName})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block">કુટુંબનો પ્રકાર (Family Type):</span>
                  <span className="font-bold text-stone-800">{currentBiodata.familyType || 'Joint'}</span>
                </div>
              </div>
              {currentBiodata.familyDetails && (
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                  {currentBiodata.familyDetails}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED BIODATA SUGGESTIONS */}
      {relatedBiodata && relatedBiodata.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-stone-900">
              સમાન અન્ય બાયોડેટા (Related Profiles)
            </h3>
            <Link to="/biodata" className="text-xs font-semibold text-orange-600 hover:underline">
              વધુ જુઓ →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBiodata.map((b) => (
              <BiodataCard key={b.id} biodata={b} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <PhotoGalleryModal
        isOpen={galleryOpen}
        photos={photos}
        initialIndex={selectedPhotoIndex}
        onClose={() => setGalleryOpen(false)}
      />
    </div>
  );
};
