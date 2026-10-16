import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchAdminBiodata,
  setAdminFilters,
  toggleBiodataStatus,
  deleteBiodataRecord,
} from '../../features/biodata/biodataSlice';
import { TalukaGamSelect } from '../../features/gams/TalukaGamSelect';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Search,
  PlusCircle,
  Trash2,
  Edit,
  Eye,
  Filter,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const AdminBiodataListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminList, adminPagination, adminFilters, loading, successMessage, error } =
    useAppSelector((state) => state.biodata);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminBiodata(adminFilters));
  }, [dispatch, adminFilters]);

  const handleFilterChange = (updates: any) => {
    dispatch(setAdminFilters({ ...updates, page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(
      setAdminFilters({
        status: '',
        gender: '',
        talukaId: '',
        gamId: '',
        search: '',
        page: 1,
      })
    );
  };

  const handleToggleStatus = (id: number, currentStatus: 'enabled' | 'disabled') => {
    const nextStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    dispatch(toggleBiodataStatus({ id, status: nextStatus }));
  };

  const confirmDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (deleteTargetId) {
      await dispatch(deleteBiodataRecord(deleteTargetId));
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            બાયોડેટા વ્યવસ્થાપન (Biodata Management)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            સમાજના તમામ યુવક-યુવતીઓના બાયોડેટા સંપાદન, સક્રિયકરણ અને વિગતો
          </p>
        </div>

        <Link
          to="/admin/biodata/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>નવો બાયોડેટા ઉમેરો (Add New)</span>
        </Link>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Admin Filters Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
            <Filter className="w-4 h-4 text-orange-600" />
            <span>ફિલ્ટર નિયંત્રણો (Filter Controls)</span>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-orange-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>રીસેટ (Reset)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Keyword search */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-stone-600">નામ / રજી. નંબર / ફોન શોધો</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="નામ અથવા Reg No લખો..."
                value={adminFilters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">જાતિ (Gender)</label>
            <select
              value={adminFilters.gender || ''}
              onChange={(e) => handleFilterChange({ gender: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
            >
              <option value="">બધા (All)</option>
              <option value="boy">યુવક (Boy)</option>
              <option value="girl">યુવતી (Girl)</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600">સ્થિતિ (Status)</label>
            <select
              value={adminFilters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500"
            >
              <option value="">બધી સ્થિતિ (All)</option>
              <option value="enabled">સક્રિય (Enabled Only)</option>
              <option value="disabled">નિષ્ક્રિય (Disabled Only)</option>
            </select>
          </div>
        </div>

        {/* Dependent Taluka & Gam */}
        <TalukaGamSelect
          selectedTalukaId={adminFilters.talukaId || ''}
          selectedGamId={adminFilters.gamId || ''}
          onTalukaChange={(talukaId) => handleFilterChange({ talukaId, gamId: '' })}
          onGamChange={(gamId) => handleFilterChange({ gamId })}
        />
      </div>

      {/* BIODATA TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="બાયોડેટા રેકોર્ડ્સ લોડ થઈ રહ્યા છે..." />
        ) : adminList.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-2">
            <p className="font-bold">કોઈ રેકોર્ડ મળ્યો નથી.</p>
            <button
              onClick={handleResetFilters}
              className="text-xs text-orange-600 font-semibold underline"
            >
              ફિલ્ટર્સ સાફ કરો
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">ફોટો / નામ</th>
                  <th className="px-6 py-3.5">જાતિ</th>
                  <th className="px-6 py-3.5">ઉંમર (Age)</th>
                  <th className="px-6 py-3.5">ગામ / તાલુકો</th>
                  <th className="px-6 py-3.5">શિક્ષણ / નોકરી</th>
                  <th className="px-6 py-3.5">સંપર્ક વ્યક્તિ / ફોન</th>
                  <th className="px-6 py-3.5">સ્થિતિ (Status)</th>
                  <th className="px-6 py-3.5 text-right">ક્રિયાઓ (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {adminList.map((item) => {
                  const primaryPhoto =
                    item.photos?.find((p) => p.isPrimary) || item.photos?.[0];
                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                          {primaryPhoto ? (
                            <img
                              src={primaryPhoto.photoUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-stone-400">
                              {item.gender === 'boy' ? '👦' : '👧'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-stone-900 text-sm">
                            {item.fullNameGu || item.fullName}
                          </div>
                          {item.fullNameGu && (
                            <div className="text-[11px] text-stone-500">{item.fullName}</div>
                          )}
                          <div className="text-[10px] text-orange-600 font-mono font-bold">
                            {item.registrationNo}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            item.gender === 'boy'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.gender === 'boy' ? 'યુવક' : 'યુવતી'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-stone-800">
                        {item.age} વર્ષ
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-900">
                          {item.gam?.nameGu} ({item.gam?.nameEn})
                        </div>
                        <div className="text-[11px] text-stone-500">
                          તા. {item.taluka?.nameGu}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-stone-900">{item.education}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[160px]">
                          {item.occupationTitle}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-800">{item.contactPerson}</div>
                        <div className="text-[11px] font-mono text-stone-500">
                          {item.contactNumber}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={item.status}
                          interactive
                          onClick={() => handleToggleStatus(item.id, item.status)}
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/biodata/${item.id}`}
                            title="Public Preview"
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/biodata/edit/${item.id}`}
                            title="Edit Record"
                            className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => confirmDelete(item.id)}
                            title="Delete Record"
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-stone-100">
          <Pagination
            meta={adminPagination}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="બાયોડેટા ડિલીટ કરવાની ખાતરી"
        message="શું તમે ખરેખર આ બાયોડેટા રેકોર્ડ રદ કરવા માંગો છો? આ ક્રિયા પછી તે જાહેર સાઇટ પર દેખાશે નહીં."
        confirmText="હા, ડિલીટ કરો (Delete)"
        cancelText="ના, રદ કરો (Cancel)"
        isDestructive
        onConfirm={executeDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
