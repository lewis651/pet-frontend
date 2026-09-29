import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from './api.js';
import ChatPanel from './ChatPanel.jsx';

export default function PuppyDetail({ puppy, onClose }) {
  const [active, setActive] = useState(0);
  const [chat, setChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [error, setError] = useState('');

  // Pre-fill user details from localStorage if they filled it before
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('dazy_visitor_info');
      return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', location: '' };
    } catch {
      return { name: '', email: '', phone: '', location: '' };
    }
  });

  useEffect(() => {
    api('/config')
      .then((config) => setWhatsappPhone(config.whatsappPhone || ''))
      .catch(() => {});
  }, []);

  const handleStartChatClick = () => {
    // If we already have the user's name and email stored, open chat directly
    if (userProfile.name && userProfile.email) {
      initiateChatSession(userProfile);
    } else {
      setShowIdentityForm(true);
    }
  };

  const handleIdentitySubmit = (e) => {
    e.preventDefault();
    if (!userProfile.name.trim() || !userProfile.email.trim()) {
      setError('Please provide your name and email so we know who we are assisting!');
      return;
    }
    try {
      localStorage.setItem('dazy_visitor_info', JSON.stringify(userProfile));
    } catch {}
    
    setShowIdentityForm(false);
    initiateChatSession(userProfile);
  };

  const initiateChatSession = async (profile) => {
    setChatOpen(true);
    setError('');
    const storageKey = `shelter-last-chat:${puppy.id}`;
    let saved = null;
    try {
      saved = sessionStorage.getItem(storageKey);
    } catch {}

    if (saved) {
      try {
        setChat(JSON.parse(saved));
        return;
      } catch {
        try { sessionStorage.removeItem(storageKey); } catch {}
      }
    }

    setChat(null);
    setChatLoading(true);

    try {
      const result = await api('/chats', {
        method: 'POST',
        body: JSON.stringify({ 
          puppyId: puppy.id, 
          puppyName: puppy.name,
          visitorName: profile.name,
          visitorEmail: profile.email,
          visitorPhone: profile.phone,
          visitorLocation: profile.location
        })
      });
      const session = { conversationId: result.conversationId, chatToken: result.chatToken };
      try { sessionStorage.setItem(storageKey, JSON.stringify(session)); } catch {}
      setChat(session);
    } catch (err) {
      // Offline / Fallback session with stored user details
      const fallbackSession = {
        conversationId: `local-chat-${puppy.id}-${Date.now()}`,
        chatToken: 'local-demo-token',
        isLocalFallback: true
      };
      setChat(fallbackSession);
    } finally {
      setChatLoading(false);
    }
  };

  const phone = whatsappPhone.replace(/\D/g, '');
  const messageText = `Hello, I’m interested in ${puppy.name} (${puppy.breedType}). My name is ${userProfile.name || 'a visitor'}.`;
  const whatsappLink = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}` : '';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C0F26]/80 p-4 backdrop-blur-md">
        <div className="mx-auto my-4 max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <button
            onClick={onClose}
            aria-label="Close puppy details"
            className="float-right m-4 grid h-10 w-10 place-items-center rounded-full bg-[#F1E8F7] text-xl font-black text-[#2D1B3E] transition hover:bg-[#2D1B3E] hover:text-white"
          >
            ×
          </button>
          <div className="grid clear-both lg:grid-cols-2">
            <div className="bg-gradient-to-br from-[#241232] via-[#38204B] to-[#4A2C5D] p-5">
              <img
                src={puppy.images[active]}
                alt={`${puppy.name} photo ${active + 1}`}
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-lg"
              />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {puppy.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    className={`overflow-hidden rounded-xl transition ${i === active ? 'ring-2 ring-[#EBCB8B] scale-105' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black text-[#2D1B3E]">{puppy.name}</h2>
                  <p className="mt-2 text-lg font-bold text-[#6C428E]">{puppy.breed}</p>
                </div>
                <b className="text-2xl font-black text-[#D99F38]">{puppy.adoptionFee}</b>
              </div>

              <p className="mt-5 rounded-2xl border border-[#E8DAF0] bg-gradient-to-r from-[#F8F2FC] to-[#FCF9FE] p-4 text-base text-[#584168]">
                {puppy.healthNotes}
              </p>

              <dl className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ['Age', puppy.age],
                  ['Weight', puppy.weight],
                  ['Sex', puppy.gender]
                ].map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] p-3 text-center">
                    <dt className="text-[10px] font-black uppercase tracking-wider text-[#8668A1]">{key}</dt>
                    <dd className="mt-1 font-bold text-[#2D1B3E]">{value}</dd>
                  </div>
                ))}
              </dl>

              <section className="mt-7 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-[#2D1B3E]">Talk with our adoption team about {puppy.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#584168]">
                    Start a live chat session to inquire about reservation, health warranty, and delivery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartChatClick}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2D1B3E] px-5 py-4 font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#452B5E]"
                >
                  <span aria-hidden="true">💬</span> Open Live Chat
                </button>
                

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#168B57] px-5 py-4 text-center font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#117346]"
                  >
                    <span aria-hidden="true">📱</span> Chat on WhatsApp
                  </a>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Chat Quick Identification Modal (No Account Required) */}
      {showIdentityForm &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#180A24]/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl border border-[#E8DAF0]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#F2EAFA] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#6C428E]">Quick Inquiry</span>
                <button onClick={() => setShowIdentityForm(false)} className="text-2xl font-bold text-[#8668A1] hover:text-[#2D1B3E]">×</button>
              </div>
              
              <h3 className="mt-4 text-2xl font-black text-[#2D1B3E]">Tell us a little about yourself</h3>
              <p className="mt-1 text-xs text-[#584168]">No password or account creation needed. This helps our adoption team know who they are speaking with.</p>

              {error && <p className="mt-3 text-xs font-bold text-red-600">{error}</p>}

              <form onSubmit={handleIdentitySubmit} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B3E]">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] px-4 py-2.5 text-sm text-[#2D1B3E] outline-none focus:border-[#6C428E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D1B3E]">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] px-4 py-2.5 text-sm text-[#2D1B3E] outline-none focus:border-[#6C428E]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2D1B3E]">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] px-4 py-2.5 text-sm text-[#2D1B3E] outline-none focus:border-[#6C428E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2D1B3E]">City, State</label>
                    <input
                      type="text"
                      placeholder="Dallas, TX"
                      value={userProfile.location}
                      onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E8DAF0] bg-[#FCF9FE] px-4 py-2.5 text-sm text-[#2D1B3E] outline-none focus:border-[#6C428E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-[#2D1B3E] py-3.5 text-sm font-extrabold text-white transition hover:bg-[#452B5E]"
                >
                  Start Live Chat →
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Live Chat Modal */}
      {chatOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#180A24]/70 p-3 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setChatOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-chat-title"
              className="flex h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl"
            >
              <header className="flex items-center justify-between gap-4 bg-[#2D1B3E] px-5 py-4 text-white">
                <div>
                  <h2 id="live-chat-title" className="text-lg font-black">
                    Live Chat with Dazy’s Shelter Team
                  </h2>
                  <p className="mt-0.5 text-xs text-purple-200">
                    Inquiring about {puppy.name} ({puppy.breed}) • <span className="font-semibold text-[#EBCB8B]">{userProfile.name}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  aria-label="Close live chat"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30"
                >
                  ×
                </button>
              </header>

              <div className="flex-1 min-h-0 overflow-y-auto p-4">
                {chat ? (
                  <ChatPanel conversationId={chat.conversationId} token={chat.chatToken} puppy={puppy} userProfile={userProfile} />
                ) : chatLoading ? (
                  <div className="grid h-full place-items-center text-center p-8">
                    <div>
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DAF0] border-t-[#6C428E]" />
                      <p className="mt-4 text-base font-black text-[#2D1B3E]">Opening conversation...</p>
                      <p className="mt-1 text-xs text-[#8668A1]">Connecting you directly to nursery advisors.</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-red-50 p-5 text-center">
                    <p role="alert" className="text-sm font-semibold text-red-800">
                      {error || 'Could not connect to live chat.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => initiateChatSession(userProfile)}
                      className="mt-4 rounded-xl bg-[#2D1B3E] px-5 py-3 font-bold text-white"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}