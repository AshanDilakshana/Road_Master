import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MessageModal from '../components/MessageModal';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { AlertCircleIcon, ClockIcon, UserIcon, MessageSquareIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useMessages();
  const [filterStatus, setFilterStatus] = useState('pending');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for province stats
  const provinceStats = [{
    id: 1,
    name: 'Province 1',
    count: 10,
    trend: 'up'
  }, {
    id: 2,
    name: 'Province 2',
    count: 8,
    trend: 'up'
  }, {
    id: 3,
    name: 'Province 3',
    count: 5,
    trend: 'down'
  }];

  return <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="admin" />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsMessageModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
                <MessageSquareIcon size={16} className="mr-2" />
                Create Message
              </button>
              <div className="flex items-center text-gray-600">
                <ClockIcon size={18} className="mr-2" />
                <span>{new Date().toLocaleString()}</span>
              </div>
              <span className="text-gray-600">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* New Informs Card */}
            <Link to="/information-tab" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <AlertCircleIcon size={32} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">New Informs</h2>
              <p className="text-gray-600">2</p>
            </Link>
            {/* Messages Card */}
            <div onClick={() => navigate('/messages')} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="bg-yellow-100 p-4 rounded-full mb-4 relative">
                <AlertCircleIcon size={32} className="text-yellow-600" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>}
              </div>
              <h2 className="text-xl font-semibold mb-2">Messages</h2>
              <p className="text-gray-600">{unreadCount} unread</p>
            </div>
            {/* Sub Admins Card */}
            <Link to="/admin-management" className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <UserIcon size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Sub Admins</h2>
              <p className="text-gray-600">Manage sub-administrators</p>
            </Link>
          </div>
          {/* Information Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Sorted:{' '}
                {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </h2>
              <div className="flex space-x-2">
                <button onClick={() => setFilterStatus('pending')} className={`px-3 py-1 rounded-md ${filterStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                  Pending
                </button>
                <button onClick={() => setFilterStatus('approved')} className={`px-3 py-1 rounded-md ${filterStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                  Approved
                </button>
                <button onClick={() => setFilterStatus('done')} className={`px-3 py-1 rounded-md ${filterStatus === 'done' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                  Done
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {provinceStats.map(province => <tr key={province.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {province.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {province.trend === 'up' ? <span className="text-green-600">▲</span> : <span className="text-red-600">▼</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {province.count}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} recipientType="subadmin" />
    </div>;
};

export default AdminDashboard; 



{/* 

  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, FilterIcon } from 'lucide-react';
import axios from 'axios';

const InformationTab = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reportIssues/GetAllreport');
        if (response.data) {
          setReports(response.data.data);
          console.log('Fetched reports:', response.data.data);
        } else {
          console.error('Empty response');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(report => report.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Information Reports</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Road Issue Reports</h2>
            <div className="flex items-center">
              <FilterIcon size={18} className="mr-2 text-gray-600" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <div
                key={report._id}
                onClick={() => navigate(`/inquiry-details/${report._id}`)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">
                    {report.province} / {report.district}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : report.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Town: {report.nearbyTown}</p>
                <p className="text-gray-500 text-sm">
                  Reported on: {new Date(report.timeAndDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No reports found with the selected filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformationTab;
  
  */}