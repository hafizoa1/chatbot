import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, Loader } from 'lucide-react';
import type { Chat, Message } from '../types/chat';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = 'user123';

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (isFetching) return;
      setIsFetching(true);
      
      try {
        const response = await fetch(`http://localhost:3000/chat/history/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const history: Chat[] = await response.json();  
        if (!Array.isArray(history)) {
          console.error('Invalid history format:', history);
          return;
        }
    
        const formattedHistory: Message[] = history.flatMap(item => [
          {
            content: item.message,
            sender: 'user' as const,
            timestamp: item.createdAt
          },
          {
            content: item.response,
            sender: 'bot' as const,
            timestamp: item.createdAt
          }
        ]);
        
        setMessages(formattedHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchChatHistory();
  }, [isFetching, userId]); // Depend on isFetching and userId to rerun the effect correctly when needed
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
  
    setIsLoading(true);
    const messageText = inputMessage;
    setInputMessage('');
  
    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          message: messageText 
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: Chat = await response.json();  // Changed from ChatResponse to Chat
      
      setMessages(prev => [
        ...prev,
        {
          content: messageText,
          sender: 'user' as const,
          timestamp: new Date().toISOString()
        },
        {
          content: data.response,
          sender: 'bot' as const,
          timestamp: data.createdAt
        }
      ]);
  
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          content: 'Error sending message. Please try again.',
          sender: 'system' as const,
          timestamp: new Date().toISOString()
        }
      ]);
      setInputMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

 const getMessageStyles = (sender: Message['sender']): string => {
   const baseStyles = 'max-w-[70%] rounded-2xl px-4 py-2 shadow-sm';
   const senderStyles = {
     user: 'bg-blue-500 text-white',
     bot: 'bg-gray-100 text-gray-800',
     system: 'bg-red-100 text-red-800'
   };
   return `${baseStyles} ${senderStyles[sender]}`;
 };

 return (
   <main className="h-screen w-full bg-white">
     <div className="flex h-full flex-col">
       <header className="border-b bg-white px-6 py-4">
         <h1 className="text-xl font-semibold text-gray-800">Chat Assistant</h1>
       </header>

       <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
         <div className="mx-auto max-w-3xl space-y-6">
           {messages.map((message, index) => (
             <div
               key={index}
               className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={getMessageStyles(message.sender)}>
                 <p className="break-words">{message.content}</p>
                 <span className="mt-1 block text-xs opacity-75">
                   {new Date(message.timestamp).toLocaleTimeString()}
                 </span>
               </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex justify-start">
               <div className="rounded-2xl bg-gray-100 px-4 py-2 shadow-sm">
                 <Loader className="h-5 w-5 animate-spin text-gray-500" />
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
         </div>
       </div>

       <div className="border-t bg-white px-6 py-4">
         <div className="mx-auto max-w-3xl">
           <form onSubmit={sendMessage} className="flex space-x-4">
             <input
               type="text"
               value={inputMessage}
               onChange={(e) => setInputMessage(e.target.value)}
               placeholder="Type a message..."
               className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
               disabled={isLoading}
             />
             <button
               type="submit"
               disabled={isLoading || !inputMessage.trim()}
               className="rounded-full bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
             >
               <Send className="h-5 w-5" />
             </button>
           </form>
         </div>
       </div>
     </div>
   </main>
 );
};

export default ChatInterface;