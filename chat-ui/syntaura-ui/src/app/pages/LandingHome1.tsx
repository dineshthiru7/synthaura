'use client'

import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiCopy, FiTrash2, FiEdit2, FiMic, FiMicOff } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';

// Type definitions
type Message = {
    id: number;
    text: string;
    sender: 'user' | 'chatgpt' | 'deepseek';
    timestamp: string;
    isLoading?: boolean;
  };

type Conversation = {
  id: number;
  title: string;
};

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm SynthAura. How can I help you today?",
      sender: 'chatgpt',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([{ id: 1, title: 'New Chat' }]);
  const [activeConversation, setActiveConversation] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<'both' | 'chatgpt' | 'deepseek'>('both');



  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      
      speechRecognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInput(transcript);
      };
      
      speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      
      setRecognition(speechRecognition);
    } else {
      console.warn('Speech recognition not supported');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleRecording = (): void => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      setInput(''); // Clear input when starting new recording
    }
  };

  const handleSendMessage1 = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    // Stop recording if active
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: `This is a simulated response to: "${input}". In a real app, this would call the SynthAura API.`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {

 // const handleSendMessage = async (text: string) => {
    e.preventDefault();
    if (!input.trim()) return;
    let text=input;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsRecording(false);

    // Add loading indicators for the services we'll call
    const newMessages = [...messages, userMessage];
    if (selectedService === 'both' || selectedService === 'chatgpt') {
      newMessages.push({
        id: Date.now() + 1,
        text: '',
        sender: 'chatgpt',
        timestamp: new Date().toLocaleTimeString(),
        isLoading: true
      });
    }
    if (selectedService === 'both' || selectedService === 'deepseek') {
      newMessages.push({
        id: Date.now() + 2,
        text: '',
        sender: 'deepseek',
        timestamp: new Date().toLocaleTimeString(),
        isLoading: true
      });
    }
    setMessages(newMessages);

    // Call APIs
    try {
      if (selectedService === 'both' || selectedService === 'chatgpt') {
        await callChatGPT(text);
      }
      if (selectedService === 'both' || selectedService === 'deepseek') {
        await callDeepSeek(text);
      }
    } catch (error) {
      console.error('API call failed:', error);
      setMessages(prev => prev.map(msg => 
        msg.isLoading ? { ...msg, text: 'Failed to get response', isLoading: false } : msg
      ));
    }
  };

  const callChatGPT = async (text: string) => {
    const response = await fetch('http://localhost:5000/api/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) throw new Error('ChatGPT API failed');
    const data = await response.json();

    setMessages(prev => prev.map(msg => 
      msg.sender === 'chatgpt' && msg.isLoading 
        ? { ...msg, text: data.response, isLoading: false } 
        : msg
    ));
  };

  const callDeepSeek = async (text: string) => {
    const response = await fetch('http://localhost:5000/api/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) throw new Error('DeepSeek API failed');
    const data = await response.json();

    setMessages(prev => prev.map(msg => 
      msg.sender === 'deepseek' && msg.isLoading 
        ? { ...msg, text: data.response, isLoading: false } 
        : msg
    ));
  };

  const startNewChat = (): void => {
    setMessages([]);
    const newId = conversations.length + 1;
    setConversations([...conversations, { id: newId, title: `New Chat ${newId}` }]);
    setActiveConversation(newId);
  };

  const copyMessage = (text: string): void => {
    navigator.clipboard.writeText(text);
  };

  const deleteMessage = (id: number): void => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const editMessage = (id: number, newText: string | null): void => {
    if (!newText) return;
    setMessages(messages.map(message => 
      message.id === id ? { ...message, text: newText } : message
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4">
          <button 
            onClick={startNewChat}
            className="w-full border border-gray-600 rounded-md py-2 px-4 text-sm flex items-center justify-center hover:bg-gray-700 transition"
          >
            + New chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveConversation(conv.id)}
              className={`p-3 text-sm cursor-pointer hover:bg-gray-700 ${activeConversation === conv.id ? 'bg-gray-700' : ''}`}
            >
              {conv.title}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <FiUser />
            </div>
            <span>User Account</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">SynthAura</h1>

          <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setSelectedService('both')}
          className={`px-4 py-2 rounded-md ${selectedService === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Both APIs
        </button>
        <button
          onClick={() => setSelectedService('chatgpt')}
          className={`px-4 py-2 rounded-md ${selectedService === 'chatgpt' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          ChatGPT Only
        </button>
        <button
          onClick={() => setSelectedService('deepseek')}
          className={`px-4 py-2 rounded-md ${selectedService === 'deepseek' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          DeepSeek Only
        </button>
      </div>

        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BsRobot className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">How can I help you today?</h2>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl rounded-lg px-4 py-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {message.sender === 'user' ? <FiUser /> : <BsRobot />}
                      </div>
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <div className={`text-xs mt-1 flex items-center ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span>{message.timestamp}</span>
                          {message.sender === 'user' ? (
                            <button 
                              onClick={() => editMessage(message.id, prompt('Edit message:', message.text))}
                              className="ml-2 hover:text-blue-300"
                            >
                              <FiEdit2 size={14} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => copyMessage(message.text)}
                              className="ml-2 hover:text-gray-700"
                              title="Copy"
                            >
                              <FiCopy size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => deleteMessage(message.id)}
                            className="ml-2 hover:text-red-400"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg px-4 py-3 bg-gray-200">
                    <div className="flex items-center space-x-2">
                      <BsRobot />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message SynthAura..."
                className="w-full border border-gray-300 rounded-md py-3 px-4 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                {('webkitSpeechRecognition' in window) && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-1 rounded-md ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700'}`}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {isRecording ? <FiMicOff size={20} /> : <FiMic size={20} />}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`p-1 rounded-md ${!input.trim() || isLoading ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-50'}`}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </form>
          {isRecording && (
            <div className="text-xs text-red-500 mt-1 flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></div>
              Listening...
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2 text-center">
            SynthAura can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;