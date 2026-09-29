import React, { useEffect, useRef, useState } from 'react';
import { api } from './api.js';

export default function ChatPanel({ conversationId, token, admin = false, puppy = null, userProfile = null }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const scrollContainerRef = useRef(null);

  const visitorName = userProfile?.name || 'Visitor';

  // Isolated container scroll method (does NOT scroll the parent window/page!)
  const scrollToBottomInternal = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    let live = true;
    if (!conversationId) return;

    if (String(conversationId).startsWith('local-chat-')) {
      setIsLocalFallback(true);
      setMessages([
        {
          id: 'welcome-1',
          sender: 'shelter',
          text: `Hello ${visitorName}! Thank you for inquiring about ${puppy?.name || 'our puppies'}. Our nursery team is ready to answer any questions regarding adoption, health guarantees, and flight shipping!`,
          createdAt: new Date().toISOString()
        }
      ]);
      return;
    }

    const load = async () => {
      try {
        const url = `/conversations/${conversationId}/messages${admin ? '?admin=true' : ''}`;
        const result = await api(url, { token });
        if (live && Array.isArray(result)) {
          setMessages(result);
          setError('');
        }
      } catch (err) {
        if (live) {
          setError('Connecting to shelter chat server...');
        }
      }
    };

    load();
    const timer = window.setInterval(load, 2500);
    return () => {
      live = false;
      window.clearInterval(timer);
    };
  }, [conversationId, token, admin, puppy, visitorName]);

  // Scroll ONLY the chat inner container when messages update
  useEffect(() => {
    scrollToBottomInternal();
  }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    const body = text.trim();
    setText('');
    setError('');

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: admin ? 'admin' : 'visitor',
      text: body,
      createdAt: new Date().toISOString()
    };

    if (isLocalFallback) {
      setMessages((current) => [...current, newMsg]);
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: `reply-${Date.now()}`,
            sender: 'shelter',
            text: `Thank you for your message, ${visitorName}! We have noted your inquiry for ${puppy?.name || 'this puppy'}. Our nursery manager will also follow up directly with you!`,
            createdAt: new Date().toISOString()
          }
        ]);
      }, 1000);
      return;
    }

    try {
      const message = await api(`/conversations/${conversationId}/messages`, {
        token,
        method: 'POST',
        body: JSON.stringify({ text: body, visitorName })
      });
      setMessages((current) => [...current, message || newMsg]);
    } catch (err) {
      setMessages((current) => [...current, newMsg]);
      setError('');
    }
  };

  return (
    <section className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#E8DAF0] bg-white">
      {/* Contact Badge Info Bar */}
      {userProfile?.email && !admin && (
        <div className="bg-[#F2EAFA] border-b border-[#E8DAF0] px-4 py-2 text-xs flex justify-between items-center text-[#6C428E] shrink-0">
          <span>Assisting: <strong>{userProfile.name}</strong> ({userProfile.email})</span>
          {userProfile.phone && <span>📞 {userProfile.phone}</span>}
        </div>
      )}

      {/* Messages Scroll View (Strictly self-contained) */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 space-y-3 overflow-y-auto bg-[#FCF9FE] p-4 min-h-[260px] max-h-[380px]" 
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm border border-[#E8DAF0]">
            <p className="text-sm font-bold text-[#2D1B3E]">
              {admin ? `Start typing to reply to ${visitorName}` : `Welcome, ${visitorName}!`}
            </p>
            <p className="mt-1 text-xs text-[#6C428E]">
              {admin ? 'Replies sent here will appear on the visitor’s chat window in real time.' : `Send a message to our adoption team about ${puppy?.name || 'adoption'} and replies will appear here.`}
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.sender === (admin ? 'admin' : 'visitor');
          return (
            <div key={message.id || Math.random()} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isUser
                    ? 'bg-[#2D1B3E] text-white rounded-br-none'
                    : 'bg-white text-[#2D1B3E] ring-1 ring-[#E8DAF0] rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <span className="mt-1 block text-[10px] opacity-70">
                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p role="alert" className="px-4 pt-2 text-xs font-semibold text-[#6C428E] shrink-0">{error}</p>}

      <form onSubmit={send} className="flex gap-2 border-t border-[#E8DAF0] bg-white p-3 shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          required
          placeholder={admin ? `Reply to ${visitorName}...` : `Write a message as ${visitorName}...`}
          className="min-w-0 flex-1 rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] px-3.5 py-3 text-sm text-[#2D1B3E] outline-none transition focus:border-[#6C428E]"
        />
        <button className="rounded-xl bg-[#2D1B3E] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#452B5E]">
          {admin ? 'Reply' : 'Send'}
        </button>
      </form>
    </section>
  );
}