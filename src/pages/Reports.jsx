import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch reports from API
        setLoading(false);
        setReports([]);
    }, []);

    return (
        <div className="mt-24 min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-lg">No reports yet</p>
                        <p className="text-gray-400 text-sm mt-2">Reports will appear here when available</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-gray-800">{report.title}</h3>
                                <p className="text-gray-500 text-sm mt-2">{report.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
