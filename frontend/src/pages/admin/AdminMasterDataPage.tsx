import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTalukas } from '../../features/gams/gamSlice';
import { masterService } from '../../services/masterService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { MapPin, Building2, Plus, Search, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminMasterDataPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { talukas, loadingTalukas } = useAppSelector((state) => state.gams);

  const [selectedTalukaId, setSelectedTalukaId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New Gam form state
  const [newGamTalukaId, setNewGamTalukaId] = useState<number | ''>('');
  const [newGamNameGu, setNewGamNameGu] = useState('');
  const [newGamNameEn, setNewGamNameEn] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTalukas());
  }, [dispatch]);

  // Set default selected taluka once loaded
  useEffect(() => {
    if (talukas.length > 0 && selectedTalukaId === null) {
      setSelectedTalukaId(talukas[0].id);
    }
  }, [talukas, selectedTalukaId]);

  const activeTaluka = talukas.find((t) => t.id === selectedTalukaId);

  const filteredGams = (activeTaluka?.gams || []).filter(
    (g) =>
      g.nameGu.toLowerCase().includes(search.toLowerCase()) ||
      g.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddGam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGamTalukaId || !newGamNameGu || !newGamNameEn) {
      setErrorMsg('તમામ વિગતો ભરવી ફરજિયાત છે.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await masterService.createGam({
        talukaId: Number(newGamTalukaId),
        nameGu: newGamNameGu.trim(),
        nameEn: newGamNameEn.trim(),
      });

      setMessage('ગામ સફળતાપૂર્વક ઉમેરાયું!');
      setNewGamNameGu('');
      setNewGamNameEn('');
      setModalOpen(false);
      dispatch(fetchTalukas()); // Refresh list
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'ગામ ઉમેરવામાં ભૂલ આવી.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            ગામ અને તાલુકા માસ્ટર ડેટા (Master Data)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            સમાજ પત્રિકા મુજબ ઉત્તર ગુજરાતના ૮ તાલુકાઓના ૨૪૨ અધિકૃત ગામોની યાદી
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewGamTalukaId(selectedTalukaId || '');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>નવું ગામ ઉમેરો (Add Gam)</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loadingTalukas ? (
        <LoadingSpinner text="માસ્ટર ડેટા લોડ થઈ રહ્યો છે..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Taluka Selector Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2">
              તાલુકા યાદી (Select Taluka)
            </h3>
            <div className="space-y-1">
              {talukas.map((t) => {
                const isSelected = t.id === selectedTalukaId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTalukaId(t.id);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-600'}`} />
                      <div>
                        <div>{t.nameGu} ({t.nameEn})</div>
                        <div className={`text-[10px] font-normal ${isSelected ? 'text-orange-100' : 'text-stone-400'}`}>
                          જિલ્લો: {t.districtGu}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {t.gams?.length || 0} ગામ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gams List in Active Taluka (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900">
                  {activeTaluka?.nameGu} તાલુકાના ગામો ({activeTaluka?.nameEn})
                </h3>
                <p className="text-xs text-stone-500">
                  કુલ ગામ: {activeTaluka?.gams?.length || 0} • જિલ્લો: {activeTaluka?.districtGu} ({activeTaluka?.district})
                </p>
              </div>

              {/* Search inside selected taluka */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="ગામ શોધો..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Village Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredGams.map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-200/60 text-xs"
                >
                  <div className="text-[10px] text-orange-600 font-bold">#{g.orderNo || g.id}</div>
                  <div className="font-extrabold text-stone-900 mt-0.5">{g.nameGu}</div>
                  <div className="text-[11px] text-stone-500 truncate">{g.nameEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Gam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-stone-100">
            <h3 className="text-lg font-bold text-stone-900">નવું ગામ ઉમેરો (Add New Gam)</h3>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddGam} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">તાલુકો પસંદ કરો</label>
                <select
                  value={newGamTalukaId}
                  onChange={(e) => setNewGamTalukaId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">-- પસંદ કરો --</option>
                  {talukas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nameGu} ({t.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">ગામનું નામ ગુજરાતીમાં (Gujarati)</label>
                <input
                  type="text"
                  placeholder="દા.ત. જગાણા"
                  value={newGamNameGu}
                  onChange={(e) => setNewGamNameGu(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">ગામનું નામ અંગ્રેજીમાં (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Jagana"
                  value={newGamNameEn}
                  onChange={(e) => setNewGamNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-orange-600 rounded-xl hover:bg-orange-700 shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'સાચવી રહ્યું છે...' : 'સાચવો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
