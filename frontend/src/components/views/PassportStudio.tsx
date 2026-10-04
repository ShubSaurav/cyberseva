import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Printer, 
  Download, 
  Sparkles
} from 'lucide-react';
import { imageProcessing, PassportGridOptions } from '../../services/imageProcessing';
import { Language, translations } from '../../utils/i18n';

interface PassportStudioProps {
  onPrint: (previewUrl: string, docName: string) => void;
  language: Language;
}

export const PassportStudio: React.FC<PassportStudioProps> = ({ onPrint, language }) => {
  const t = translations[language];

  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  );

  const [count, setCount] = useState<number>(8);
  const [paperSize, setPaperSize] = useState<'A4' | '4x6'>('A4');
  const [bgColor, setBgColor] = useState<'White' | 'LightBlue' | 'LightGray'>('White');
  const [addBorder, setAddBorder] = useState<boolean>(true);

  // SSC Name & Date Tag
  const [enableNameTag, setEnableNameTag] = useState<boolean>(false);
  const [applicantName, setApplicantName] = useState<string>('RAJESH KUMAR');
  const [photoDate, setPhotoDate] = useState<string>(new Date().toLocaleDateString('en-GB'));

  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    generateSheet();
  }, [photoUrl, count, paperSize, bgColor, addBorder, enableNameTag, applicantName, photoDate]);

  const generateSheet = async () => {
    if (!photoUrl) return;
    setIsGenerating(true);
    try {
      const img = await imageProcessing.loadImageFromUrl(photoUrl);
      const options: PassportGridOptions = {
        count,
        paperSize,
        photoWidthMm: 35,
        photoHeightMm: 45,
        bgColor,
        addBorder,
        nameDateTag: enableNameTag ? { name: applicantName, date: photoDate } : undefined
      };
      const result = await imageProcessing.generatePassportSheet(img, options);
      setSheetUrl(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shadow-sm">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52]">
              {t.photoTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.photoSub}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80')}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>⚡ {t.testSampleBtn}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Photo Source & Presets (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Box */}
          <div className="clean-card p-5 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              {t.customerPhotoTitle}
            </span>
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-orange-200 bg-slate-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img src={photoUrl} alt="Photo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="btn-orange px-4 py-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <UploadCloud className="w-4 h-4" />
                  <span>{t.uploadNewPhoto}</span>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-slate-500">
                  {t.aiFaceDetectNote}
                </p>
              </div>
            </div>
          </div>

          {/* Number of Photos Picker */}
          <div className="clean-card p-5 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              {t.howManyPhotos}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => { setCount(8); setPaperSize('A4'); }}
                className={`py-3 rounded-xl border text-center transition-all ${
                  count === 8 && paperSize === 'A4'
                    ? 'bg-[#FF6B00] text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.photos8}
                <span className="block text-[10px] font-normal opacity-90">{t.sheet30}</span>
              </button>

              <button
                onClick={() => { setCount(16); setPaperSize('A4'); }}
                className={`py-3 rounded-xl border text-center transition-all ${
                  count === 16 && paperSize === 'A4'
                    ? 'bg-[#FF6B00] text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.photos16}
                <span className="block text-[10px] font-normal opacity-90">{t.sheet50}</span>
              </button>

              <button
                onClick={() => { setCount(4); setPaperSize('4x6'); }}
                className={`py-3 rounded-xl border text-center transition-all ${
                  count === 4 && paperSize === '4x6'
                    ? 'bg-[#FF6B00] text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.photos4}
                <span className="block text-[10px] font-normal opacity-90">{t.sheet20}</span>
              </button>
            </div>
          </div>

          {/* Background Color Picker */}
          <div className="clean-card p-5 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
              {t.bgColorTitle}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setBgColor('White')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'White' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-400"></span>
                <span>{t.bgWhite}</span>
              </button>

              <button
                onClick={() => setBgColor('LightBlue')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'LightBlue' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-sky-200 border border-sky-400"></span>
                <span>{t.bgBlue}</span>
              </button>

              <button
                onClick={() => setBgColor('LightGray')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'LightGray' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-slate-200 text-slate-700'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-400"></span>
                <span>{t.bgGray}</span>
              </button>
            </div>
          </div>

          {/* Government Job Name & Date Strip */}
          <div className="clean-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t.sscNameTag}
              </span>
              <input
                type="checkbox"
                checked={enableNameTag}
                onChange={(e) => setEnableNameTag(e.target.checked)}
                className="w-4 h-4 accent-[#155EEF] rounded cursor-pointer"
              />
            </div>

            {enableNameTag && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 animate-fadeIn">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">{t.applicantName}</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">{t.photoDate}</label>
                  <input
                    type="text"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High-Res Sheet Preview & Print Button (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full clean-card p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                {t.photoTitle} ({count} Photos):
              </span>
              <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                ✂ 300 DPI
              </span>
            </div>

            {/* Canvas Container */}
            <div className="w-full bg-slate-200 p-4 rounded-2xl flex items-center justify-center min-h-[460px] border border-slate-300 shadow-inner overflow-hidden">
              {isGenerating ? (
                <div className="text-center py-12">
                  <span className="text-3xl animate-spin">⏳</span>
                  <p className="text-xs font-bold text-slate-600 mt-2">Creating sheet...</p>
                </div>
              ) : sheetUrl ? (
                <div className="bg-white shadow-2xl border border-slate-300 w-[310px] h-[438px] relative overflow-hidden transition-all duration-300 rounded">
                  <img
                    src={sheetUrl}
                    alt="Passport Sheet"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  if (!sheetUrl) return;
                  const a = document.createElement('a');
                  a.href = sheetUrl;
                  a.download = `Passport_${count}x_Sheet.jpg`;
                  a.click();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadJpg}</span>
              </button>

              <button
                onClick={() => {
                  if (sheetUrl) {
                    onPrint(sheetUrl, `Passport_${count}x_Sheet.jpg`);
                  }
                }}
                className="btn-orange px-6 py-3 font-extrabold text-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printPhotosBtn} ({count}x - ₹{count === 16 ? 50 : count === 4 ? 20 : 30})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
