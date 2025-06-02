
'use client';

import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  toolsUsed?: string[];
}

export default function SimpleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'Sorry, I encountered an error.',
        role: 'assistant',
        timestamp: new Date(),
        toolsUsed: data.toolsUsed || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="h-[600px] overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Bot className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Welcome to your AI Assistant
                  </h3>
                  <p className="text-slate-400">
                    Ask me anything! I can provide real-time information including current time, weather, web search results, and more.
                  </p>
                  <div className="mt-4 text-sm text-slate-500">
                    <p>Try asking:</p>
                    <ul className="mt-2 space-y-1">
                      <li>• "What time is it?"</li>
                      <li>• "What's the weather in New York?"</li>
                      <li>• "Search for latest AI news"</li>
                      <li>• "What's my IP address?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] items-start space-x-2 ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          message.role === 'user'
                            ? 'bg-purple-600'
                            : 'bg-slate-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.toolsUsed && message.toolsUsed.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.toolsUsed.map((tool, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-green-600 px-2 py-1 text-xs text-white"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="rounded-lg bg-slate-700 px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-500">Online mode - Real-time tools active</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 p-4">
            <div className="flex space-x-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything! I can get real-time info like current time, weather, search results, or help with any topic..."
                className="min-h-[60px] resize-none border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-purple-500"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
