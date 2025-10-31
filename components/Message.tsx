
import React, { useEffect, useState, useMemo } from 'react';
import { ChatMessage } from '../types';

interface MessageProps {
  message: ChatMessage;
}

// Since we can't import `marked`, we need to declare it as a global
declare const marked: any;

const Message: React.FC<MessageProps> = ({ message }) => {
  const { role, parts } = message;
  const isModel = role === 'model';
  const textContent = parts[0]?.text || '';
  
  const [parsedContent, setParsedContent] = useState('');

  useEffect(() => {
    if (isModel && typeof marked !== 'undefined') {
        // The `marked` library is loaded from a CDN and available globally.
        // We use it to parse the Markdown content from the model.
        const htmlContent = marked.parse(textContent);
        setParsedContent(htmlContent);
    } else {
        setParsedContent(textContent);
    }
  }, [textContent, isModel]);


  const containerClasses = isModel
    ? 'flex items-start space-x-3'
    : 'flex items-start justify-end space-x-3';
    
  const bubbleClasses = isModel
    ? 'bg-gray-700 text-gray-200'
    : 'bg-blue-600 text-white';

  const avatar = isModel ? (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
      G
    </div>
  ) : (
     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white">
      U
    </div>
  );
  
  const markdownStyles = `
    prose prose-invert prose-sm max-w-none
    prose-p:my-2 prose-headings:my-3
    prose-ul:my-2 prose-ol:my-2
    prose-li:my-0
    prose-pre:bg-gray-800 prose-pre:p-3 prose-pre:rounded-lg
    prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
    prose-a:text-blue-400 hover:prose-a:text-blue-300
  `;

  return (
    <div className={`py-4 ${containerClasses}`}>
        {isModel && avatar}
        <div className={`p-4 rounded-lg max-w-2xl ${bubbleClasses}`}>
        {isModel ? (
          <div
            className={markdownStyles}
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{textContent}</p>
        )}
      </div>
      {!isModel && avatar}
    </div>
  );
};

export default Message;
