import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MessageModal = ({ isOpen, onClose, recipientType }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [recipients, setRecipients] = useState([]);
  const { sendMessage } = useMessages();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch users from backend and filter for admins and subadmins
    const fetchRecipients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/admins');
        if (Array.isArray(response.data)) {
          // Filter for admins and subadmins by email pattern
          const filtered = response.data.filter(r => r.email.includes('Admin'));
          setRecipients(filtered);
          // Set default recipient
          if (user?.userType === 'user') {
            const adminRecipient = filtered.find(r => r.email.includes('Admin') && !r.email.includes('SubAdmin'));
            if (adminRecipient) setSelectedRecipient(adminRecipient.email);
          } else if (user?.userType === 'admin') {
            const subadminRecipient = filtered.find(r => r.email.includes('SubAdmin'));
            if (subadminRecipient) setSelectedRecipient(subadminRecipient.email);
          } else if (user?.userType === 'subadmin') {
            const adminRecipient = filtered.find(r => r.email.includes('Admin') && !r.email.includes('SubAdmin'));
            if (adminRecipient) setSelectedRecipient(adminRecipient.email);
          }
        } else {
          setRecipients([]);
        }
      } catch (err) {
        setRecipients([]);
      }
    };
    fetchRecipients();
  }, [user]);

  const handleSend = () => {
    if (!subject || !content || !selectedRecipient) {
      alert('Please fill out all fields');
      return;
    }
    sendMessage(selectedRecipient, subject, content);
    alert('Message sent successfully!');
    // Reset form and close modal
    setSubject('');
    setContent('');
    onClose();
  };

  if (!isOpen) return null;

  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {recipients.length > 1 && <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Recipient
              </label>
              <select value={selectedRecipient} onChange={e => setSelectedRecipient(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="">Select Recipient</option>
                {recipients.map(recipient => <option key={recipient.email} value={recipient.email}>
                    {recipient.name} ({recipient.email})
                  </option>)}
              </select>
            </div>}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subject
            </label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter message subject" required />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Message
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message here..." required></textarea>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>;
};

export default MessageModal; 