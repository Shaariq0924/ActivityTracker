import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';

const DAYS = 31;
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();

const DEFAULT_HABITS = [
  { id: 1, name: 'DSA Practice',      emoji: '💻', color: '#f59e0b', goal: 31 },
  { id: 2, name: 'Exercise',           emoji: '🏋️', color: '#10b981', goal: 30 },
  { id: 3, name: 'Reading',            emoji: '📖', color: '#f97316', goal: 25 },
  { id: 4, name: 'Meditation',         emoji: '🧘', color: '#06b6d4', goal: 28 },
  { id: 5, name: 'Coding Project',     emoji: '🚀', color: '#fbbf24', goal: 20 },
  { id: 6, name: 'English Practice',   emoji: '🗣️', color: '#a78bfa', goal: 31 },
];

export default function HabitsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [checked, setChecked] = useState(() => {
    const init = {};
    DEFAULT_HABITS.forEach(h => { init[h.id] = {}; });
    return init;
  });
  const [month, setMonth] = useState(currentMonth);
  const [newHabit, setNewHabit] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem('at-habits');
    const savedChecked = localStorage.getItem('at-checked');
    if (saved) setHabits(JSON.parse(saved));
    if (savedChecked) setChecked(JSON.parse(savedChecked));
  }, []);

  const toggleDay = (id, day) => {
    const updated = { ...checked, [id]: { ...checked[id], [day]: !checked[id]?.[day] } };
    setChecked(updated);
    localStorage.setItem('at-checked', JSON.stringify(updated));
  };

  const getCompleted = (id) => Object.values(checked[id] || {}).filter(Boolean).length;
  const getPct = (id, goal) => Math.min(Math.round((getCompleted(id) / goal) * 100), 100);

  const overallPct = () => {
    const total = habits.reduce((sum, h) => sum + h.goal, 0);
    const done = habits.reduce((sum, h) => sum + Math.min(getCompleted(h.id), h.goal), 0);
    return total ? Math.round((done / total) * 100) : 0;
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const h = { id: Date.now(), name: newHabit, emoji: '⭐', color: '#f59e0b', goal: 30 };
    const updated = [...habits, h];
    const updatedChecked = { ...checked, [h.id]: {} };
    setHabits(updated);
    setChecked(updatedChecked);
    localStorage.setItem('at-habits', JSON.stringify(updated));
    localStorage.setItem('at-checked', JSON.stringify(updatedChecked));
    setNewHabit('');
    setShowAdd(false);
  };

  const deleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    const updatedChecked = { ...checked };
    delete updatedChecked[id];
    setHabits(updated);
    setChecked(updatedChecked);
    localStorage.setItem('at-habits', JSON.stringify(updated));
    localStorage.setItem('at-checked', JSON.stringify(updatedChecked));
  };

  if (status === 'loading' || status === 'unauthenticated') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0805' }}>
      <div className="font-black text-xl animate-pulse" style={{ color: '#f59e0b' }}>Loading...</div>
    </div>
  );

  const pct = overallPct();

  return (
    <div className="min-h-screen" style={{ background: '#0a0805', fontFamily: 'Montserrat, sans-serif' }}>
      <Head><title>Activity Tracker — Habits</title></Head>

      <NavBar session={session} active="/habits" />

      <div className="p-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Habit Tracker</h1>
            <p className="text-sm mt-1 font-medium" style={{ color: '#78716c' }}>31-day habit grid — {MONTHS[month]} 2026</p>
          </div>
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {MONTHS.map((m, i) => (
              <button key={m} onClick={() => setMonth(i)}
                className="px-2.5 py-1 text-xs font-black rounded-lg transition-all"
                style={month === i
                  ? { background: '#f59e0b', color: '#000' }
                  : { background: '#13100a', color: '#78716c', border: '1px solid #2a2015' }}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-6 rounded-2xl p-5 border" style={{ background: '#13100a', borderColor: '#2a2015' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-white uppercase tracking-wider">Monthly Completion</span>
            <span className="text-2xl font-black" style={{ color: '#f59e0b' }}>{pct}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#2a2015' }}>
            <div className="h-full rounded-full transition-all duration-1000"
                 style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #f97316)' }} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold" style={{ color: '#78716c' }}>
            <span>Start</span><span>Keep Going →</span><span>100%</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto rounded-2xl border" style={{ background: '#13100a', borderColor: '#2a2015' }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: '#0a0805', borderBottom: '1px solid #2a2015' }}>
                <th className="px-4 py-4 text-left"
                    style={{ color: '#78716c', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', minWidth: 180 }}>
                  Habit
                </th>
                {Array.from({ length: DAYS }, (_, i) => i + 1).map(day => (
                  <th key={day} className="px-0.5 py-4 text-center"
                      style={{ fontSize: '11px', fontWeight: 900, minWidth: 30,
                               color: day === currentDay && month === currentMonth ? '#f59e0b' : '#78716c' }}>
                    {day}
                  </th>
                ))}
                <th className="px-4 py-4 text-center" style={{ color: '#78716c', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', minWidth: 64 }}>Done</th>
                <th className="px-4 py-4 text-center" style={{ color: '#78716c', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', minWidth: 64 }}>Goal</th>
                <th className="px-4 py-4 text-center" style={{ color: '#78716c', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', minWidth: 100 }}>Progress</th>
                <th style={{ minWidth: 36 }} />
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, idx) => {
                const done = getCompleted(habit.id);
                const p = getPct(habit.id, habit.goal);
                return (
                  <tr key={habit.id}
                      style={{ borderBottom: '1px solid #1e180f', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{habit.emoji}</span>
                        <span className="font-bold text-white text-sm">{habit.name}</span>
                      </div>
                    </td>
                    {Array.from({ length: DAYS }, (_, i) => i + 1).map(day => {
                      const isChecked = checked[habit.id]?.[day];
                      const isToday = day === currentDay && month === currentMonth;
                      return (
                        <td key={day} className="px-0.5 py-3 text-center">
                          <button onClick={() => toggleDay(habit.id, day)}
                            className="w-5 h-5 rounded flex items-center justify-center text-xs font-black transition-all mx-auto"
                            style={isChecked
                              ? { background: habit.color, color: '#000' }
                              : isToday
                              ? { border: `1px solid ${habit.color}88`, background: `${habit.color}18`, color: habit.color }
                              : { border: '1px solid #2a2015', background: '#1a1510', color: '#78716c' }}>
                            {isChecked ? '✓' : ''}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center">
                      <span className="font-black text-white">{done}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold" style={{ color: '#78716c' }}>{habit.goal}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#2a2015' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                               style={{ width: `${p}%`, background: habit.color }} />
                        </div>
                        <span className="text-xs font-black min-w-[36px] text-right"
                              style={{ color: p >= 100 ? '#10b981' : p >= 50 ? '#f59e0b' : '#78716c' }}>
                          {p}%
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button onClick={() => deleteHabit(habit.id)}
                        className="text-xs transition-all hover:text-red-400"
                        style={{ color: '#2a2015' }}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add Habit */}
        <div className="mt-4">
          {showAdd ? (
            <div className="flex items-center space-x-3 rounded-2xl border p-4"
                 style={{ background: '#13100a', borderColor: '#2a2015' }}>
              <input className="flex-1 rounded-xl px-4 py-2.5 text-white text-sm font-bold outline-none"
                style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                placeholder="New habit (e.g. Cold shower, Journaling...)"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                autoFocus />
              <button onClick={addHabit}
                className="px-5 py-2.5 rounded-xl text-sm font-black"
                style={{ background: '#f59e0b', color: '#000' }}>Add</button>
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold border"
                style={{ color: '#78716c', borderColor: '#2a2015' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)}
              className="px-5 py-3 rounded-xl text-sm font-bold transition-all border"
              style={{ borderColor: '#2a2015', borderStyle: 'dashed', color: '#78716c' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.color = '#fbbf24'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#2a2015'; e.currentTarget.style.color = '#78716c'; }}>
              + Add Habit
            </button>
          )}
        </div>

        {/* Analysis Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {habits.map(h => {
            const done = getCompleted(h.id);
            const p = getPct(h.id, h.goal);
            return (
              <div key={h.id} className="rounded-2xl p-4 border transition-all"
                   style={{ background: '#13100a', borderColor: '#2a2015' }}
                   onMouseOver={e => e.currentTarget.style.borderColor = h.color + '55'}
                   onMouseOut={e => e.currentTarget.style.borderColor = '#2a2015'}>
                <div className="flex items-center space-x-1.5 mb-3">
                  <span>{h.emoji}</span>
                  <span className="text-xs font-black text-white truncate">{h.name}</span>
                </div>
                <div className="text-2xl font-black mb-0.5" style={{ color: h.color }}>{p}%</div>
                <div className="text-xs font-bold" style={{ color: '#78716c' }}>{done} / {h.goal}</div>
                <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: '#2a2015' }}>
                  <div className="h-full rounded-full" style={{ width: `${p}%`, background: h.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
