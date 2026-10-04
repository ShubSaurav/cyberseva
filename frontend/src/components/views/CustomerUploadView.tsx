import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface CustomerUploadViewProps {
  token: string;
}

export const CustomerUploadView: React.FC<CustomerUploadViewProps> = ({ token }) => {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    if (!e.target.files) return;

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            originalName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            category,
            dataUrl: ev.target?.result as string,
            uploadedAt: new Date().toISOString()
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTransmitToCounter = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please add at least one document or photo to upload.');
      return;
    }

    setIsUploading(true);
    try {
      await api.uploadToSession(token, uploadedFiles);
      setIsDone(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
      alert('Error transmitting files to counter');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col justify-between p-4 max-w-lg mx-auto font-sans antialiased text-[#101828]">
      {/* Top Branding */}
      <div className="text-center pt-4 pb-2">
        <img
          src="/cybersevalogo2.png"
          alt="CyberSeva"
          className="h-10 mx-auto object-contain mb-1"
        />
        <p className="text-xs font-semibold text-[#667085]">
          One Counter. Every Service.
        </p>
      </div>

      {/* Main Container */}
      <div className="clay-card p-5 space-y-5 my-auto">
        <div className="text-center pb-2 border-b border-[#E4E7EC]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] font-mono font-bold text-xs mb-2">
            <span>Counter Session: #{token}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#071A52]">
            Upload Your Documents
          </h2>
          <p className="text-xs text-[#667085] mt-1">
            Documents go directly to the operator counter. No WhatsApp needed.
          </p>
        </div>

        {isDone ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-extrabold text-[#071A52]">
              Documents Transmitted Successfully!
            </h3>
            <p className="text-xs text-[#667085] max-w-xs mx-auto">
              The counter operator has received your files. Your prints will be ready shortly.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold">
              🛡️ Privacy Safe: Files will be purged from counter buffer after completion.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customer Name Optional Input */}
            <div>
              <label className="text-xs font-bold text-[#101828] block mb-1">
                Your Name (आपका नाम):
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            {/* Quick Upload Action Buttons (Camera, Gallery, PDF) */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Camera Button */}
              <label className="p-3 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100 transition-all flex flex-col items-center justify-center text-center cursor-pointer group active:scale-95">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileSelect(e, 'PHOTO')}
                  className="hidden"
                />
                <Camera className="w-6 h-6 text-[#FF6B00] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-xs text-[#071A52]">Camera</span>
                <span className="text-[10px] text-[#667085]">Take Photo</span>
              </label>

              {/* Gallery / Photos */}
              <label className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 transition-all flex flex-col items-center justify-center text-center cursor-pointer group active:scale-95">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e, 'DOCUMENT')}
                  className="hidden"
                />
                <ImageIcon className="w-6 h-6 text-[#155EEF] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-xs text-[#071A52]">Gallery</span>
                <span className="text-[10px] text-[#667085]">Photos</span>
              </label>

              {/* PDF Documents */}
              <label className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 transition-all flex flex-col items-center justify-center text-center cursor-pointer group active:scale-95">
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => handleFileSelect(e, 'PDF')}
                  className="hidden"
                />
                <FileText className="w-6 h-6 text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-extrabold text-xs text-[#071A52]">Files / PDF</span>
                <span className="text-[10px] text-[#667085]">Admit Card</span>
              </label>
            </div>

            {/* List of Selected Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E4E7EC]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#071A52]">
                    Selected Documents ({uploadedFiles.length}):
                  </span>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-red-500 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-[#F8FAFF] p-2 rounded-lg border border-[#E4E7EC] text-xs"
                    >
                      <span className="font-medium truncate max-w-[200px] text-[#101828]">
                        {file.originalName}
                      </span>
                      <button
                        onClick={() => setUploadedFiles(uploadedFiles.filter(f => f.id !== file.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleTransmitToCounter}
                  disabled={isUploading}
                  className="w-full clay-button-royal py-3 font-extrabold text-xs flex items-center justify-center gap-2 mt-3 shadow-md"
                >
                  {isUploading ? (
                    <span>Sending to counter...</span>
                  ) : (
                    <>
                      <span>Transmit {uploadedFiles.length} File(s) to Counter</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Privacy Assurance */}
      <div className="text-center py-4 text-xs text-[#667085] flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Privacy First: Encrypted transfer • Zero storage • Safe & Secure</span>
      </div>
    </div>
  );
};
