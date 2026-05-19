import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Bot, AlertTriangle, Building, MessageSquareText, CheckCircle } from 'lucide-react';

const ComplaintDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdate, setStatusUpdate] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchComplaintDetails();
    }, [id]);

    const fetchComplaintDetails = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const res = await axios.get(`${API_URL}/api/complaints/${id}`, config);
            setComplaint(res.data);
            setStatusUpdate(res.data.status);
        } catch (error) {
            console.error('Error fetching complaint:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const res = await axios.put(`${API_URL}/api/complaints/${id}`, { status: statusUpdate }, config);
            setComplaint(res.data);
            alert('Status updated successfully!');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading details...</div>;
    }

    if (!complaint) {
        return <div className="text-center py-12 text-red-500">Complaint not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Complaint Details & Status Update */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
                                <p className="text-sm text-gray-500 mt-1">Submitted on {new Date(complaint.createdAt).toLocaleString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                  complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {complaint.status}
                            </span>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-6">
                            <p>{complaint.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                            <div><strong>Category:</strong> {complaint.category}</div>
                            <div><strong>Location:</strong> {complaint.location}</div>
                            <div><strong>User Name:</strong> {complaint.name}</div>
                            <div><strong>User Email:</strong> {complaint.email}</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
                        <form onSubmit={handleStatusUpdate} className="flex items-center gap-4">
                            <select
                                className="block w-full sm:w-1/2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={statusUpdate}
                                onChange={(e) => setStatusUpdate(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <button
                                type="submit"
                                disabled={updateLoading || statusUpdate === complaint.status}
                                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${updateLoading || statusUpdate === complaint.status ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {updateLoading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: AI Analysis */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 sticky top-6">
                        <div className="flex items-center mb-4 text-indigo-700">
                            <Bot className="h-6 w-6 mr-2" />
                            <h2 className="text-xl font-bold">AI Analysis</h2>
                        </div>
                        
                        {complaint.aiPriority ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" /> Priority Level
                                    </h3>
                                    <p className="text-gray-900 font-medium">{complaint.aiPriority}</p>
                                </div>
                                
                                <div>
                                    <h3 className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <Building className="h-4 w-4 mr-1 text-blue-500" /> Recommended Department
                                    </h3>
                                    <p className="text-gray-900">{complaint.aiDepartment}</p>
                                </div>

                                <div>
                                    <h3 className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> AI Summary
                                    </h3>
                                    <p className="text-gray-700 text-sm italic border-l-2 border-indigo-200 pl-3">{complaint.aiSummary}</p>
                                </div>

                                <div>
                                    <h3 className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                                        <MessageSquareText className="h-4 w-4 mr-1 text-purple-500" /> Auto-Generated Response
                                    </h3>
                                    <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-800 shadow-inner">
                                        {complaint.aiResponse}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <Bot className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p>AI analysis is pending or not available for this complaint.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
