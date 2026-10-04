import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { CustomerUploadSession } from '../../types';

interface CustomerQrViewProps {
  onFilesReady: (files: any[]) => void;
}

export const CustomerQrView: React.FC<CustomerQrViewProps> = ({ onFilesReady }) => {
  const [session, setSession] = useState<CustomerUploadSession | null>(null);

  useEffect(() => {
    initSession();
  }, []);

  // Poll for incoming customer uploads every 2s
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(async () => {
      try {
        const updated = await api.getSession(session.sessionToken);
        if (updated) setSession(updated);
      } catch (e) {
        console.error(e);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [session]);

  const initSession = async () => {
    try {
      const res = await api.createSession('Counter Walk-in');
      if (res.success) {
        setSession({
          id: res.data.sessionToken,
          sessionToken: res.data.sessionToken,
          customerName: 'Counter Customer',
          status: 'WAITING_FOR_FILES',
          createdAt: new Date().toISOString(),
          expiresAt: res.data.expiresAt,
          uploadedFiles: []
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulate = async () => {
    if (!session) return;
    const mock = [
      {
        id: 'f1',
        originalName: 'Customer_Aadhaar.jpg',
        fileSize: 420 * 1024,
        mimeType: 'image/jpeg',
        category: 'AADHAAR_FRONT',
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'f2',
        originalName: 'Customer_Photo.jpg',
        fileSize: 210 * 1024,
        mimeType: 'image/jpeg',
        category: 'PHOTO',
        dataUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        uploadedAt: new Date().toISOString()
      }
    ];
    await api.uploadToSession(session.sessionToken, mock);
    const updated = await api.getSession(session.sessionToken);
    if (updated) setSession(updated);
  };

  const origin = window.location.origin;
  const uploadUrl = session ? `${origin}?view=customer-upload&token=${session.sessionToken}` : '';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52]">
              कस्टमर QR काउंटर डिस्प्ले (Mobile Direct Upload)
            </h2>
            <p className="text-xs text-slate-500">
              ग्राहक फोन से स्कैन करके सीधे फोटो या PDF भेजेगा — नो व्हाट्सएप, नो नंबर सेविंग!
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          className="btn-orange px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>⚡ टेस्ट फोन अपलोड (Demo)</span>
        </button>
      </div>

      {/* Main QR Standee Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Code Card */}
        <div className="clean-card p-8 text-center flex flex-col items-center justify-center space-y-4 border-2 border-emerald-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-xs">
            <span>काउंटर टोकन: {session?.sessionToken || 'CS-XXXX'}</span>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200 flex items-center justify-center">
            {uploadUrl ? (
              <QRCodeSVG value={uploadUrl} size={200} level="M" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400">QR बन रहा है...</div>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-extrabold text-base text-[#071A52]">
              फोन कैमरे से स्कैन करें
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              गैलरी से फोटो चुनें या कैमरे से नया फोटो खींचकर सीधे भेजें
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>सुरक्षित • प्रिंट होते ही फाइलें मिट जाती हैं</span>
          </div>
        </div>

        {/* Incoming Files Receiver */}
        <div className="clean-card p-6 space-y-4 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                काउंटर पर प्राप्त दस्तावेज ({session?.uploadedFiles.length || 0}):
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (session?.uploadedFiles.length || 0) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {(session?.uploadedFiles.length || 0) > 0 ? 'फाइलें मिलीं' : 'इंतजार में...'}
              </span>
            </div>

            {(!session || session.uploadedFiles.length === 0) ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Smartphone className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-bold text-slate-600">ग्राहक के स्कैन करने का इंतजार है</p>
                <p className="text-[11px]">दुकान पर खड़े ग्राहक से कहें कि वह अपना कैमरा QR पर दिखाए।</p>
              </div>
            ) : (
              <div className="space-y-2.5 mt-3 max-h-56 overflow-y-auto">
                {session.uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{f.originalName}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {(f.fileSize / 1024).toFixed(0)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {session && session.uploadedFiles.length > 0 && (
            <button
              onClick={() => onFilesReady(session.uploadedFiles)}
              className="w-full btn-primary py-3 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md animate-fadeIn"
            >
              <span>ये दस्तावेज प्रिंट काउंटर में लोड करें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="text-center pt-2">
            <a
              href={uploadUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#155EEF] hover:underline inline-flex items-center gap-1"
            >
              <span>ब्राउज़र में ग्राहक वाला मोबाइल पेज खोलकर देखें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
