import React, { useState } from 'react';
import { 
  Printer as PrinterIcon, 
  X, 
  CheckCircle2, 
  Sliders, 
  FileText, 
  Layers, 
  Palette, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { Printer } from '../../types';
import confetti from 'canvas-confetti';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  printers: Printer[];
  previewUrl?: string;
  documentName?: string;
  onPrintSuccess?: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  printers,
  previewUrl,
  documentName = 'CyberSeva_Print_Job.pdf',
  onPrintSuccess
}) => {
  const [selectedPrinterId, setSelectedPrinterId] = useState(
    printers.find(p => p.isDefault)?.id || printers[0]?.id || 'printer-hp-1'
  );
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState<'BW' | 'COLOR'>('BW');
  const [paperSize, setPaperSize] = useState<'A4' | 'A5' | '4x6' | 'PVC'>('A4');
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT');
  const [duplex, setDuplex] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPrinter = printers.find(p => p.id === selectedPrinterId) || printers[0];

  const handlePrint = async () => {
    setIsDispatching(true);
    try {
      await api.dispatchPrint({
        printerId: selectedPrinterId,
        documentName,
        pages: 1,
        copies,
        colorMode,
        paperSize
      });

      setIsSuccess(true);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });

      setTimeout(() => {
        setIsSuccess(false);
        if (onPrintSuccess) onPrintSuccess();
        onClose();
      }, 1500);
    } catch (e) {
      console.error(e);
      alert('Failed to communicate with Windows Print Bridge. Check spooler service.');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] to-[#155EEF] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <PrinterIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                Windows Print Bridge Dispatch
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">
                  Spooler Ready
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                1-Click Direct Spool to Connected Cyber Café Printers
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns (Preview on left, Controls on right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 overflow-y-auto">
          {/* Left: Print Preview Sheet */}
          <div className="flex flex-col items-center">
            <p className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
              <span>📄 High-Fidelity Print Preview ({paperSize}):</span>
            </p>
            <div className="w-full bg-[#E5E9F2] p-4 rounded-xl flex items-center justify-center min-h-[300px] border border-[#D0D5DD] shadow-inner">
              <div 
                className={`bg-white shadow-xl transition-all duration-300 relative border border-gray-300 flex items-center justify-center overflow-hidden ${
                  orientation === 'PORTRAIT' 
                    ? 'w-[200px] h-[282px]' 
                    : 'w-[282px] h-[200px]'
                }`}
                style={{
                  filter: colorMode === 'BW' ? 'grayscale(100%)' : 'none'
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Print Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-4 text-center">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-[11px] font-bold text-gray-700">{documentName}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Ready for Print Spooler</p>
                  </div>
                )}

                {/* Stamp watermark for test preview */}
                <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-400">
                  CYBERSEVA PRINT
                </div>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-[#667085] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>Exact 100% scale without edge clipping.</span>
            </div>
          </div>

          {/* Right: Hardware Settings */}
          <div className="space-y-4">
            {/* Target Printer Picker */}
            <div>
              <label className="text-xs font-bold text-[#101828] block mb-1.5">
                Select Destination Printer:
              </label>
              <div className="space-y-2">
                {printers.map((p) => {
                  const isSelected = p.id === selectedPrinterId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPrinterId(p.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-[#155EEF] bg-blue-50/70 shadow-sm'
                          : 'border-[#E4E7EC] hover:bg-[#F6F8FC]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${p.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          <PrinterIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#101828] flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isDefault && (
                              <span className="text-[9px] bg-blue-100 text-[#155EEF] px-1.5 py-0.2 rounded font-semibold">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#667085]">
                            {p.type} • {p.tonerBlack}% Toner
                          </span>
                        </div>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${p.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Copies & Color Mode */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">Copies:</label>
                <div className="flex items-center border border-[#E4E7EC] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setCopies(Math.max(1, copies - 1))}
                    className="px-3 py-2 bg-[#F6F8FC] hover:bg-gray-200 text-[#101828] font-bold text-xs"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={copies}
                    onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                    className="w-full text-center text-xs font-bold text-[#101828] outline-none py-1.5"
                  />
                  <button
                    onClick={() => setCopies(copies + 1)}
                    className="px-3 py-2 bg-[#F6F8FC] hover:bg-gray-200 text-[#101828] font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">Color Mode:</label>
                <div className="grid grid-cols-2 gap-1 bg-[#F1F4F9] p-1 rounded-xl border border-[#E4E7EC] text-xs">
                  <button
                    onClick={() => setColorMode('BW')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      colorMode === 'BW' ? 'bg-white text-[#101828] shadow-sm' : 'text-[#667085]'
                    }`}
                  >
                    B&W (₹3)
                  </button>
                  <button
                    onClick={() => setColorMode('COLOR')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      colorMode === 'COLOR' ? 'bg-[#FF6B00] text-white shadow-sm' : 'text-[#667085]'
                    }`}
                  >
                    Color (₹10)
                  </button>
                </div>
              </div>
            </div>

            {/* Paper Size & Orientation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">Paper Type:</label>
                <select
                  value={paperSize}
                  onChange={(e: any) => setPaperSize(e.target.value)}
                  className="w-full bg-[#F6F8FC] border border-[#E4E7EC] rounded-xl px-3 py-2 text-xs font-medium text-[#101828] outline-none"
                >
                  <option value="A4">A4 Standard (75 GSM)</option>
                  <option value="A5">A5 Half Sheet</option>
                  <option value="4x6">4x6 Glossy Photo Paper</option>
                  <option value="PVC">PVC Plastic Card</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#101828] block mb-1">Orientation:</label>
                <div className="grid grid-cols-2 gap-1 bg-[#F1F4F9] p-1 rounded-xl border border-[#E4E7EC] text-xs">
                  <button
                    onClick={() => setOrientation('PORTRAIT')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      orientation === 'PORTRAIT' ? 'bg-white text-[#101828] shadow-sm' : 'text-[#667085]'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOrientation('LANDSCAPE')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      orientation === 'LANDSCAPE' ? 'bg-white text-[#101828] shadow-sm' : 'text-[#667085]'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
            </div>

            {/* Dispatch Action */}
            <button
              onClick={handlePrint}
              disabled={isDispatching || isSuccess}
              className="w-full clay-button-royal py-3 font-extrabold text-sm flex items-center justify-center gap-2 mt-4"
            >
              {isDispatching ? (
                <>
                  <span className="animate-spin text-base">⏳</span>
                  <span>Sending to Print Spooler...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Dispatched to {currentPrinter?.name}!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Send to Printer ({copies} {copies > 1 ? 'Copies' : 'Copy'})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
