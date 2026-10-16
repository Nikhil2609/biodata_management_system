import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiodataForm } from '../../features/biodata/BiodataForm';
import { biodataService } from '../../services/biodataService';

export const AdminBiodataAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (values: any, photos?: File[]) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // 1. Create biodata record
      const created = await biodataService.createBiodata(values);

      // 2. Upload photos if any selected
      if (photos && photos.length > 0) {
        const formData = new FormData();
        photos.forEach((file) => {
          formData.append('photos', file);
        });
        await biodataService.uploadPhotos(created.id, formData);
      }

      navigate('/admin/biodata');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'બાયોડેટા સાચવવામાં ક્ષતિ આવી છે.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-shake">
          {errorMsg}
        </div>
      )}

      <BiodataForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};
