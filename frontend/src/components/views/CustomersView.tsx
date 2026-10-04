import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Calendar, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  onNewJobForCustomer: (customerName: string, phone: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onNewJobForCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-1',
      name: 'Amit Kumar Verma',
      phone: '+91 98234 11223',
      totalJobs: 14,
      totalSpent: 420,
      lastVisit: 'Today, 10:15 AM',
      isGuest: false
    },
    {
      id: 'cust-2',
      name: 'Pooja Tiwari',
      phone: '+91 97112 55667',
      totalJobs: 6,
      totalSpent: 195,
      lastVisit: 'Today, 11:30 AM',
      isGuest: false
    },
    {
      id: 'cust-3',
      name: 'Rameshwar Singh (Kisan Mitra)',
      phone: '+91 94500 88991',
      totalJobs: 28,
      totalSpent: 940,
      lastVisit: 'Yesterday',
      isGuest: false
    },
    {
      id: 'cust-4',
      name: 'Sunita Devi',
      phone: '+91 91200 44332',
      totalJobs: 3,
      totalSpent: 85,
      lastVisit: '2 days ago',
      isGuest: false
    }
  ]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Customer Directory (ग्राहक संपर्क सूची)
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Privacy-First (Minimal Info)
              </span>
            </h2>
            <p className="text-xs text-[#667085]">
              Minimal personal information stored. Zero sensitive document retention.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer name or mobile..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E4E7EC] focus:border-[#155EEF] rounded-xl text-xs outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="clay-card p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-[#155EEF] font-extrabold flex items-center justify-center text-sm">
                  {c.name.charAt(0)}
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">
                  {c.totalJobs} Jobs Done
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-[#071A52] mt-2.5">{c.name}</h3>
              <p className="text-xs text-[#667085] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                <span>{c.phone}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-[#E4E7EC] space-y-2">
              <div className="flex justify-between text-xs text-[#667085]">
                <span>Total Spent:</span>
                <span className="font-extrabold text-[#071A52]">₹{c.totalSpent}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#667085]">
                <span>Last Visit:</span>
                <span>{c.lastVisit}</span>
              </div>

              <button
                onClick={() => onNewJobForCustomer(c.name, c.phone)}
                className="w-full py-2 rounded-xl bg-[#F1F4F9] hover:bg-[#155EEF] hover:text-white font-bold text-xs text-[#071A52] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Create Job for {c.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
