import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logoutAdmin } from '../features/auth/authSlice';
import { Heart, Search, Users, ShieldCheck, LogOut, Menu, X, Home, MapPin, PlusCircle, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate('/');
  };

  const navLinks = [
    { name: 'મુખ્ય પૃષ્ઠ (Home)', path: '/', icon: Home },
    { name: 'બાયોડેટા શોધો (Browse)', path: '/biodata', icon: Search },
    { name: 'યુવકો (Boys)', path: '/biodata?gender=boy', icon: Users },
    { name: 'યુવતીઓ (Girls)', path: '/biodata?gender=girl', icon: Heart },
    { name: 'ગામોની યાદી (Gams)', path: '/gams-list', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Auspicious Cultural Ribbon */}
      <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-amber-700 text-white text-[11px] font-bold py-1 px-4 text-center tracking-widest shadow-inner">
        ॥ શ્રી ગણેશાય નમઃ ॥ ઉત્તર ગુજરાત પાટીદાર પંચાલ સેવા સમાજ — લગ્ન બાયોડેટા પોર્ટલ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
                <span className="text-orange-600">શ્રી ધાણધાર</span> પંચાલ સેવા સમાજ
              </div>
              <div className="text-[11px] font-semibold text-stone-500 tracking-wide">
                લગ્ન સંબંધ મંચ (Marriage Biodata Portal)
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-orange-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  <span>એડમિન પેનલ (Dashboard)</span>
                </Link>

                <Link
                  to="/admin/biodata/new"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>નવો બાયોડેટા (Add)</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200/80 rounded-xl transition-all shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                <span>સંચાલક લૉગિન (Admin)</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
              >
                <Icon className="w-4 h-4 text-orange-500" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-stone-800 bg-stone-100 rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                  <span>એડમિન પેનલ (Admin Dashboard)</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-4 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>લૉગ આઉટ (Log Out)</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-orange-600 rounded-xl shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>સંચાલક લૉગિન (Admin Login)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
