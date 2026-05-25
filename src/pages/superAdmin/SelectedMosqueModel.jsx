import { X } from "lucide-react";
import { useEffect } from "react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";


const SelectedMosqueModel = ({selectedMosque, setSelectedMosque, setPendingMosques, setTotalPendingMosqueCounts}) => {

    const handleApproveMosque = async(id) => {
     
        try{
            const res = await privateAxiosInstance.put(`/mosques/verified-mosque/${id}`);
            if(res.status < 400){
                setSelectedMosque(null);
                setPendingMosques(prev => prev.filter(mosqueId => mosqueId.id === id));
                
            }

        } catch(err){
      console.error(err.response.data)
    }
    }


    return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-slate-900 p-6 text-white relative">
              <button onClick={() => setSelectedMosque(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full cursor-pointer"><X size={16} /></button>
              <h3 className="text-xl font-black text-white">{selectedMosque.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{selectedMosque.localGovernment}, {selectedMosque.state}, {selectedMosque.country},</p>
            </div>
            <div className="p-6 space-y-4 text-xs font-medium">
              <p className="text-slate-700 leading-relaxed text-sm bg-gray-50 p-4 border rounded-xl font-sans font-medium">{selectedMosque.description}</p>
              <p className="text-gray-500 font-bold"><span className="text-black">Applicant/admin Identity Node:</span> {selectedMosque?.mosquAdmin[0]?.user?.firstName}  {selectedMosque?.mosquAdmin[0]?.user?.surName} ( {selectedMosque?.mosquAdmin[0]?.user?.email})</p>
            </div>
            <div className="bg-gray-50 border-t p-4 px-6 flex items-center justify-end gap-3">
              <button onClick={() => setSelectedMosque(null)} className="px-4 py-2 border text-gray-600 rounded-xl text-xs font-bold cursor-pointer">Cancel Audit</button>
              <button onClick={() => handleApproveMosque(selectedMosque.id)} className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer hover:bg-emerald-800">Verify Mosque & Deploy Live</button>
            </div>
          </div>
        </div>
    );
};


export default SelectedMosqueModel;