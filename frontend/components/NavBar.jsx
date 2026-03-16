import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useTheme } from '@/pages/_app';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/',          label: 'Dashboard', icon: 'fa-th-large',       color: '#f59e0b' },
  { href: '/daily',     label: 'Daily',     icon: 'fa-calendar-check', color: '#10b981' },
  { href: '/goals',     label: 'Goals',     icon: 'fa-bullseye',       color: '#3b82f6' },
  { href: '/analytics', label: 'Analytics', icon: 'fa-chart-bar',      color: '#8b5cf6' },
  { href: '/focus',     label: 'Focus',     icon: 'fa-stopwatch',      color: '#f97316' },
];

export default function NavBar({ session, active = '/' }) {
  const { theme, mounted, toggle } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = mounted ? theme === 'dark' : true;

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="relative flex items-center justify-between px-5 py-3 border-b sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
           style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>

        {/* Left — Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group z-50">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 shadow-lg"
               style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
            <i className="fas fa-chart-line text-black text-xs" />
          </div>
          <span className="font-black tracking-tight text-sm sm:block" style={{ color: 'var(--text)' }}>
            Activity Tracker
          </span>
        </Link>

        {/* Center — Desktop Nav links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(n => {
            const isActive = active === n.href;
            return (
              <Link key={n.href} href={n.href}
                className="px-3 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 relative group"
                style={isActive ? { color: n.color, background: n.color + '18' } : { color: 'var(--muted)' }}
              >
                <i className={`fas ${n.icon} text-[10px]`} />
                {n.label}
                {isActive && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" 
                    style={{ background: n.color }} 
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 z-50">
          {/* Theme toggle (Always visible) */}
          <button onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:scale-110 glass"
            style={{ borderColor: 'var(--border)', color: isDark ? '#fbbf24' : '#6366f1' }}
            suppressHydrationWarning>
            {mounted ? (
              <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-xs`} />
            ) : (
              <i className="fas fa-circle-half-stroke text-xs opacity-50" />
            )}
          </button>

          {/* Desktop Sign Out */}
          <button onClick={() => signOut()}
            className="hidden md:flex px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all hover:border-red-500/50 hover:text-red-500 glass"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>
            <i className="fas fa-right-from-bracket mr-1.5" /> SIGN OUT
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center border glass transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xs`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col pt-20 px-6 backdrop-blur-xl"
            style={{ background: 'var(--bg-glass)' }}
          >
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] mb-4 ml-2 opacity-50">Navigation</div>
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
                        background: isActive ? n.color + '12' : 'var(--surface)',
                        borderColor: isActive ? n.color + '40' : 'var(--border)',
                        color: isActive ? n.color : 'var(--text)'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: isActive ? n.color : 'var(--border-muted)', color: isActive ? '#000' : 'var(--text)' }}>
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
               <div className="p-4 rounded-2xl glass border border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center font-black text-xs border border-[var(--border)]">
                        {session?.user?.name?.charAt(0) || 'U'}
                     </div>
                     <div>
                        <div className="text-xs font-black" style={{ color: 'var(--text)' }}>{session?.user?.name || 'User Account'}</div>
                        <div className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest">Active Session</div>
                     </div>
                  </div>
                  <button onClick={() => signOut()} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                     <i className="fas fa-power-off text-sm" />
                  </button>
               </div>
               <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-30">Activity Tracker Mobile Core v2.0</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
