import React, { useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  FileText, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Scissors, 
  Zap,
  Eye,
  Camera,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Job, Printer as PrinterType, ShopSettings, ServiceItem } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface NewJobViewProps {
  settings: ShopSettings;
  printers: PrinterType[];
  onJobCompleted: (newJob: Job) => void;
  onOpenCustomerQR: () => void;
  onNavigate: (tab: string, state?: any) => void;
}

export const NewJobView: React.FC<NewJobViewProps> = ({
  settings,
  printers,
  onJobCompleted,
  onOpenCustomerQR,
  onNavigate
}) => {
  // Step tracker: 1 = Upload, 2 = AI Detection & Action, 3 = Print Config & Pricing, 4 = Payment & Dispatch
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [documentType, setDocumentType] = useState<'AADHAAR' | 'PAN' | 'PHOTO' | 'SIGNATURE' | 'GENERAL_DOC'>('AADHAAR');
  const [selectedAction, setSelectedAction] = useState<string>('AADHAAR_FRONT_BACK');
  
  // Document Images
  const [docImageFront, setDocImageFront] = useState<string | null>(null);
  const [docImageBack, setDocImageBack] = useState<string | null>(null);
  
  // Print Settings
  const [copies, setCopies] = useState<number>(1);
  const [colorMode, setColorMode] = useState<'BW' | 'COLOR'>('BW');
  const [paperSize, setPaperSize] = useState<'A4' | 'A5' | '4x6'>('A4');
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>(
    printers.find(p => p.isDefault)?.id || printers[0]?.id || 'printer-hp-1'
  );

  // Payment
  const [paymentMode, setPaymentMode] = useState<'UPI_QR' | 'CASH'>('UPI_QR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Sample quick loaders for instantaneous testing
  const loadSampleDoc = (type: 'AADHAAR' | 'PHOTO' | 'SIGNATURE' | 'PAN') => {
    setDocumentType(type);
    if (type === 'AADHAAR') {
      setSelectedAction('AADHAAR_FRONT_BACK');
      setDocImageFront('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
      setDocImageBack('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80');
    } else if (type === 'PHOTO') {
      setSelectedAction('PASSPORT_8_UP');
      setDocImageFront('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80');
      setColorMode('COLOR');
    } else if (type === 'SIGNATURE') {
      setSelectedAction('SIGNATURE_20KB');
      setDocImageFront('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80');
    } else {
      setSelectedAction('PAN_PRINT');
      setDocImageFront('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
    }
    setCurrentStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBack: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isBack) {
        setDocImageBack(result);
      } else {
        setDocImageFront(result);
        // Auto detect type based on filename or dimensions
        const name = file.name.toLowerCase();
        if (name.includes('aadhaar') || name.includes('aadhar')) {
          setDocumentType('AADHAAR');
          setSelectedAction('AADHAAR_FRONT_BACK');
        } else if (name.includes('pan')) {
          setDocumentType('PAN');
          setSelectedAction('PAN_PRINT');
        } else if (name.includes('photo') || name.includes('passport')) {
          setDocumentType('PHOTO');
          setSelectedAction('PASSPORT_8_UP');
          setColorMode('COLOR');
        } else if (name.includes('sign')) {
          setDocumentType('SIGNATURE');
          setSelectedAction('SIGNATURE_20KB');
        } else {
          setDocumentType('GENERAL_DOC');
          setSelectedAction('PRINT_A4');
        }
      }
      setCurrentStep(2);
    };
    reader.readAsDataURL(file);
  };

  // Pricing calculation
  const calculateTotal = (): { services: ServiceItem[]; total: number } => {
    const items: ServiceItem[] = [];
    if (selectedAction === 'AADHAAR_FRONT_BACK') {
      items.push({
        id: 's-adh',
        name: 'Aadhaar Smart A4 Print (Front + Back)',
        category: 'PRINT',
        unitPrice: colorMode === 'COLOR' ? 20 : 15,
        quantity: copies,
        total: (colorMode === 'COLOR' ? 20 : 15) * copies
      });
    } else if (selectedAction === 'PASSPORT_8_UP') {
      items.push({
        id: 's-pho',
        name: 'Passport Photos (8 Copies Glossy A4)',
        category: 'PHOTO',
        unitPrice: 30,
        quantity: copies,
        total: 30 * copies
      });
    } else if (selectedAction === 'SIGNATURE_20KB') {
      items.push({
        id: 's-sig',
        name: 'Signature Enhancement & 20KB Compress',
        category: 'DOC',
        unitPrice: 10,
        quantity: 1,
        total: 10
      });
    } else {
      const pricePerCopy = colorMode === 'COLOR' ? 10 : 3;
      items.push({
        id: 's-gen',
        name: `${colorMode === 'COLOR' ? 'Color' : 'B&W'} Document Print (${paperSize})`,
        category: 'PRINT',
        unitPrice: pricePerCopy,
        quantity: copies,
        total: pricePerCopy * copies
      });
    }

    const total = items.reduce((sum, item) => sum + item.total, 0);
    return { services: items, total };
  };

  const { services, total } = calculateTotal();
  const upiPayString = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.shopName)}&am=${total}&cu=INR&tn=CyberSevaJob`;

  const handleDispatchJob = async () => {
    setIsProcessing(true);
    try {
      // 1. Spool to Print Bridge
      const targetPrinter = printers.find(p => p.id === selectedPrinterId) || printers[0];
      await api.dispatchPrint({
        printerId: targetPrinter.id,
        documentName: `${documentType}_Job.pdf`,
        pages: 1,
        copies,
        colorMode,
        paperSize
      });

      // 2. Create Job in database
      const created = await api.createJob({
        customerName: customerName.trim() || 'Counter Walk-in',
        customerPhone,
        services,
        subtotal: total,
        totalAmount: total,
        paymentMode,
        paymentStatus: 'PAID',
        operator: settings.ownerName
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setIsFinished(true);

      setTimeout(() => {
        onJobCompleted(created);
      }, 1800);
    } catch (e) {
      console.error(e);
      alert('Error creating job');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Stepper Breadcrumb */}
      <div className="clay-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-100 text-[#FF6B00]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#071A52]">
                New Counter Job Workflow (नया ग्राहक काम)
              </h2>
              <p className="text-xs text-[#667085]">
                Process, Preview, Print and Pay under 30 seconds
              </p>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg ${currentStep >= 1 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-400'}`}>
              1. Upload
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep >= 2 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-400'}`}>
              2. Detect & Action
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep >= 3 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-400'}`}>
              3. Print & Bill
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${currentStep >= 4 ? 'bg-[#155EEF] text-white' : 'bg-gray-100 text-gray-400'}`}>
              4. Complete
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Upload or Quick Select */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Drag & Drop Area */}
            <div className="clay-card p-6 border-2 border-dashed border-[#155EEF]/30 hover:border-[#155EEF] transition-all flex flex-col items-center justify-center text-center cursor-pointer relative group">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload(e, false)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#155EEF] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-sm text-[#071A52]">
                Upload Customer Document from PC or Scanner
              </h3>
              <p className="text-xs text-[#667085] mt-1 max-w-xs">
                Supports Aadhaar, PAN Card, Photos, PDF marksheet, Voter ID (JPG, PNG, PDF)
              </p>
              <div className="mt-4 px-4 py-2 rounded-xl bg-[#F1F4F9] text-xs font-bold text-[#155EEF]">
                Browse Files or Drop Here
              </div>
            </div>

            {/* Right: Customer QR or Quick Demo Samples */}
            <div className="clay-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#667085] mb-2 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#FF6B00]" />
                  <span>Receive from Customer's Mobile:</span>
                </h3>
                <div 
                  onClick={onOpenCustomerQR}
                  className="p-3 rounded-xl bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm text-[#FF6B00]">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-[#071A52]">Customer Scan Counter QR</div>
                      <div className="text-[11px] text-[#667085]">Customer uploads from phone camera</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FF6B00]">Open QR →</span>
                </div>
              </div>

              {/* Demo Fast Triggers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">
                  ⚡ Or Test with Sample Documents:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => loadSampleDoc('AADHAAR')}
                    className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] hover:border-[#155EEF] text-left transition-all"
                  >
                    <div className="font-bold text-xs text-[#101828]">Sample Aadhaar</div>
                    <div className="text-[10px] text-[#667085]">Front + Back Dual Scan</div>
                  </button>
                  <button
                    onClick={() => loadSampleDoc('PHOTO')}
                    className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] hover:border-[#FF6B00] text-left transition-all"
                  >
                    <div className="font-bold text-xs text-[#101828]">Sample Passport Photo</div>
                    <div className="text-[10px] text-[#667085]">Portrait 35x45mm</div>
                  </button>
                  <button
                    onClick={() => loadSampleDoc('SIGNATURE')}
                    className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] hover:border-emerald-500 text-left transition-all"
                  >
                    <div className="font-bold text-xs text-[#101828]">Sample Signature</div>
                    <div className="text-[10px] text-[#667085]">Ink Pen on Paper (20KB)</div>
                  </button>
                  <button
                    onClick={() => loadSampleDoc('PAN')}
                    className="p-2.5 rounded-xl bg-[#F8FAFF] border border-[#E4E7EC] hover:border-purple-500 text-left transition-all"
                  >
                    <div className="font-bold text-xs text-[#101828]">Sample PAN Card</div>
                    <div className="text-[10px] text-[#667085]">Single Side Print</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AI Detection & Suggested Action */}
      {currentStep >= 2 && (
        <div className="space-y-4">
          {/* AI Detection Banner */}
          <div className="clay-card p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#155EEF] text-white">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#071A52]">
                      AI Document Detection:
                    </span>
                    <span className="text-xs bg-[#155EEF] text-white font-bold px-2 py-0.5 rounded-full uppercase">
                      {documentType} Identified
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] mt-0.5">
                    {documentType === 'AADHAAR' 
                      ? 'Detected Indian National ID (Aadhaar). Front & Back alignment suggested.'
                      : documentType === 'PHOTO'
                      ? 'Detected Passport Photo Portrait. 8-Up or 16-Up Sheet suggested.'
                      : documentType === 'SIGNATURE'
                      ? 'Detected Handwritten Signature. Background cleanup to 20 KB recommended.'
                      : 'Detected Standard Document. Ready for crisp printout.'}
                  </p>
                </div>
              </div>

              {/* Back side upload trigger for Aadhaar */}
              {documentType === 'AADHAAR' && !docImageBack && (
                <label className="clay-button-royal px-3 py-1.5 font-bold text-xs cursor-pointer flex items-center gap-1 self-start sm:self-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                  <span>+ Add Back Side</span>
                </label>
              )}
            </div>
          </div>

          {/* Action Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                setSelectedAction('AADHAAR_FRONT_BACK');
                setDocumentType('AADHAAR');
              }}
              className={`clay-card p-3 text-left transition-all ${
                selectedAction === 'AADHAAR_FRONT_BACK'
                  ? 'border-2 border-[#155EEF] bg-blue-50/50 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-extrabold text-xs text-[#071A52] flex items-center justify-between">
                <span>Aadhaar Smart A4</span>
                {selectedAction === 'AADHAAR_FRONT_BACK' && <CheckCircle2 className="w-4 h-4 text-[#155EEF]" />}
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Stack Front & Back on one A4 page with fold line</p>
            </button>

            <button
              onClick={() => {
                setSelectedAction('PASSPORT_8_UP');
                setDocumentType('PHOTO');
                setColorMode('COLOR');
              }}
              className={`clay-card p-3 text-left transition-all ${
                selectedAction === 'PASSPORT_8_UP'
                  ? 'border-2 border-[#FF6B00] bg-orange-50/50 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-extrabold text-xs text-[#071A52] flex items-center justify-between">
                <span>8 Passport Photos</span>
                {selectedAction === 'PASSPORT_8_UP' && <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />}
              </div>
              <p className="text-[11px] text-[#667085] mt-1">35x45mm grid with cutting guides on photo paper</p>
            </button>

            <button
              onClick={() => {
                setSelectedAction('SIGNATURE_20KB');
                setDocumentType('SIGNATURE');
              }}
              className={`clay-card p-3 text-left transition-all ${
                selectedAction === 'SIGNATURE_20KB'
                  ? 'border-2 border-emerald-500 bg-emerald-50/50 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-extrabold text-xs text-[#071A52] flex items-center justify-between">
                <span>Signature 20 KB</span>
                {selectedAction === 'SIGNATURE_20KB' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-[#667085] mt-1">Remove background to pure white for SSC/UPSC portal</p>
            </button>
          </div>

          {/* STEP 3 & 4: Live Preview & Print Dispatch Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual Canvas Preview (1 Col) */}
            <div className="clay-card p-4 flex flex-col items-center justify-center bg-[#F1F4F9]">
              <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-2 self-start">
                Preview Before Spooling:
              </span>
              <div className="w-[180px] h-[254px] bg-white shadow-lg border border-gray-300 rounded p-2 flex flex-col items-center justify-center relative overflow-hidden">
                {docImageFront ? (
                  <div className="w-full h-full flex flex-col items-center justify-around">
                    <img
                      src={docImageFront}
                      alt="Front"
                      className={`w-full max-h-[46%] object-contain rounded border border-gray-200 ${
                        colorMode === 'BW' ? 'grayscale' : ''
                      }`}
                    />
                    {docImageBack && (
                      <>
                        <div className="w-full border-t border-dashed border-gray-300 my-1"></div>
                        <img
                          src={docImageBack}
                          alt="Back"
                          className={`w-full max-h-[46%] object-contain rounded border border-gray-200 ${
                            colorMode === 'BW' ? 'grayscale' : ''
                          }`}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-[10px]">No image loaded</span>
                  </div>
                )}
                <div className="absolute bottom-1 text-[7px] text-gray-400 font-mono">
                  CYBERSEVA SMART PRINT
                </div>
              </div>
              <span className="text-[10px] text-[#667085] mt-2">
                100% Scale • Margins Auto-fitted
              </span>
            </div>

            {/* Print & Customer Settings (2 Cols) */}
            <div className="md:col-span-2 clay-card p-5 space-y-4">
              {/* Customer Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Customer Name:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-medium text-[#101828] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Mobile No (Optional):</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F6F8FC] border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl px-3 py-2 text-xs font-medium text-[#101828] outline-none"
                  />
                </div>
              </div>

              {/* Printer Hardware Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Color Mode:</label>
                  <div className="grid grid-cols-2 gap-1 bg-[#F1F4F9] p-1 rounded-xl text-xs">
                    <button
                      onClick={() => setColorMode('BW')}
                      className={`py-1.5 rounded-lg font-bold transition-all ${
                        colorMode === 'BW' ? 'bg-white text-[#101828] shadow-sm' : 'text-[#667085]'
                      }`}
                    >
                      B&W
                    </button>
                    <button
                      onClick={() => setColorMode('COLOR')}
                      className={`py-1.5 rounded-lg font-bold transition-all ${
                        colorMode === 'COLOR' ? 'bg-[#FF6B00] text-white shadow-sm' : 'text-[#667085]'
                      }`}
                    >
                      Color
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Copies:</label>
                  <div className="flex items-center border border-[#E4E7EC] rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="px-3 py-1.5 bg-[#F6F8FC] hover:bg-gray-200 text-[#101828] font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-full text-center text-xs font-bold">{copies}</span>
                    <button
                      onClick={() => setCopies(copies + 1)}
                      className="px-3 py-1.5 bg-[#F6F8FC] hover:bg-gray-200 text-[#101828] font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#101828] block mb-1">Printer Spooler:</label>
                  <select
                    value={selectedPrinterId}
                    onChange={(e) => setSelectedPrinterId(e.target.value)}
                    className="w-full bg-[#F6F8FC] border border-[#E4E7EC] rounded-xl px-2 py-2 text-xs font-medium text-[#101828] outline-none truncate"
                  >
                    {printers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Billing & Dynamic UPI QR Section */}
              <div className="bg-[#FAFBFF] p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block font-bold">
                    Itemized Bill Calculation:
                  </span>
                  <div className="text-xl font-extrabold text-[#071A52] mt-0.5">
                    ₹{total} <span className="text-xs text-[#667085] font-normal">({services.map(s => s.name).join(', ')})</span>
                  </div>
                  
                  {/* Payment Mode Selector */}
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <button
                      onClick={() => setPaymentMode('UPI_QR')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        paymentMode === 'UPI_QR'
                          ? 'bg-[#155EEF] text-white shadow-sm'
                          : 'bg-[#F1F4F9] text-[#667085]'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI QR</span>
                    </button>
                    <button
                      onClick={() => setPaymentMode('CASH')}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        paymentMode === 'CASH'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#F1F4F9] text-[#667085]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Cash Paid</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic QR for Amount */}
                {paymentMode === 'UPI_QR' && (
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#E4E7EC] shadow-sm">
                    <QRCodeSVG value={upiPayString} size={64} level="M" />
                    <div className="text-left text-xs">
                      <div className="font-extrabold text-[#071A52]">Pay ₹{total}</div>
                      <div className="text-[10px] text-[#667085]">{settings.upiId}</div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-bold">
                        Zero Gateway Fee
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dispatch Print & Complete Job Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#667085] hover:text-[#071A52]"
                >
                  ← Back to Upload
                </button>

                <button
                  onClick={handleDispatchJob}
                  disabled={isProcessing || isFinished}
                  className="clay-button-orange px-6 py-3 font-extrabold text-sm flex items-center gap-2 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Spooling to Printer & Generating Bill...</span>
                    </>
                  ) : isFinished ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Job Dispatched Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-4 h-4" />
                      <span>Print & Collect ₹{total}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
