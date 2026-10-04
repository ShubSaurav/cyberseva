import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  QrCode, 
  Smartphone, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  FileCheck, 
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { CustomerUploadSession } from '../../types';

interface CustomerQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesReceived: (files: any[], customerName: string) => void;
}

export const CustomerQRModal: React.FC<CustomerQRModalProps> = ({
  isOpen,
  onClose,
  onFilesReceived
}) => {
  const [session, setSession] = useState<CustomerUploadSession | null>(null);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize or fetch session when opened
  useEffect(() => {
    if (isOpen) {
      createSession();
    }
  }, [isOpen]);

  // Periodic polling for incoming documents
  useEffect(() => {
    if (!isOpen || !session) return;

    const interval = setInterval(async () => {
      try {
        const updated = await api.getSession(session.sessionToken);
        if (updated) {
          setSession(updated);
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, session]);

  const createSession = async () => {
    setLoading(true);
    try {
      const res = await api.createSession(customerName);
      if (res.success) {
        setSession({
          id: res.data.sessionToken,
          sessionToken: res.data.sessionToken,
          customerName,
          status: 'WAITING_FOR_FILES',
          createdAt: new Date().toISOString(),
          expiresAt: res.data.expiresAt,
          uploadedFiles: []
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const origin = window.location.origin;
  const uploadUrl = session ? `${origin}?view=customer-upload&token=${session.sessionToken}` : '';

  const handleSimulateMobileUpload = async () => {
    if (!session) return;
    // Simulate customer uploading an Aadhaar card and a passport photo from their phone
    const mockFiles = [
      {
        id: 'file-1',
        originalName: 'Customer_Aadhaar_Front.jpg',
        fileSize: 450 * 1024,
        mimeType: 'image/jpeg',
        category: 'AADHAAR_FRONT',
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        uploadedAt: new Date().toISOString()
      },
      {
        id: 'file-2',
        originalName: 'Customer_Passport_Photo.jpg',
        fileSize: 220 * 1024,
        mimeType: 'image/jpeg',
        category: 'PHOTO',
        dataUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        uploadedAt: new Date().toISOString()
      }
    ];

    await api.uploadToSession(session.sessionToken, mockFiles);
    const updated = await api.getSession(session.sessionToken);
    if (updated) setSession(updated);
  };

  const handleImportToCounter = () => {
    if (session && session.uploadedFiles.length > 0) {
      onFilesReceived(session.uploadedFiles, session.customerName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-orange-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] to-[#FF6B00] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                Customer QR Upload
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">
                  Live
                </span>
              </h2>
              <p className="text-xs text-orange-100">
                Customer scans at counter to upload directly from phone (No WhatsApp needed!)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {session ? (
            <>
              {/* QR Code Frame */}
              <div className="mx-auto w-48 h-48 bg-white p-3 rounded-2xl shadow-md border-2 border-orange-200 flex items-center justify-center relative group">
                <QRCodeSVG 
                  value={uploadUrl} 
                  size={168}
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Session Token & Expiry */}
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="bg-[#F1F4F9] px-3 py-1.5 rounded-lg border border-[#E4E7EC]">
                  <span className="text-[#667085] mr-1">Session:</span>
                  <span className="font-mono font-bold text-[#071A52]">{session.sessionToken}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Auto-purges in 15m</span>
                </div>
              </div>

              {/* Upload Status */}
              {session.uploadedFiles.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span>Waiting for customer to scan & upload documents...</span>
                  </div>
                  <p className="text-[11px] text-amber-700 mt-1">
                    Ask customer to open camera and point at this counter QR code.
                  </p>
                  
                  {/* Test helper */}
                  <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-amber-800">Testing right now?</span>
                    <button
                      onClick={handleSimulateMobileUpload}
                      className="text-xs font-bold text-[#FF6B00] bg-white px-2.5 py-1 rounded-md border border-orange-200 hover:bg-orange-50 transition-colors shadow-sm"
                    >
                      ⚡ Simulate Phone Upload
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-left space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{session.uploadedFiles.length} Document(s) Received!</span>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                      READY
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {session.uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded-lg border border-emerald-100 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileCheck className="w-3.5 h-3.5 text-[#155EEF]" />
                          <span className="font-semibold text-[#101828] truncate">{f.originalName}</span>
                        </div>
                        <span className="text-[10px] text-[#667085] ml-2">
                          {(f.fileSize / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleImportToCounter}
                    className="w-full clay-button-royal py-2 font-bold text-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Import to Job Counter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Direct Link button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E4E7EC] text-xs">
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#155EEF] hover:underline flex items-center gap-1 font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Mobile Upload View in new tab</span>
                </a>
                <span className="text-[11px] text-[#667085] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Zero customer tracking
                </span>
              </div>
            </>
          ) : (
            <div className="py-8">
              <span className="animate-spin text-2xl">⏳</span>
              <p className="text-xs text-[#667085] mt-2">Generating secure counter QR code...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
