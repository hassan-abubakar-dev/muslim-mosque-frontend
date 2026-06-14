import { X } from "lucide-react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";

const SelectedMosqueModel = ({ 
    selectedMosque, 
  setSelectedMosque, 
  setPendingMosques, 
  setSuspendedMosques }) => {

const isSuspended = selectedMosque.status === 'suspended';

 const isDev = import.meta.env.VITE_ENV === 'development';

   
const handleAction = async (id) => {
        try {
            if (isSuspended) {
                const res = await privateAxiosInstance.patch(`/mosques/moderate/${id}`);
                if (res.status < 400) {
                    // Update Suspended list: Remove the now-unsuspended mosque
                   setSuspendedMosques(prev => prev.filter(m => m.id !== id));
               
                }
            } else {
                const res = await privateAxiosInstance.put(`/mosques/verified-mosque/${id}`);
                if (res.status < 400) {
                    // Update Pending list: Remove the now-verified mosque
                    setPendingMosques(prev => prev.filter(m => m.id !== id));
                }
            }
            setSelectedMosque(null);
        } catch (err) {
            if(isDev){
                console.error("Action failed", err?.response?.data || err);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-emerald-100">
                
                {/* BRANDED HEADER: Replaced slate-900 with emerald-800 */}
                <div className="bg-emerald-800 p-6 text-white relative">
                    <button 
                        onClick={() => setSelectedMosque(null)} 
                        className="absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-xl font-black">{selectedMosque.name}</h3>
                    <p className="text-xs text-emerald-100 mt-1 opacity-90">
                        {selectedMosque.localGovernment}, {selectedMosque.state}, {selectedMosque.country}
                    </p>
                </div>

                {/* CONTENT AREA */}
                <div className="p-6 space-y-6 text-xs font-medium">
                    <div className="bg-emerald-50/50 p-4 border border-emerald-100 rounded-xl">
                        <p className="text-emerald-900 leading-relaxed text-sm font-medium">
                            {selectedMosque.description}
                        </p>
                    </div>
                    
                    <div className="space-y-1">
                      {/* Safely access the admin user info */}
<p className="text-slate-800 font-bold text-sm">
    {selectedMosque?.mosquAdmin?.[0]?.user?.firstName} {selectedMosque?.mosquAdmin?.[0]?.user?.surName}
</p>
<p className="text-emerald-700 font-semibold">
    {selectedMosque?.mosquAdmin?.[0]?.user?.email}
</p>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex items-center justify-end gap-3">
                    <button 
                        onClick={() => setSelectedMosque(null)} 
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        Cancel Audit
                    </button>
                   <button 
            onClick={() => handleAction(selectedMosque.id)} 
            className={`px-4 py-2 text-white font-bold rounded-xl text-xs ${isSuspended ? 'bg-amber-700' : 'bg-emerald-700'}`}
        >
            {isSuspended ? "Unsuspend Mosque" : "Verify Mosque & Deploy"}
        </button>
                </div>
            </div>
        </div>
    );
};

export default SelectedMosqueModel;