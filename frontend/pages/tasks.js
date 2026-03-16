import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';

const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [timeSpent, setTimeSpent] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem('at-tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const save = (data) => {
    setTasks(data);
    localStorage.setItem('at-tasks', JSON.stringify(data));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const t = {
      id: Date.now(), title: newTask, status: 'Pending', priority,
      timeSpent: timeSpent || '0',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };
    save([t, ...tasks]);
    setNewTask(''); setTimeSpent('');
  };

  const toggleStatus = (id) => save(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  const deleteTask = (id) => save(tasks.filter(t => t.id !== id));

  if (status === 'loading' || status === 'unauthenticated') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0805' }}>
      <div className="font-black text-xl animate-pulse" style={{ color: '#f59e0b' }}>Loading...</div>
    </div>
  );

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const filtered = tasks.filter(t => filter === 'All' ? true : t.status === filter);

  return (
    <div className="min-h-screen" style={{ background: '#0a0805', fontFamily: 'Montserrat, sans-serif' }}>
      <Head><title>Activity Tracker — Tasks</title></Head>

      <NavBar session={session} active="/tasks" />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Task Manager</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: '#78716c' }}>{completed}/{tasks.length} tasks completed</p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl p-5 border" style={{ background: '#13100a', borderColor: '#2a2015' }}>
          <div className="flex justify-between text-sm font-black text-white mb-3">
            <span>Progress</span>
            <span style={{ color: '#f59e0b' }}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#2a2015' }}>
            <div className="h-full rounded-full transition-all duration-700"
                 style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #f97316)' }} />
          </div>
        </div>

        {/* Add Task */}
        <div className="rounded-2xl border p-5 mb-6" style={{ background: '#13100a', borderColor: '#2a2015' }}>
          <div className="flex items-center space-x-3 mb-3">
            <input className="flex-1 rounded-xl px-4 py-3 text-white font-bold text-sm outline-none"
              style={{ background: '#0a0805', border: '1px solid #2a2015' }}
              placeholder="What will you accomplish today?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              onFocus={e => e.target.style.borderColor = '#f59e0b'}
              onBlur={e => e.target.style.borderColor = '#2a2015'} />
            <input type="number"
              className="w-20 rounded-xl px-3 py-3 text-white font-bold text-sm outline-none"
              style={{ background: '#0a0805', border: '1px solid #2a2015' }}
              placeholder="Min"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)} />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              {['High', 'Medium', 'Low'].map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                  style={priority === p
                    ? { background: PRIORITY_COLORS[p], color: '#fff' }
                    : { background: '#1a1510', color: '#78716c', border: '1px solid #2a2015' }}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={addTask}
              className="ml-auto px-6 py-2.5 rounded-xl text-sm font-black transition-all"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#000' }}>
              Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-4">
          {['All', 'Pending', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-sm font-black transition-all"
              style={filter === f
                ? { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid #f59e0b44' }
                : { background: '#13100a', color: '#78716c', border: '1px solid #2a2015' }}>
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 font-bold text-sm uppercase tracking-widest rounded-2xl border"
                 style={{ color: '#78716c', borderColor: '#2a2015', borderStyle: 'dashed' }}>
              {filter === 'Completed' ? 'No completed tasks yet. Get to work! 💪' : 'Queue is empty. Add your first task above.'}
            </div>
          )}
          {filtered.map(task => (
            <div key={task.id}
              className="flex items-center space-x-4 p-4 rounded-2xl border transition-all"
              style={{
                background: task.status === 'Completed' ? '#0d1f17' : '#13100a',
                borderColor: task.status === 'Completed' ? '#10b98133' : '#2a2015'
              }}>
              <button onClick={() => toggleStatus(task.id)}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-black text-xs transition-all"
                style={task.status === 'Completed'
                  ? { background: '#10b981', borderColor: '#10b981', color: '#fff' }
                  : { borderColor: '#2a2015' }}>
                {task.status === 'Completed' ? '✓' : ''}
              </button>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                   style={{ background: PRIORITY_COLORS[task.priority] || '#78716c' }} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm"
                   style={{ color: task.status === 'Completed' ? '#78716c' : '#fef9f0',
                            textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                  {task.title}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: '#78716c' }}>
                  {task.date}{task.timeSpent && task.timeSpent !== '0' ? ` · ${task.timeSpent}m` : ''}
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-lg"
                    style={task.status === 'Completed'
                      ? { background: '#10b98122', color: '#10b981' }
                      : { background: '#f59e0b18', color: '#fbbf24' }}>
                {task.status}
              </span>
              <button onClick={() => deleteTask(task.id)}
                className="text-xs flex-shrink-0 hover:text-red-400 transition-all"
                style={{ color: '#2a2015' }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
