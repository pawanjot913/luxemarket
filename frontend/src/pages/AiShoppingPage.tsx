import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, RefreshCw, Star, ExternalLink } from 'lucide-react';
import { Product } from '../types';
import { askAiShoppingAssistant } from '../api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'Show me luxury watches under $300',
  'Looking for refined menswear jackets',
  'Top rated unisex sunglasses',
  'New arrivals in women\'s collection'
];

export default function AiShoppingPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Hello! I am Luxe Market's Personal AI Shopping Assistant. Tell me what precision-crafted pieces you are looking for today, and I'll recommend items directly from our catalog.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setError(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askAiShoppingAssistant(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer || "Here are matching products from our catalog:",
        products: response.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unable to connect to AI assistant.';
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `Apologies, I encountered an issue: ${errMsg}. Please try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1D20] py-8 sm:py-12 px-4 sm:px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col h-[85vh] bg-white border border-[#E9ECEF] rounded-lg shadow-xl overflow-hidden text-left">
        
        {/* Header Bar */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2F58CD] flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                AI Shopping Assistant
              </h1>
              <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider block">
                Powered by OpenRouter &amp; Luxe Catalog
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-[10px] text-neutral-400 hover:text-white uppercase tracking-widest font-bold border border-neutral-800 px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8F9FA]/50">
          
          {/* Quick Prompts Pills */}
          {messages.length <= 1 && (
            <div className="mb-6 bg-white p-4 rounded-md border border-neutral-200 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                Try Asking:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs bg-neutral-50 hover:bg-black hover:text-white border border-neutral-200 px-3.5 py-2 rounded-full font-semibold transition-all cursor-pointer text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user' ? 'bg-black text-white' : 'bg-[#2F58CD] text-white'
              }`}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Content Bubble */}
              <div className={`space-y-4 max-w-[88%] sm:max-w-[80%]`}>
                <div className={`p-4 rounded-md text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-black text-white font-medium rounded-tr-none'
                    : 'bg-white border border-[#E9ECEF] text-neutral-800 shadow-xs rounded-tl-none font-normal'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>
                  <span className={`text-[9px] block mt-2 text-right font-medium ${
                    msg.sender === 'user' ? 'text-neutral-400' : 'text-neutral-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Embedded Recommended Products Grid */}
                {msg.products && msg.products.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                      Recommended Catalog Items ({msg.products.length}):
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white border border-[#E9ECEF] hover:border-black rounded-sm p-3 shadow-xs transition-all flex flex-col justify-between group"
                        >
                          <div className="flex gap-3 items-center mb-3">
                            <div className="w-16 h-20 bg-neutral-50 rounded-sm overflow-hidden shrink-0 border border-neutral-100">
                              <img
                                src={prod.image || undefined}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="space-y-1 text-left flex-1 min-w-0">
                              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block truncate">
                                {prod.category}
                              </span>
                              <h4 className="text-xs font-bold text-black truncate group-hover:text-[#2F58CD] transition-colors">
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-neutral-900">
                                  ${prod.price.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5">
                                  <Star size={10} fill="currentColor" /> {prod.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              navigate(`/product/${prod.id}`);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full bg-black text-white hover:bg-neutral-800 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <span>View Product</span>
                            <ExternalLink size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Loading State */}
          {isLoading && (
            <div className="flex gap-3 max-w-md items-center">
              <div className="w-8 h-8 rounded-full bg-[#2F58CD] text-white flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-white border border-[#E9ECEF] p-3.5 rounded-md text-xs font-semibold text-neutral-500 flex items-center gap-2 shadow-xs">
                <RefreshCw className="animate-spin text-[#2F58CD]" size={14} />
                <span>Searching catalog &amp; consulting OpenRouter AI...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-4 bg-white border-t border-[#E9ECEF] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask for recommendations (e.g. 'Show me luxury watches under $300')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 border border-neutral-200 p-3 text-xs font-medium rounded-sm focus:outline-none focus:border-black bg-neutral-50 text-neutral-800 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Send</span>
              <Send size={12} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
