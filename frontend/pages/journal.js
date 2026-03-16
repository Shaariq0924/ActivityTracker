import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';

const MOODS = [
  { emoji: '😄', label: 'Great', color: '#10b981' },
  { emoji: '🙂', label: 'Good', color: '#f59e0b' },
  { emoji: '😐', label: 'Okay', color: '#78716c' },
  { emoji: '😔', label: 'Low', color: '#f97316' },
  { emoji: '😤', label: 'Stressed', color: '#ef4444' },
];

export default function JournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [wins, setWins] = useState('');
  const [mood, setMood] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem('at-journal');
    if (saved) setEntries(JSON.parse(saved));
    setTimeout(() => setVisible(true), 80);
  }, []);

  const save = (data) => {
    setEntries(data);
    localStorage.setItem('at-journal', JSON.stringify(data));
  };

  const addEntry = () => {
    if (!text.trim()) return;
    const entry = {
      id: Date.now(),
      text,
      wins,
      mood,
      date: new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    save([entry, ...entries]);
    setText(''); setWins(''); setMood(null); setShowForm(false);
  };

  const deleteEntry = (id) => save(entries.filter(e => e.id !== id));

  if (status === 'loading' || status === 'unauthenticated') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0805' }}>
      <div className="font-black text-xl animate-pulse" style={{ color: '#f59e0b' }}>Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#0a0805', fontFamily: 'Montserrat, sans-serif' }}>
      <Head><title>Activity Tracker — Journal</title></Head>
      <NavBar session={session} active="/journal" />

      <div className="p-6 max-w-3xl mx-auto">
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Daily Journal</h1>
              <p className="text-sm font-medium mt-1" style={{ color: '#78716c' }}>
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} — reflect, grow, remember
              </p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: '#fff' }}>
              + New Entry
            </button>
          </div>

          {/* Write Entry Form */}
          {showForm && (
            <div className="rounded-2xl border p-6 mb-6 relative overflow-hidden"
                 style={{ background: '#13100a', borderColor: '#a78bfa44',
                          animation: 'slideDown 0.3s cubic-bezier(.22,1,.36,1)' }}>
              <div className="absolute top-0 left-0 w-full h-1"
                   style={{ background: 'linear-gradient(90deg, #a78bfa, #7c3aed)' }} />
              <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Today's Reflection</h2>

              {/* Mood picker */}
              <div className="mb-4">
                <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: '#78716c' }}>How are you feeling?</label>
                <div className="flex space-x-3">
                  {MOODS.map(m => (
                    <button key={m.label} onClick={() => setMood(m)}
                      className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: mood?.label === m.label ? m.color + '22' : '#1a1510',
                               border: `2px solid ${mood?.label === m.label ? m.color : '#2a2015'}` }}>
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-xs font-bold" style={{ color: mood?.label === m.label ? m.color : '#78716c' }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wins */}
              <div className="mb-4">
                <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: '#78716c' }}>Today's wins 🏆</label>
                <input className="w-full rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none"
                  style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                  placeholder="What did you accomplish today?"
                  value={wins}
                  onChange={e => setWins(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#a78bfa'}
                  onBlur={e => e.target.style.borderColor = '#2a2015'} />
              </div>

              {/* Reflection */}
              <div className="mb-5">
                <label className="text-xs font-black uppercase tracking-widest mb-2 block" style={{ color: '#78716c' }}>Reflection ✍️</label>
                <textarea className="w-full rounded-xl px-4 py-3 text-white text-sm font-medium outline-none resize-none"
                  style={{ background: '#0a0805', border: '1px solid #2a2015', minHeight: 100 }}
                  placeholder="How was your day? What did you learn? What would you do differently?"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#a78bfa'}
                  onBlur={e => e.target.style.borderColor = '#2a2015'} />
              </div>

              <div className="flex space-x-3">
                <button onClick={addEntry}
                  className="px-6 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
                  Save Entry
                </button>
                <button onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-all"
                  style={{ color: '#78716c', borderColor: '#2a2015' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entries List */}
          {entries.length === 0 && !showForm && (
            <div className="text-center py-24 rounded-2xl border font-bold text-sm uppercase tracking-widest"
                 style={{ color: '#78716c', borderColor: '#2a2015', borderStyle: 'dashed' }}>
              No journal entries yet.<br />
              <span style={{ color: '#2a2015' }}>Click "New Entry" to start reflecting.</span>
            </div>
          )}

          <div className="space-y-4">
            {entries.map((entry, i) => {
              const isExpanded = expandedId === entry.id;
              return (
                <div key={entry.id}
                  className="rounded-2xl border transition-all cursor-pointer"
                  style={{
                    background: '#13100a', borderColor: '#2a2015',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s, border-color 0.2s ease`
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = '#3a3025'}
                  onMouseOut={e => e.currentTarget.style.borderColor = '#2a2015'}
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}>

                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center space-x-3">
                      {entry.mood && <span className="text-xl">{entry.mood.emoji}</span>}
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#78716c' }}>{entry.date}</p>
                        {entry.wins && (
                          <p className="text-sm font-bold text-white mt-0.5 truncate max-w-xs">🏆 {entry.wins}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold" style={{ color: entry.mood?.color || '#78716c' }}>
                        {entry.mood?.label}
                      </span>
                      <span className="text-xs" style={{ color: '#2a2015' }}>{isExpanded ? '▲' : '▼'}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                        className="text-xs hover:text-red-400 transition-all"
                        style={{ color: '#2a2015' }}>✕</button>
                    </div>
                  </div>

                  {isExpanded && entry.text && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: '#2a2015' }}>
                      <p className="text-sm font-medium leading-relaxed pt-4" style={{ color: '#94a3b8' }}>
                        {entry.text}
                      </p>
                      <p className="text-xs font-bold mt-3" style={{ color: '#2a2015' }}>{entry.time}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
