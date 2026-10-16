import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTalukas, fetchGamsByTaluka } from '../../features/gams/gamSlice';
import { Search, MapPin, Building2, ExternalLink, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GamsListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { talukas } = useAppSelector((state) => state.gams);

  const [selectedTalukaTab, setSelectedTalukaTab] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTalukas());
  }, [dispatch]);

  // Aggregate all gams with their taluka info
  const allGams = React.useMemo(() => {
    const list: any[] = [];
    talukas.forEach((t) => {
      if (t.gams) {
        t.gams.forEach((g) => {
          list.push({
            ...g,
            talukaNameGu: t.nameGu,
            talukaNameEn: t.nameEn,
            districtGu: t.districtGu,
          });
        });
      }
    });
    return list;
  }, [talukas]);

  // Filter based on tab and search
  const filteredGams = allGams.filter((g) => {
    const matchesTaluka = selectedTalukaTab === 'all' || g.talukaId === selectedTalukaTab;
    const matchesSearch =
      !searchQuery.trim() ||
      g.nameGu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.talukaNameGu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.talukaNameEn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTaluka && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>શ્રી ધાણધાર પંચાલ સેવા સમાજ અધિકૃત ગામ ડિરેક્ટરી</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          ઉત્તર ગુજરાતના તાલુકાઓમાં વસતા ગામોની યાદી
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
          સમાજ પત્રિકા અનુસાર પાલનપુર (૭૭), વડગામ (૭૪), ડીસા (૨૭), દાંતીવાડા (૧૫), દાંતા (૩), ધાનેરા (૧), સિદ્ધપુર (૨૪) અને સરસ્વતી (૨૧) તાલુકાઓના કુલ ૨૪૨ ગામોની સત્તાવાર માહિતી.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="ગામનું નામ શોધો (દા.ત. જગાણા, છાપી, ભીલડી, બાદરપુરા)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
        </div>
      </div>

      {/* Taluka Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
        <button
          type="button"
          onClick={() => setSelectedTalukaTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            selectedTalukaTab === 'all'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          બધા ગામો (All 242)
        </button>

        {talukas.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTalukaTab(t.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedTalukaTab === t.id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {t.nameGu} ({t.gams?.length || 0})
          </button>
        ))}
      </div>

      {/* Gam Cards Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <span className="text-sm font-bold text-stone-800">
            મળેલ ગામો: <span className="text-orange-600">{filteredGams.length}</span>
          </span>
          <span className="text-xs text-stone-500">ગામ પર ક્લિક કરીને તે ગામના બાયોડેટા જુઓ</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredGams.map((g) => (
            <Link
              key={g.id}
              to={`/biodata?gamId=${g.id}&talukaId=${g.talukaId}`}
              className="group p-3 rounded-xl border border-stone-100 hover:border-orange-300 bg-stone-50/60 hover:bg-orange-50/40 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-orange-600 block">
                  #{g.orderNo || g.id}
                </span>
                <span className="text-sm font-extrabold text-stone-900 group-hover:text-orange-700 transition-colors block">
                  {g.nameGu}
                </span>
                <span className="text-[11px] text-stone-500 block truncate">{g.nameEn}</span>
              </div>
              <div className="mt-2 pt-1 border-t border-stone-200/60 text-[10px] text-stone-400 group-hover:text-orange-600 flex items-center justify-between">
                <span>{g.talukaNameGu}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
