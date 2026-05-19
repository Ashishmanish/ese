import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintDetails from './pages/ComplaintDetails';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/new-complaint" element={user ? <ComplaintForm /> : <Navigate to="/login" />} />
        <Route path="/complaint/:id" element={user ? <ComplaintDetails /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
