import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { Printer as PrinterType } from '../../types';
import confetti from 'canvas-confetti';

interface SimplePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  printers: PrinterType[];
  previewUrl?: string;
  documentName?: string;
  onSuccess?: () => void;
}

export const SimplePrintModal: React.FC<SimplePrintModalProps> = ({
  isOpen,
  onClose,
  printers,
  previewUrl,
  documentName = 'CyberSeva_Print.pdf',
  onSuccess
}) => {
  const [selectedPrinterId, setSelectedPrinterId] = useState(
    printers.find(p => p.isDefault)?.id || printers[0]?.id || 'printer-hp-1'
  );
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<'BW' | 'COLOR'>('BW');
  const [paperSize, setPaperSize] = useState<'A4' | '4x6'>('A4');
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const currentPrinter = printers.find(p => p.id === selectedPrinterId) || printers[0];

  const handlePrint = async () => {
    setIsSending(true);
    try {
      await api.dispatchPrint({
        printerId: selectedPrinterId,
        documentName,
        pages: 1,
        copies,
        colorMode,
        paperSize
      });
      setIsDone(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setIsDone(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } catch (e) {
      console.error(e);
      alert('प्रिंटर से संपर्क नहीं हो पाया। केबल व प्रिंटर ऑन चेक करें।');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#071A52] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">प्रिंटर पर भेजें (Print Spooler)</h2>
              <p className="text-xs text-blue-200">कागज़, कॉपी और प्रिंटर चुनें</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
          {/* Left: Preview */}
          <div className="flex flex-col items-center justify-center bg-slate-100 p-4 rounded-2xl border border-slate-200 min-h-[260px]">
            <div className="bg-white shadow-xl border border-slate-300 w-[180px] h-[254px] rounded flex items-center justify-center overflow-hidden relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={`w-full h-full object-contain ${colorMode === 'BW' ? 'grayscale' : ''}`}
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span className="text-[11px] font-bold text-slate-600 block">{documentName}</span>
                  <span className="text-[10px] text-slate-400">प्रिंट के लिए तैयार</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-bold mt-2">100% सही मार्जिन व साइज</span>
          </div>

          {/* Right: Controls */}
          <div className="space-y-4">
            {/* Printer Dropdown */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">प्रिंटर चुनें:</label>
              <select
                value={selectedPrinterId}
                onChange={(e) => setSelectedPrinterId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
              >
                {printers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status === 'ONLINE' ? 'ऑनलाइन' : 'ऑफलाइन'})
                  </option>
                ))}
              </select>
            </div>

            {/* Copies */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">कितनी कॉपी निकालनी हैं?</label>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 max-w-[160px]">
                <button
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm border-r border-slate-200"
                >
                  -
                </button>
                <span className="w-full text-center text-sm font-extrabold text-slate-900">{copies}</span>
                <button
                  onClick={() => setCopies(copies + 1)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm border-l border-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Color Mode */}
            <div>
              <label className="text-xs font-extrabold text-slate-700 block mb-1">रंग (Color Mode):</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setColorMode('BW')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    colorMode === 'BW' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  B&W (काली स्याही)
                </button>
                <button
                  onClick={() => setColorMode('COLOR')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all ${
                    colorMode === 'COLOR' ? 'bg-[#FF6B00] text-white border-orange-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  कलर (Color)
                </button>
              </div>
            </div>

            {/* Big Action Button */}
            <button
              onClick={handlePrint}
              disabled={isSending || isDone}
              className="w-full btn-green py-3.5 font-extrabold text-sm flex items-center justify-center gap-2 mt-4 shadow-lg"
            >
              {isSending ? (
                <span>प्रिंटर को भेजा जा रहा है...</span>
              ) : isDone ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>प्रिंट कमांड सफलता से भेजी गई!</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>🖨️ अभी प्रिंट निकालें ({copies} कॉपी)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
