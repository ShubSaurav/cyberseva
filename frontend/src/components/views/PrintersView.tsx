import React, { useState } from 'react';
import { 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Trash2, 
  FileText, 
  Activity, 
  Wifi, 
  Cable,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import { Printer as PrinterType, PrintJobItem } from '../../types';

interface PrintersViewProps {
  printers: PrinterType[];
  onRefresh: () => void;
}

export const PrintersView: React.FC<PrintersViewProps> = ({ printers, onRefresh }) => {
  const [activeQueue, setActiveQueue] = useState<PrintJobItem[]>([
    {
      id: 'pj-101',
      jobId: 'job-10293',
      printerId: 'printer-hp-1',
      printerName: 'HP LaserJet Pro M404n',
      documentName: 'Aadhaar_Front_Back_A4.pdf',
      pages: 1,
      copies: 1,
      colorMode: 'BW',
      paperSize: 'A4',
      status: 'COMPLETED',
      createdAt: '12 mins ago',
      completedAt: '11 mins ago'
    },
    {
      id: 'pj-102',
      jobId: 'job-10294',
      printerId: 'printer-canon-1',
      printerName: 'Canon PIXMA G3010 Ink Tank',
      documentName: 'Passport_Photos_8x_Sheet.jpg',
      pages: 1,
      copies: 1,
      colorMode: 'COLOR',
      paperSize: 'A4',
      status: 'PRINTING',
      createdAt: '3 mins ago'
    }
  ]);

  const [testingPrinterId, setTestingPrinterId] = useState<string | null>(null);

  const handleTestPrint = async (printerId: string) => {
    setTestingPrinterId(printerId);
    try {
      await api.testPrint(printerId);
      alert('Diagnostic Test Sheet sent to printer successfully!');
      onRefresh();
    } catch (e) {
      console.error(e);
      alert('Test print failed.');
    } finally {
      setTestingPrinterId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 text-[#155EEF]">
            <Printer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Windows Print Bridge & Spooler Dashboard
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Service Active
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Real-time monitoring of HP, Canon, Epson and Brother devices with zero print dialog lag
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="clay-button-royal px-4 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Rescan Printers</span>
        </button>
      </div>

      {/* Connected Printers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {printers.map((p) => (
          <div
            key={p.id}
            className={`clay-card p-5 space-y-4 border-t-4 ${
              p.status === 'ONLINE' ? 'border-t-emerald-500' : 'border-t-amber-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-[#071A52]">{p.name}</h3>
                  {p.isDefault && (
                    <span className="text-[10px] bg-blue-100 text-[#155EEF] font-bold px-2 py-0.5 rounded">
                      DEFAULT
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#667085] mt-0.5">{p.location} • {p.type}</p>
              </div>

              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                p.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${p.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                {p.status}
              </span>
            </div>

            {/* Consumables (Toner & Inks) */}
            <div className="space-y-2 bg-[#F8FAFF] p-3 rounded-xl border border-[#E4E7EC]">
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block">
                Consumables & Tray Status:
              </span>

              {/* Black Toner/Ink */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Black Toner / Ink Level:</span>
                  <span className="font-bold text-[#101828]">{p.tonerBlack}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gray-800 h-full rounded-full" style={{ width: `${p.tonerBlack}%` }}></div>
                </div>
              </div>

              {/* Color Inks if applicable */}
              {p.inkCyan !== undefined && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-sky-600 font-bold block">Cyan: {p.inkCyan}%</span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div className="bg-sky-500 h-full" style={{ width: `${p.inkCyan}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-pink-600 font-bold block">Magenta: {p.inkMagenta}%</span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div className="bg-pink-500 h-full" style={{ width: `${p.inkMagenta}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-600 font-bold block">Yellow: {p.inkYellow}%</span>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div className="bg-amber-400 h-full" style={{ width: `${p.inkYellow}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paper Tray info */}
              <div className="flex items-center justify-between text-xs pt-1 text-[#667085]">
                <span>Paper Tray 1 ({p.paperSize}):</span>
                <span className="font-bold text-[#101828]">~{p.paperTrayCount} Sheets Loaded</span>
              </div>
            </div>

            {/* Hardware actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#667085] flex items-center gap-1 font-mono">
                <Cable className="w-3.5 h-3.5" />
                {p.connection}
              </span>

              <button
                onClick={() => handleTestPrint(p.id)}
                disabled={testingPrinterId === p.id}
                className="px-3 py-1.5 rounded-lg border border-[#E4E7EC] hover:bg-gray-100 text-xs font-bold text-[#071A52] transition-colors"
              >
                {testingPrinterId === p.id ? 'Printing Test...' : 'Diagnostic Test Print'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Spooler Active Queue */}
      <div className="clay-card p-5 space-y-3">
        <h3 className="font-extrabold text-sm text-[#071A52] uppercase tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#155EEF]" />
          <span>Active Windows Spooler Queue ({activeQueue.length} Jobs)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8F9FC] text-[#667085] font-semibold border-b border-[#E4E7EC]">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Document</th>
                <th className="p-3">Destination Printer</th>
                <th className="p-3">Copies / Color</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Spooler Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {activeQueue.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFF]">
                  <td className="p-3 font-mono font-bold text-[#071A52]">{item.id}</td>
                  <td className="p-3 font-semibold text-[#101828]">{item.documentName}</td>
                  <td className="p-3 text-[#667085]">{item.printerName}</td>
                  <td className="p-3">
                    <span className="font-bold text-[#101828]">{item.copies} copy</span> ({item.colorMode})
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {item.status === 'PRINTING' && (
                      <button
                        onClick={() => {
                          setActiveQueue(activeQueue.map(q => q.id === item.id ? { ...q, status: 'CANCELLED' } : q));
                        }}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Cancel Spool
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
