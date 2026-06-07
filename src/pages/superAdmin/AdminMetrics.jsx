import React from 'react';
import { Users, Building2, ShieldCheck, AlertOctagon, Flag, UserX } from 'lucide-react';

const AdminMetrics = ({ stats }) => {
  // Define a color map so Tailwind CSS generates the required styles at build time
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
  };

  const metrics = [
    { label: "Active Users", val: stats.usersCounts.totalActiveUsers, icon: Users, color: "emerald" },
    { label: "Inactive Users", val: stats.usersCounts.totalInActiveUsers, icon: UserX, color: "red" },
    { label: "Total Agents", val: stats.usersCounts.totalAgents, icon: ShieldCheck, color: "indigo" },
    { label: "Verified Mosques", val: stats.mosquesCounts.totalVerifiedMosques, icon: Building2, color: "emerald" },
    { label: "Pending Mosques", val: stats.mosquesCounts.totalPendingMosques, icon: Building2, color: "red" },
    { label: "Reports", val: stats.pendingReportsCount, icon: Flag, color: "amber" },
    { label: "Feedbacks", val: stats.pendingFeedbackCount, icon: AlertOctagon, color: "emerald" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">{item.val}</h3>
          </div>
          {/* Access the pre-defined map */}
          <div className={`p-3 rounded-xl ${colorMap[item.color]}`}>
            <item.icon size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMetrics;