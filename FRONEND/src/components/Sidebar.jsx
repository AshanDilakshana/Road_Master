import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { UserIcon, HomeIcon, MessageSquareIcon, LogOutIcon, AlertTriangleIcon } from 'lucide-react';

const Sidebar = ({ userType }) => {
  const { logout } = useAuth();
  const { unreadCount } = useMessages();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <div className="bg-blue-800 text-white h-full min-h-screen w-64 p-5 flex flex-col">
      <div className="mb-10">
        <div className="flex items-center justify-center mb-6">
          {userType === 'user' ? <UserIcon size={40} /> : userType === 'admin' ? <UserIcon size={40} /> : <AlertTriangleIcon size={40} />}
        </div>
        <h2 className="text-xl font-bold text-center mb-2">
          {userType === 'user' ? 'User' : userType === 'admin' ? 'Main Admin' : 'Subadmin'}
        </h2>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to={`/${userType === 'user' ? 'user' : userType}-dashboard`} className="flex items-center p-3 rounded-md hover:bg-blue-700 transition-colors border border-blue-700">
              <HomeIcon className="mr-3" size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          {userType === 'admin' && <li>
              <Link to="/admin-management" className="flex items-center p-3 rounded-md hover:bg-blue-700 transition-colors border border-blue-700">
                <UserIcon className="mr-3" size={20} />
                <span>Admins</span>
              </Link>
            </li>}
          <li>
            <Link to="/messages" className="flex items-center p-3 rounded-md hover:bg-blue-700 transition-colors border border-blue-700 relative">
              <MessageSquareIcon className="mr-3" size={20} />
              <span>Messages</span>
              {unreadCount > 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>}
            </Link>
          </li>
          {userType !== 'user' && <li>
              <Link to="/information-tab" className="flex items-center p-3 rounded-md hover:bg-blue-700 transition-colors border border-blue-700">
                <AlertTriangleIcon className="mr-3" size={20} />
                <span>Information</span>
              </Link>
            </li>}
        </ul>
      </nav>
      <div className="mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-md hover:bg-red-600 transition-colors bg-red-700">
          <LogOutIcon className="mr-3" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>;
};

export default Sidebar; 