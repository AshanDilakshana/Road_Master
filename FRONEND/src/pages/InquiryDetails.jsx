import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { ArrowLeftIcon, MapPinIcon, UserIcon, CalendarIcon, PhoneIcon, SendIcon, FileTextIcon, DownloadIcon, XIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data for a single report
const mockReport = {
  id: 1,
  province: 'Sabaragamuwa',
  district: 'Ratnapura',
  town: 'Eheliyagoda',
  damageLevel: 'high',
  date: '2023-06-12T09:30:00',
  email: 'user@example.com',
  contactNumber: '+94 76 123 4567',
  location: [6.8583, 80.2625],
  images: ['https://images.unsplash.com/photo-1584463623578-77a2d8b9b0b2?q=80&w=500&auto=format', 'https://images.unsplash.com/photo-1624890240592-2b7f9a186ce4?q=80&w=500&auto=format'],
  message: "There is a large pothole in the middle of the road near the market. It's causing traffic and is dangerous for motorcycles.",
  status: 'pending'
};

const InquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const [status, setStatus] = useState(mockReport.status);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock admin list
  const allSubAdmins = [{
    id: 1,
    name: 'Subadmin 1',
    region: 'Western Province',
    province: 'Western'
  }, {
    id: 2,
    name: 'Subadmin 2',
    region: 'Sabaragamuwa Province',
    province: 'Sabaragamuwa'
  }, {
    id: 3,
    name: 'Subadmin 3',
    region: 'Southern Province',
    province: 'Southern'
  }];

  // Filter subadmins based on the report's province
  const relevantSubAdmins = allSubAdmins.filter(admin => admin.province === mockReport.province);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // In a real app, you would send this update to your backend
    // Here we'll just update localStorage to simulate persistence
    const reports = JSON.parse(localStorage.getItem('roadmaster_reports') || '[]');
    const updatedReports = reports.map((report) => {
      if (report.id === Number(id)) {
        return {
          ...report,
          status: newStatus
        };
      }
      return report;
    });
    localStorage.setItem('roadmaster_reports', JSON.stringify(updatedReports));
    
    // Send notification to the user
    if (newStatus === 'approved') {
      sendMessage(mockReport.email, 'Report Status Update', `Your report about road damage in ${mockReport.town} has been approved. We will begin work soon.`);
    } else if (newStatus === 'done') {
      sendMessage(mockReport.email, 'Report Status Update', `Your report about road damage in ${mockReport.town} has been marked as done. Thank you for your report.`);
    }
    alert(`Status updated to ${newStatus}`);
  };

  const handleSendToAdmin = () => {
    setShowAdminModal(true);
  };

  const confirmSendToAdmin = () => {
    if (!selectedAdmin) return;
    // In a real app, you would send this to your backend
    const subAdmin = allSubAdmins.find(admin => admin.name === selectedAdmin);
    // Send a message to the subadmin
    sendMessage(`subadmin${subAdmin?.id}@example.com`, `New Report Assignment: ${mockReport.town}, ${mockReport.district}`, `You have been assigned to handle a road damage report in ${mockReport.town}, ${mockReport.district}. Please review the details and take appropriate action.`);
    // Send confirmation to the user
    sendMessage(mockReport.email, 'Thank you for your report', `Thank you for informing us about the road damage in ${mockReport.town}. Your report has been assigned to a sub-admin and will be investigated soon.`);
    alert(`Report sent to ${selectedAdmin} (${mockReport.province} Province)`);
    setShowAdminModal(false);
  };

  const generateReport = () => {
    // In a real app, this would generate a PDF or some other report format
    setShowReportModal(true);
  };

  const downloadReport = () => {
    alert('Report downloaded successfully');
    setShowReportModal(false);
  };

  return <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Report Details</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">
              {mockReport.province} / {mockReport.district}
            </h2>
            <div className="flex items-center">
              <span className={`text-sm px-3 py-1 rounded-full ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-gray-700 font-medium mb-2">
                Location Details
              </h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <MapPinIcon size={18} className="mr-2 text-gray-500" />
                  {mockReport.town}, {mockReport.district},{' '}
                  {mockReport.province}
                </p>
                <p className="text-gray-600 ml-6">
                  Damage Level:{' '}
                  <span className={`font-medium ${mockReport.damageLevel === 'high' ? 'text-red-600' : mockReport.damageLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {mockReport.damageLevel.charAt(0).toUpperCase() + mockReport.damageLevel.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-gray-700 font-medium mb-2">
                Reporter Information
              </h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <UserIcon size={18} className="mr-2 text-gray-500" />
                  {mockReport.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <PhoneIcon size={18} className="mr-2 text-gray-500" />
                  {mockReport.contactNumber}
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarIcon size={18} className="mr-2 text-gray-500" />
                  {new Date(mockReport.date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
              {mockReport.message}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockReport.images.map((image, index) => <div key={index} className="relative aspect-video">
                  <img src={image} alt={`Report image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                </div>)}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Location on Map</h3>
            <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '300px' }}>
              <MapContainer center={mockReport.location} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mockReport.location} />
              </MapContainer>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <span>Latitude: {mockReport.location[0].toFixed(6)}</span>
              <span>Longitude: {mockReport.location[1].toFixed(6)}</span>
            </div>
          </div>
          {user?.userType === 'admin' ? <div className="flex justify-end">
              <button onClick={handleSendToAdmin} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center">
                <SendIcon size={18} className="mr-2" />
                Send to {mockReport.province} Province Admin
              </button>
            </div> : <div className="flex justify-between">
              <div>
                <h3 className="text-gray-700 font-medium mb-3">
                  Update Status
                </h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleStatusChange('pending')} className={`px-4 py-2 rounded-md ${status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    Pending
                  </button>
                  <button onClick={() => handleStatusChange('approved')} className={`px-4 py-2 rounded-md ${status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    Approved
                  </button>
                  <button onClick={() => handleStatusChange('done')} className={`px-4 py-2 rounded-md ${status === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    Done
                  </button>
                </div>
              </div>
              <button onClick={generateReport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center">
                <FileTextIcon size={18} className="mr-2" />
                Generate Report
              </button>
            </div>}
        </div>
      </div>
      {/* Admin Selection Modal */}
      {showAdminModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Select {mockReport.province} Province Admin
            </h3>
            {relevantSubAdmins.length > 0 ? <div className="mb-4">
                <select value={selectedAdmin} onChange={e => setSelectedAdmin(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a Province Admin</option>
                  {relevantSubAdmins.map(admin => <option key={admin.id} value={admin.name}>
                      {admin.name} - {admin.region}
                    </option>)}
                </select>
              </div> : <div className="mb-4 text-center py-4 bg-yellow-50 text-yellow-700 rounded-md">
                No province admin available for {mockReport.province} Province.
              </div>}
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={confirmSendToAdmin} disabled={!selectedAdmin || relevantSubAdmins.length === 0} className={`px-4 py-2 rounded-md ${selectedAdmin && relevantSubAdmins.length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Send
              </button>
            </div>
          </div>
        </div>}
      {/* Report Preview Modal */}
      {showReportModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Report Summary</h3>
              <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon size={24} />
              </button>
            </div>
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800">
                  ROAD MASTER
                </h2>
                <p className="text-gray-600">Road Development Authority</p>
                <p className="text-lg font-semibold mt-2">Road Damage Report</p>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Location Information</h4>
                  <p>
                    <span className="font-medium">Province:</span>{' '}
                    {mockReport.province}
                  </p>
                  <p>
                    <span className="font-medium">District:</span>{' '}
                    {mockReport.district}
                  </p>
                  <p>
                    <span className="font-medium">Town:</span> {mockReport.town}
                  </p>
                  <p>
                    <span className="font-medium">Coordinates:</span>{' '}
                    {mockReport.location[0].toFixed(6)},{' '}
                    {mockReport.location[1].toFixed(6)}
                  </p>
                  <p>
                    <span className="font-medium">Damage Level:</span>{' '}
                    {mockReport.damageLevel}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Report Information</h4>
                  <p>
                    <span className="font-medium">Report ID:</span>{' '}
                    {mockReport.id}
                  </p>
                  <p>
                    <span className="font-medium">Date Reported:</span>{' '}
                    {new Date(mockReport.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time Reported:</span>{' '}
                    {new Date(mockReport.date).toLocaleTimeString()}
                  </p>
                  <p>
                    <span className="font-medium">Current Status:</span>{' '}
                    {status}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="bg-gray-50 p-4 rounded">{mockReport.message}</p>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {mockReport.images.map((image, index) => <div key={index}>
                      <img src={image} alt={`Report image ${index + 1}`} className="w-full h-40 object-cover rounded" />
                    </div>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <p className="text-gray-500 italic">
                    Assigned to Sub-admin on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 italic">
                    Status changed to {status} on{' '}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={downloadReport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center">
                <DownloadIcon size={18} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>}
    </div>;
};

export default InquiryDetails; 