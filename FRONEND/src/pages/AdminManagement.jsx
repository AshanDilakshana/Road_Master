import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import Axios from 'axios';



const AdminManagement = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [provinceStats, setProvinceStats] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    province: '',
    password: '',
    confirmPassword: ''
  });

useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/users/admins');
      const allUsers = response.data;

      const filteredAdmins = allUsers.filter(user =>
        user.email.includes('@Admin') || user.email.includes('@SubAdmin')
      );

      setSubAdmins(filteredAdmins);
    } catch (error) {
      console.error('Error fetching province stats:', error);
      alert('Failed to fetch province stats. Please try again later.');
    }
  };
  fetchAdmins();
}, []);      




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setCurrentAdmin(null);
    setFormData({
      name: '',
      email: '',
      province: '',
      password: '',
      confirmPassword: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      province: admin.province,
      password: admin.password ,
      confirmPassword: admin.password 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
 try {
    if (currentAdmin) {
      // UPDATE
      const response = await Axios.put(`http://localhost:8080/api/users/admins_update/${currentAdmin._id}`, {
        name: formData.name,
        email: formData.email,
        province: formData.province,
        password: formData.password
      });
      alert('Admin updated!');
    } else {
      // CREATE
      const response = await Axios.post(`http://localhost:8080/api/users/admins_create`, {
        name: formData.name,
        email: formData.email,
        province: formData.province,
        password: formData.password
      });
      alert('Admin created!');
    }

    // Refresh list
    const res = await Axios.get('http://localhost:8080/api/users/admins');
    const filteredAdmins = res.data.filter(user =>
      user.email.includes('@Admin') || user.email.includes('@SubAdmin')
    );
    setSubAdmins(filteredAdmins);
    setIsModalOpen(false);
  } catch (error) {
    console.error('Error saving admin:', error);
    alert('Failed to save admin.');
  }
  };

  const toggleAdminStatus = (_id) => {
    const updated = subAdmins.map(admin => admin._id === _id ? {
      ...admin,
      active: !admin.active
    } : admin);
    setSubAdmins(updated);
    localStorage.setItem('roadmaster_subadmins', JSON.stringify(updated));
  };

  const deleteAdmin = async(_id) => {
    if (confirm('Are you sure you want to delete this sub-admin?')) {
      try{
       await Axios.delete(`http://localhost:8080/api/users/admins_delete/${_id}`);

        setSubAdmins(subAdmins.filter(admin => admin._id !== _id));
        alert('Sub-admin deleted successfully!');
      }
      catch (error) {
        console.error('Error deleting sub-admin:', error);
        alert('Failed to delete sub-admin.');
      }
    }
  };

  return <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate('/admin-dashboard')} className="mr-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Sub-Admin Management
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Sub-Admins</h2>
            <button onClick={openAddModal} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <PlusIcon size={20} className="mr-2" />
              Add Sub-Admin
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    province
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">

                {subAdmins.map(admin => <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {admin.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {admin.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => openEditModal(admin)} className="text-blue-600 hover:text-blue-900">
                          <EditIcon size={18} />
                        </button>
                        <button onClick={() => toggleAdminStatus(admin._id)} className={`${admin.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                          {admin.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteAdmin(admin._id)} className="text-red-600 hover:text-red-900">
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Add/Edit Modal */}
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {currentAdmin ? 'Edit Sub-Admin' : 'Add New Sub-Admin'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <select name="province" value={formData.province} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select province</option>
                    <option value="Western Province">Western Province</option>
                    <option value="Central Province">Central Province</option>
                    <option value="Southern Province">Southern Province</option>
                    <option value="Northern Province">Northern Province</option>
                    <option value="Eastern Province">Eastern Province</option>
                    <option value="North Western Province"> North Western Province </option>
                    <option value="North Central Province">North Central Province</option>
                    <option value="Uva Province">Uva Province</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required={!currentAdmin} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required={!currentAdmin} />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {currentAdmin ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};

export default AdminManagement; 


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