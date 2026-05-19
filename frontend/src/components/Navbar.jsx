import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl">
                            <ShieldAlert className="h-8 w-8" />
                            <span>SmartComplaint</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">Welcome, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
