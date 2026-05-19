import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';

const Dashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const res = await axios.get('http://localhost:5000/api/complaints', config);
            setComplaints(res.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            fetchComplaints();
            return;
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const res = await axios.get(`http://localhost:5000/api/complaints/search?location=${searchTerm}`, config);
            setComplaints(res.data);
        } catch (error) {
            console.error('Error searching complaints:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredComplaints = filterCategory 
        ? complaints.filter(c => c.category === filterCategory) 
        : complaints;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Complaints Dashboard</h1>
                <Link 
                    to="/new-complaint" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Complaint
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by location..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 text-sm font-medium">
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Roads">Roads</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {filteredComplaints.length > 0 ? (
                        filteredComplaints.map((complaint) => (
                            <li key={complaint._id}>
                                <Link to={`/complaint/${complaint._id}`} className="block hover:bg-gray-50 transition-colors">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                {complaint.title}
                                            </p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Category: {complaint.category}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Location: {complaint.location}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-8 text-center text-gray-500">
                            No complaints found.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
