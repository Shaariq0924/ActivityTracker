import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useTheme } from '@/pages/_app';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Feedback from './Feedback';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'fa-th-large', color: '#3b82f6' },
  { href: '/flow', label: 'Flow', icon: 'fa-wind', color: '#3b82f6' },
  { href: '/targets', label: 'Targets', icon: 'fa-bullseye', color: '#3b82f6' },
  { href: '/insights', label: 'Insights', icon: 'fa-chart-bar', color: '#3b82f6' },
  { href: '/focus', label: 'Focus', icon: 'fa-stopwatch', color: '#3b82f6' },
];

export default function NavBar({ session, active = '/' }) {
  const { theme, mounted, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const isDark = mounted ? theme === 'dark' : true;

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-[60] bg-gradient-to-b from-[var(--background-main)] to-transparent opacity-80" />

      <div className="sticky top-6 z-50 px-4 mb-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2.5 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group/nav"
          style={{
            background: isDark ? 'rgba(15, 15, 15, 0.7)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)' : '0 8px 32px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(0,0,0,0.02)'
          }}>

          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f605] to-transparent pointer-events-none" />

          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group z-50">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg] shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
              <span className="text-black font-black text-xs tracking-tighter">AT</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tighter text-xs leading-none" style={{ color: isDark ? '#fff' : '#000' }}>
                ACTIVITY <span className="text-[#3b82f6]">TRACKER</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mt-1 flex items-center gap-1">
                v1.0 <span className="w-1 h-1 rounded-full bg-[#3b82f6] animate-pulse" /> BETA
              </span>
            </div>
          </Link>

          {/* Center — Desktop Nav links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl border transition-colors"
               style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)' }}>
            {NAV_LINKS.map(n => {
              const isActive = active === n.href;
              return (
                <Link key={n.href} href={n.href}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative group/item overflow-hidden"
                  style={isActive ? { color: '#fff' } : { color: 'var(--text-muted)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBG"
                      className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <i className={`fas ${n.icon} text-[10px] z-10 transition-colors duration-300 ${isActive ? (isDark ? 'text-black' : 'text-white') : ''}`} />
                  <span className={`z-10 transition-colors duration-300 ${isActive ? (isDark ? 'text-black' : 'text-white') : 'group-hover/item:text-[var(--text-primary)]'}`}>{n.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-3 z-50">
            {/* Desktop Account Icon (Simulated) */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-colors group-hover/nav:border-white/10"
                 style={{ background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)', borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)' }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-[8px] font-black text-white">
                {session?.user?.name?.charAt(0) || 'S'}
              </div>
              <div className="w-[1px] h-3" style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
              <button onClick={() => signOut()} className="text-[8px] font-black text-[var(--text-muted)] hover:text-red-400 transition-colors uppercase tracking-widest">
                Secure Exit
              </button>
            </div>

            {/* Feedback toggle */}
            <button onClick={() => setIsFeedbackOpen(true)}
              className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 glass hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#10b981' }}>
              <i className="fas fa-comment-dots text-xs" />
            </button>

            {/* Theme toggle */}
            <button onClick={toggle}
              className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-300 hover:scale-105 active:scale-95 glass hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: isDark ? '#60a5fa' : '#3b82f6' }}
              suppressHydrationWarning>
              {mounted ? (
                <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-xs`} />
              ) : (
                <i className="fas fa-circle-half-stroke text-xs opacity-50" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-9 h-9 rounded-2xl flex items-center justify-center border glass transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars-staggered'} text-xs`} />
            </button>
          </div>
        </nav>
      </div>

      <Feedback isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col pt-20 px-6 backdrop-blur-xl"
            style={{ background: 'var(--glass-overlay)' }}
          >
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-4 ml-2 opacity-50">Navigation</div>
              {NAV_LINKS.map((n, i) => {
                const isActive = active === n.href;
                return (
                  <motion.div
                    key={n.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-2xl border transition-all"
                      style={{
                        background: isActive ? n.color + '12' : 'var(--surface-layer)',
                        borderColor: isActive ? n.color + '40' : 'var(--border-color)',
                        color: isActive ? n.color : 'var(--text-primary)'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: isActive ? n.color : 'var(--surface-layer)', color: isActive ? '#fff' : 'var(--text-primary)' }}>
                          <i className={`fas ${n.icon} text-sm`} />
                        </div>
                        <span className="font-black text-sm uppercase tracking-wider">{n.label}</span>
                      </div>
                      <i className="fas fa-chevron-right text-[10px] opacity-30" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto mb-10 space-y-4">
              <div className="p-4 rounded-2xl glass border border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--surface-layer)] flex items-center justify-center font-black text-xs border border-[var(--border-color)]">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>{session?.user?.name || 'User Account'}</div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Active Session</div>
                  </div>
                </div>
                <button onClick={() => signOut()} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                  <i className="fas fa-power-off text-sm" />
                </button>
              </div>
              <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-30">Activity Tracker Mobile Core v1.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
