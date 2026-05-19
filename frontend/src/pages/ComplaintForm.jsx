import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ComplaintForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        title: '',
        description: '',
        category: 'Water Supply',
        location: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const res = await axios.post('http://localhost:5000/api/complaints', formData, config);
            
            // Automatically trigger AI analysis
            try {
                await axios.post('http://localhost:5000/api/ai/analyze', { complaintId: res.data._id }, config);
            } catch (aiError) {
                console.error("AI Analysis failed but complaint was created", aiError);
            }

            navigate('/');
        } catch (error) {
            console.error('Error creating complaint:', error);
            alert('Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Register a New Complaint</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.name}
                                onChange={handleChange}
                                readOnly={!!user?.name}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly={!!user?.email}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Complaint Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g., Water Leakage Issue"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            placeholder="Please provide specific details about the issue..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Water Supply">Water Supply</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Sanitation">Sanitation</option>
                                <option value="Roads">Roads</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                name="location"
                                required
                                placeholder="e.g., Ghaziabad Market"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
                        >
                            {loading ? 'Submitting & Analyzing with AI...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;
