import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import { Loader2, CheckCircle, Eye, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { useUserContext } from '../../context/UserContext';

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Investigation Modal State
    const [selectedReport, setSelectedReport] = useState(null);
    const [isInvestigating, setIsInvestigating] = useState(false);

    const {mosques} = useUserContext();

  


    const navigate = useNavigate();

    const fetchReports = async (pageNum, isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            const res = await privateAxiosInstance.get(`/reports/get?page=${pageNum}&limit=10`);

            // OLD (Incorrect): const { reports: newReports, totalPages: pages } = res.data.data;

            // NEW (Correct):
            const { reports } = res.data.data; // The reports are inside data
            const { totalPages } = res.data;   // The totalPages are at the top level

            setReports(prev => isLoadMore ? [...prev, ...reports] : reports);
            setTotalPages(totalPages);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
const handleViewMosque = async (mosqueId) => {

    const localMosque = mosques?.find(m => m.id === mosqueId);

    if (localMosque) {
            navigate(`/mosque/${mosqueId}`, { state: { mosque: localMosque } });
            return;
        }

    setIsInvestigating(true);
    try {
        const res = await privateAxiosInstance.get(`mosques/get-mosque/${mosqueId}`);
        navigate(`/mosque/${mosqueId}`, {state: {mosque: res.data.mosque}});
    } catch (err) {
        console.error("Failed to fetch mosque details:", err.response.data);
      
    } finally {
        setIsInvestigating(false);
    }
};

// 3. Resolution handler: The single source of truth for resolving
const handleResolve = async (id) => {
    try {
       const res = await privateAxiosInstance.patch(`/reports/resolve/${id}`);
       if(res.status < 400){
         setReports(prev => prev.filter(r => r.id !== id));
        setSelectedReport(null); // Close modal
        setIsInvestigating(false); 
        console.log(res.data)
       }
    } catch (err) {
        console.error("Failed to resolve:", err.response.data || err.message);
    }
};

    useEffect(() => { fetchReports(1); }, []);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 mt-24">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShieldAlert className="text-emerald-700" /> Pending Reports
            </h1>

            {reports.length === 0 && !loading ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-500 font-medium">No pending reports found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">{report.targetMosqueName}</h3>
                                <p className="text-sm text-gray-500">{report.reporterName}</p>
                            </div>
                            <button 
    onClick={() => setSelectedReport(report)} // Just open the modal
    className="p-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100"
>
    <Eye className="w-5 h-5" />
</button>
                        </div>
                    ))}

                    {/* Load More Button Positioned Below the List */}
                    {page < totalPages && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => {
                                    const nextPage = page + 1;
                                    setPage(nextPage);
                                    fetchReports(nextPage, true);
                                }}
                                disabled={loadingMore}
                                className="bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-800 transition-all flex items-center gap-2"
                            >
                                {loadingMore ? <Loader2 className="animate-spin w-5 h-5" /> : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            )}



            {/* Investigation Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Investigation</h2>
                            <button onClick={() => setSelectedReport(null)}><X className="w-6 h-6 text-gray-500" /></button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <p><strong>Reason:</strong> {selectedReport.reasonCategory.replace('_', ' ')}</p>
                            <p className="bg-gray-50 p-3 rounded-lg">{selectedReport.customReason || "No additional details provided."}</p>
                            <p><strong>Reporter:</strong> {selectedReport.reporterName} ({selectedReport.reporterEmail})</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                         <button 
    onClick={() => handleViewMosque(selectedReport.mosqueId)} 
    disabled={isInvestigating}
    className="flex-1 bg-emerald-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
>
    {isInvestigating ? <Loader2 className="animate-spin w-4 h-4" /> : "View Live Mosque"}
</button>
                            <button
                                onClick={() => handleResolve(selectedReport.id)}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> Resolve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportList;