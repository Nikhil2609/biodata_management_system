import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboardStats, toggleBiodataStatus } from '../../features/biodata/biodataSlice';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  Heart,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Layers,
  MapPin,
  ArrowRight,
  TrendingUp,
  Eye,
  Edit,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dashboardStats, loading } = useAppSelector((state) => state.biodata);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleToggleStatus = (id: number, currentStatus: 'enabled' | 'disabled') => {
    const nextStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    dispatch(toggleBiodataStatus({ id, status: nextStatus })).then(() => {
      dispatch(fetchDashboardStats());
    });
  };

  if (loading && !dashboardStats) {
    return <LoadingSpinner text="ડેશબોર્ડ માહિતી લોડ થઈ રહી છે..." />;
  }

  const counts = dashboardStats?.counts || {
    totalBiodata: 0,
    totalBoys: 0,
    totalGirls: 0,
    totalEnabled: 0,
    totalDisabled: 0,
    totalTalukas: 8,
    totalGams: 242,
  };

  const recentList = dashboardStats?.recentBiodata || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            સંચાલક ડેશબોર્ડ (Admin Dashboard)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            શ્રી ધાણધાર પંચાલ સેવા સમાજ - બાયોડેટા અને માસ્ટર ડેટા આંકડાકીય માહિતી
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/admin/master-data"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>ગામ/તાલુકા માસ્ટર ડેટા</span>
          </Link>

          <Link
            to="/admin/biodata/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>નવો બાયોડેટા ઉમેરો</span>
          </Link>
        </div>
      </div>

      {/* STATS CARDS GRID - Actual DB Values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Boys */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              કુલ યુવકો (Boys)
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              👦
            </div>
          </div>
          <div className="text-3xl font-black text-blue-600">{counts.totalBoys}</div>
          <p className="text-[11px] text-stone-400">સક્રિય અને નિષ્ક્રિય યુવકો</p>
        </div>

        {/* Total Girls */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              કુલ યુવતીઓ (Girls)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
              👧
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{counts.totalGirls}</div>
          <p className="text-[11px] text-stone-400">સક્રિય અને નિષ્ક્રિય યુવતીઓ</p>
        </div>

        {/* Total Enabled */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              સક્રિય બાયોડેટા (Enabled)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">{counts.totalEnabled}</div>
          <p className="text-[11px] text-stone-400">જાહેર વેબસાઇટ પર દેખાતા</p>
        </div>

        {/* Total Disabled */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
              નિષ્ક્રિય (Disabled)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600">{counts.totalDisabled}</div>
          <p className="text-[11px] text-stone-400">જાહેર વેબસાઇટથી છુપાયેલ</p>
        </div>
      </div>

      {/* Second Row: Master Data counts summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-orange-950">કુલ બાયોડેટા રેકોર્ડ્સ</div>
            <div className="text-2xl font-black text-orange-700">{counts.totalBiodata}</div>
          </div>
          <Layers className="w-8 h-8 text-orange-400" />
        </div>

        <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-800">અધિકૃત તાલુકાઓ (Talukas)</div>
            <div className="text-2xl font-black text-stone-900">{counts.totalTalukas} તાલુકા</div>
          </div>
          <MapPin className="w-8 h-8 text-stone-400" />
        </div>

        <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-800">સમાજના માન્ય ગામો (Gams)</div>
            <div className="text-2xl font-black text-stone-900">{counts.totalGams} ગામો</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-stone-400" />
        </div>
      </div>

      {/* RECENTLY ADDED BIODATA TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              તાજેતરમાં ઉમેરેલ બાયોડેટા (Recently Added Biodata)
            </h2>
            <p className="text-xs text-stone-500">
              છેલ્લા ઉમેરાયેલ રેકોર્ડ્સ અને તેમની સ્થિતિ
            </p>
          </div>

          <Link
            to="/admin/biodata"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>તમામ રેકોર્ડ્સ જુઓ (View All)</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-6 py-3.5">પ્રોફાઇલ / નામ</th>
                <th className="px-6 py-3.5">જાતિ (Gender)</th>
                <th className="px-6 py-3.5">ઉંમર (Age)</th>
                <th className="px-6 py-3.5">ગામ / તાલુકો</th>
                <th className="px-6 py-3.5">શિક્ષણ / વ્યવસાય</th>
                <th className="px-6 py-3.5">સ્થિતિ (Status)</th>
                <th className="px-6 py-3.5 text-right">ક્રિયાઓ (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentList.map((item: any) => {
                const primaryPhoto = item.photos?.find((p: any) => p.isPrimary) || item.photos?.[0];
                return (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        {primaryPhoto ? (
                          <img
                            src={primaryPhoto.photoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stone-400">
                            {item.gender === 'boy' ? '👦' : '👧'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-stone-900 text-sm">
                          {item.fullNameGu || item.fullName}
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono">
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

                    <td className="px-6 py-4 font-semibold text-stone-800">
                      {item.age} વર્ષ
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{item.gam?.nameGu || '—'}</div>
                      <div className="text-[11px] text-stone-500">{item.taluka?.nameGu || '—'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{item.education}</div>
                      <div className="text-[11px] text-stone-500">{item.occupationTitle}</div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={item.status}
                        interactive
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/biodata/${item.id}`}
                          title="View Details"
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/biodata/edit/${item.id}`}
                          title="Edit Biodata"
                          className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
