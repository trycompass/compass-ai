import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Markdown from 'react-markdown';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const newUserMessage = { role: 'user', content: inputMessage };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInputMessage('');
      setIsAiTyping(true);
      setError(null);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );

      try {
        const response = await Promise.race([
          fetch('/api/compass', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: [...messages, newUserMessage] }),
          }),
          timeoutPromise
        ]);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.response }]);
      } catch (error) {
        console.error('Error calling API:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[100dvh] bg-gradient-to-b from-green-50 to-green-50">
      <Head>
        <title>Compass - Navigate Community Services</title>
      </Head>
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M12 4 L14 12 L12 20 L10 12 Z" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
          <h1 className="text-2xl font-semibold text-center text-green-600 relative">
            Compass
            <span className="absolute -top-1 -right-8 text-xs font-normal text-gray-500 bg-gray-100 px-1 rounded">Beta</span>
          </h1>
        </div>
        <button
          onClick={() => setShowFAQ(true)}
          className="text-gray-600 hover:text-green-600 focus:outline-none transition-colors duration-200"
          aria-label="Show FAQ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-5/6 text-gray-500">
            <Image
              src="/welcome-illustration.svg"
              alt="Welcome to Compass"
              width={200}
              height={200}
            />
            <p className="mt-4 text-lg">Welcome to Compass! How can I help? 👋</p>
            <button
              onClick={() => setShowFAQ(true)}
              className="mt-4 text-xs text-green-500 hover:text-green-600 focus:outline-none transition-colors duration-200 relative"
            >
              What is Compass?
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-sm ${message.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                    }`}
                >
                  {message.role === 'assistant' ? (
                    <Markdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600" />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="mb-4" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc ml-6 mb-4" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal ml-6 mb-4" />
                        ),
                        li: ({ node, ...props }) => (
                          <li {...props} className="mb-2" />
                        ),
                        em: ({ node, ...props }) => (
                          <em {...props} className="italic" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong {...props} className="font-bold" />
                        )
                      }}
                    >
                      {message.content}
                    </Markdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl px-4 py-2 max-w-sm">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-red-100 text-red-700 rounded-2xl px-4 py-2 max-w-sm">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-semibold">What is Compass?</h3>
                <p>Compass is an AI-powered community services navigator designed to provide personalized guidance and support for navigating complex community services.</p>
              </li>
              <li>
                <h3 className="font-semibold">How do I use Compass?</h3>
                <p>Just chat like you're texting a trusted friend! Type whatever you're curious about in the box below. Compass also has the ability to run web searches to find you community resources in real-time!</p>
              </li>
              <li>
                <h3 className="font-semibold">Is my conversation with Compass private?</h3>
                <p>Absolutely. Privacy isn't an afterthought—it's our foundation. No conversation storage. No data sharing. No exceptions. Period.
                </p>
              </li>
            </ul>
            <button
              onClick={() => setShowFAQ(false)}
              className="mt-6 bg-green-500 text-white rounded-full px-6 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="p-4 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSendMessage} className="flex space-x-2 bg-white bg-opacity-30 backdrop-blur-sm rounded-2xl shadow-lg p-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a message to Compass"
            className="flex-1 rounded-full border-0 bg-gray-100 bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-green-300 focus:bg-white px-6 py-3"
          />
          <button
            type="submit"
            className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Compass is not a substitute for professional legal advice.</p>
      </footer>

    </div>
  );
}