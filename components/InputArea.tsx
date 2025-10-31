
import React from 'react';
import { SendIcon, CopyIcon, TrashIcon, SpeakerIcon } from './Icons';

interface InputAreaProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onClear: () => void;
  onCopy: () => void;
  onSpeak: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode, title: string }> = ({ onClick, disabled = false, children, title }) => (
  <button
    title={title}
    onClick={onClick}
    disabled={disabled}
    className="p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white disabled:text-gray-600 disabled:bg-transparent transition-colors"
  >
    {children}
  </button>
);

const InputArea: React.FC<InputAreaProps> = ({ inputValue, onInputChange, onSendMessage, onClear, onCopy, onSpeak, isLoading, hasMessages }) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && inputValue.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800/50 border-t border-gray-700">
      <div className="flex items-center space-x-2 mb-2">
        <ActionButton onClick={onClear} disabled={!hasMessages || isLoading} title="Clear Chat">
            <TrashIcon />
        </ActionButton>
        <ActionButton onClick={onCopy} disabled={!hasMessages || isLoading} title="Copy Last Response">
            <CopyIcon />
        </ActionButton>
        <ActionButton onClick={onSpeak} disabled={!hasMessages || isLoading} title="Read Last Response">
            <SpeakerIcon />
        </ActionButton>
      </div>
      <div className="relative flex items-center">
        <textarea
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje aquí..."
          disabled={isLoading}
          rows={1}
          className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full py-3 pl-5 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
          style={{ maxHeight: '150px' }}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-600 text-white disabled:bg-gray-600 hover:bg-blue-500 transition-all duration-200 ease-in-out transform disabled:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          aria-label="Send Message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
