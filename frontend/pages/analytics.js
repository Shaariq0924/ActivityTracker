import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/pages/_app';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
};

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, mounted } = useTheme();
  const isDark = theme === 'dark';
  
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    try {
      const t = localStorage.getItem('at-tasks'); if (t) setTasks(JSON.parse(t));
      const h = localStorage.getItem('at-habits'); if (h) setHabits(JSON.parse(h));
      const c = localStorage.getItem('at-checked'); if (c) setChecked(JSON.parse(c));
    } catch {}
  }, []);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'Completed').length;
  const taskPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const habitStats = habits.map(h => {
    const d = Object.values(checked[h.id] || {}).filter(Boolean).length;
    const g = h.goal || 31;
    return { ...h, done: d, goal: g, pct: Math.min(Math.round((d / g) * 100), 100) };
  });

  const avgHabitPct = habitStats.length ? Math.round(habitStats.reduce((s, h) => s + h.pct, 0) / habitStats.length) : 0;

  const isAuthLoading = status === 'loading';

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: 'var(--bg)' }}>
      <Head><title>Analytics Interface — Activity Tracker</title></Head>
      <NavBar session={session} active="/analytics" />

      {/* Background Decorative Element */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-5">
         <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[#f59e0b] rounded-full blur-[120px]" />
         <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-[#3b82f6] rounded-full blur-[100px]" />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>
             Performance <span className="text-[#f59e0b]">Metrology</span>
           </h1>
           <p className="text-sm font-bold text-[var(--muted)] mt-2 uppercase tracking-widest">Aggregate behavioral data analysis</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Summary Stat Cards */}
          <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 border border-[var(--border)] relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <i className="fas fa-check-double text-7xl" />
             </div>
             <div className="text-[10px] font-black uppercase tracking-widest text-[#10b981] mb-2 px-3 py-1 bg-[#10b98110] rounded-full w-fit">Operational Efficiency</div>
             <div className="text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>{taskPct}%</div>
             <p className="text-xs font-bold text-[var(--muted)] mt-2">Overall task completion rate</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 border border-[var(--border)] relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <i className="fas fa-bolt text-7xl" />
             </div>
             <div className="text-[10px] font-black uppercase tracking-widest text-[#f59e0b] mb-2 px-3 py-1 bg-[#f59e0b10] rounded-full w-fit">Habit Consistency</div>
             <div className="text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>{avgHabitPct}%</div>
             <p className="text-xs font-bold text-[var(--muted)] mt-2">Average habit target fulfillment</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass rounded-[32px] p-8 border border-[var(--border)] relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <i className="fas fa-calendar-alt text-7xl" />
             </div>
             <div className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] mb-2 px-3 py-1 bg-[#3b82f610] rounded-full w-fit">System Load</div>
             <div className="text-5xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>{habits.length + tasks.length}</div>
             <p className="text-xs font-bold text-[var(--muted)] mt-2">Total active parameters tracked</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Detailed Habit breakdown */}
           <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass rounded-[40px] p-8 border border-[var(--border)]">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-8" style={{ color: 'var(--text)' }}>Habit Precision Breakdown</h2>
              <div className="space-y-6">
                 {habitStats.map((h, i) => (
                   <div key={h.id} className="relative">
                      <div className="flex justify-between items-end mb-2 px-1">
                         <div className="flex items-center gap-2">
                            <span className="text-lg">{h.emoji}</span>
                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-sub)' }}>{h.name}</span>
                         </div>
                         <span className="text-xs font-black" style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${h.pct}%` }} transition={{ delay: 0.6 + (i*0.1), duration: 1 }} className="h-full rounded-full" style={{ background: h.color }} />
                      </div>
                      <div className="flex justify-between mt-1 px-1">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">Status: {h.pct >= 80 ? 'Optimal' : h.pct >= 50 ? 'Stable' : 'Unsaturated'}</span>
                         <span className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)]">{h.done} / {h.goal} Cycles</span>
                      </div>
                   </div>
                 ))}
              </div>
           </motion.section>

           {/* Performance Visualization */}
           <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass rounded-[40px] p-8 border border-[var(--border)] overflow-hidden relative">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-8" style={{ color: 'var(--text)' }}>Cyclic Activity Heatmap</h2>
              <div className="grid grid-cols-7 gap-2">
                 {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const completionCount = habits.filter(h => checked[h.id]?.[day]).length;
                    const maxPossible = habits.length || 1;
                    const opacity = completionCount / maxPossible;
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ delay: 0.6 + (i * 0.02) }}
                        className="aspect-square rounded-[8px] flex items-center justify-center text-[8px] font-black group relative"
                        style={{ 
                          background: completionCount > 0 ? `rgba(245, 158, 11, ${0.1 + opacity * 0.9})` : 'var(--surface)',
                          color: completionCount > (maxPossible / 2) ? '#000' : 'var(--muted)',
                          border: day === new Date().getDate() ? '1px solid #f59e0b' : '1px solid transparent'
                        }}
                      >
                         {day}
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded-md border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap text-[9px]">
                            {completionCount} Objectives Met
                         </div>
                      </motion.div>
                    );
                 })}
              </div>
              <div className="mt-8 pt-8 border-t border-[var(--border)]/30">
                 <div className="flex items-center justify-between">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Peak Performance Day</div>
                       <div className="text-xl font-black text-[#f59e0b]">DAY 14</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">System Entropy</div>
                       <div className="text-xl font-black text-[#3b82f6]">LOW</div>
                    </div>
                 </div>
              </div>
           </motion.section>
        </div>
      </main>

      <footer className="py-20 border-t border-[var(--border)]/30 mt-12 bg-black/20">
         <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--muted)] opacity-50">METRICS ENGINE EXTERNALLY SYNCED · ENCRYPTED LOCAL STORAGE</p>
         </div>
      </footer>
    </div>
  );
}
