import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EditIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', province: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/users/admins');
      if (Array.isArray(response.data)) {
        // Exclude Admins and SubAdmins by email pattern
        const filtered = response.data.filter(u => !u.email.includes('Admin'));
        setUsers(filtered);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ name: user.name, email: user.email, province: user.province });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/users/admins_update/${userId}`, editForm);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/admins_delete/${userId}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Province</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <input name="name" value={editForm.name} onChange={handleEditChange} className="border rounded px-2 py-1" />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <input name="email" value={editForm.email} onChange={handleEditChange} className="border rounded px-2 py-1" />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <input name="province" value={editForm.province} onChange={handleEditChange} className="border rounded px-2 py-1" />
                    ) : (
                      user.province
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {editingUserId === user._id ? (
                      <>
                        <button onClick={() => handleSave(user._id)} className="text-green-600 hover:text-green-800 mr-2"><SaveIcon size={18} /></button>
                        <button onClick={() => setEditingUserId(null)} className="text-gray-500 hover:text-gray-700"><XIcon size={18} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 mr-2"><EditIcon size={18} /></button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800"><TrashIcon size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers; 