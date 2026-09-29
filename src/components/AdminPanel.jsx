import React, { useEffect, useState } from 'react';
import { api } from './api.js';
import ChatPanel from './ChatPanel.jsx';

const blank = {
  name: '',
  breedType: 'Yorkie',
  age: '',
  weight: '',
  gender: 'Male',
  color: '',
  adoptionFee: '350',
  status: 'Available',
  personality: '',
  healthNotes: '',
  parents: '',
  images: ''
};

const inputClass = 'w-full rounded-xl border border-[#E4D8EA] bg-white px-3 py-3 text-sm outline-none focus:border-[#8A659F]';

export default function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [puppies, setPuppies] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    if (!token) return;
    try {
      const [listedPuppies, inbox] = await Promise.all([
        api('/puppies'),
        api('/admin/conversations', { token }),
      ]);

      setPuppies(Array.isArray(listedPuppies) ? listedPuppies : []);

      const validConversations = Array.isArray(inbox) ? inbox : [];
      setConversations(validConversations);

      if (selectedChat) {
        const updated = validConversations.find((item) => item.id === selectedChat.id);
        if (updated) setSelectedChat(updated);
      }
      setError('');
    } catch (err) {
      if (/sign in|administrator|unauthorized|jwt/i.test(err.message)) logout();
      else setError(err.message);
    }
  };

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 5000);
    return () => window.clearInterval(timer);
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setSelectedChat(null);
  };

  const login = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = await api('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      sessionStorage.setItem('adminToken', result.token);
      setToken(result.token);
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm(blank);
    setEditingId('');
  };

  const editPuppy = (puppy) => {
    setEditingId(puppy.id);
    setForm({
      ...blank,
      ...puppy,
      adoptionFee: String(puppy.adoptionFee || '').replace(/[^\d.]/g, ''),
      personality: Array.isArray(puppy.personality) ? puppy.personality.join(', ') : puppy.personality || '',
      images: Array.isArray(puppy.images) ? puppy.images.join('\n') : puppy.images || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savePuppy = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const parsedFee = Number(String(form.adoptionFee).replace(/[^\d.]/g, ''));
    const imagesArray = form.images.split(/\n|,/).map((val) => val.trim()).filter(Boolean);
    const personalityArray = form.personality.split(',').map((val) => val.trim()).filter(Boolean);

    const payload = {
      ...form,
      adoptionFee: parsedFee,
      images: imagesArray,
      personality: personalityArray
    };

    try {
      await api(editingId ? `/puppies/${editingId}` : '/puppies', {
        token,
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });

      setNotice(editingId ? 'Puppy listing updated.' : 'Puppy listing added.');
      resetForm();
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const removePuppy = async (puppy) => {
    if (!window.confirm(`Remove ${puppy.name} from the public listings?`)) return;
    try {
      await api(`/puppies/${puppy.id}`, { token, method: 'DELETE' });
      setNotice(`${puppy.name} was removed.`);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-br from-[#FBF7FD] via-white to-[#F8F1E6] px-4 py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-[#EADFF0] bg-white p-8 shadow-xl">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#8A659F]">Private area</p>
          <h1 className="mt-3 text-3xl font-black text-[#3B2350]">Shelter admin sign in</h1>
          <p className="mt-3 text-sm leading-6 text-[#5C4763]">Use the administrator credentials configured in the backend environment.</p>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <form onSubmit={login} className="mt-6 space-y-3">
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className={inputClass} />
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} />
            <button className="w-full rounded-xl bg-[#3B2350] px-5 py-3 font-extrabold text-white">Sign in</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#FCF9FE] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#8A659F]">Shelter workspace</p>
            <h1 className="mt-2 text-4xl font-black text-[#3B2350]">Admin dashboard</h1>
          </div>
          <button onClick={logout} className="rounded-xl border border-[#DCC9E8] bg-white px-4 py-3 text-sm font-bold text-[#3B2350]">
            Sign out
          </button>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}

        <div className="mt-8 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
          {/* Puppy Management */}
          <section className="rounded-2xl border border-[#EADFF0] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#3B2350]">{editingId ? 'Edit puppy listing' : 'Add a puppy'}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5C4763]">
              All fields are required. Adoption fees must be between $300 and $600.
            </p>
            <form onSubmit={savePuppy} className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-bold text-[#5C4763]">
                Puppy name<span className="ml-1 text-red-600">*</span>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Breed<span className="ml-1 text-red-600">*</span>
                <select required value={form.breedType} onChange={(e) => setForm({ ...form, breedType: e.target.value })} className={`${inputClass} mt-1`}>
                  <option value="Yorkie">Yorkie</option>
                  <option value="Shih Tzu">Shih Tzu</option>
                </select>
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Age<span className="ml-1 text-red-600">*</span>
                <input required type="text" placeholder="e.g. 10 weeks" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Weight<span className="ml-1 text-red-600">*</span>
                <input required type="text" placeholder="e.g. 2.4 lbs" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Sex<span className="ml-1 text-red-600">*</span>
                <select required value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={`${inputClass} mt-1`}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Color<span className="ml-1 text-red-600">*</span>
                <input required type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Adoption fee ($300-$600)<span className="ml-1 text-red-600">*</span>
                <input required type="number" min="300" max="600" value={form.adoptionFee} onChange={(e) => setForm({ ...form, adoptionFee: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763]">
                Status<span className="ml-1 text-red-600">*</span>
                <select required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`${inputClass} mt-1`}>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </label>

              <label className="text-xs font-bold text-[#5C4763] sm:col-span-2">
                Personality (comma-separated)<span className="ml-1 text-red-600">*</span>
                <input required type="text" placeholder="Playful, Affectionate, Smart" value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763] sm:col-span-2">
                Health notes<span className="ml-1 text-red-600">*</span>
                <textarea required rows={2} value={form.healthNotes} onChange={(e) => setForm({ ...form, healthNotes: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763] sm:col-span-2">
                Known background / Parents<span className="ml-1 text-red-600">*</span>
                <textarea required rows={2} value={form.parents} onChange={(e) => setForm({ ...form, parents: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <label className="text-xs font-bold text-[#5C4763] sm:col-span-2">
                Photo URLs (one per line)<span className="ml-1 text-red-600">*</span>
                <textarea required rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className={`${inputClass} mt-1`} />
              </label>

              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button className="rounded-xl bg-[#3B2350] px-5 py-3 font-extrabold text-white">
                  {editingId ? 'Save changes' : 'Add puppy'}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="rounded-xl border border-[#DCC9E8] px-5 py-3 font-bold text-[#3B2350]">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Listings Overview */}
          <section className="rounded-2xl border border-[#EADFF0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#3B2350]">Puppy listings</h2>
              <span className="rounded-full bg-[#F1E8F7] px-3 py-1 text-sm font-bold text-[#6B4A86]">{puppies.length}</span>
            </div>
            <div className="mt-5 max-h-[42rem] space-y-3 overflow-y-auto">
              {puppies.map((puppy) => (
                <article key={puppy.id} className="flex items-center gap-3 rounded-xl border border-[#EEE5F2] p-3">
                  <img src={Array.isArray(puppy.images) ? puppy.images[0] : puppy.images} alt="" className="h-16 w-16 rounded-lg object-cover bg-purple-50" />
                  <div className="min-w-0 flex-1">
                    <b className="block text-[#3B2350]">{puppy.name}</b>
                    <span className="text-xs text-[#6B4A86]">{puppy.breedType} · {puppy.adoptionFee} · {puppy.status}</span>
                  </div>
                  <button onClick={() => editPuppy(puppy)} className="rounded-lg border px-3 py-2 text-xs font-bold">Edit</button>
                  <button onClick={() => removePuppy(puppy)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700">Remove</button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Adoption Inbox Section */}
        <section className="mt-8 rounded-2xl border border-[#EADFF0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#3B2350]">Adoption Inbox</h2>
              <p className="mt-1 text-sm text-[#5C4763]">Active adoption inquiries appear here in real time.</p>
            </div>
            <span className="rounded-full bg-[#F1E8F7] px-3 py-1 text-sm font-bold text-[#6B4A86]">{conversations.length}</span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
            {/* Conversation List */}
            <div className="max-h-[34rem] space-y-2.5 overflow-y-auto pr-1">
              {conversations.length === 0 && (
                <p className="rounded-xl bg-[#FCF9FE] p-4 text-sm text-[#6B4A86]">No active inquiries yet.</p>
              )}
              {conversations.map((chat) => {
                const displayName = chat.visitorName || chat.name || 'Adoption Visitor';
                const displayEmail = chat.visitorEmail || chat.email || 'No email provided';

                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      selectedChat?.id === chat.id ? 'border-[#8A659F] bg-[#F7F0FA] shadow-sm' : 'border-[#EEE5F2] hover:bg-[#FCF9FE]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <b className="truncate text-sm font-black text-[#3B2350]">{displayName}</b>
                      {chat.unread > 0 && (
                        <span className="shrink-0 rounded-full bg-[#EBCB8B] px-2 py-0.5 text-[10px] font-black text-[#2D1B3E]">
                          {chat.unread} new
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1.5 space-y-0.5 text-xs text-[#6B4A86]">
                      {chat.puppyName && (
                        <p className="font-bold text-[#3B2350]">🐾 Inquiring about {chat.puppyName}</p>
                      )}
                      <p className="truncate">✉ {displayEmail}</p>
                    </div>

                    <time className="mt-2 block text-[10px] font-semibold text-[#8A75A0]">
                      {chat.createdAt ? new Date(chat.createdAt).toLocaleString() : ''}
                    </time>
                  </button>
                );
              })}
            </div>

            {/* Selected Chat Box Container */}
            <div className="h-[34rem] flex flex-col overflow-hidden rounded-2xl border border-[#E8DAF0] bg-[#FCF9FE]">
              {selectedChat ? (
                <>
                  <div className="bg-[#3B2350] p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base">
                        {selectedChat.visitorName || selectedChat.name || 'Adoption Visitor'}
                      </h3>
                      {selectedChat.puppyName && (
                        <span className="rounded-full bg-[#EBCB8B]/20 px-3 py-1 text-xs font-extrabold text-[#EBCB8B]">
                          Pup: {selectedChat.puppyName}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-purple-200/90 border-t border-white/10 pt-2">
                      <p>✉ {selectedChat.visitorEmail || selectedChat.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ChatPanel
                      conversationId={selectedChat.id}
                      token={token}
                      admin
                    />
                  </div>
                </>
              ) : (
                <div className="grid h-full place-items-center p-6 text-center text-sm font-semibold text-[#6B4A86]">
                  Select an inquiry from the inbox to read the conversation and respond.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}