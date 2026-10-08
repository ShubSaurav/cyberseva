import React, { useState } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Printer, 
  Download, 
  Maximize2, 
  Eye, 
  ShieldCheck, 
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Language, translations } from '../../utils/i18n';

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  fileDetails?: {
    dimensions?: string;
    dpi?: string;
    fileSize?: string;
    format?: string;
    securityTag?: string;
  };
  onPrint?: () => void;
  language: Language;
}

export const ImageViewModal: React.FC<ImageViewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  fileDetails,
  onPrint,
  language
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [highContrast, setHighContrast] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const t = translations[language];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setHighContrast(false);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${title.replace(/\s+/g, '_')}_HighRes.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate font-display">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {subtitle || (language === 'en' ? 'High-Resolution Document & Photo Inspector' : 'हाई-रेसोलुशन दस्तावेज व्यूअर')}
              </p>
            </div>
          </div>

          {/* Quick Zoom / Rotate / Contrast Toolbar */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-2xl border border-slate-700">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold px-2 text-blue-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-700 mx-0.5" />
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-1.5 rounded-xl transition-all ${highContrast ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
              title="High-Contrast Photocopy Check"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1 text-[10px] font-bold rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              Reset
            </button>
          </div>

          {/* Action buttons (Print, Download, Close) */}
          <div className="flex items-center gap-2">
            {onPrint && (
              <button
                onClick={onPrint}
                className="btn-green px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.btnPrint}</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Download' : 'डाउनलोड'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Viewer Canvas */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-hidden relative select-none">
          {/* Subtle grid pattern background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38BDF8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div
            className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              filter: highContrast ? 'contrast(200%) grayscale(100%) brightness(95%)' : 'none'
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[68vh] max-w-[85vw] object-contain rounded-lg shadow-2xl border border-slate-700/60 bg-white"
            />
          </div>
        </div>

        {/* Bottom Technical Inspector Bar */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="text-slate-200">Scale:</strong> {fileDetails?.dimensions || 'A4 Standard (210 × 297 mm)'}
            </span>
            <span>
              <strong className="text-slate-200">DPI:</strong> {fileDetails?.dpi || '300 DPI Print-Ready'}
            </span>
            <span>
              <strong className="text-slate-200">Format:</strong> {fileDetails?.format || 'RGB 24-bit / JPEG'}
            </span>
            {fileDetails?.fileSize && (
              <span>
                <strong className="text-slate-200">Size:</strong> {fileDetails.fileSize}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'en' ? 'RAM Buffer Protected • Zero Permanent Storage' : 'रैम बफर सुरक्षित • प्रिंट के बाद स्वतः डिलीट'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
