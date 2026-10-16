import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          {/* Column 1: Samaj Intro */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                શ્રી ધાણધાર પંચાલ સેવા સમાજ
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              ઉત્તર ગુજરાતના પાલનપુર, વડગામ, ડીસા, દાંતીવાડા, દાંતા, ધાનેરા, સિદ્ધપુર અને સરસ્વતી તાલુકાઓમાં વસતા પાટીદાર પંચાલ સેવા સમાજના સર્વે પરિવારોનું અધિકૃત લગ્ન સંબંધ મંચ.
            </p>
            <div className="pt-2 text-[11px] text-orange-400 font-semibold tracking-wide">
              સંવત ૨૦૮૨ • વર્ષ ૨૦૨૫-૨૦૨૬
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              ઝડપી લિંક્સ (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">
                  મુખ્ય પૃષ્ઠ (Home)
                </Link>
              </li>
              <li>
                <Link to="/biodata?gender=boy" className="hover:text-orange-400 transition-colors">
                  યોગ્ય યુવકોના બાયોડેટા (Eligible Boys)
                </Link>
              </li>
              <li>
                <Link to="/biodata?gender=girl" className="hover:text-orange-400 transition-colors">
                  યોગ્ય યુવતીઓના બાયોડેટા (Eligible Girls)
                </Link>
              </li>
              <li>
                <Link to="/gams-list" className="hover:text-orange-400 transition-colors">
                  સમાજના તમામ ગામોની યાદી (242 Gams)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition-colors">
                  સમાજ વિશે અને નિયમો (About Us)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Talukas Represented */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              સમાજના તાલુકાઓ (Our Talukas)
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-400">
              {['પાલનપુર (૭૭)', 'વડગામ (૭૪)', 'ડીસા (૨૭)', 'દાંતીવાડા (૧૫)', 'દાંતા (૩)', 'ધાનેરા (૧)', 'સિદ્ધપુર (૨૪)', 'સરસ્વતી (૨૧)'].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-stone-800 rounded-lg text-stone-300 text-[11px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              * તમામ ગામોની માહિતી અધિકૃત પંચાલ સેવા સમાજ પત્રિકા મુજબ સંચાલિત છે.
            </p>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              સંપર્ક સહાય (Samaj Helpdesk)
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>શ્રી ધાણધાર પંચાલ સેવા સમાજ કાર્યાલય, પાલનપુર / સિદ્ધપુર, ઉત્તર ગુજરાત</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>+91 98250 12345 / 94280 67890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>contact@panchalbiodata.com</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>સંચાલક લોગિન (Admin Portal)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & privacy */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © {new Date().getFullYear()} શ્રી ધાણધાર પાટીદાર પંચાલ સેવા સમાજ. સર્વાધિકાર સુરક્ષિત.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-stone-300 transition-colors">
              નિયમો અને શરતો (Terms)
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-stone-300 transition-colors">
              ગોપનીયતા નીતિ (Privacy Policy)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
