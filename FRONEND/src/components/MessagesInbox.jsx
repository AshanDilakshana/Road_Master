import React, { useState } from 'react';
import { useMessages } from '../context/MessageContext';
import { format } from 'date-fns';
import { ArrowLeftIcon, ReplyIcon, TrashIcon } from 'lucide-react';

const MessagesInbox = ({ onBack }) => {
  const { messages, markAsRead, getMessagesByUser } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const userMessages = getMessagesByUser();

  const handleMessageClick = (id) => {
    setSelectedMessage(id);
    markAsRead(id);
  };

  const currentMessage = userMessages.find(msg => msg.id === selectedMessage);

  return <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-800 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-4">
          <ArrowLeftIcon size={20} />
        </button>
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <div className="flex h-[500px]">
        {/* Message List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          {userMessages.length === 0 ? <div className="p-4 text-center text-gray-500">No messages</div> : userMessages.map(msg => <div key={msg.id} onClick={() => handleMessageClick(msg.id)} className={`p-4 border-b border-gray-200 cursor-pointer ${selectedMessage === msg.id ? 'bg-blue-50' : ''} ${!msg.read ? 'font-semibold' : ''}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{msg.from}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
                <div className="text-sm font-medium">{msg.subject}</div>
                <div className="text-xs text-gray-500 truncate">
                  {msg.content}
                </div>
              </div>)}
        </div>
        {/* Message Content */}
        <div className="w-2/3 p-4 overflow-y-auto">
          {selectedMessage && currentMessage ? <div>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-xl font-bold mb-2">
                  {currentMessage.subject}
                </h3>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div>
                    <span className="font-medium">From:</span>{' '}
                    {currentMessage.from}
                  </div>
                  <div>
                    {format(new Date(currentMessage.timestamp), 'MMMM d, yyyy h:mm a')}
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{currentMessage.content}</p>
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <ReplyIcon size={16} className="mr-1" />
                  Reply
                </button>
                <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                  <TrashIcon size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div> : <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view
            </div>}
        </div>
      </div>
    </div>;
};

export default MessagesInbox; 