import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, FilterIcon } from 'lucide-react';
import axios from 'axios';

const InformationTab = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  //const [reports, setReports] = useState([]);

{/* 
  useEffect(() => {() => {
    const fetchReports = async () => {
    try {
    const response = await axios.get('http://localhost:8080/api/reportIssues/GetAllreport');{
      if (response.status === 200) {
        // Assuming response.data contains the reports
        setReports(response.data);
      } else {
        console.error('Failed to fetch reports');
      }
    };
  }catch (error) {
    console.error('Error fetching reports:', error);}
    
    fetchReports();
}
}}, []);*/}
  
  // Mock data for reports
  const reports = [{
    id: 1,
    province: 'Western',
    district: 'Colombo',
    town: 'Nugegoda',
    date: '2023-06-15',
    status: 'pending'
  }];



  const filteredReports = filter === 'all' ? reports : reports.filter(report => report.status === filter);

  return <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Information Reports
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Road Issue Reports</h2>
            <div className="flex items-center">
              <FilterIcon size={18} className="mr-2 text-gray-600" />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => <div key={report.id} onClick={() => navigate(`/inquiry-details/${report.id}`)} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">
                    {report.province} / {report.district}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : report.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Town: {report.town}</p>
                <p className="text-gray-500 text-sm">
                  Reported on: {new Date(report.date).toLocaleDateString()}
                </p>
              </div>)}
          </div>
          {filteredReports.length === 0 && <div className="text-center py-8">
              <p className="text-gray-500">
                No reports found with the selected filter.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};

export default InformationTab; 