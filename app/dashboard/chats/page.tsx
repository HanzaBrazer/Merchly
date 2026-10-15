'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MoreVertical,
  Plus,
  Send,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
  Key,
  Bot,
  Settings,
  X,
  Check,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ChatsPage() {
  const { conversations, activeChatId, setActiveChatId, sendMessage, workspace } =
    useMerchly();

  const [inputMessage, setInputMessage] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Gemini API Key config
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isUsingLiveGemini, setIsUsingLiveGemini] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load API key from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('merchly_gemini_api_key');
      if (savedKey) {
        setGeminiApiKey(savedKey);
        setTempApiKey(savedKey);
        setIsUsingLiveGemini(true);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const activeConversation =
    conversations.find((c) => c.id === activeChatId) || conversations[0];

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isCustomerTyping]);

  // Handle Send from Store Owner -> Triggers Realtime Customer Reply via Gemini
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isCustomerTyping) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // 1. Send the admin message to chat
    sendMessage(activeConversation.id, userText, 'admin');

    // 2. Start customer typing state
    setIsCustomerTyping(true);

    try {
      // 3. Request Gemini to respond as the customer
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: activeConversation.customerName,
          customerId: activeConversation.customerId,
          customerContext: `Customer named ${activeConversation.customerName} on channel ${activeConversation.channel}. Inquiries: ${activeConversation.lastMessage}`,
          messages: activeConversation.messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          latestMessage: userText,
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();

      if (data.isLiveGemini) {
        setIsUsingLiveGemini(true);
      }

      // 4. Realistic natural pause (1.4s) so the customer response feels authentic
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const customerReply =
        data.reply ||
        "Thank you for the update! I really appreciate your quick response.";

      // 5. Append customer's response to the conversation
      sendMessage(activeConversation.id, customerReply, 'customer');
      toast.info(`New message from ${activeConversation.customerName}`, {
        description: customerReply.length > 50 ? `${customerReply.slice(0, 50)}...` : customerReply,
      });
    } catch (err) {
      console.error('Error getting customer reply from Gemini:', err);
      // Fallback response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      sendMessage(
        activeConversation.id,
        "Thank you! Please keep me posted on the next steps.",
        'customer'
      );
    } finally {
      setIsCustomerTyping(false);
    }
  };

  // Handle "Generate AI Reply" (Productive with AI feature)
  const handleAiQuickReply = async () => {
    setIsGeneratingAi(true);

    try {
      const lastCustMsg =
        activeConversation.messages
          .filter((m) => m.sender === 'customer')
          .slice(-1)[0]?.text || activeConversation.lastMessage;

      const res = await fetch('/api/gemini/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: activeConversation.customerName,
          lastCustomerMessage: lastCustMsg,
          messages: activeConversation.messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
          apiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      if (data.suggestion) {
        setInputMessage(data.suggestion);
        inputRef.current?.focus();
        toast.success('AI draft generated! Review and click send.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate AI reply');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveApiKey = () => {
    try {
      if (tempApiKey.trim()) {
        localStorage.setItem('merchly_gemini_api_key', tempApiKey.trim());
        setGeminiApiKey(tempApiKey.trim());
        setIsUsingLiveGemini(true);
        toast.success('Gemini API key saved! Live customer simulation is active.');
      } else {
        localStorage.removeItem('merchly_gemini_api_key');
        setGeminiApiKey('');
        setIsUsingLiveGemini(false);
        toast.info('Using built-in Gemini contextual AI simulation engine.');
      }
      setIsApiKeyModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveChatId(id);
    setMobileView('chat');
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.customerName.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <div className="h-[calc(100vh-140px)] min-h-[640px] bg-white rounded-[40px] border border-[#E2E2E2]/70 shadow-xs flex overflow-hidden w-full max-w-[1400px]">
        {/* Left Column: Conversations List (Figma Replica 9:5844) */}
        <div
          className={cn(
            'w-full md:w-80 lg:w-[350px] border-r border-[#E2E2E2]/70 flex flex-col shrink-0 bg-white',
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E2E2E2]/70">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-[#000000]">Chats</h2>
              <span className="text-xs font-semibold text-[#FF0013] bg-[#FFE6E7] px-2.5 py-0.5 rounded-full">
                {totalUnread} unread
              </span>
            </div>
            <p className="text-sm text-[#A0A0A0] font-normal">
              You have {totalUnread} unread customer inquiries
            </p>

            {/* Conversation Search Bar */}
            <div className="relative mt-3">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-full bg-[#F6F6F6] text-xs text-[#000000] border border-transparent focus:outline-hidden focus:border-[#CE3627] transition-all"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#000000]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F5F5F5]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'p-4 px-5 flex items-start gap-3.5 cursor-pointer transition-colors select-none',
                    isSelected ? 'bg-[#F6F6F6]' : 'hover:bg-[#FAFAFA]'
                  )}
                >
                  {/* Avatar with online dot */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        conv.customerAvatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
                      }
                      alt={conv.customerName}
                      className="w-12 h-12 rounded-full object-cover bg-[#F6F6F6]"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0E8F21] border-2 border-white" />
                    )}
                  </div>

                  {/* Text snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-base text-[#000000] truncate">
                        {conv.customerName}
                      </h4>
                      <span className="text-xs text-[#A0A0A0] font-normal">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-[#71717A] truncate font-normal leading-relaxed">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FF0013] text-white text-[11px] font-bold flex items-center justify-center shrink-0 self-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chat Room (Figma Replica 9:5844) */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 bg-[#FBFBFB]',
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Room Header */}
          <div className="h-20 px-6 border-b border-[#E2E2E2]/70 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden p-2 rounded-full hover:bg-black/5 text-[#71717A]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={
                    activeConversation.customerAvatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
                  }
                  alt={activeConversation.customerName}
                  className="w-10 h-10 rounded-full object-cover bg-[#F6F6F6]"
                />
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0E8F21] border-2 border-white" />
                )}
              </div>

              <div>
                <h3 className="font-medium text-base text-[#000000]">
                  {activeConversation.customerName}
                </h3>
                <span className="text-xs text-[#0E8F21] font-normal">Online now</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Gemini Realtime Connection Badge */}
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FEF1ED] text-[#CE3627] hover:bg-[#F7D7D1] transition-colors cursor-pointer select-none"
                title="Gemini AI Customer Reply Settings"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CE3627]" />
                <span>{isUsingLiveGemini ? 'Gemini Live AI' : 'Gemini AI Active'}</span>
                <span className="w-2 h-2 rounded-full bg-[#0E8F21] ml-0.5 animate-pulse" />
              </button>

              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-9 h-9 rounded-full hover:bg-[#F6F6F6] text-[#71717A] flex items-center justify-center transition-colors"
                title="Search in chat"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="w-9 h-9 rounded-full hover:bg-[#F6F6F6] text-[#71717A] flex items-center justify-center transition-colors"
                title="Settings & Gemini API"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area matching Figma styling */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5">
            {activeConversation.messages.map((msg, idx) => {
              const isMe = msg.sender === 'admin';

              return (
                <div
                  key={msg.id || idx}
                  className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
                >
                  {/* Timestamp separator if provided */}
                  {idx === 0 && (
                    <div className="w-full text-center my-2">
                      <span className="text-xs text-[#A0A0A0] font-normal">{msg.timestamp || '10:33 AM'}</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-[85%] sm:max-w-lg p-4 rounded-2xl text-sm leading-relaxed shadow-2xs transition-all',
                      isMe
                        ? 'bg-[#FEF1ED] text-[#4A1512] rounded-br-none border border-[#F7D7D1]'
                        : 'bg-white text-[#000000] rounded-bl-none border border-[#E2E2E2]'
                    )}
                  >
                    <p className="font-normal">{msg.text}</p>

                    {/* Image Attachments */}
                    {msg.images && msg.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2.5 mt-3 pt-2.5 border-t border-black/10">
                        {msg.images.map((img, i) => (
                          <div
                            key={i}
                            className="rounded-xl overflow-hidden border border-[#E2E2E2] bg-white h-28"
                          >
                            <img
                              src={img}
                              alt="Attachment"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] text-[#A0A0A0] mt-1.5 px-1 font-normal">
                    {msg.timestamp} {msg.isAiGenerated && '• Sent with AI'}
                  </span>
                </div>
              );
            })}

            {/* Realtime Customer Typing Indicator when Gemini is responding */}
            {isCustomerTyping && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="flex items-center gap-3 p-3.5 px-4 bg-white rounded-2xl rounded-bl-none border border-[#E2E2E2] shadow-2xs">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#CE3627] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#CE3627] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#CE3627] animate-bounce" />
                  </div>
                  <span className="text-xs text-[#71717A] font-medium">
                    {activeConversation.customerName} is typing a reply via Gemini...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Quick Reply Recommendation Bar (Figma Replica) */}
          <div className="px-6 py-2.5 bg-[#FEF1ED] border-t border-[#F7D7D1] flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-[#CE3627] font-medium">
              <Sparkles className="w-4 h-4 text-[#CE3627] shrink-0" />
              <span className="hidden sm:inline font-medium">Productive with AI:</span>
              <span className="text-[#4A1512] font-normal">Context-aware draft reply</span>
            </div>

            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleAiQuickReply}
              className="h-9 px-4 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] transition-colors text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAi ? 'Drafting...' : 'Generate AI Reply'}</span>
            </button>
          </div>

          {/* Chat Input Bar (Figma Replica 9:5844) */}
          <form
            onSubmit={handleSend}
            className="p-4 px-6 bg-white border-t border-[#E2E2E2]/70 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => toast.info('Photo attachment simulation: Attached damage review photo')}
              className="w-10 h-10 rounded-full text-[#71717A] hover:text-[#000000] hover:bg-[#F6F6F6] flex items-center justify-center transition-colors shrink-0"
              title="Attach photo"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isCustomerTyping}
              className="flex-1 h-12 px-5 bg-[#F6F6F6] rounded-full text-sm text-[#000000] border border-transparent focus:outline-hidden focus:border-[#CE3627] focus:bg-white transition-all shadow-xs"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isCustomerTyping}
              className="w-12 h-12 rounded-full bg-[#CE3627] text-white flex items-center justify-center hover:bg-[#B72E20] disabled:opacity-40 transition-all shrink-0 shadow-xs cursor-pointer"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Gemini AI Key Settings Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E2E2E2] space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#FEF1ED] flex items-center justify-center text-[#CE3627]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#000000]">Gemini AI Integration</h3>
                  <p className="text-xs text-[#A0A0A0]">Realtime Customer Simulation</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F6F6F6] flex items-center justify-center text-[#71717A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F6F6] text-xs text-[#71717A] leading-relaxed space-y-2">
              <p>
                Ketika Anda mengirim pesan di chat, <strong>Google Gemini</strong> akan berperan sebagai pelanggan ({activeConversation.customerName}) dan merespons secara otomatis serta real-time.
              </p>
              <div className="flex items-center gap-1.5 text-[#0E8F21] font-medium pt-1">
                <CheckCircle className="w-4 h-4" />
                <span>Simulasi Realtime Gemini Aktif & Siap Digunakan</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#000000] block">
                Google Gemini API Key (Opsional)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#E2E2E2] text-xs text-[#000000] focus:outline-hidden focus:border-[#CE3627]"
              />
              <p className="text-[11px] text-[#A0A0A0]">
                Jika dikosongkan, sistem akan otomatis menggunakan AI Engine bawaan Merchly untuk merespons pesan secara real-time.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="h-10 px-4 rounded-full border border-[#E8E8E8] text-xs font-medium text-[#71717A] hover:bg-[#F6F6F6]"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="h-10 px-5 rounded-full bg-[#CE3627] text-white hover:bg-[#B72E20] text-xs font-medium shadow-xs"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
