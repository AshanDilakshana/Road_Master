import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MessageModal from '../components/MessageModal';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { PlusIcon, AlertCircleIcon, MessageSquareIcon } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useMessages();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const navigate = useNavigate();

  return <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="user" />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Road Master</h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsMessageModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
                <MessageSquareIcon size={16} className="mr-2" />
                Create Message
              </button>
              <span className="text-gray-600">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inform Card */}
            <Link to="/inform-form" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <PlusIcon size={32} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Inform</h2>
              <p className="text-gray-600">Report road damage or issues</p>
            </Link>
            {/* My Informs Card */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <AlertCircleIcon size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">My Informs</h2>
              <p className="text-gray-600">2</p>
            </div>
            {/* Messages Card */}
            <div onClick={() => navigate('/messages')} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="bg-yellow-100 p-4 rounded-full mb-4 relative">
                <MessageSquareIcon size={32} className="text-yellow-600" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>}
              </div>
              <h2 className="text-xl font-semibold mb-2">Messages</h2>
              <p className="text-gray-600">{unreadCount} unread</p>
            </div>
          </div>
          {/* Recent Informs Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Your Sent Information</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    Eheliyagoda / Sabaragamuwa
                  </h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Pothole on main road near the market
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: Pending</span>
                  <span>Submitted: 12 Jun 2023</span>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">
                    Avissawella / Western Province
                  </h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Damaged road signs near the school zone
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status: In Progress</span>
                  <span>Submitted: 5 Jun 2023</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} recipientType="admin" />
    </div>;
};

export default UserDashboard; 