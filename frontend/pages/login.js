import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn('credentials', { redirect: false, username, password });
    setLoading(false);
    if (res?.error) setError(true);
    else router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at 50% 0%, #291800 0%, #0a0805 70%)' }}>
      <Head><title>Activity Tracker — Sign In</title></Head>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none glow-pulse"
           style={{ background: 'radial-gradient(circle, #f59e0b18 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none glow-pulse"
           style={{ background: 'radial-gradient(circle, #f9731615 0%, transparent 70%)', animationDelay: '1.5s' }} />

      <div className="z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 float"
               style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Activity Tracker</h1>
          <p className="text-sm mt-2 font-medium" style={{ color: '#78716c' }}>
            Your personal habits, tasks & goals hub
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border"
             style={{ background: '#13100a', borderColor: '#2a2015' }}>
          <h2 className="text-base font-black text-white mb-6 uppercase tracking-wider">Welcome back 👋</h2>

          {error && (
            <div className="rounded-xl p-3 mb-5 text-sm font-bold text-center"
                 style={{ background: '#7f1d1d33', color: '#fca5a5', border: '1px solid #7f1d1d55' }}>
              Invalid credentials — try again
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#78716c' }}>
                Username / Email
              </label>
              <input type="text"
                className="w-full rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                placeholder="your@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#2a2015'}
                required />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#78716c' }}>
                Password
              </label>
              <input type="password"
                className="w-full rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#f59e0b'}
                onBlur={e => e.target.style.borderColor = '#2a2015'}
                required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-black text-sm tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 0 20px #f59e0b33' }}>
              {loading ? 'Loading...' : 'Start Tracking →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6 font-medium" style={{ color: '#78716c' }}>
          Any username + any password works — this is your personal tracker.
        </p>
      </div>
    </div>
  );
}
