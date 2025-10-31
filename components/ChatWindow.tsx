
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Message from './Message';
import { GoogleIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const TypingIndicator = () => (
  <div className="flex items-start space-x-3 py-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
      G
    </div>
    <div className="p-4 rounded-lg bg-gray-700 flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400"></span>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {messages.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <GoogleIcon />
            <h1 className="text-2xl font-medium">How can I help you today?</h1>
        </div>
      ) : (
        messages.map((msg, index) => <Message key={index} message={msg} />)
      )}
      
      {isLoading && <TypingIndicator />}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatWindow;
