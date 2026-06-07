import { useState, useEffect } from 'react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import { Loader2, CheckCircle, Eye, X, MessageSquare, Mail } from 'lucide-react';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Modal State
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isResolving, setIsResolving] = useState(false);

    const fetchFeedbacks = async (pageNum, isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        try {
            // Using your production-ready endpoint structure
            const res = await privateAxiosInstance.get(`/feedback/get?page=${pageNum}&limit=10`);
            
            const { feedbacks: newFeedbacks } = res.data.data;
            const pages = res.data.totalPages;
            
            setFeedbacks(prev => isLoadMore ? [...prev, ...newFeedbacks] : newFeedbacks);
            setTotalPages(pages);
            console.log(page)
            
        } catch (err) {
            console.error("Failed to fetch feedbacks:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleResolve = async (id) => {
        setIsResolving(true);
        try {
            
           const res =  await privateAxiosInstance.patch(`/feedback/resolve/${id}`);
            
            setFeedbacks(prev => prev.filter(f => f.id !== id));
            setSelectedFeedback(null);
            console.log(res.data);
        } catch (err) {
            console.error("Failed to resolve feedback:", err);
        } finally {
            setIsResolving(false);
        }
    };

    useEffect(() => { fetchFeedbacks(1); }, []);

    return (
        <div className="space-y-4">
            {feedbacks.length === 0 && !loading ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-500 font-bold">No pending feedback found.</p>
                </div>
            ) : (
                <>
                    {feedbacks.map((f) => (
                        <div key={f.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900 capitalize">{f.type.replace('_', ' ')}</h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    From: {f.user ? `${f.user.firstName} ${f.user.surName}` : "Guest User"}
                                </p>
                            </div>
                            <button 
                                onClick={() => setSelectedFeedback(f)}
                                className="p-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    {page < totalPages && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => { const next = page + 1; setPage(next); fetchFeedbacks(next, true); }}
                                disabled={loadingMore}
                                className="bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-800 transition-all flex items-center gap-2"
                            >
                                {loadingMore ? <Loader2 className="animate-spin w-4 h-4" /> : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-lg font-black flex items-center gap-2">
                                <MessageSquare className="text-emerald-700" /> {selectedFeedback.type.toUpperCase()}
                            </h2>
                            <button onClick={() => setSelectedFeedback(null)}><X className="text-gray-400" /></button>
                        </div>
                        
                        <div className="text-sm text-gray-700 font-medium space-y-3">
                            <p className="bg-gray-50 p-4 rounded-xl">{selectedFeedback.message}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 uppercase font-bold">
                                <span>User: {selectedFeedback.user ? selectedFeedback.user.firstName : "Guest"}</span>
                                <span>Role: {selectedFeedback.user?.role || "N/A"}</span>
                            </div>
                            {selectedFeedback.contactConsent && (
                                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-lg">
                                    <Mail size={16} /> <span>Contact: {selectedFeedback.email}</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleResolve(selectedFeedback.id)}
                            disabled={isResolving}
                            className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all"
                        >
                            {isResolving ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle size={18} /> Mark as Resolved</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;