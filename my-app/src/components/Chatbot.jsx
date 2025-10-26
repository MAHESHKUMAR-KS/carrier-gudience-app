import React, { useState, useRef, useEffect } from 'react';

function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you with your career or education today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false); // show "typing..." indicator
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message:', messageToSend);
      const response = await fetch('http://localhost:5001/api/v1/chatbot/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: messageToSend }),
        credentials: 'include',
        mode: 'cors'
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        
        // Still try to show a helpful message
        const botMessage = { 
          id: Date.now() + 1, 
          text: 'I\'m currently experiencing high demand. Please try again in a moment, or explore our Scholarships, College Search, and Careers pages.', 
          sender: 'bot',
          isError: true
        };
        setMessages(prev => [...prev, botMessage]);
        return;
      }

      const data = await response.json();
      
      // Create bot message
      let botText = data.reply || 'Sorry, I did not understand that.';
      
      // If it's a fallback response, add a note
      if (data.fallback && data.message) {
        botText = `ℹ️ ${data.message}\n\n${botText}`;
      }
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: botText, 
        sender: 'bot',
        isFallback: data.fallback
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Error fetching bot reply:', err);
      const botMessage = { 
        id: Date.now() + 1, 
        text: 'Sorry, I\'m having trouble connecting. Please check our Scholarships page for scholarship information, College Search for colleges, or Careers page for career guidance.', 
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {/* Chat icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm2 5h12v2H6V9zm0 4h8v2H6v-2z" />
        </svg>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-3 w-[90vw] max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="px-4 py-2 bg-indigo-600 text-white flex items-center justify-between">
            <span className="font-semibold">Career Assistant</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white focus:outline-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-3 space-y-3">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : message.isError
                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
                    : message.isFallback
                    ? 'bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-bl-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic text-sm">Bot is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
