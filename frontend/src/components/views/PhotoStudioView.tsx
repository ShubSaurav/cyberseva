import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Printer, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Crop, 
  Palette, 
  FileText,
  User,
  Zap
} from 'lucide-react';
import { imageProcessing, PassportGridOptions } from '../../services/imageProcessing';
import { Printer as PrinterType } from '../../types';

interface PhotoStudioViewProps {
  printers: PrinterType[];
  onOpenPrintModal: (previewUrl: string, docName: string) => void;
  initialCount?: number;
}

export const PhotoStudioView: React.FC<PhotoStudioViewProps> = ({
  printers,
  onOpenPrintModal,
  initialCount = 8
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  );

  // Layout Config
  const [count, setCount] = useState<number>(initialCount);
  const [paperSize, setPaperSize] = useState<'A4' | '4x6'>('A4');
  const [bgColor, setBgColor] = useState<'White' | 'LightBlue' | 'LightGray'>('White');
  const [addBorder, setAddBorder] = useState<boolean>(true);
  
  // Name & Date on Photo (Mandatory for SSC/Govt Recruitments)
  const [enableNameTag, setEnableNameTag] = useState<boolean>(false);
  const [applicantName, setApplicantName] = useState<string>('RAJESH KUMAR');
  const [photoDate, setPhotoDate] = useState<string>(
    new Date().toLocaleDateString('en-GB')
  );

  // Generated Canvas Sheet
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
      console.error('Passport generation error:', e);
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

  const handlePrint = () => {
    if (sheetUrl) {
      onOpenPrintModal(sheetUrl, `Passport_${count}x_${paperSize}.jpg`);
    }
  };

  const handleDownload = () => {
    if (!sheetUrl) return;
    const a = document.createElement('a');
    a.href = sheetUrl;
    a.download = `CyberSeva_Passport_Sheet_${count}x.jpg`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-100 text-[#FF6B00]">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Passport Photo Studio (पासपोर्ट फोटो मेकर)
              <span className="text-xs bg-orange-100 text-[#FF6B00] font-bold px-2 py-0.5 rounded-full">
                35x45 mm Standard
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Generate 8, 16 or 32 passport copies with cut-guides & background swap in seconds
            </p>
          </div>
        </div>

        {/* Paper Size selector */}
        <div className="flex items-center bg-[#F1F4F9] p-1 rounded-xl border border-[#E4E7EC] text-xs font-bold">
          <button
            onClick={() => { setPaperSize('A4'); setCount(8); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              paperSize === 'A4' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#667085]'
            }`}
          >
            A4 Sheet (8/16 Photos)
          </button>
          <button
            onClick={() => { setPaperSize('4x6'); setCount(4); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              paperSize === '4x6' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-[#667085]'
            }`}
          >
            4x6 Glossy Paper (4 Photos)
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Controls & Upload (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Photo Source Card */}
          <div className="clay-card p-4">
            <span className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider block mb-2">
              Customer Photo Source:
            </span>
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-orange-200 bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img src={photoUrl} alt="Customer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="clay-button-royal px-4 py-2 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Camera / PC</span>
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <p className="text-[11px] text-[#667085]">
                  AI automatically crops to official 35:45 aspect ratio with eyes level.
                </p>
              </div>
            </div>
          </div>

          {/* Number of Photos Grid Selector */}
          <div className="clay-card p-4 space-y-3">
            <span className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider block">
              Copies Count:
            </span>
            <div className="grid grid-cols-4 gap-2 text-xs font-bold">
              {[4, 8, 16, 32].map((num) => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={`py-2 rounded-xl border text-center transition-all ${
                    count === num
                      ? 'bg-[#FF6B00] text-white border-orange-600 shadow-sm'
                      : 'bg-[#F8FAFF] text-[#101828] border-[#E4E7EC] hover:bg-gray-100'
                  }`}
                >
                  {num} Photos
                </button>
              ))}
            </div>
          </div>

          {/* Background Color Picker */}
          <div className="clay-card p-4 space-y-3">
            <span className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider block">
              Background Color (बैकग्राउंड रंग):
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                onClick={() => setBgColor('White')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'White' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-gray-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-gray-400"></span>
                <span>White (Standard)</span>
              </button>

              <button
                onClick={() => setBgColor('LightBlue')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'LightBlue' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-gray-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-sky-200 border border-sky-400"></span>
                <span>Light Blue</span>
              </button>

              <button
                onClick={() => setBgColor('LightGray')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  bgColor === 'LightGray' ? 'border-[#155EEF] bg-blue-50 text-[#155EEF]' : 'border-gray-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-gray-200 border border-gray-400"></span>
                <span>Light Gray</span>
              </button>
            </div>
          </div>

          {/* SSC / Government Exam Name & Date on Photo */}
          <div className="clay-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider">
                Name & Date Strip (SSC / Railway):
              </span>
              <input
                type="checkbox"
                checked={enableNameTag}
                onChange={(e) => setEnableNameTag(e.target.checked)}
                className="w-4 h-4 accent-[#155EEF] rounded cursor-pointer"
              />
            </div>

            {enableNameTag && (
              <div className="grid grid-cols-2 gap-2 text-xs animate-fadeIn pt-1">
                <div>
                  <label className="text-[10px] text-[#667085] uppercase block font-semibold mb-0.5">Applicant Name:</label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-[#F6F8FC] border border-[#E4E7EC] rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#667085] uppercase block font-semibold mb-0.5">Photo Date (DOP):</label>
                  <input
                    type="text"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full bg-[#F6F8FC] border border-[#E4E7EC] rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: High-Resolution Photo Sheet Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full clay-card p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#FF6B00]" />
                <span>Exact Print Sheet with Cutting Marks:</span>
              </span>
              <span className="text-[11px] font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded">
                300 DPI High-Def
              </span>
            </div>

            {/* Sheet Canvas Container */}
            <div className="w-full bg-[#E5E9F2] p-4 rounded-xl flex items-center justify-center min-h-[460px] border border-[#D0D5DD] shadow-inner overflow-hidden">
              {isGenerating ? (
                <div className="text-center py-12">
                  <span className="text-3xl animate-spin">⏳</span>
                  <p className="text-xs text-[#667085] mt-2 font-bold">Stamping {count} Passport Photos...</p>
                </div>
              ) : sheetUrl ? (
                <div className="bg-white shadow-2xl border border-gray-300 w-[300px] h-[424px] relative overflow-hidden transition-all duration-300">
                  <img
                    src={sheetUrl}
                    alt="Passport Sheet"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
            </div>

            {/* Bottom Actions */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[#E4E7EC]">
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-white hover:bg-gray-50 text-[#344054] font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Print Sheet</span>
              </button>

              <button
                onClick={handlePrint}
                className="clay-button-orange px-6 py-2.5 font-extrabold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print {count} Photos on Canon G3010</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
