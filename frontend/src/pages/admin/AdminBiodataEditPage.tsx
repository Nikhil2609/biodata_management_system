import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BiodataForm } from '../../features/biodata/BiodataForm';
import { biodataService } from '../../services/biodataService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Biodata } from '../../types/biodata.types';
import { Camera, Check, Trash2 } from 'lucide-react';

export const AdminBiodataEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<Biodata | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRecord = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await biodataService.getAdminDetail(Number(id));
      setInitialData(data);
    } catch (err: any) {
      setErrorMsg('બાયોડેટા રેકોર્ડ લોડ થઈ શક્યો નહીં.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const handleSubmit = async (values: any, newPhotos?: File[]) => {
    if (!id) return;
    try {
      setSaving(true);
      setErrorMsg(null);

      await biodataService.updateBiodata(Number(id), values);

      if (newPhotos && newPhotos.length > 0) {
        const formData = new FormData();
        newPhotos.forEach((file) => {
          formData.append('photos', file);
        });
        await biodataService.uploadPhotos(Number(id), formData);
      }

      navigate('/admin/biodata');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'બાયોડેટા અપડેટ કરવામાં ક્ષતિ આવી છે.');
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimaryPhoto = async (photoId: number) => {
    if (!id) return;
    try {
      await biodataService.setPrimaryPhoto(Number(id), photoId);
      await fetchRecord();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!id) return;
    try {
      await biodataService.deletePhoto(Number(id), photoId);
      await fetchRecord();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="બાયોડેટા સંપાદન ફોર્મ લોડ થઈ રહ્યું છે..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-shake">
          {errorMsg}
        </div>
      )}

      {/* Existing Photos Manager */}
      {initialData?.photos && initialData.photos.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
            હાલના અપલોડ કરેલ ફોટોઝ (Current Photos)
          </h3>
          <div className="flex flex-wrap gap-4">
            {initialData.photos.map((p) => (
              <div
                key={p.id}
                className={`relative w-28 h-28 rounded-xl overflow-hidden border-2 shadow-xs group ${
                  p.isPrimary ? 'border-orange-600 ring-2 ring-orange-200' : 'border-stone-200'
                }`}
              >
                <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />

                {p.isPrimary ? (
                  <span className="absolute bottom-1 left-1 right-1 text-center bg-orange-600 text-white text-[9px] font-bold py-0.5 rounded">
                    મુખ્ય ફોટો (Primary)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryPhoto(p.id)}
                    className="absolute bottom-1 left-1 right-1 text-center bg-black/75 hover:bg-orange-600 text-white text-[9px] font-bold py-0.5 rounded transition-colors"
                  >
                    મુખ્ય બનાવો
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeletePhoto(p.id)}
                  title="Delete Photo"
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {initialData && (
        <BiodataForm
          initialValues={initialData}
          onSubmit={handleSubmit}
          isLoading={saving}
          isEdit
        />
      )}
    </div>
  );
};
