import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [childWindows, setChildWindows] = useState<Window[]>([]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'sharedMessage') {
        const newMessage = event.newValue;
        if (newMessage) {
          setReceivedMessages(prev => [...prev, newMessage]);
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const openNewWindow = () => {
    const childWindow = window.open(`${window.location.origin}/child`, '_blank');
    if (childWindow) {
      setChildWindows(prev => [...prev, childWindow]);
    }
  };

  const sendMessage = () => {
    if (message) {
      const fullMessage = `Main Window: ${message}`;
      localStorage.setItem('sharedMessage', fullMessage);
      setMessage('');
      setReceivedMessages(prev => [...prev, fullMessage]);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Multi-Window Communication Demo</h1>
      <button
        onClick={openNewWindow}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Open New Window
      </button>
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter message"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Message
        </button>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Received Messages:</h2>
        <ul className="list-disc pl-5">
          {receivedMessages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

