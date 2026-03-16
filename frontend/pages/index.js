import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/pages/_app';

const BENTO_CARDS = [
  {
    href: '/daily',
    icon: 'fa-calendar-check',
    title: 'Daily Sync',
    desc: 'Habits, tasks, and journal in a single flow.',
    color: '#f59e0b',
    tag: 'Flow',
    gridArea: 'md:col-span-2 md:row-span-2',
  },
  {
    href: '/analytics',
    icon: 'fa-chart-pie',
    title: 'Insights',
    desc: 'Visual data breakdown.',
    color: '#3b82f6',
    tag: 'Data',
    gridArea: 'md:col-span-1 md:row-span-1',
  },
  {
    href: '/focus',
    icon: 'fa-stopwatch',
    title: 'Focus',
    desc: 'Deep work timer.',
    color: '#f97316',
    tag: 'Deep',
    gridArea: 'md:col-span-1 md:row-span-1',
  },
  {
    href: '/goals',
    icon: 'fa-bullseye',
    title: 'Targets',
    desc: 'Long-term goals.',
    color: '#10b981',
    tag: 'Aim',
    gridArea: 'md:col-span-2 md:row-span-1',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, mounted } = useTheme();
  const isDark = theme === 'dark';
  
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    try {
      const t = localStorage.getItem('at-tasks'); if (t) setTasks(JSON.parse(t));
      const h = localStorage.getItem('at-habits'); if (h) setHabits(JSON.parse(h));
      const g = localStorage.getItem('at-goals'); if (g) setGoals(JSON.parse(g));
      const j = localStorage.getItem('at-journal'); if (j) setEntries(JSON.parse(j));
    } catch {}
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const taskProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const completedHabits = habits.filter(h => h.completedToday).length;
  const habitProgress = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;

  const systemEfficiency = Math.round((taskProgress + habitProgress) / 2);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // No longer blocking with full-screen "Initializing..."
  // This allows the NavBar and Background to render instantly.
  const isAuthLoading = status === 'loading';

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-[#f59e0b20]">
      <Head><title>Activity Tracker — Modern Dashboard</title></Head>
      <NavBar session={session} active="/" />

      {/* ─── BACKGROUND GLOWS ─── */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} 
        />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* ─── HERO SECTION ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f59e0b30] bg-[#f59e0b0d] text-[#f59e0b] text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                </span>
                Live System Overview
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-[0.9]">
                {isAuthLoading ? (
                  <span className="opacity-20">Standby...</span>
                ) : (
                  <>
                    {greeting},<br />
                    <span className="gradient-text">{session?.user?.name || 'Partner'}</span>
                  </>
                )}
              </h1>
              <p className="text-lg font-medium text-[var(--muted)] max-w-lg mt-2">
                {isAuthLoading ? 'Syncing system metrics...' : 'Your performance dashboard is ready. Track habits, manage tasks, and optimize focus.'}
              </p>
            </div>
            
            <div className="flex gap-3">
               <Link href="/daily" className="group relative px-6 py-3 rounded-xl font-black text-sm bg-[#f59e0b] text-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Session <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform" />
                  </span>
               </Link>
            </div>
          </div>
        </motion.section>

        {/* ─── BENTO GRID ─── */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          {BENTO_CARDS.map((card, i) => (
            <motion.div 
              key={card.href}
              variants={itemVariants}
              className={`group relative rounded-3xl overflow-hidden glass card-lift ${card.gridArea}`}
            >
              <Link href={card.href} className="block p-8 h-full">
                <div className="absolute top-0 right-0 p-8">
                   <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: card.color }}>
                      <i className={`fas ${card.icon}`} />
                   </div>
                </div>
                
                <div className="h-full flex flex-col justify-end">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-2 inline-block w-fit" style={{ background: `${card.color}15`, color: card.color }}>
                    {card.tag}
                  </span>
                  <h3 className="text-2xl font-black mb-2 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text)' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--muted)] leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#f59e0b30] rounded-3xl transition-all pointer-events-none" />
              </Link>
            </motion.div>
          ))}
          
          {/* ─── QUICK STATS CARD (Manual Bento Item) ─── */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 rounded-3xl glass p-8 flex flex-col justify-between overflow-hidden relative group"
          >
             <div className="relative z-10 w-full">
                <div className="flex justify-between items-end mb-6">
                   <div>
                      <h3 className="text-lg font-black uppercase tracking-tighter" style={{ color: 'var(--text)' }}>System Efficiency</h3>
                      <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-widest mt-1">Live Performance Pulse</p>
                   </div>
                   <div className="text-4xl font-black text-[#f59e0b]">{systemEfficiency}%</div>
                </div>
                
                <div className="h-4 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)] relative">
                   <motion.div 
                     initial={{ width: 0 }} 
                     animate={{ width: `${systemEfficiency}%` }} 
                     className="h-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] relative"
                   >
                     <motion.div 
                       animate={{ x: ['-100%', '100%'] }} 
                       transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full"
                     />
                   </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="glass p-4 rounded-2xl border border-[var(--border)]">
                      <div className="text-xl font-black text-[#10b981] mb-1">{completedTasks}/{tasks.length}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">Tasks Engage</div>
                   </div>
                   <div className="glass p-4 rounded-2xl border border-[var(--border)]">
                      <div className="text-xl font-black text-[#f59e0b] mb-1">{completedHabits}/{habits.length}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">Habits Active</div>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-150 rotate-12">
                <i className="fas fa-bolt text-9xl" />
             </div>
          </motion.div>
        </motion.section>

        {/* ─── CHART SECTION ─── */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl glass p-8 border border-[var(--border)] overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: 'var(--text)' }}>Weekly Performance Flow</h2>
              <p className="text-xs font-bold text-[var(--muted)]">Calculated based on habit completion percentages</p>
            </div>
            <Link href="/analytics" className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-all">
              Detailed Analytics <i className="fas fa-chevron-right ml-1 text-[8px]" />
            </Link>
          </div>

          <div className="h-48 flex items-end gap-3 mt-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const heights = [40, 65, 55, 90, 75, 60, 85]; // Mock data
              const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${heights[i]}%` }}
                    transition={{ delay: 0.8 + (i * 0.1), duration: 1, ease: 'circOut' }}
                    className="w-full rounded-2xl relative overflow-hidden"
                    style={{ background: isToday ? '#f59e0b' : 'var(--surface)' }}
                  >
                     <AnimatePresence>
                        {isToday && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                          />
                        )}
                     </AnimatePresence>
                  </motion.div>
                  <span className="text-[10px] font-black" style={{ color: isToday ? '#f59e0b' : 'var(--muted)' }}>{day}</span>
                </div>
              );
            })}
          </div>
        </motion.section>
      </main>

      <footer className="py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--muted)]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Activity Tracker System</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-[var(--text)] transition-colors text-xs font-black uppercase tracking-[0.1em]">Dashboard</Link>
            <Link href="/daily" className="hover:text-[var(--text)] transition-colors text-xs font-black uppercase tracking-[0.1em]">Daily</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
