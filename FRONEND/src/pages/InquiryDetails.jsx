import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { ArrowLeftIcon, MapPinIcon, UserIcon, CalendarIcon, PhoneIcon, SendIcon, FileTextIcon, DownloadIcon, XIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const InquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendMessage } = useMessages();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('pending');
  const [allSubAdmins, setAllSubAdmins] = useState([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch report details
        const reportResponse = await axios.get(`http://localhost:8080/api/reportIssues/GetreportById/${id}`);
          console.log(' Report response:', reportResponse);

        if (reportResponse.status === 200 && reportResponse.data.data) {
          setReport(reportResponse.data.data);
          setStatus(reportResponse.data.data.status || 'pending');
        } else {
          throw new Error('Unexpected report response format');}
        

        // Fetch sub-admins
        const adminsResponse = await axios.get('http://localhost:8080/api/users/admins');
  
        if (adminsResponse.status === 200 && Array.isArray(adminsResponse.data)) {
          const filteredSubAdmins = adminsResponse.data.filter(admin => admin.email.includes('SubAdmin'));
          setAllSubAdmins(filteredSubAdmins);
            console.log('✅ Admins response:', filteredSubAdmins);
        } else {
          throw new Error('Unexpected admins response format');
        }
        } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load report or sub-admins. Please try again later.');
       } 
       finally {
        setLoading(false);
             

      }
    };
    fetchData();
  }, [id]);
  const relevantSubAdmins = report ? allSubAdmins.filter(admin => admin.province === report.province) : [];

  const handleStatusChange = async (newStatus) => {
    try {
      setStatus(newStatus);
      const response = await axios.put(`http://localhost:8081/api/reportIssues/reportIssues_update/${id}`, {
        ...report,
        status: newStatus,
      });
      if (response.status === 200) {
        setReport(response.data.data);
        // Send notification to the user
        if (newStatus === 'approved') {
          sendMessage(report.emailAddress, 'Report Status Update', `Your report about road damage in ${report.nearbyTown} has been approved. We will begin work soon.`);
        } else if (newStatus === 'done') {
          sendMessage(report.emailAddress, 'Report Status Update', `Your report about road damage in ${report.nearbyTown} has been marked as done. Thank you for your report.`);
        }
        alert(`Status updated to ${newStatus}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
      setStatus(report.status || 'pending'); // Revert on failure
    }
  };

  const handleSendToAdmin = () => {
    setShowAdminModal(true);
  };

  const confirmSendToAdmin = async () => {
  if (!selectedAdmin) return;
  try {
    const subAdmin = allSubAdmins.find(admin => admin.email === selectedAdmin);
    // Update report with ProvinceAdmin
    const response = await axios.put(`http://localhost:8080/api/reportIssues/reportIssues_update/${id}`, {
      ...report,
      ProvinceAdmin: subAdmin.email,
    });
    if (response.status === 200) {
      setReport(response.data.data);

      // Send message to sub-admin
      sendMessage(
        subAdmin.email,
        `New Report Assignment: ${report.nearbyTown}, ${report.district}`,
        `You have been assigned to handle a road damage report in ${report.nearbyTown}, ${report.district}. Please review the details and take appropriate action.`
      );
      // Send confirmation to user
      sendMessage(
        report.emailAddress,
        'Thank you for your report',
        `Thank you for informing us about the road damage in ${report.nearbyTown}. Your report has been assigned to ${subAdmin.name} and will be investigated soon.`
      );
      alert(`Report sent to ${selectedAdmin} (${report.province} Province)`);
      setShowAdminModal(false);
    } else {
      throw new Error('Failed to assign report to sub-admin');
    }
  } catch (error) {
    console.error('Error sending to admin:', error);
    alert('Failed to send report to sub-admin. Please try again.');
  }
};

  const generateReport = () => {
    setShowReportModal(true);
  };

  const downloadReport = () => {
    alert('Report downloaded successfully');
    setShowReportModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-gray-500">Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto text-center py-8">
          <p className="text-red-500">Report not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
              {report.province} / {report.district}
            </h2>
            <div className="flex items-center">
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Location Details</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <MapPinIcon size={18} className="mr-2 text-gray-500" />
                  {report.nearbyTown}, {report.district}, {report.province}
                </p>
                <p className="text-gray-600 ml-6">
                  Damage Level:{' '}
                  <span
                    className={`font-medium ${
                      report.damageLevel === 'high'
                        ? 'text-red-600'
                        : report.damageLevel === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {report.damageLevel.charAt(0).toUpperCase() + report.damageLevel.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Reporter Information</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <UserIcon size={18} className="mr-2 text-gray-500" />
                  {report.emailAddress}
                </p>
                <p className="flex items-center text-gray-600">
                  <PhoneIcon size={18} className="mr-2 text-gray-500" />
                  {report.contactNumber}
                </p>
                <p className="flex items-center text-gray-600">
                  <CalendarIcon size={18} className="mr-2 text-gray-500" />
                  {new Date(report.timeAndDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Description</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
              {report.additionalMessage || 'No additional message provided.'}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {report.image && report.image.length > 0 ? (
                report.image.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <img src={image} alt={`Report image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No images provided.</p>
              )}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-3">Location on Map</h3>
            <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: '300px' }}>
              <MapContainer
                center={[report.location.lat, report.location.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[report.location.lat, report.location.lng]} />
              </MapContainer>
            </div>
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <span>Latitude: {report.location.lat.toFixed(6)}</span>
              <span>Longitude: {report.location.lng.toFixed(6)}</span>
            </div>
          </div>
          
          {user?.userType === 'Admin' ? (
            <div className="flex justify-end">
              <button
                onClick={handleSendToAdmin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center"
              >
                <SendIcon size={18} className="mr-2" />
                Send to {report.province} Province Admin
              </button>
            </div>
          ) : (
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-700 font-medium mb-3">Update Status</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className={`px-4 py-2 rounded-md ${
                      status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange('approved')}
                    className={`px-4 py-2 rounded-md ${
                      status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => handleStatusChange('done')}
                    className={`px-4 py-2 rounded-md ${
                      status === 'done' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
              <button
                onClick={generateReport}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center"
              >
                <FileTextIcon size={18} className="mr-2" />
                Generate Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Selection Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Select {report.province} Province Admin</h3>
            {allSubAdmins.length > 0 ? (
              <div className="mb-4">
                <select
                  value={selectedAdmin}
                  onChange={e => setSelectedAdmin(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Province Admin</option>
                  {allSubAdmins.map(filteredSubAdmins => (
                    <option key={filteredSubAdmins._id} value={filteredSubAdmins.email}>
                      {filteredSubAdmins.name} - {filteredSubAdmins.province}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-4 text-center py-4 bg-yellow-50 text-yellow-700 rounded-md">
                No province admin available for Province.
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"  >
                Cancel
              </button>
              <button
                onClick={confirmSendToAdmin}
                disabled={!selectedAdmin || allSubAdmins.length === 0}
                className={`px-4 py-2 rounded-md ${
                  selectedAdmin && allSubAdmins.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}  >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Report Preview Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Report Summary</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={24} />
              </button>
            </div>
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-800">ROAD MASTER</h2>
                <p className="text-gray-600">Road Development Authority</p>
                <p className="text-lg font-semibold mt-2">Road Damage Report</p>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Location Information</h4>
                  <p>
                    <span className="font-medium">Province:</span> {report.province}
                  </p>
                  <p>
                    <span className="font-medium">District:</span> {report.district}
                  </p>
                  <p>
                    <span className="font-medium">Town:</span> {report.nearbyTown}
                  </p>
                  <p>
                    <span className="font-medium">Coordinates:</span>{' '}
                    {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                  </p>
                  <p>
                    <span className="font-medium">Damage Level:</span> {report.damageLevel}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Report Information</h4>
                  <p>
                    <span className="font-medium">Report ID:</span> {report._id}
                  </p>
                  <p>
                    <span className="font-medium">Date Reported:</span>{' '}
                    {new Date(report.timeAndDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time Reported:</span>{' '}
                    {new Date(report.timeAndDate).toLocaleTimeString()}
                  </p>
                  <p>
                    <span className="font-medium">Current Status:</span> {status}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{' '}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="bg-gray-50 p-4 rounded">
                  {report.additionalMessage || 'No additional message provided.'}
                </p>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  {report.image && report.image.length > 0 ? (
                    report.image.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`Report image ${index + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No images provided.</p>
                  )}
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
                    Status changed to {status} on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={downloadReport}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center"
              >
                <DownloadIcon size={18} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryDetails;