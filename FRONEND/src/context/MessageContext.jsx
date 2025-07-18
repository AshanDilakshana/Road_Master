import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const MessageContext = createContext(undefined);

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch messages from backend when user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/messages/get', {
          params: { user: user.email }
        });
        if (response.status === 200 && Array.isArray(response.data.data)) {
          setMessages(response.data.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user?.email]);

  const unreadCount = user ? messages.filter(msg => msg.recipient === user.email && !msg.read).length : 0;

  const sendMessage = async (to, subject, content) => {
    if (!user) return;
    try {
      const response = await axios.post('http://localhost:8080/api/messages/send', {
        sender: user.email,
        recipient: to,
        subject,
        content
      });
      if (response.status === 201 && response.data.data) {
        setMessages(prev => [response.data.data, ...prev]);
      }
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/messages/read/${id}`);
      if (response.status === 200 && response.data.data) {
        setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, read: true } : msg));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/messages/delete/${id}`);
      if (response.status === 200) {
        setMessages(prev => prev.filter(msg => msg._id !== id));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const getMessagesByUser = () => {
    if (!user) return [];
    return messages.filter(msg => msg.recipient === user.email || msg.sender === user.email);
  };

  return <MessageContext.Provider value={{
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    deleteMessage,
    getMessagesByUser,
    loading
  }}>
      {children}
    </MessageContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}; 