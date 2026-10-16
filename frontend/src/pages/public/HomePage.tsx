import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPublicBiodata, fetchDashboardStats } from '../../features/biodata/biodataSlice';
import { fetchTalukas } from '../../features/gams/gamSlice';
import { TalukaGamSelect } from '../../features/gams/TalukaGamSelect';
import { BiodataCard } from '../../components/BiodataCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Heart,
  Search,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Phone,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { publicList, loading, dashboardStats } = useAppSelector((state) => state.biodata);
  const { talukas } = useAppSelector((state) => state.gams);

  // Quick search state
  const [quickGender, setQuickGender] = useState<'boy' | 'girl' | ''>('');
  const [quickTalukaId, setQuickTalukaId] = useState<number | ''>('');
  const [quickGamId, setQuickGamId] = useState<number | ''>('');
  const [quickSearchText, setQuickSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchPublicBiodata({ page: 1, limit: 8, sort: 'newest' }));
    dispatch(fetchDashboardStats());
    dispatch(fetchTalukas());
  }, [dispatch]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (quickGender) queryParams.set('gender', quickGender);
    if (quickTalukaId) queryParams.set('talukaId', String(quickTalukaId));
    if (quickGamId) queryParams.set('gamId', String(quickGamId));
    if (quickSearchText) queryParams.set('search', quickSearchText);

    navigate(`/biodata?${queryParams.toString()}`);
  };

  const boysProfiles = publicList.filter((b) => b.gender === 'boy').slice(0, 4);
  const girlsProfiles = publicList.filter((b) => b.gender === 'girl').slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/80 via-amber-50/30 to-stone-50 pt-10 pb-20 border-b border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-900 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>સંવત ૨૦૮૨ • વર્ષ ૨૦૨૫-૨૦૨૬ પંચાલ સેવા સમાજ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              શ્રી ધાણધાર પાટીદાર પંચાલ સેવા સમાજ
              <span className="block text-2xl sm:text-3xl font-extrabold text-orange-600 mt-2">
                લગ્ન બાયોડેટા પોર્ટલ (North Gujarat)
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
              પાલનપુર, વડગામ, ડીસા, દાંતીવાડા, દાંતા, ધાનેરા, સિદ્ધપુર અને સરસ્વતી તાલુકાઓના કુલ ૨૪૨ ગામોમાં વસતા સમાજના દીકરા-દીકરીઓ માટે ઉત્કૃષ્ટ જીવનસાથી પસંદગીનું પવિત્ર મંચ.
            </p>
          </div>

          {/* QUICK SEARCH WIDGET */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80">
            <form onSubmit={handleQuickSearch} className="space-y-5">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-800 pb-2 border-b border-stone-100">
                <Search className="w-4 h-4 text-orange-600" />
                <span>ઝડપી બાયોડેટા શોધ (Quick Search)</span>
              </div>

              {/* Gender selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setQuickGender('')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    !quickGender
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  બધા (All Profiles)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickGender('boy')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    quickGender === 'boy'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  👦 યોગ્ય યુવકો (Boys)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickGender('girl')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    quickGender === 'girl'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  👧 યોગ્ય યુવતીઓ (Girls)
                </button>
              </div>

              {/* Dependent Taluka & Gam */}
              <TalukaGamSelect
                selectedTalukaId={quickTalukaId}
                selectedGamId={quickGamId}
                onTalukaChange={(talukaId) => setQuickTalukaId(talukaId)}
                onGamChange={(gamId) => setQuickGamId(gamId)}
              />

              {/* Keyword & Submit */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="નામ, શિક્ષણ અથવા અટક લખો... (Keyword)"
                    value={quickSearchText}
                    onChange={(e) => setQuickSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50/60 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>શોધો (Search Profiles)</span>
                </button>
              </div>
            </form>
          </div>

          {/* REAL STATS COUNTER */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
              <div className="text-3xl font-black text-orange-600">
                {dashboardStats?.counts?.totalEnabled || publicList.length || '10+'}
              </div>
              <div className="text-xs font-bold text-stone-600 mt-1">
                કુલ સક્રિય બાયોડેટા (Active Profiles)
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
              <div className="text-3xl font-black text-blue-600">
                {dashboardStats?.counts?.totalBoys || '—'}
              </div>
              <div className="text-xs font-bold text-stone-600 mt-1">
                યોગ્ય યુવકો (Boys)
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
              <div className="text-3xl font-black text-rose-600">
                {dashboardStats?.counts?.totalGirls || '—'}
              </div>
              <div className="text-xs font-bold text-stone-600 mt-1">
                યોગ્ય યુવતીઓ (Girls)
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
              <div className="text-3xl font-black text-emerald-600">
                {dashboardStats?.counts?.totalGams || 242}
              </div>
              <div className="text-xs font-bold text-stone-600 mt-1">
                સમાજના અધિકૃત ગામો (Verified Gams)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENTLY ADDED PROFILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                તાજેતરમાં ઉમેરાયેલ બાયોડેટા (Recently Added)
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              સમાજના તાજેતરના સત્યાપિત યુવક અને યુવતીઓના લગ્ન બાયોડેટા.
            </p>
          </div>

          <Link
            to="/biodata"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
          >
            <span>બધા બાયોડેટા જુઓ (View All)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : publicList.length === 0 ? (
          <div className="py-12 text-center text-stone-500">હાલમાં કોઈ બાયોડેટા ઉપલબ્ધ નથી.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {publicList.slice(0, 8).map((b) => (
              <BiodataCard key={b.id} biodata={b} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/biodata"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <span>બધા બાયોડેટા જુઓ (View All Profiles)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* BOYS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
          <div className="flex items-center justify-between pb-4 border-b border-blue-200/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                👦
              </div>
              <div>
                <h3 className="text-xl font-black text-blue-950 tracking-tight">
                  યોગ્ય યુવકો (Eligible Boys Profiles)
                </h3>
                <p className="text-xs text-blue-700">ઉત્તર ગુજરાતના વિવિધ ગામોના સુશિક્ષિત યુવકો</p>
              </div>
            </div>

            <Link
              to="/biodata?gender=boy"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>વધુ યુવકો જુઓ</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boysProfiles.map((b) => (
              <BiodataCard key={b.id} biodata={b} />
            ))}
          </div>
        </div>
      </section>

      {/* GIRLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-rose-50/50 rounded-3xl border border-rose-100">
          <div className="flex items-center justify-between pb-4 border-b border-rose-200/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                👧
              </div>
              <div>
                <h3 className="text-xl font-black text-rose-950 tracking-tight">
                  યોગ્ય યુવતીઓ (Eligible Girls Profiles)
                </h3>
                <p className="text-xs text-rose-700">સમાજની સંસ્કારી અને સુશિક્ષિત યુવતીઓ</p>
              </div>
            </div>

            <Link
              to="/biodata?gender=girl"
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
            >
              <span>વધુ યુવતીઓ જુઓ</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {girlsProfiles.map((b) => (
              <BiodataCard key={b.id} biodata={b} />
            ))}
          </div>
        </div>
      </section>

      {/* SAMAJ VILLAGE MAP & TALUKAS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/30 border border-orange-500/40 text-orange-400 rounded-full text-xs font-bold">
              <MapPin className="w-4 h-4" />
              <span>અધિકૃત ગામ યાદી (Official Document List)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              ઉત્તર ગુજરાતના ૮ તાલુકાઓના કુલ ૨૪૨ ગામોનો સમાવેશ
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              અમારા પોર્ટલ પર દર્શાવેલ તમામ ગામો અને તાલુકાઓની વિગતો સમાજ દ્વારા અધિકૃત પ્રકાશિત પત્રિકામાંથી અક્ષરશઃ સ્વીકારેલ છે. કોઈપણ બનાવટી ગામ કે માહિતી ઉમેરવામાં આવતી નથી.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {[
                { name: 'પાલનપુર', count: '૭૭' },
                { name: 'વડગામ', count: '૭૪' },
                { name: 'ડીસા', count: '૨૭' },
                { name: 'દાંતીવાડા', count: '૧૫' },
                { name: 'દાંતા', count: '૩' },
                { name: 'ધાનેરા', count: '૧' },
                { name: 'સિદ્ધપુર', count: '૨૪' },
                { name: 'સરસ્વતી', count: '૨૧' },
              ].map((t) => (
                <div key={t.name} className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="text-base font-bold text-white">{t.name}</div>
                  <div className="text-xs text-orange-400">{t.count} ગામો (Gams)</div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/gams-list"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-md"
              >
                <span>તમામ ૨૪૨ ગામોની યાદી જુઓ (View Complete 242 Gam Directory)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SAMAJ GUIDELINES & ABOUT US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">૧૦૦% ચકાસાયેલ પ્રોફાઇલ્સ</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              તમામ બાયોડેટા સંચાલક મંડળ દ્વારા ચકાસણી બાદ જ સક્રિય કરવામાં આવે છે જેથી સમાજના પરિવારોને સાચી વિગતો મળે.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">સમાજની પરંપરાનું સન્માન</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              મૂળ વતન (ગામ), મોસાળ પક્ષ, કૌટુંબિક પૃષ્ઠભૂમિ અને વ્યવસાયિક સફળતા જેવી તમામ આવશ્યક માહિતી એક જ સ્થાને.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">સીધો પારિવારિક સંપર્ક</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              કોઈ વચેટિયા કે એજન્ટ વગર સીધા પરિવારના વડીલો સાથે ટેલિફોનિક અથવા WhatsApp દ્વારા વાતચીત કરી શકાય છે.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
