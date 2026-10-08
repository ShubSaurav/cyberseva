import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  FileCheck, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  Download,
  Trash2
} from 'lucide-react';
import { api } from '../../services/api';
import { CustomerUploadSession } from '../../types';
import { Language, translations } from '../../utils/i18n';

interface CustomerQrViewProps {
  onFilesReady: (files: any[]) => void;
  language: Language;
}

export const CustomerQrView: React.FC<CustomerQrViewProps> = ({ onFilesReady, language }) => {
  const [session, setSession] = useState<CustomerUploadSession | null>(null);
  const t = translations[language];

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
        originalName: 'Customer_Aadhaar_Card.jpg',
        fileSize: 420 * 1024,
        mimeType: 'image/jpeg',
        category: 'AADHAAR_FRONT',
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'f2',
        originalName: 'Customer_Passport_Photo.jpg',
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
              {t.qrStandeeTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.qrStandeeSub}
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          className="btn-orange px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>⚡ {language === 'en' ? 'Test Upload (Demo)' : language === 'hinglish' ? 'Test Phone Upload' : 'टेस्ट फोन अपलोड'}</span>
        </button>
      </div>

      {/* Main QR Standee Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* QR Code Card */}
        <div className="clean-card p-8 text-center flex flex-col items-center justify-between space-y-4 border-2 border-emerald-200 bg-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-xs">
            <span>{language === 'en' ? 'Counter Token' : language === 'hinglish' ? 'Counter Token' : 'टोकन'}: {session?.sessionToken || 'CS-XXXX'}</span>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-slate-200 flex items-center justify-center">
            {uploadUrl ? (
              <QRCodeSVG value={uploadUrl} size={190} level="M" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400">Loading QR...</div>
            )}
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-base text-[#071A52]">
              {language === 'en' ? 'Scan with Mobile Camera' : language === 'hinglish' ? 'Phone Camera Se Scan Karein' : 'फोन कैमरे से स्कैन करें'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              {language === 'en' ? 'Customer selects photos or PDFs and transmits directly to your counter.' : language === 'hinglish' ? 'Customer gallery se photo ya PDF chune aur sidhe bheje.' : 'ग्राहक गैलरी से फोटो या PDF चुनें और सीधे भेजें।'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.privacyShield}</span>
          </div>
        </div>

        {/* Incoming Files Receiver */}
        <div className="clean-card p-6 space-y-4 flex flex-col justify-between min-h-[360px] bg-white">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                {t.incomingFilesHeading} ({session?.uploadedFiles.length || 0}):
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (session?.uploadedFiles.length || 0) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {(session?.uploadedFiles.length || 0) > 0 ? (language === 'en' ? 'Files Received' : 'फाइलें मिलीं') : (language === 'en' ? 'Waiting...' : 'इंतजार में...')}
              </span>
            </div>

            {(!session || session.uploadedFiles.length === 0) ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Smartphone className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-bold text-slate-600">
                  {t.noFilesYet}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'en' ? 'No WhatsApp or mobile number saving needed.' : 'व्हाट्सएप या नंबर सेव करने की कोई जरूरत नहीं।'}
                </p>
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
              <span>{t.openInAadhaar}</span>
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
              <span>{t.copyCustomerLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

