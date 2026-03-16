import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/pages/_app';

const DURATIONS = [
  { label: 'Short Focus', mins: 15, color: '#10b981' },
  { label: 'Deep Work',   mins: 25, color: '#f59e0b' },
  { label: 'Intense',     mins: 45, color: '#f97316' },
  { label: 'Extended',    mins: 60, color: '#ef4444' },
];

const AMBIENT_SOUNDS = [
  { id: 'lofi',  label: 'Zen Lo-fi',  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: 'fa-headphones' },
  { id: 'rain',  label: 'Rain Protocol', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3', icon: 'fa-cloud-showers-heavy' },
  { id: 'space', label: 'Deep Space', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', icon: 'fa-atom' },
];

export default function FocusPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, mounted } = useTheme();
  const isDark = theme === 'dark';
  
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(25);
  const [stats, setStats] = useState({ todaySessions: 0, totalMinutes: 0 });
  const [currentSound, setCurrentSound] = useState(null);
  const [volume, setVolume] = useState(0.5);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('at-focus-stats');
      if (s) setStats(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    if (isActive && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, seconds]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggleSound = (sound) => {
    if (currentSound?.id === sound.id) {
      setCurrentSound(null);
    } else {
      setCurrentSound(sound);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    const newStats = {
      todaySessions: stats.todaySessions + 1,
      totalMinutes: stats.totalMinutes + sessionTime
    };
    setStats(newStats);
    localStorage.setItem('at-focus-stats', JSON.stringify(newStats));
    alert('Focus Session Complete! Commencing break protocol.');
  };

  const startTimer = (mins) => {
    setIsActive(false);
    setSessionTime(mins);
    setSeconds(mins * 60);
    setIsActive(true);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const isAuthLoading = status === 'loading';

  const progress = (seconds / (sessionTime * 60));
  const dashOffset = 2 * Math.PI * 140 * progress;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Head><title>Deep Focus — Activity Tracker</title></Head>
      <NavBar session={session} active="/focus" />

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none -center">
         <motion.div 
           animate={{ 
             scale: isActive ? [1, 1.1, 1] : 1,
             opacity: isActive ? [0.05, 0.1, 0.05] : 0.05
           }}
           transition={{ duration: 4, repeat: Infinity }}
           className="w-[800px] h-[800px] bg-[#f59e0b] rounded-full blur-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
         />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
           <h1 className="text-4xl font-black tracking-tighter" style={{ color: 'var(--text)' }}>Deep <span className="text-[#f59e0b]">Focus</span></h1>
           <p className="text-xs font-black text-[var(--muted)] mt-2 uppercase tracking-[0.3em]">{isActive ? 'Isolation Protocol Active' : 'Standby for Operative Focus'}</p>
        </motion.div>

        {/* Timer Core */}
        <div className="flex flex-col items-center">
           <div className="relative w-[320px] h-[320px] mb-16">
              {/* Circular Progress SVG */}
              <svg className="w-full h-full -rotate-90">
                 <circle cx="160" cy="160" r="140" fill="transparent" stroke="var(--surface)" strokeWidth="12" />
                 <motion.circle 
                    cx="160" cy="160" r="140" fill="transparent" stroke="#f59e0b" strokeWidth="12" 
                    strokeDasharray={2 * Math.PI * 140}
                    animate={{ strokeDashoffset: 2 * Math.PI * 140 - dashOffset }}
                    transition={{ ease: 'linear' }}
                    strokeLinecap="round"
                 />
              </svg>
              
              {/* Central Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="text-7xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
                    {formatTime(seconds)}
                 </div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mt-2">Time Remaining</div>
              </div>

              {/* Decorative Pulsing Dots (active only) */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none">
                  {[0, 90, 180, 270].map(deg => (
                    <motion.div 
                      key={deg}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: deg / 90 * 0.5 }}
                      className="absolute w-2 h-2 rounded-full bg-[#f59e0b]"
                      style={{ 
                        top: '50%', left: '50%',
                        transform: `rotate(${deg}deg) translate(140px, -50%)`
                      }} 
                    />
                  ))}
                </div>
              )}
           </div>

           {/* Zen Audio Hub */}
           <div className="mb-12 glass rounded-[2rem] p-4 border border-[var(--border)] flex items-center gap-6">
              <div className="flex gap-2">
                 {AMBIENT_SOUNDS.map(s => (
                   <button 
                     key={s.id} 
                     onClick={() => toggleSound(s)}
                     className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentSound?.id === s.id ? 'bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'hover:bg-[var(--surface)] text-[var(--muted)]'}`}
                   >
                     <i className={`fas ${s.icon} text-lg`} />
                   </button>
                 ))}
              </div>
              <div className="h-8 w-[1px] bg-[var(--border)]" />
              <div className="flex items-center gap-4">
                 <i className="fas fa-volume-low text-[var(--muted)] text-xs" />
                 <input 
                   type="range" min="0" max="1" step="0.01" 
                   value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
                   className="w-24 accent-[#f59e0b] bg-[var(--surface)] h-1 rounded-full appearance-none cursor-pointer"
                 />
                 <i className="fas fa-volume-high text-[var(--muted)] text-xs" />
              </div>
              {currentSound && (
                <div className="pr-4">
                   <p className="text-[9px] font-black uppercase tracking-widest text-[#f59e0b] animate-pulse">Syncing: {currentSound.label}</p>
                </div>
              )}
              {currentSound && (
                <audio ref={audioRef} src={currentSound.url} autoPlay loop />
              )}
           </div>

           {/* Controls */}
           <div className="flex flex-wrap justify-center gap-3 mb-16">
              {DURATIONS.map(d => (
                <button 
                  key={d.label} 
                  onClick={() => startTimer(d.mins)}
                  disabled={isActive && sessionTime === d.mins}
                  className={`px-5 py-3 rounded-2xl glass border font-black text-[10px] uppercase tracking-widest transition-all ${isActive && sessionTime === d.mins ? 'bg-[#f59e0b15] border-[#f59e0b] text-[#f59e0b]' : 'border-[var(--border)] hover:border-[#f59e0b30] text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                  {d.label} ({d.mins}m)
                </button>
              ))}
           </div>

           <div className="flex gap-4">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`px-10 py-5 rounded-3xl font-black text-sm transition-all shadow-2xl ${isActive ? 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]' : 'bg-[#f59e0b] text-black hover:scale-105 active:scale-95'}`}
              >
                 {isActive ? 'SUSPEND SESSION' : 'ENGAGE FOCUS'}
              </button>
              <button 
                onClick={() => { setIsActive(false); setSeconds(sessionTime * 60); }}
                className="px-6 py-5 rounded-3xl glass border border-[var(--border)] text-[var(--muted)] hover:text-[#ef4444] transition-all"
              >
                 <i className="fas fa-redo-alt" />
              </button>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-6 mt-24">
           <div className="glass rounded-[32px] p-8 border border-[var(--border)] text-center relative overflow-hidden group">
              <div className="text-4xl font-black mb-1" style={{ color: 'var(--text)' }}>{stats.todaySessions}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Sessions Completed Today</div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#f59e0b08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
           <div className="glass rounded-[32px] p-8 border border-[var(--border)] text-center relative overflow-hidden group">
              <div className="text-4xl font-black mb-1" style={{ color: 'var(--text)' }}>{stats.totalMinutes}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Total Minutes Deep Work</div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b82f608] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </div>
        </div>
      </main>

      <footer className="py-12 border-t border-[var(--border)]/30 mt-12 bg-black/20">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--muted)] opacity-50">ISOLATION CORE ONLINE · SESSION LOGGING ACTIVE</p>
         </div>
      </footer>
    </div>
  );
}
