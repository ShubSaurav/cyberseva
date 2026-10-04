import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles
} from 'lucide-react';
import { imageProcessing } from '../../services/imageProcessing';
import { Language, translations } from '../../utils/i18n';

interface AadhaarStudioProps {
  onPrint: (previewUrl: string, docName: string) => void;
  language: Language;
}

export const AadhaarStudio: React.FC<AadhaarStudioProps> = ({ onPrint, language }) => {
  const t = translations[language];

  const [selectedCardType, setSelectedCardType] = useState<'aadhaar' | 'pan' | 'voter' | 'ayushman'>('aadhaar');

  const [frontImage, setFrontImage] = useState<string | null>('/tools/aadhaar.jpg');
  const [backImage, setBackImage] = useState<string | null>('/tools/aadhaar.jpg');

  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
  const [maskAadhaar, setMaskAadhaar] = useState(false);
  const [generatedA4Url, setGeneratedA4Url] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    generateA4();
  }, [frontImage, backImage, isBlackAndWhite, maskAadhaar]);

  const generateA4 = async () => {
    if (!frontImage) return;
    setIsRendering(true);
    try {
      const frontEl = await imageProcessing.loadImageFromUrl(frontImage);
      let backEl: HTMLImageElement | null = null;
      if (backImage) {
        backEl = await imageProcessing.loadImageFromUrl(backImage);
      }
      const sheet = await imageProcessing.generateAadhaarA4Layout(
        frontEl,
        backEl,
        isBlackAndWhite,
        maskAadhaar
      );
      setGeneratedA4Url(sheet);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRendering(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBack: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (isBack) setBackImage(ev.target?.result as string);
      else setFrontImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const switchCardType = (type: 'aadhaar' | 'pan' | 'voter' | 'ayushman') => {
    setSelectedCardType(type);
    if (type === 'pan') {
      setFrontImage('/tools/pan.jpg');
      setBackImage('/tools/pan.jpg');
    } else if (type === 'voter') {
      setFrontImage('/tools/voter.jpg');
      setBackImage('/tools/voter.jpg');
    } else if (type === 'ayushman') {
      setFrontImage('/tools/ayushman.jpg');
      setBackImage('/tools/ayushman.jpg');
    } else {
      setFrontImage('/tools/aadhaar.jpg');
      setBackImage('/tools/aadhaar.jpg');
    }
  };

  const loadSampleDoc = () => {
    switchCardType(selectedCardType);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Banner & ID Card Switcher */}
      <div className="clean-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#155EEF] flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#071A52]">
                {selectedCardType === 'pan' ? 'पैन कार्ड स्मार्ट प्रिंट (PAN Card A4 Layout)' :
                 selectedCardType === 'voter' ? 'मतदाता पहचान पत्र प्रिंट (Voter ID A4 Layout)' :
                 selectedCardType === 'ayushman' ? 'आयुष्मान गोल्डन कार्ड प्रिंट (Ayushman A4 Layout)' :
                 t.aadhaarTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.aadhaarSub}
              </p>
            </div>
          </div>

          <button
            onClick={loadSampleDoc}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.testSampleBtn}</span>
          </button>
        </div>

        {/* Card Type Selector Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-500 mr-1 whitespace-nowrap">पहचान पत्र चुनें:</span>
          <button
            onClick={() => switchCardType('aadhaar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCardType === 'aadhaar'
                ? 'bg-[#155EEF] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🪪 आधार कार्ड (Aadhaar)
          </button>
          <button
            onClick={() => switchCardType('pan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCardType === 'pan'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            💳 पैन कार्ड (PAN Card)
          </button>
          <button
            onClick={() => switchCardType('voter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCardType === 'voter'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🗳️ वोटर कार्ड (Voter ID)
          </button>
          <button
            onClick={() => switchCardType('ayushman')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCardType === 'ayushman'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🏥 आयुष्मान कार्ड (PM-JAY)
          </button>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Uploads & 1-Click Toggles (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dual Upload Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Front Upload */}
            <div className="clean-card p-4 text-center border-2 border-dashed border-blue-200 hover:border-blue-400 relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-[11px] font-extrabold text-slate-700 block mb-2">
                {t.frontSideTitle}
              </span>
              {frontImage ? (
                <div className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img src={frontImage} alt="Front" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-28 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <UploadCloud className="w-6 h-6 mb-1 text-[#155EEF]" />
                  <span className="text-[11px] font-bold">{t.choosePhoto}</span>
                </div>
              )}
              <span className="text-[10px] text-[#155EEF] font-bold mt-2 block">
                {t.clickToChange}
              </span>
            </div>

            {/* Back Upload */}
            <div className="clean-card p-4 text-center border-2 border-dashed border-orange-200 hover:border-orange-400 relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-[11px] font-extrabold text-slate-700 block mb-2">
                {t.backSideTitle}
              </span>
              {backImage ? (
                <div className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                  <img src={backImage} alt="Back" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-28 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <UploadCloud className="w-6 h-6 mb-1 text-[#FF6B00]" />
                  <span className="text-[11px] font-bold">{t.choosePhoto}</span>
                </div>
              )}
              <span className="text-[10px] text-[#FF6B00] font-bold mt-2 block">
                {backImage ? t.clickToChange : t.addBackPhoto}
              </span>
            </div>
          </div>

          {/* Simple Toggles */}
          <div className="clean-card p-5 space-y-4">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              {t.printSettings}
            </span>

            {/* Color or B&W */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setIsBlackAndWhite(false)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  !isBlackAndWhite
                    ? 'bg-[#155EEF] text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.colorModeColor}
              </button>
              <button
                onClick={() => setIsBlackAndWhite(true)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                  isBlackAndWhite
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.colorModeBw}
              </button>
            </div>

            {/* Mask Aadhaar Number */}
            <div
              onClick={() => setMaskAadhaar(!maskAadhaar)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                maskAadhaar ? 'bg-blue-50 border-blue-300 text-[#155EEF]' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {maskAadhaar ? <EyeOff className="w-4 h-4 text-[#155EEF]" /> : <Eye className="w-4 h-4 text-slate-400" />}
                <span>{t.maskAadhaarLabel}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${maskAadhaar ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-700'}`}>
                {maskAadhaar ? t.maskActive : t.maskInactive}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              <strong>{t.privacyNoteTitle}</strong> {t.privacyNoteDesc}
            </p>
          </div>
        </div>

        {/* Right Side: Big Clear A4 Sheet Preview & Print Button (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full clean-card p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {t.a4PreviewTitle}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {t.cutGuideBadge}
              </span>
            </div>

            {/* A4 Sheet Preview Container */}
            <div className="w-full bg-slate-200 p-4 rounded-2xl flex items-center justify-center min-h-[460px] border border-slate-300 shadow-inner overflow-hidden">
              {isRendering ? (
                <div className="text-center py-12">
                  <span className="text-3xl animate-spin">⏳</span>
                  <p className="text-xs font-bold text-slate-600 mt-2">A4 Sheet Loading...</p>
                </div>
              ) : generatedA4Url ? (
                <div className="bg-white shadow-2xl border border-slate-300 w-[310px] h-[438px] relative overflow-hidden transition-all duration-300 rounded">
                  <img
                    src={generatedA4Url}
                    alt="Aadhaar A4 Layout"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
            </div>

            {/* Big Action Buttons */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  if (!generatedA4Url) return;
                  const a = document.createElement('a');
                  a.href = generatedA4Url;
                  a.download = 'Aadhaar_A4_Print.jpg';
                  a.click();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadJpg}</span>
              </button>

              <button
                onClick={() => {
                  if (generatedA4Url) {
                    onPrint(generatedA4Url, 'Aadhaar_Front_Back_A4.pdf');
                  }
                }}
                className="btn-green px-6 py-3 font-extrabold text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printA4Sheet}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
