import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, LockIcon } from 'lucide-react';
import Axiso from 'axios'; 

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
      const user = await Axiso.post('http://localhost:8080/api/users/logging', {
        email,
        password,
      }); alert(user.data.message);
        
      await login(user.data);
      //console.log('Login successfulnnn:', user.data);
      if (user.data.userType == 'subadmin') {
        navigate('/subadmin-dashboard');
      } else if (user.data.userType == 'admin') {
        navigate('/admin-dashboard');
      } else if (user.data.userType == 'user') {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };
//fetch users in the data base
{/*useEffect(() => {
  const fetchUsers = async () => {
      const res = await fetch('http://localhost:8080/api/users/addmins');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await res.json();
  };
  fetchUsers();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);

      if (email.includes ('subadmin')) {
        navigate('/subadmin-dashboard');
      } else if (email.includes ('admin')) {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };  */}

  

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