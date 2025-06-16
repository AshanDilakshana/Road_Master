import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const MessageContext = createContext(undefined);

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('roadmaster_messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Initialize with some sample messages
      const initialMessages = [{
        id: '1',
        from: 'admin@example.com',
        to: 'user@example.com',
        subject: 'Your report has been received',
        content: 'Thank you for informing us. We will investigate your report about the pothole in Eheliyagoda.',
        timestamp: new Date().toISOString(),
        read: false
      }, {
        id: '2',
        from: 'subadmin@example.com',
        to: 'user@example.com',
        subject: 'Update on your report',
        content: 'We have inspected the site and scheduled repairs for next week.',
        timestamp: new Date().toISOString(),
        read: false
      }];
      setMessages(initialMessages);
      localStorage.setItem('roadmaster_messages', JSON.stringify(initialMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('roadmaster_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const unreadCount = user ? messages.filter(msg => msg.to === user.email && !msg.read).length : 0;

  const sendMessage = (to, subject, content) => {
    if (!user) return;
    const newMessage = {
      id: Date.now().toString(),
      from: user.email,
      to,
      subject,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const markAsRead = (id) => {
    setMessages(prevMessages => prevMessages.map(msg => msg.id === id ? {
      ...msg,
      read: true
    } : msg));
  };

  const getMessagesByUser = () => {
    if (!user) return [];
    return messages.filter(msg => msg.to === user.email || msg.from === user.email);
  };

  return <MessageContext.Provider value={{
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    getMessagesByUser
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