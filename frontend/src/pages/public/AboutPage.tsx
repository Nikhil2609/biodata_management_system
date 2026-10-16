import React from 'react';
import { Heart, ShieldCheck, Users, MapPin, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <Heart className="w-4 h-4 text-orange-600" />
          <span>સમાજ સેવા અને લગ્ન સંબંધ મંચ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          શ્રી ધાણધાર પાટીદાર પંચાલ સેવા સમાજ
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto">
          ઉત્તર ગુજરાતના પાટણ અને બનાસકાંઠા જિલ્લાના વિવિધ તાલુકાઓમાં વસતા પંચાલ સમાજના પરિવારો વચ્ચે પારિવારિક સંબંધો સુદ્રઢ કરવા માટેનું અધિકૃત પ્લેટફોર્મ.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
          ધ્યેય અને ઉદ્દેશ્યો (Our Mission)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-orange-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>વિશ્વસનીય અને પારદર્શક માહિતી</span>
            </h3>
            <p>
              સમાજના દરેક દીકરા-દીકરી માટે સાચી, ચકાસાયેલી અને સંપૂર્ણ માહિતી ઉપલબ્ધ કરાવવી, જેથી પરિવારો કોઈપણ સંકોચ વગર યોગ્ય નિર્ણય લઈ શકે.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm text-orange-950 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>મૂળ વતન અને ગામની ઓળખ</span>
            </h3>
            <p>
              સમાજની પત્રિકા મુજબ ઉત્તર ગુજરાતના ૮ તાલુકાઓ અને ૨૪૨ ગામોની વિગતોને આધારે સમાજબંધુઓને પોતાના ગામ અને મોસાળ પક્ષની સાચી વિગતો દર્શાવવી.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 space-y-3">
          <h3 className="text-base font-bold text-stone-900">
            સમાજના મુખ્ય નિયમો અને માર્ગદર્શિકા (Guidelines)
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600 leading-relaxed">
            <li>આ પોર્ટલ પર માત્ર પાટીદાર પંચાલ સેવા સમાજના યોગ્ય ઉમેદવારોના બાયોડેટા રાખવામાં આવે છે.</li>
            <li>કોઈપણ વ્યક્તિની અંગત માહિતીની ગોપનીયતા જાળવવી એ સંચાલક મંડળની પ્રાથમિકતા છે.</li>
            <li>સગાઈ કે લગ્ન નક્કી થયા બાદ સંચાલક મંડળને જાણ કરીને બાયોડેટા નિષ્ક્રિય કરાવવો જરૂરી છે.</li>
            <li>કોઈપણ પ્રકારની અયોગ્ય અથવા બનાવટી માહિતી આપનાર સામે સમાજના નિયમાનુસાર પગલાં લેવાશે.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
