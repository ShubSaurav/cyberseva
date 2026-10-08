import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  QrCode, 
  Phone, 
  MapPin, 
  IndianRupee,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { ShopSettings, StaffMember } from '../../types';
import { Language, translations } from '../../utils/i18n';
import { api } from '../../services/api';

interface SettingsStaffViewProps {
  settings: ShopSettings;
  onUpdateSettings: (settings: ShopSettings) => void;
  language: Language;
}

export const SettingsStaffView: React.FC<SettingsStaffViewProps> = ({
  settings,
  onUpdateSettings,
  language
}) => {
  const t = translations[language];

  // Shop Details form state
  const [formData, setFormData] = useState<ShopSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New staff modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState(t.newStaffRoleOperator);
  const [newStaffPhone, setNewStaffPhone] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings(formData);
      onUpdateSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    try {
      const res = await api.addStaff({
        name: newStaffName.trim(),
        role: newStaffRole,
        phone: newStaffPhone.trim() || undefined
      });
      if (res.data) {
        const updated = { ...formData, staffMembers: res.data };
        setFormData(updated);
        onUpdateSettings(updated);
        setNewStaffName('');
        setNewStaffPhone('');
        setIsAddStaffOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm(language === 'en' ? 'Remove this staff member?' : language === 'hi' ? 'क्या आप इस स्टाफ सदस्य को हटाना चाहते हैं?' : 'Kya is staff ko hatana chahte hain?')) return;
    try {
      const res = await api.deleteStaff(id);
      if (res.data) {
        const updated = { ...formData, staffMembers: res.data };
        setFormData(updated);
        onUpdateSettings(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const staffList = formData.staffMembers && formData.staffMembers.length > 0
    ? formData.staffMembers
    : [{ id: 'staff-1', name: formData.ownerName || 'Rajesh Sharma', role: 'Owner', active: true }];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="clean-card p-5 sm:p-6 bg-gradient-to-r from-blue-50/80 via-white to-purple-50/80 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071A52] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#155EEF]" />
            <span>{t.settingsTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t.settingsSub}
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Shop Profile (7 cols) */}
        <div className="lg:col-span-7 clean-card p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-[#155EEF]" />
            <h3 className="text-base font-extrabold text-[#071A52]">
              {t.shopDetailsSection}
            </h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-700 block">
                {t.shopNameLabel}
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">
                  {t.ownerNameLabel}
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-slate-700 flex items-center justify-between">
                <span>{t.upiIdLabel}</span>
                <span className="text-[10px] text-emerald-600 font-bold">For customer receipts</span>
              </label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-slate-700 block">
                {t.addressLabel}
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveSettingsBtn}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Staff Management (5 cols) */}
        <div className="lg:col-span-5 clean-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-extrabold text-[#071A52]">
                  {t.staffSection}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="btn-green px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.addStaffBtn}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            {t.staffSectionSub}
          </p>

          {/* Staff Members List */}
          <div className="space-y-2.5">
            {staffList.map((st) => (
              <div 
                key={st.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#155EEF] font-extrabold text-xs flex items-center justify-center">
                    {st.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                      {st.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {st.role} {st.phone ? `• ${st.phone}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {t.activeTag}
                  </span>
                  {staffList.length > 1 && (
                    <button
                      onClick={() => handleDeleteStaff(st.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#071A52] text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>{t.newStaffModalTitle}</span>
              </h3>
              <button 
                onClick={() => setIsAddStaffOpen(false)} 
                className="text-white hover:text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">
                  {t.newStaffNameLabel}
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Vikas Kumar, Sonu..."
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700 block">
                  {t.newStaffRoleLabel}
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900 bg-white"
                >
                  <option value={t.newStaffRoleOperator}>{t.newStaffRoleOperator}</option>
                  <option value={t.newStaffRoleHelper}>{t.newStaffRoleHelper}</option>
                  <option value={t.newStaffRoleOwner}>{t.newStaffRoleOwner}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">
                  Phone (Optional):
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-medium text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="btn-green px-4 py-2 font-bold text-xs"
                >
                  {t.saveNewStaffBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
