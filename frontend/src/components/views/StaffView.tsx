import React from 'react';
import { UserCheck, ShieldCheck, Key, Lock, CheckCircle2, Plus } from 'lucide-react';

export const StaffView: React.FC = () => {
  const staffMembers = [
    {
      id: 'staff-1',
      name: 'Rajesh Sharma',
      role: 'OWNER',
      access: 'Full Access (Settings, Pricing, All Studios, Inventory, Staff)',
      status: 'ACTIVE',
      phone: '+91 98765 43210'
    },
    {
      id: 'staff-2',
      name: 'Vikas Mishra',
      role: 'OPERATOR',
      access: 'Counter Documents + Printing + Jobs (No Pricing modification)',
      status: 'ACTIVE',
      phone: '+91 97112 33445'
    },
    {
      id: 'staff-3',
      name: 'Pawan Kumar',
      role: 'OPERATOR',
      access: 'Document Scanning + Photo Studio + Basic Print',
      status: 'ACTIVE',
      phone: '+91 94500 22119'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 text-[#155EEF]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Staff & Counter Permissions (स्टाफ और रोल्स)
            </h2>
            <p className="text-xs text-[#667085]">
              Role-based access control for cyber café operators, managers, and shop owners
            </p>
          </div>
        </div>

        <button className="clay-button-royal px-4 py-2 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      {/* Staff List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffMembers.map((member) => (
          <div key={member.id} className="clay-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#071A52] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#101828]">{member.name}</h3>
                  <span className="text-[10px] text-[#667085]">{member.phone}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                member.role === 'OWNER' ? 'bg-orange-100 text-[#FF6B00]' : 'bg-blue-100 text-[#155EEF]'
              }`}>
                {member.role}
              </span>
            </div>

            <div className="bg-[#F8FAFF] p-3 rounded-xl border border-[#E4E7EC] text-xs">
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">
                Permissions Granted:
              </span>
              <p className="text-[#344054] font-medium leading-relaxed">
                {member.access}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E4E7EC]">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active on Counter</span>
              </span>
              <button className="text-[#155EEF] hover:underline font-bold text-[11px]">
                Edit Role
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
