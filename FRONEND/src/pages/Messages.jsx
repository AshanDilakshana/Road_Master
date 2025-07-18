import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MessageModal from '../components/MessageModal';
import MessagesInbox from '../components/MessagesInbox';
import { PlusIcon } from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const handleBack = () => {
    if (user?.userType === 'user') {
      navigate('/user-dashboard');
    } else if (user?.userType === 'Admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/subadmin-dashboard');
    }
  };

  return <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">All Messages</h1>
          <button onClick={() => setIsMessageModalOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            <PlusIcon size={18} className="mr-2" />
            Create Message
          </button>
        </div>
        <MessagesInbox onBack={handleBack} />
      </div>
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} />
    </div>;
};

export default Messages; 