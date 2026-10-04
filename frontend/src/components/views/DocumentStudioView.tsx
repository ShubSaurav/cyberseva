import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sliders, 
  RotateCw, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Eye, 
  EyeOff, 
  Scissors, 
  SunMedium, 
  Contrast, 
  Download,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';
import { imageProcessing } from '../../services/imageProcessing';
import { Printer as PrinterType } from '../../types';

interface DocumentStudioViewProps {
  printers: PrinterType[];
  onOpenPrintModal: (previewUrl: string, docName: string) => void;
  initialPreset?: string;
}

export const DocumentStudioView: React.FC<DocumentStudioViewProps> = ({
  printers,
  onOpenPrintModal,
  initialPreset = 'AADHAAR'
}) => {
  const [docType, setDocType] = useState<string>(initialPreset);
  const [frontImage, setFrontImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );
  const [backImage, setBackImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
  );

  // Enhancements
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(115);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState<boolean>(false);
  const [maskAadhaar, setMaskAadhaar] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  // Generated layout preview data URL
  const [generatedA4Url, setGeneratedA4Url] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Re-generate layout whenever images or adjustments change
  useEffect(() => {
    renderA4Layout();
  }, [frontImage, backImage, isBlackAndWhite, maskAadhaar]);

  const renderA4Layout = async () => {
    if (!frontImage) return;
    setIsRendering(true);
    try {
      const frontEl = await imageProcessing.loadImageFromUrl(frontImage);
      let backEl: HTMLImageElement | null = null;
      if (backImage) {
        backEl = await imageProcessing.loadImageFromUrl(backImage);
      }
      const a4 = await imageProcessing.generateAadhaarA4Layout(
        frontEl,
        backEl,
        isBlackAndWhite,
        maskAadhaar
      );
      setGeneratedA4Url(a4);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRendering(false);
    }
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFrontImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBackImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    if (generatedA4Url) {
      onOpenPrintModal(generatedA4Url, `${docType}_A4_Print.pdf`);
    }
  };

  const handleDownload = () => {
    if (!generatedA4Url) return;
    const a = document.createElement('a');
    a.href = generatedA4Url;
    a.download = `CyberSeva_${docType}_A4.jpg`;
    a.click();
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 text-[#155EEF]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Document Studio & Smart Aadhaar Engine
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Zero Cloud Storage
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Auto-deskew, Front + Back alignment, Privacy masking & Print layout in 1 click
            </p>
          </div>
        </div>

        {/* Document Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {['AADHAAR', 'PAN', 'VOTER_ID', 'DRIVING_LICENCE', 'MARKSHEET'].map((cat) => (
            <button
              key={cat}
              onClick={() => setDocType(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                docType === cat
                  ? 'bg-[#155EEF] text-white shadow-sm'
                  : 'bg-[#F1F4F9] text-[#667085] hover:text-[#101828]'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace: 2-Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Uploads & Image Adjustments (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dual Side Upload Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Front Side */}
            <div className="clay-card p-3 text-center border-2 border-dashed border-[#155EEF]/30 hover:border-[#155EEF] relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFrontUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                Front Side (आगे का भाग)
              </span>
              {frontImage ? (
                <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img src={frontImage} alt="Front" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-28 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-[#667085]">
                  <Upload className="w-5 h-5 mb-1 text-[#155EEF]" />
                  <span className="text-[10px] font-bold">Upload Front</span>
                </div>
              )}
              <span className="text-[10px] text-[#155EEF] font-semibold mt-1 block group-hover:underline">
                Change Front Photo
              </span>
            </div>

            {/* Back Side */}
            <div className="clay-card p-3 text-center border-2 border-dashed border-orange-200 hover:border-[#FF6B00] relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleBackUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                Back Side (पीछे का भाग)
              </span>
              {backImage ? (
                <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                  <img src={backImage} alt="Back" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-28 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-[#667085]">
                  <Upload className="w-5 h-5 mb-1 text-[#FF6B00]" />
                  <span className="text-[10px] font-bold">Upload Back</span>
                </div>
              )}
              <span className="text-[10px] text-[#FF6B00] font-semibold mt-1 block group-hover:underline">
                {backImage ? 'Change Back Photo' : '+ Add Back Photo'}
              </span>
            </div>
          </div>

          {/* Quick Smart Actions */}
          <div className="clay-card p-4 space-y-3">
            <h3 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#155EEF]" />
              <span>Smart Document Presets:</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setIsBlackAndWhite(!isBlackAndWhite);
                }}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between transition-all ${
                  isBlackAndWhite ? 'bg-gray-800 text-white border-gray-900' : 'bg-[#F8FAFF] text-[#101828] border-[#E4E7EC]'
                }`}
              >
                <span>Black & White Mode</span>
                <span className="text-[10px]">{isBlackAndWhite ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  setMaskAadhaar(!maskAadhaar);
                }}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between transition-all ${
                  maskAadhaar ? 'bg-[#155EEF] text-white border-blue-600' : 'bg-[#F8FAFF] text-[#101828] border-[#E4E7EC]'
                }`}
              >
                <div className="flex items-center gap-1">
                  {maskAadhaar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>Mask Aadhaar No.</span>
                </div>
                <span className="text-[10px]">{maskAadhaar ? 'XXXX' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Image Contrast & Brightness Sliders */}
          <div className="clay-card p-4 space-y-3">
            <h3 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#FF6B00]" />
              <span>Scanner & Quality Adjustments:</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1 text-[#344054]">
                  <span className="flex items-center gap-1">
                    <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                    Brightness (चमक)
                  </span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-[#344054]">
                  <span className="flex items-center gap-1">
                    <Contrast className="w-3.5 h-3.5 text-[#155EEF]" />
                    Contrast (स्पष्टता)
                  </span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="160"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-[#155EEF]"
                />
              </div>
            </div>
          </div>

          {/* Privacy Disclaimer Banner */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-[#344054]">
            <ShieldCheck className="w-4 h-4 text-[#155EEF] flex-shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              <strong>Privacy Assurance:</strong> Processed in browser memory. CyberSeva does not store Aadhaar numbers or biometric details. Not affiliated with UIDAI.
            </p>
          </div>
        </div>

        {/* Right Column: High-Res A4 Sheet Preview & Spool Buttons (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full clay-card p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#155EEF]" />
                <span>Standard A4 Print Sheet Layout:</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Fold & Laminate Guides Ready
              </span>
            </div>

            {/* A4 Sheet Container */}
            <div className="w-full bg-[#E5E9F2] p-4 rounded-xl flex items-center justify-center min-h-[460px] border border-[#D0D5DD] shadow-inner overflow-hidden">
              {isRendering ? (
                <div className="text-center py-12">
                  <span className="text-3xl animate-spin">⏳</span>
                  <p className="text-xs text-[#667085] mt-2 font-bold">Rendering Dual Alignment Layout...</p>
                </div>
              ) : generatedA4Url ? (
                <div className="bg-white shadow-2xl border border-gray-300 w-[300px] h-[424px] relative overflow-hidden transition-all duration-300">
                  <img
                    src={generatedA4Url}
                    alt="A4 Sheet"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : null}
            </div>

            {/* Bottom Action Buttons */}
            <div className="w-full mt-4 flex items-center justify-between gap-3 pt-3 border-t border-[#E4E7EC]">
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-white hover:bg-gray-50 text-[#344054] font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Clean A4 JPG</span>
              </button>

              <button
                onClick={handlePrint}
                className="clay-button-royal px-6 py-2.5 font-extrabold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Send to Print Spooler (Ctrl+P)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
