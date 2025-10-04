import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/Chatbot.module.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      // Add bot message and manage history (keep only last 5 messages)
      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        return newMessages.length > 5 ? newMessages.slice(-5) : newMessages;
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => {
        const newMessages = [...prev, errorMessage];
        return newMessages.length > 5 ? newMessages.slice(-5) : newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div 
        className={`${styles.chatIcon} ${isOpen ? styles.chatIconHidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.chatIconText}>💬</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>ExoDiscover Assistant</h3>
            <div className={styles.chatControls}>
              <button 
                className={styles.clearBtn}
                onClick={clearHistory}
                title="Clear History"
              >
                🗑️
              </button>
              <button 
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.length === 0 ? (
              <div className={styles.welcomeMessage}>
                <p>👋 Hello! I'm your ExoDiscover assistant. Ask me anything about exoplanets, the models, or how to use this application!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.message} ${styles[message.sender]}`}
                >
                  <div className={styles.messageContent}>
                    <span className={styles.messageText}>{message.text}</span>
                    <span className={styles.messageTime}>{message.timestamp}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <div className={styles.messageContent}>
                  <span className={styles.typingIndicator}>Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about exoplanets..."
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={styles.sendBtn}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
