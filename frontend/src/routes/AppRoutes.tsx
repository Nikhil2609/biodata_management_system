import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/public/HomePage';
import { BiodataListingPage } from '../pages/public/BiodataListingPage';
import { BiodataDetailPage } from '../pages/public/BiodataDetailPage';
import { GamsListPage } from '../pages/public/GamsListPage';
import { AboutPage } from '../pages/public/AboutPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminBiodataListPage } from '../pages/admin/AdminBiodataListPage';
import { AdminBiodataAddPage } from '../pages/admin/AdminBiodataAddPage';
import { AdminBiodataEditPage } from '../pages/admin/AdminBiodataEditPage';
import { AdminMasterDataPage } from '../pages/admin/AdminMasterDataPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/biodata" element={<BiodataListingPage />} />
      <Route path="/biodata/:id" element={<BiodataDetailPage />} />
      <Route path="/gams-list" element={<GamsListPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Pages */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/biodata"
        element={
          <ProtectedRoute>
            <AdminBiodataListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/biodata/new"
        element={
          <ProtectedRoute>
            <AdminBiodataAddPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/biodata/edit/:id"
        element={
          <ProtectedRoute>
            <AdminBiodataEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/master-data"
        element={
          <ProtectedRoute>
            <AdminMasterDataPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
