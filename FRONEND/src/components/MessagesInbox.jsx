import React, { useState } from 'react';
import { useMessages } from '../context/MessageContext';
import { format } from 'date-fns';
import { ArrowLeftIcon, ReplyIcon, TrashIcon } from 'lucide-react';

const MessagesInbox = ({ onBack }) => {
  const { messages, markAsRead, getMessagesByUser, sendMessage, deleteMessage } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const userMessages = getMessagesByUser();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleMessageClick = (id) => {
    setSelectedMessage(id);
    markAsRead(id);
  };

  const currentMessage = userMessages.find(msg => msg._id === selectedMessage);

  const handleReply = () => {
    setShowReplyBox(true);
  };

  const handleSendReply = () => {
    if (!currentMessage || !replyContent.trim()) return;
    sendMessage(currentMessage.sender, 'Re: ' + (currentMessage.subject || ''), replyContent.trim());
    setReplyContent('');
    setShowReplyBox(false);
    alert('Reply sent!');
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setShowReplyBox(false);
  };

  const handleDelete = () => {
    if (!currentMessage) return;
    if (window.confirm('Delete this message?')) {
      deleteMessage(currentMessage._id);
      setSelectedMessage(null);
    }
  };

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
          {userMessages.length === 0 ? <div className="p-4 text-center text-gray-500">No messages</div> : userMessages.map(msg => <div key={msg._id} onClick={() => handleMessageClick(msg._id)} className={`p-4 border-b border-gray-200 cursor-pointer ${selectedMessage === msg._id ? 'bg-blue-50' : ''} ${!msg.read ? 'font-semibold' : ''}`}>
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
                <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleReply}>
                  <ReplyIcon size={16} className="mr-1" />
                  Reply
                </button>
                <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleDelete}>
                  <TrashIcon size={16} className="mr-1" />
                  Delete
                </button>
              </div>
              {showReplyBox && (
                <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Reply</label>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reply here..."
                  ></textarea>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleCancelReply}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendReply}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div> : <div className="h-full flex items-center justify-center text-gray-500">
              Select a message to view
            </div>}
        </div>
      </div>
    </div>;
};

export default MessagesInbox; 