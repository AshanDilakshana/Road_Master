import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MessageModal from '../components/MessageModal';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { AlertCircleIcon, CheckCircleIcon, MessageSquareIcon, ClipboardIcon } from 'lucide-react';

const SubAdminDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useMessages();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const navigate = useNavigate();












  return <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="subadmin" />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Sub Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsMessageModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
                <MessageSquareIcon size={16} className="mr-2" />
                Create Message
              </button>
              <span className="text-gray-600">{user?.email}</span>
              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Sabaragamuwa
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Informations Card */}
            <Link to="/information-tab" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <ClipboardIcon size={32} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Informations</h2>
              <p className="text-gray-600">View all reports</p>
            </Link>
            {/* Pending Card */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <AlertCircleIcon size={32} className="text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Pending</h2>
              <p className="text-gray-600">6</p>
            </div>
            {/* Messages Card */}
            <div onClick={() => navigate('/messages')} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="bg-purple-100 p-4 rounded-full mb-4 relative">
                <MessageSquareIcon size={32} className="text-purple-600" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>}
              </div>
              <h2 className="text-xl font-semibold mb-2">Messages</h2>
              <p className="text-gray-600">{unreadCount} unread</p>
            </div>
            {/* Done Card */}
            <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircleIcon size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Done</h2>
              <p className="text-gray-600">2</p>
            </div>
          </div>
          {/* Recent Reports */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Recent Reports</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Eheliyagoda / Sabaragamuwa
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Pothole on main road near the market
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Reported: June 12, 2023</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    </div>
                  </div>
                  <Link to="/inquiry-details/1" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Ratnapura / Sabaragamuwa
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Damaged guardrail on highway
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Reported: June 10, 2023</span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Approved
                      </span>
                    </div>
                  </div>
                  <Link to="/inquiry-details/2" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Balangoda / Sabaragamuwa
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Faded road markings near school zone
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Reported: June 5, 2023</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Done
                      </span>
                    </div>
                  </div>
                  <Link to="/inquiry-details/3" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} recipientType="admin" />
    </div>;
};

export default SubAdminDashboard; 