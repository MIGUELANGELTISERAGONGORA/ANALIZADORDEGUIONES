import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from './types';
import { createChatSession } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import InputArea from './components/InputArea';
import { GoogleIcon } from './components/Icons';
import type { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSession = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    chatSession.current = createChatSession();
  }, []);
  
  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !chatSession.current) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: inputValue }],
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatSession.current.sendMessageStream({ message: messageToSend });
      
      let modelResponseText = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: modelResponseText }] };
          return newMessages;
        });
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = `Error al conectar con la IA: ${err.message || 'Por favor, inténtalo de nuevo.'}`;
      setError(errorMessage);
      setMessages(prev => {
         const newMessages = [...prev];
         // In case of error, update the last empty model message with the error.
         if(newMessages.length > 0 && newMessages[newMessages.length-1].role === 'model' && newMessages[newMessages.length -1].parts[0].text === ''){
             newMessages[newMessages.length - 1] = { role: 'model', parts: [{ text: errorMessage }] };
             return newMessages;
         }
         // Otherwise, add a new error message
         return [...newMessages, { role: 'model', parts: [{ text: errorMessage }] }];
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue]);

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    // Create a new, clean chat session
    chatSession.current = createChatSession();
  };
  
  const getLastModelMessage = (): string => {
    const lastModelMsg = [...messages].reverse().find(m => m.role === 'model');
    return lastModelMsg?.parts[0]?.text || '';
  };

  const handleCopyText = () => {
    const textToCopy = getLastModelMessage();
    if(textToCopy) {
        navigator.clipboard.writeText(textToCopy)
        .then(() => alert('¡Copiado al portapapeles!'))
        .catch(err => console.error('Falló la copia: ', err));
    }
  };

  const handleSpeakText = () => {
    const textToSpeak = getLastModelMessage();
    if(textToSpeak && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        window.speechSynthesis.cancel(); // Cancel any previous speech
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="flex items-center p-4 border-b border-gray-700 bg-gray-800/50">
        <GoogleIcon />
        <h1 className="text-xl font-semibold text-gray-200">Asistente de IA de Gemini</h1>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
       {error && <div className="p-2 text-center bg-red-800/50 text-red-300 border-t border-gray-700">{error}</div>}
      <InputArea
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSendMessage}
        onClear={handleClearChat}
        onCopy={handleCopyText}
        onSpeak={handleSpeakText}
        isLoading={isLoading}
        hasMessages={messages.length > 0}
      />
    </div>
  );
};

export default App;
