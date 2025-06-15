import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, LockIcon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, userType);
      // Redirect based on user type
      if (userType === 'user') {
        navigate('/user-dashboard');
      } else if (userType === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/subadmin-dashboard');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">ROAD MASTER</h1>
          <p className="text-gray-600 mt-2">Road Development Authority</p>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded-md">
              <div className="px-3 py-2 bg-gray-100 border-r">
                <UserIcon size={20} className="text-gray-500" />
              </div>
              <input id="email" type="email" className="w-full px-3 py-2 outline-none" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-md">
              <div className="px-3 py-2 bg-gray-100 border-r">
                <LockIcon size={20} className="text-gray-500" />
              </div>
              <input id="password" type="password" className="w-full px-3 py-2 outline-none" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
              Login As
            </label>
            <select id="userType" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={userType} onChange={e => setUserType(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Main Admin</option>
              <option value="subadmin">Province Admin</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
            Login
          </button>
        </form>
        <div className="text-center mt-6">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>;
};

export default Login; 