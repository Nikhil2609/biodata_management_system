import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginAdmin, clearAuthError } from '../../features/auth/authSlice';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Heart } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@biodata.com');
  const [password, setPassword] = useState('Admin@123');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // If already logged in, redirect
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());

    const result = await dispatch(loginAdmin({ identifier, password }));
    if (loginAdmin.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            સંચાલક લૉગિન (Admin Login)
          </h2>
          <p className="text-xs text-stone-500">
            શ્રી ધાણધાર પંચાલ સેવા સમાજ બાયોડેટા સંચાલન પ્રણાલી
          </p>
        </div>

        {/* Demo Credentials Alert */}
        <div className="p-3.5 bg-orange-50/80 border border-orange-200 rounded-2xl text-xs text-orange-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-orange-800">
            <ShieldCheck className="w-4 h-4" />
            <span>પ્રારંભિક એડમિન વિગતો (Default Credentials):</span>
          </div>
          <div>ઈમેઇલ: <span className="font-mono font-bold">admin@biodata.com</span></div>
          <div>પાસવર્ડ: <span className="font-mono font-bold">Admin@123</span></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              ઈમેઇલ અથવા યુઝરનેમ (Email / Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@biodata.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              પાસવર્ડ (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <span>{loading ? 'ચકાસણી ચાલુ છે...' : 'સુરક્ષિત લૉગિન કરો (Login)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-stone-500 hover:text-orange-600 font-medium transition-colors">
            ← સામાન્ય વેબસાઇટ પર પાછા જાઓ (Return to Public Site)
          </Link>
        </div>
      </div>
    </div>
  );
};
