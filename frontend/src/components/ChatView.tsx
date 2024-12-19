import React from 'react';
import { Send } from 'lucide-react';
import type { Message } from './ChatInterface';

interface ChatViewProps {
  messages: Message[];
  input: string;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setInput: (value: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  input,
  loading,
  messagesEndRef,
  setInput,
  sendMessage
}) => {
  return (
    <main className="h-screen w-full bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">Chat Assistant</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[70%] rounded-lg bg-blue-500 px-4 py-2 text-white">
                    {msg.message}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-lg bg-white px-4 py-2 shadow-sm">
                    {msg.response}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-full bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
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