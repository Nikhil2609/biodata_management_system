import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTalukas, fetchGamsByTaluka } from './gamSlice';
import { MapPin, Building2 } from 'lucide-react';

interface TalukaGamSelectProps {
  selectedTalukaId: number | string;
  selectedGamId: number | string;
  onTalukaChange: (talukaId: number | '') => void;
  onGamChange: (gamId: number | '') => void;
  talukaLabel?: string;
  gamLabel?: string;
  required?: boolean;
  talukaError?: string;
  gamError?: string;
  className?: string;
  stacked?: boolean;
}

export const TalukaGamSelect: React.FC<TalukaGamSelectProps> = ({
  selectedTalukaId,
  selectedGamId,
  onTalukaChange,
  onGamChange,
  talukaLabel = 'તાલુકો (Taluka)',
  gamLabel = 'ગામ (Gam)',
  required = false,
  talukaError,
  gamError,
  className = '',
  stacked = false,
}) => {
  const dispatch = useAppDispatch();
  const { talukas, gams, loadingTalukas, loadingGams } = useAppSelector((state) => state.gams);
  const [gamSearch, setGamSearch] = useState('');

  // Fetch talukas on mount if not loaded
  useEffect(() => {
    if (talukas.length === 0) {
      dispatch(fetchTalukas());
    }
  }, [dispatch, talukas.length]);

  // Fetch gams whenever selectedTalukaId changes
  useEffect(() => {
    if (selectedTalukaId) {
      dispatch(fetchGamsByTaluka({ talukaId: Number(selectedTalukaId) }));
    }
  }, [dispatch, selectedTalukaId]);

  const handleTalukaSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : '';
    onTalukaChange(val);
    onGamChange(''); // reset gam when taluka changes
  };

  const handleGamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : '';
    onGamChange(val);
  };

  return (
    <div className={`grid ${stacked ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'} ${className}`}>
      {/* Taluka Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-700 tracking-wide">
          {talukaLabel} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <select
            value={selectedTalukaId}
            onChange={handleTalukaSelect}
            className={`w-full pl-9 pr-8 py-2.5 bg-white border text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-xs appearance-none ${
              talukaError ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 text-stone-800'
            }`}
          >
            <option value="">-- તાલુકો પસંદ કરો (Select Taluka) --</option>
            {talukas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameGu} ({t.nameEn}) - {t.districtGu}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
            ▼
          </div>
        </div>
        {talukaError && <p className="text-xs text-rose-500 font-medium">{talukaError}</p>}
      </div>

      {/* Dependent Gam Dropdown */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-stone-700 tracking-wide">
          {gamLabel} {required && <span className="text-rose-500">*</span>}
          {selectedTalukaId && gams.length > 0 && (
            <span className="text-stone-400 font-normal ml-1">({gams.length} ગામ)</span>
          )}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <select
            value={selectedGamId}
            onChange={handleGamSelect}
            disabled={!selectedTalukaId || loadingGams}
            className={`w-full pl-9 pr-8 py-2.5 bg-white border text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-xs appearance-none disabled:bg-stone-100 disabled:cursor-not-allowed ${
              gamError ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 text-stone-800'
            }`}
          >
            <option value="">
              {!selectedTalukaId
                ? '← પહેલા તાલુકો પસંદ કરો (Select Taluka first)'
                : loadingGams
                ? 'ગામો લોડ થઈ રહ્યા છે...'
                : '-- ગામ પસંદ કરો (Select Gam) --'}
            </option>
            {gams.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nameGu} ({g.nameEn})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-xs">
            ▼
          </div>
        </div>
        {gamError && <p className="text-xs text-rose-500 font-medium">{gamError}</p>}
      </div>
    </div>
  );
};
