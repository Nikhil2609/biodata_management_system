import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchPublicBiodata, setPublicFilters, resetPublicFilters } from '../../features/biodata/biodataSlice';
import { BiodataFilter } from '../../features/biodata/BiodataFilter';
import { BiodataCard } from '../../components/BiodataCard';
import { Pagination } from '../../components/Pagination';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BiodataFilterQuery } from '../../types/biodata.types';
import { Heart, SearchX } from 'lucide-react';

export const BiodataListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { publicList, publicPagination, publicFilters, loading } = useAppSelector(
    (state) => state.biodata
  );

  // Sync from URL search params into Redux on initial load or URL change
  useEffect(() => {
    const urlFilters: Partial<BiodataFilterQuery> = {};
    const gender = searchParams.get('gender') as any;
    const talukaId = searchParams.get('talukaId');
    const gamId = searchParams.get('gamId');
    const search = searchParams.get('search');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');

    if (gender) urlFilters.gender = gender;
    if (talukaId) urlFilters.talukaId = Number(talukaId);
    if (gamId) urlFilters.gamId = Number(gamId);
    if (search) urlFilters.search = search;
    if (minAge) urlFilters.minAge = Number(minAge);
    if (maxAge) urlFilters.maxAge = Number(maxAge);
    if (sort) urlFilters.sort = sort;
    if (page) urlFilters.page = Number(page);

    dispatch(setPublicFilters(urlFilters));
  }, [searchParams, dispatch]);

  // Fetch from backend when publicFilters changes
  useEffect(() => {
    dispatch(fetchPublicBiodata(publicFilters));
  }, [dispatch, publicFilters]);

  // Update URL search parameters when filters change
  const handleFilterChange = (newFilters: Partial<BiodataFilterQuery>) => {
    const merged = { ...publicFilters, ...newFilters };
    dispatch(setPublicFilters(newFilters));

    const params = new URLSearchParams();
    if (merged.gender) params.set('gender', merged.gender);
    if (merged.talukaId) params.set('talukaId', String(merged.talukaId));
    if (merged.gamId) params.set('gamId', String(merged.gamId));
    if (merged.search) params.set('search', merged.search);
    if (merged.minAge) params.set('minAge', String(merged.minAge));
    if (merged.maxAge) params.set('maxAge', String(merged.maxAge));
    if (merged.sort) params.set('sort', merged.sort);
    if (merged.page && merged.page > 1) params.set('page', String(merged.page));

    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    dispatch(resetPublicFilters());
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            લગ્ન બાયોડેટા યાદી (Browse Biodata Records)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            ગામ, તાલુકો, ઉંમર અથવા શિક્ષણ મુજબ યોગ્ય સંબંધો શોધો.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">
            કુલ સક્રિય બાયોડેટા:{' '}
            <span className="text-orange-600 font-extrabold text-sm">{publicPagination.total}</span>
          </span>
        </div>
      </div>

      {/* Filter Component */}
      <BiodataFilter
        filters={publicFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={publicPagination.total}
      />

      {/* Biodata Cards Grid / Loading / Empty State */}
      {loading ? (
        <LoadingSpinner text="બાયોડેટા રેકોર્ડ્સ લોડ થઈ રહ્યા છે..." />
      ) : publicList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">કોઈ મેળ મળ્યો નથી (No Biodata Found)</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            તમે પસંદ કરેલ ફિલ્ટર્સ (ગામ, તાલુકો અથવા ઉંમર) અનુસાર કોઈ બાયોડેટા ઉપલબ્ધ નથી. કૃપા કરીને ફિલ્ટર્સ બદલીને અથવા રીસેટ કરીને ફરી પ્રયત્ન કરો.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-700 transition-colors"
          >
            તમામ ફિલ્ટર્સ રીસેટ કરો (Clear All Filters)
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicList.map((b) => (
              <BiodataCard key={b.id} biodata={b} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination meta={publicPagination} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};
