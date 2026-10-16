import React from 'react';
import { Search, RotateCcw, Filter, User } from 'lucide-react';
import { TalukaGamSelect } from '../gams/TalukaGamSelect';
import { BiodataFilterQuery } from '../../types/biodata.types';

interface BiodataFilterProps {
  filters: BiodataFilterQuery;
  onFilterChange: (newFilters: Partial<BiodataFilterQuery>) => void;
  onReset: () => void;
  totalResults?: number;
}

export const BiodataFilter: React.FC<BiodataFilterProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-md p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-base">
          <Filter className="w-5 h-5 text-orange-600" />
          <span>શોધ અને ફિલ્ટર્સ (Search & Filters)</span>
          {totalResults !== undefined && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 ml-2">
              {totalResults} પરિણામો
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-orange-600 transition-colors py-1 px-2 rounded-lg hover:bg-orange-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>રીસેટ (Clear All)</span>
        </button>
      </div>

      {/* Row 1: Search text + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name / Keyword Search */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 tracking-wide">
            નામ / શિક્ષણ / વ્યવસાય શોધો (Search Name / Education)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="નામ, હોદ્દો અથવા ગામ લખો... (Search in Gujarati or English)"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 tracking-wide">
            જાતિ (Gender)
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onFilterChange({ gender: '', page: 1 })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                !filters.gender ? 'bg-white text-orange-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              બધા (All)
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ gender: 'boy', page: 1 })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                filters.gender === 'boy' ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              યુવક (Boys)
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ gender: 'girl', page: 1 })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                filters.gender === 'girl' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              યુવતી (Girls)
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Dependent Taluka & Gam Dropdowns */}
      <TalukaGamSelect
        selectedTalukaId={filters.talukaId || ''}
        selectedGamId={filters.gamId || ''}
        onTalukaChange={(talukaId) => onFilterChange({ talukaId, gamId: '', page: 1 })}
        onGamChange={(gamId) => onFilterChange({ gamId, page: 1 })}
      />

      {/* Row 3: Age Range & Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Min Age */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 tracking-wide">
            લઘુત્તમ ઉંમર (Min Age)
          </label>
          <select
            value={filters.minAge || ''}
            onChange={(e) => onFilterChange({ minAge: e.target.value ? Number(e.target.value) : '', page: 1 })}
            className="w-full px-3 py-2 bg-white border border-stone-200 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 shadow-xs"
          >
            <option value="">બધી ઉંમર (Any Min)</option>
            {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35].map((age) => (
              <option key={age} value={age}>
                {age} વર્ષ ({age} Years)
              </option>
            ))}
          </select>
        </div>

        {/* Max Age */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 tracking-wide">
            મહત્તમ ઉંમર (Max Age)
          </label>
          <select
            value={filters.maxAge || ''}
            onChange={(e) => onFilterChange({ maxAge: e.target.value ? Number(e.target.value) : '', page: 1 })}
            className="w-full px-3 py-2 bg-white border border-stone-200 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 shadow-xs"
          >
            <option value="">બધી ઉંમર (Any Max)</option>
            {[24, 25, 26, 27, 28, 29, 30, 32, 35, 40].map((age) => (
              <option key={age} value={age}>
                {age} વર્ષ ({age} Years)
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-stone-700 tracking-wide">
            ક્રમ (Sort By)
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
            className="w-full px-3 py-2 bg-white border border-stone-200 text-sm rounded-xl focus:ring-2 focus:ring-orange-500 shadow-xs"
          >
            <option value="newest">નવા ઉમેરાયેલ (Newest First)</option>
            <option value="oldest">જૂના ઉમેરાયેલ (Oldest First)</option>
            <option value="age_asc">ઉંમર: ઓછી થી વધુ (Age: Low to High)</option>
            <option value="age_desc">ઉંમર: વધુ થી ઓછી (Age: High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
