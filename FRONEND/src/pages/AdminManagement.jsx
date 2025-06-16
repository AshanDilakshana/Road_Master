import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';

const AdminManagement = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    region: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Load subadmins from localStorage or use defaults
    const storedAdmins = localStorage.getItem('roadmaster_subadmins');
    if (storedAdmins) {
      setSubAdmins(JSON.parse(storedAdmins));
    } else {
      const defaultAdmins = [{
        id: '1',
        name: 'John Smith',
        email: 'subadmin1@example.com',
        region: 'Western Province',
        active: true
      }, {
        id: '2',
        name: 'Mary Johnson',
        email: 'subadmin2@example.com',
        region: 'Southern Province',
        active: true
      }, {
        id: '3',
        name: 'Robert Davis',
        email: 'subadmin3@example.com',
        region: 'Central Province',
        active: false
      }];
      setSubAdmins(defaultAdmins);
      localStorage.setItem('roadmaster_subadmins', JSON.stringify(defaultAdmins));
    }
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
      region: '',
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
      region: admin.region,
      password: '',
      confirmPassword: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (currentAdmin) {
      // Edit existing admin
      const updated = subAdmins.map(admin => admin.id === currentAdmin.id ? {
        ...admin,
        name: formData.name,
        email: formData.email,
        region: formData.region
      } : admin);
      setSubAdmins(updated);
      localStorage.setItem('roadmaster_subadmins', JSON.stringify(updated));
    } else {
      // Add new admin
      const newAdmin = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        region: formData.region,
        active: true
      };
      const updated = [...subAdmins, newAdmin];
      setSubAdmins(updated);
      localStorage.setItem('roadmaster_subadmins', JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  const toggleAdminStatus = (id) => {
    const updated = subAdmins.map(admin => admin.id === id ? {
      ...admin,
      active: !admin.active
    } : admin);
    setSubAdmins(updated);
    localStorage.setItem('roadmaster_subadmins', JSON.stringify(updated));
  };

  const deleteAdmin = (id) => {
    if (confirm('Are you sure you want to delete this sub-admin?')) {
      const updated = subAdmins.filter(admin => admin.id !== id);
      setSubAdmins(updated);
      localStorage.setItem('roadmaster_subadmins', JSON.stringify(updated));
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
                    Region
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
                {subAdmins.map(admin => <tr key={admin.id}>
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
                        <button onClick={() => toggleAdminStatus(admin.id)} className={`${admin.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                          {admin.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => deleteAdmin(admin.id)} className="text-red-600 hover:text-red-900">
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
                  <select name="region" value={formData.region} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select Region</option>
                    <option value="Western Province">Western Province</option>
                    <option value="Central Province">Central Province</option>
                    <option value="Southern Province">Southern Province</option>
                    <option value="Northern Province">Northern Province</option>
                    <option value="Eastern Province">Eastern Province</option>
                    <option value="North Western Province">
                      North Western Province
                    </option>
                    <option value="North Central Province">
                      North Central Province
                    </option>
                    <option value="Uva Province">Uva Province</option>
                    <option value="Sabaragamuwa Province">
                      Sabaragamuwa Province
                    </option>
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