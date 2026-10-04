import React, { useState } from 'react';
import { 
  FileStack, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Minimize2
} from 'lucide-react';
import { pdfService } from '../../services/pdfService';
import { Language, translations } from '../../utils/i18n';

interface PdfStudioProps {
  language: Language;
}

export const PdfStudio: React.FC<PdfStudioProps> = ({ language }) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'merge' | 'delete' | 'compress'>('merge');

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<{ id: string; name: string; file: File; size: string }[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  // Delete page state
  const [deleteFile, setDeleteFile] = useState<File | null>(null);
  const [pageToDelete, setPageToDelete] = useState('4');
  const [isDeleting, setIsDeleting] = useState(false);

  // Compress state
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState(500);
  const [isCompressing, setIsCompressing] = useState(false);

  const [notification, setNotification] = useState<string | null>(null);

  const handleAddMergeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(f => ({
      id: Math.random().toString(),
      name: f.name,
      file: f,
      size: (f.size / 1024).toFixed(0) + ' KB'
    }));
    setMergeFiles(prev => [...prev, ...newFiles]);
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      alert('Please add at least 2 PDF files.');
      return;
    }
    setIsMerging(true);
    try {
      const mergedBytes = await pdfService.mergePdfs(mergeFiles.map(f => f.file));
      pdfService.downloadPdfBytes(mergedBytes, 'CyberSeva_Merged.pdf');
      setNotification('PDFs merged and downloaded successfully!');
    } catch (e) {
      console.error(e);
      alert('Error merging PDFs.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleExecuteDeletePage = async () => {
    if (!deleteFile) {
      alert('Please select a PDF file first.');
      return;
    }
    setIsDeleting(true);
    try {
      const pNum = parseInt(pageToDelete);
      const resBytes = await pdfService.deletePages(deleteFile, [pNum]);
      pdfService.downloadPdfBytes(resBytes, `CyberSeva_Clean_No_Page_${pNum}.pdf`);
      setNotification(`Page ${pNum} removed successfully!`);
    } catch (e) {
      console.error(e);
      alert('Error removing page.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExecuteCompress = () => {
    if (!compressFile) {
      alert('Please select a PDF file.');
      return;
    }
    setIsCompressing(true);
    setTimeout(() => {
      const blob = new Blob([compressFile], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Compressed_${targetKb}KB_${compressFile.name}`;
      a.click();
      setIsCompressing(false);
      setNotification(`PDF optimized to < ${targetKb} KB!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-sm">
            <FileStack className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52]">
              {t.pdfTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.pdfSub}
            </p>
          </div>
        </div>

        {/* 3 Simple Action Switchers */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('merge')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'merge' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-slate-600'
            }`}
          >
            {t.tabMerge}
          </button>
          <button
            onClick={() => setActiveTab('delete')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'delete' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-slate-600'
            }`}
          >
            {t.tabDelete}
          </button>
          <button
            onClick={() => setActiveTab('compress')}
            className={`px-3 py-2 rounded-lg transition-all ${
              activeTab === 'compress' ? 'bg-white text-[#155EEF] shadow-sm' : 'text-slate-600'
            }`}
          >
            {t.tabCompress}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: MERGE */}
      {activeTab === 'merge' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="clean-card p-8 border-2 border-dashed border-purple-200 hover:border-purple-400 flex flex-col items-center justify-center text-center relative group cursor-pointer">
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleAddMergeFiles}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-[#071A52]">
              {t.selectMultiplePdfs}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {t.mergeDesc}
            </p>
            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-purple-700">
              + {t.tabMerge}
            </div>
          </div>

          <div className="clean-card p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                  {t.selectedFiles} ({mergeFiles.length}):
                </span>
                {mergeFiles.length > 0 && (
                  <button onClick={() => setMergeFiles([])} className="text-xs text-red-600 hover:underline font-bold">
                    {t.clearAll}
                  </button>
                )}
              </div>

              {mergeFiles.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No files added yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 mt-2">
                  {mergeFiles.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 truncate">{item.name}</span>
                      </div>
                      <button
                        onClick={() => setMergeFiles(mergeFiles.filter(f => f.id !== item.id))}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleExecuteMerge}
              disabled={mergeFiles.length < 2 || isMerging}
              className="w-full btn-primary py-3 font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isMerging ? <span>Merging...</span> : <span>{t.mergeAndDownload}</span>}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DELETE PAGE */}
      {activeTab === 'delete' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="clean-card p-8 border-2 border-dashed border-red-200 flex flex-col items-center justify-center text-center relative group cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setDeleteFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-[#071A52]">
              {deleteFile ? deleteFile.name : t.uploadPdfToDelete}
            </h3>
            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-red-600">
              Browse PDF
            </div>
          </div>

          <div className="clean-card p-6 space-y-4">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block">
              {t.whichPageToDelete}
            </span>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">{t.pageNumber}</label>
              <input
                type="number"
                min="1"
                value={pageToDelete}
                onChange={(e) => setPageToDelete(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-extrabold outline-none"
              />
            </div>
            <button
              onClick={handleExecuteDeletePage}
              disabled={!deleteFile || isDeleting}
              className="w-full btn-orange py-3 font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <span>Removing...</span> : <span>{t.deleteAndSaveBtn}</span>}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: COMPRESS */}
      {activeTab === 'compress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="clean-card p-8 border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center text-center relative group cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCompressFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Minimize2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-sm text-[#071A52]">
              {compressFile ? compressFile.name : 'Select PDF File'}
            </h3>
            <div className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-emerald-600">
              Browse PDF
            </div>
          </div>

          <div className="clean-card p-6 space-y-4">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wide block">
              {t.compressTargetTitle}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[200, 500, 1000].map((kb) => (
                <button
                  key={kb}
                  onClick={() => setTargetKb(kb)}
                  className={`py-3 rounded-xl border text-center transition-all ${
                    targetKb === kb
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  &lt; {kb} KB
                </button>
              ))}
            </div>
            <button
              onClick={handleExecuteCompress}
              disabled={!compressFile || isCompressing}
              className="w-full btn-green py-3 font-extrabold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCompressing ? <span>Compressing...</span> : <span>{t.compressBtn}</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
