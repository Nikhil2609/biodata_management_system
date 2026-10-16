import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, GraduationCap, Briefcase, Calendar, Ruler, UserCheck, ArrowRight } from 'lucide-react';
import { Biodata } from '../types/biodata.types';

interface BiodataCardProps {
  biodata: Biodata;
  isAdmin?: boolean;
}

export const BiodataCard: React.FC<BiodataCardProps> = ({ biodata, isAdmin = false }) => {
  const isBoy = biodata.gender === 'boy';
  const primaryPhoto = biodata.photos?.find((p) => p.isPrimary) || biodata.photos?.[0];

  // Default fallback avatars if no photo
  const fallbackAvatar = isBoy
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80';

  const photoSrc = primaryPhoto?.photoUrl || fallbackAvatar;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Photo & Gender Badge Header */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        <img
          src={photoSrc}
          alt={biodata.fullName}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackAvatar;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`px-3 py-1 text-xs font-bold tracking-wide rounded-full backdrop-blur-md shadow-md ${
              isBoy
                ? 'bg-blue-600/90 text-white'
                : 'bg-rose-600/90 text-white'
            }`}
          >
            {isBoy ? 'યુવક (Boy)' : 'યુવતી (Girl)'}
          </span>

          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-black/50 text-white/90 backdrop-blur-md">
            {biodata.registrationNo}
          </span>
        </div>

        {/* Name overlay at bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold truncate tracking-tight drop-shadow-md">
            {biodata.fullNameGu || biodata.fullName}
          </h3>
          {biodata.fullNameGu && (
            <p className="text-xs text-white/80 truncate drop-shadow-sm font-medium">
              {biodata.fullName}
            </p>
          )}
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-stone-600 bg-stone-50/80 p-2.5 rounded-xl border border-stone-100">
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>{biodata.age ? `${biodata.age} વર્ષ (Age ${biodata.age})` : 'Age N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Ruler className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>{biodata.height || 'Height N/A'}</span>
          </div>
        </div>

        {/* Location & Village */}
        <div className="flex items-start gap-2 text-xs text-stone-700">
          <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-semibold text-stone-900">
              ગામ: {biodata.gam?.nameGu || 'N/A'} ({biodata.gam?.nameEn || ''})
            </span>
            <div className="text-stone-500 text-[11px] mt-0.5">
              તા. {biodata.taluka?.nameGu || 'N/A'} | જિ. {biodata.district}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="flex items-start gap-2 text-xs text-stone-700">
          <GraduationCap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span className="truncate leading-tight font-medium" title={biodata.education}>
            {biodata.education}
          </span>
        </div>

        {/* Occupation */}
        <div className="flex items-start gap-2 text-xs text-stone-700">
          <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="truncate leading-tight">
            <span className="font-semibold text-stone-900">{biodata.occupationTitle}</span>
            {biodata.workLocation && (
              <span className="text-stone-500 text-[11px] block">
                {biodata.workLocation}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {isAdmin ? (
            <div className="flex items-center justify-between w-full">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  biodata.status === 'enabled'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {biodata.status === 'enabled' ? 'સક્રિય' : 'નિષ્ક્રિય'}
              </span>
              <Link
                to={`/admin/biodata/edit/${biodata.id}`}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
              >
                સંપાદિત કરો (Edit) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <Link
              to={`/biodata/${biodata.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-xl transition-all duration-200 group-hover:bg-orange-600 group-hover:text-white shadow-xs"
            >
              <span>સંપૂર્ણ બાયોડેટા જુઓ (View Biodata)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
