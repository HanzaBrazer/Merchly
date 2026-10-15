'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Plus,
  Send,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useMerchly } from '@/lib/store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ChatsPage() {
  const { conversations, activeChatId, setActiveChatId, sendMessage, generateAiReply, workspace } =
    useMerchly();

  const [inputMessage, setInputMessage] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const activeConversation =
    conversations.find((c) => c.id === activeChatId) || conversations[0];

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(activeConversation.id, inputMessage, 'admin');
    setInputMessage('');
  };

  const handleAiQuickReply = async () => {
    if (workspace.plan === 'FREE') {
      toast.info('AI Customer Service replies are a Pro feature.');
      return;
    }

    setIsGeneratingAi(true);
    const reply = await generateAiReply(activeConversation.id);
    setInputMessage(reply);
    setIsGeneratingAi(false);
    toast.success('AI draft generated! Review and click send.');
  };

  const handleSelectConversation = (id: string) => {
    setActiveChatId(id);
    setMobileView('chat');
  };

  return (
    <AppShell>
      <div className="h-[calc(100vh-140px)] min-h-[600px] bg-white rounded-3xl border border-[#E2E2E2] shadow-sm flex overflow-hidden">
        {/* Left Column: Conversations List */}
        <div
          className={cn(
            'w-full md:w-80 lg:w-96 border-r border-[#E2E2E2] flex flex-col shrink-0',
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E2E2E2]">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-[#000000]">Chats</h2>
              <span className="text-xs font-semibold text-[#FF0013] bg-[#FFE6E7] px-2 py-0.5 rounded-full">
                {totalUnread} unread
              </span>
            </div>
            <p className="text-xs text-[#71717A]">
              You have {totalUnread} unread customer inquiries
            </p>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E2E2]/60">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'p-4 flex items-start gap-3.5 cursor-pointer transition-colors select-none',
                    isSelected ? 'bg-[#F6F6F6]' : 'hover:bg-[#F9F9F9]'
                  )}
                >
                  {/* Avatar with online dot */}
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        conv.customerAvatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                      }
                      alt={conv.customerName}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#0E8F21] border-2 border-white" />
                    )}
                  </div>

                  {/* Text snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm text-[#000000] truncate">
                        {conv.customerName}
                      </h4>
                      <span className="text-[11px] text-[#A0A0A0]">{conv.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-[#71717A] truncate mt-1 leading-relaxed">
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

        {/* Right Column: Active Chat Room */}
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 bg-[#FBFBFB]',
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          )}
        >
          {/* Room Header */}
          <div className="h-16 px-5 border-b border-[#E2E2E2] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 rounded-full hover:bg-black/5 text-[#71717A]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    activeConversation.customerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                  }
                  alt={activeConversation.customerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#0E8F21] border-2 border-white" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#000000]">
                  {activeConversation.customerName}
                </h3>
                <span className="text-[11px] text-[#0E8F21] font-medium">Online now</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[#71717A]">
              <button className="p-2 rounded-full hover:bg-black/5 hover:text-[#000000]">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-full hover:bg-black/5 hover:text-[#000000]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeConversation.messages.map((msg) => {
              const isMe = msg.sender === 'admin';

              return (
                <div
                  key={msg.id}
                  className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs',
                      isMe
                        ? 'bg-[#FEF1ED] text-[#4A1512] rounded-br-none border border-[#F7D7D1]'
                        : 'bg-white text-[#000000] rounded-bl-none border border-[#E2E2E2]'
                    )}
                  >
                    <p>{msg.text}</p>

                    {/* Image Attachments (e.g. damaged furniture photos from Figma) */}
                    {msg.images && msg.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-black/10">
                        {msg.images.map((img, i) => (
                          <div
                            key={i}
                            className="rounded-xl overflow-hidden border border-[#E2E2E2] bg-white h-24"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
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

                  <span className="text-[10px] text-[#A0A0A0] mt-1 px-1">
                    {msg.timestamp} {msg.isAiGenerated && '• Sent with AI'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* AI Quick Reply Recommendation Bar */}
          <div className="px-4 py-2 bg-[#FEF1ED] border-t border-[#F7D7D1] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#CE3627] font-semibold">
              <Sparkles className="w-4 h-4 text-[#CE3627]" />
              <span className="hidden sm:inline">Productive with AI:</span>
              <span className="text-[#4A1512] font-normal">Context-aware draft reply</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              disabled={isGeneratingAi}
              onClick={handleAiQuickReply}
              className="text-xs py-1 px-3.5 font-bold"
            >
              {isGeneratingAi ? 'Thinking...' : '✨ Generate AI Reply'}
            </Button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3.5 bg-white border-t border-[#E2E2E2] flex items-center gap-2.5"
          >
            <button
              type="button"
              className="p-2 text-[#71717A] hover:text-[#000000] rounded-full hover:bg-[#F6F6F6]"
              title="Attach photo"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#F6F6F6] rounded-full text-xs sm:text-sm border border-[#E2E2E2] focus:outline-none focus:border-[#CE3627]"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-full bg-[#CE3627] text-white flex items-center justify-center hover:bg-[#B72E20] disabled:opacity-40 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
