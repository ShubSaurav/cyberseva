import React, { useState } from 'react';
import { 
  X, 
  IndianRupee, 
  CheckCircle2, 
  User, 
  Phone, 
  FileText, 
  Sparkles,
  CreditCard,
  Banknote,
  Clock
} from 'lucide-react';
import { Language, translations } from '../../utils/i18n';
import { ShopSettings, StaffMember, Job } from '../../types';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSale: (saleData: {
    serviceName: string;
    totalAmount: number;
    quantity: number;
    paymentMode: 'CASH' | 'UPI_QR' | 'PENDING';
    paymentStatus: 'PAID' | 'PENDING';
    operator: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
  }, printReceipt: boolean) => Promise<void>;
  settings: ShopSettings;
  language: Language;
  initialService?: string;
  initialAmount?: number;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({
  isOpen,
  onClose,
  onSaveSale,
  settings,
  language,
  initialService = '',
  initialAmount
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const quickServices = [
    { id: 'aadhaar', name: language === 'en' ? 'Aadhaar Print' : language === 'hi' ? 'आधार कार्ड प्रिंट' : 'Aadhaar Print' },
    { id: 'pan', name: language === 'en' ? 'PAN Card Service' : language === 'hi' ? 'पैन कार्ड प्रिंट' : 'PAN Card Print' },
    { id: 'photo', name: language === 'en' ? 'Passport Photos' : language === 'hi' ? 'पासपोर्ट साइज फोटो' : 'Passport Photo' },
    { id: 'xerox', name: language === 'en' ? 'Photocopy (Xerox)' : language === 'hi' ? 'फोटोकॉपी (Xerox)' : 'Photocopy Xerox' },
    { id: 'lamination', name: language === 'en' ? 'Lamination' : language === 'hi' ? 'लैमिनेशन' : 'Lamination' },
    { id: 'admit', name: language === 'en' ? 'Admit Card Print' : language === 'hi' ? 'एडमिट कार्ड प्रिंट' : 'Admit Card Print' },
    { id: 'form', name: language === 'en' ? 'Online Form Apply' : language === 'hi' ? 'ऑनलाइन फॉर्म अप्लाई' : 'Online Form' },
    { id: 'bill', name: language === 'en' ? 'Electricity Bill Pay' : language === 'hi' ? 'बिजली बिल भुगतान' : 'Bijli Bill Pay' },
  ];

  const [serviceName, setServiceName] = useState(initialService || quickServices[0].name);
  const [amount, setAmount] = useState<string>(initialAmount ? String(initialAmount) : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'UPI_QR' | 'PENDING'>('CASH');
  
  const staffList = settings.staffMembers && settings.staffMembers.length > 0 
    ? settings.staffMembers 
    : [{ id: 'owner', name: settings.ownerName || 'Rajesh Sharma', role: 'Owner', active: true }];

  const [operator, setOperator] = useState<string>(staffList[0].name);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (printReceipt: boolean) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert(language === 'en' ? 'Please enter a valid price/amount charged.' : language === 'hi' ? 'कृपया ली गई सही राशि दर्ज करें।' : 'Kripya sahi amount dalein.');
      return;
    }
    if (!serviceName.trim()) {
      alert(language === 'en' ? 'Please enter service name.' : language === 'hi' ? 'कृपया सेवा का नाम दर्ज करें।' : 'Kripya service ka naam dalein.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveSale({
        serviceName: serviceName.trim(),
        totalAmount: numericAmount,
        quantity: quantity || 1,
        paymentMode,
        paymentStatus: paymentMode === 'PENDING' ? 'PENDING' : 'PAID',
        operator,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined
      }, printReceipt);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#071A52] to-[#155EEF] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">{t.logSaleTitle}</h2>
              <p className="text-[11px] text-blue-200">{t.logSaleSub}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs text-slate-800">
          {/* Quick Select Service Chips */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-700 block text-[11px] uppercase tracking-wide">
              {t.quickSelectService}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceName(s.name)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    serviceName === s.name
                      ? 'bg-[#155EEF] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service Name Input */}
          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block">
              {t.serviceNameLabel}
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder={t.serviceNamePlaceholder}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF] shadow-xs"
            />
          </div>

          {/* Amount & Quantity (Flexible Pricing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-900 flex items-center justify-between">
                <span>{t.amountLabel}</span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ Custom Price</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-extrabold text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t.amountPlaceholder}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border-2 border-emerald-500/50 bg-emerald-50/20 font-extrabold text-base text-slate-900 focus:outline-none focus:border-emerald-600 shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-slate-700 block">
                {t.quantityLabel}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF] shadow-xs"
              />
            </div>
          </div>

          {/* Payment Mode (Cash, UPI, Pending) */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-700 block text-[11px] uppercase tracking-wide">
              {t.paymentModeLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border font-extrabold text-xs transition-all ${
                  paymentMode === 'CASH'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>{t.paymentCash}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('UPI_QR')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border font-extrabold text-xs transition-all ${
                  paymentMode === 'UPI_QR'
                    ? 'bg-[#155EEF] text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.paymentUpi}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('PENDING')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border font-extrabold text-xs transition-all ${
                  paymentMode === 'PENDING'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.paymentPending}</span>
              </button>
            </div>
          </div>

          {/* Staff Member (Dropdown) */}
          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.handledByLabel}</span>
            </label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 bg-white focus:outline-none focus:border-[#155EEF] shadow-xs"
            >
              {staffList.map((st) => (
                <option key={st.id} value={st.name}>
                  {st.name} {st.role ? `(${st.role})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 block text-[11px]">
                {t.customerNameLabel}
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.customerNamePlaceholder}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-xs text-slate-800 focus:outline-none focus:border-[#155EEF]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-600 block text-[11px]">
                {t.customerPhoneLabel}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.customerPhonePlaceholder}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-xs text-slate-800 focus:outline-none focus:border-[#155EEF]"
              />
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700"
          >
            {t.cancelBtn}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-auto btn-primary px-5 py-2 font-bold text-xs"
          >
            {t.saveSaleBtn}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="w-full sm:w-auto btn-green px-5 py-2 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.saveAndPrintReceiptBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
