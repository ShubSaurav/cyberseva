import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  PlusCircle,
  FileText,
  Camera,
  FileStack,
  Printer,
  Clock,
  Users,
  CreditCard,
  Sliders,
  Package,
  BarChart3,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: '' },
    { id: 'copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
    { id: 'new-job', label: 'New Job Counter', icon: PlusCircle, badge: 'Fast' },
    { id: 'document-studio', label: 'Document Studio', icon: FileText, badge: 'Aadhaar' },
    { id: 'photo-studio', label: 'Photo Studio', icon: Camera, badge: '8-Up' },
    { id: 'pdf-studio', label: 'PDF Studio', icon: FileStack, badge: 'Tools' },
    { id: 'printing', label: 'Print Bridge', icon: Printer, badge: 'Spooler' },
    { id: 'jobs', label: 'Jobs Queue', icon: Clock, badge: '147' },
    { id: 'customers', label: 'Customers', icon: Users, badge: '' },
    { id: 'payments', label: 'Payments & UPI', icon: CreditCard, badge: 'QR' },
    { id: 'printers', label: 'Printers Status', icon: Sliders, badge: '3 Dev' },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: 'Alerts' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: '₹' },
    { id: 'staff', label: 'Staff & Roles', icon: UserCheck, badge: '' },
    { id: 'settings', label: 'Shop Settings', icon: Settings, badge: '' },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-white border-r border-[#E4E7EC] flex flex-col justify-between transition-all duration-300 z-40 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Logo Section */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E4E7EC] bg-[#FAFBFF]">
          {!collapsed ? (
            <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              {/* Full Brand Logo with Name & Tagline */}
              <img
                src="/cybersevalogo2.png"
                alt="CyberSeva - One Counter. Every Service."
                className="h-10 w-auto object-contain max-w-[190px]"
              />
            </div>
          ) : (
            <div className="mx-auto cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              {/* Standalone Brand Emblem Icon */}
              <img
                src="/cybersevalogo1.png"
                alt="CyberSeva"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[#F1F4F9] text-[#667085] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all text-left ${
                  isActive
                    ? 'bg-[#155EEF] text-white shadow-md shadow-[#155EEF]/25 font-bold'
                    : 'text-[#344054] hover:bg-[#F6F8FC] hover:text-[#071A52]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : item.id === 'copilot' ? 'text-[#FF6B00]' : 'text-[#667085]'
                  }`}
                />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === 'AI'
                            ? 'bg-orange-100 text-[#FF6B00]'
                            : item.badge === 'Alerts'
                            ? 'bg-red-50 text-red-600 font-bold'
                            : 'bg-[#F1F4F9] text-[#667085]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Privacy & Operating System Badge */}
      <div className="p-3 border-t border-[#E4E7EC] bg-[#FAFBFF]">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-[#071A52]">
              <ShieldCheck className="w-4 h-4 text-[#155EEF]" />
              <span>Process, Don't Store</span>
            </div>
            <p className="text-[11px] text-[#667085] mt-1 leading-snug">
              Encrypted memory buffer • Auto-purge enabled for Aadhaar & PAN security.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Bridge v1.4.2 Windows Active</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Privacy Shield Active">
            <ShieldCheck className="w-5 h-5 text-[#155EEF]" />
          </div>
        )}
      </div>
    </aside>
  );
};
