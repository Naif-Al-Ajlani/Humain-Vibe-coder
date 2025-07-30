import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './ChatApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Load chat history
    fetchMessages();

    // Socket event listeners
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('ai_typing', (data) => {
      setIsTyping(data.isTyping);
    });

    newSocket.on('ai_suggestions', (suggestions) => {
      setAiSuggestions(suggestions);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/chat/messages');
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Optimistic update
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // Send to backend
      const response = await axios.post('/api/chat/messages', {
        text: newMessage,
        requestAiResponse: true
      });

      // Update with server response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === message.id ? response.data.message : msg
        )
      );

      // Emit to socket for real-time updates
      if (socket) {
        socket.emit('user_message', response.data.message);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== message.id));
    }
  };

  const getMessageSuggestions = async (partialMessage) => {
    if (partialMessage.length < 3) {
      setAiSuggestions([]);
      return;
    }

    try {
      const response = await axios.post('/api/chat/suggestions', {
        partialMessage
      });
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to get suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    // Get AI suggestions after brief delay
    const timeoutId = setTimeout(() => {
      getMessageSuggestions(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const applySuggestion = (suggestion) => {
    setNewMessage(suggestion);
    setAiSuggestions([]);
  };

  const getMessageIcon = (sender) => {
    return sender === 'ai' ? '🤖' : '👤';
  };

  const getMessageClass = (sender) => {
    return `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
  };

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>💬 AI-Enhanced Chat</h1>
        <div className="chat-status">
          {isTyping && (
            <div className="typing-indicator">
              🤖 AI is typing...
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={getMessageClass(message.sender)}>
            <div className="message-avatar">
              {getMessageIcon(message.sender)}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-meta">
                <span className="message-sender">{message.sender}</span>
                <span className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {message.aiConfidence && (
                  <span className="ai-confidence">
                    🎯 {Math.round(message.aiConfidence * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        {aiSuggestions.length > 0 && (
          <div className="ai-suggestions">
            <span className="suggestions-label">💡 AI Suggestions:</span>
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => applySuggestion(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="input-row">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message... (AI will suggest improvements)"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="send-button"
          >
            ➤ Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
