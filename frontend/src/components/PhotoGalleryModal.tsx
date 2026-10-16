import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BiodataPhoto } from '../types/biodata.types';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  photos: BiodataPhoto[];
  initialIndex?: number;
  onClose: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  photos,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main photo container */}
      <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center">
        <img
          src={currentPhoto.photoUrl}
          alt={`Photo ${currentIndex + 1}`}
          className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
        />

        {/* Navigation buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/75 rounded-full transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/75 rounded-full transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="flex items-center gap-2 mt-4 overflow-x-auto py-2 px-4 max-w-full">
            {photos.map((p, idx) => (
              <button
                key={p.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  idx === currentIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.photoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
