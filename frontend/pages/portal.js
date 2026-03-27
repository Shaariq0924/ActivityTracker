import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PortalPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isRegister) {
      try {
        let imageUrl = null;
        if (imageFile) {
          const storageRef = ref(storage, `profiles/${username}-${Date.now()}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, username, password, image: imageUrl }),
        });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || 'Registration failed');
          setLoading(false);
          return;
        }

        // Auto-login after registration
        const loginRes = await signIn('credentials', { redirect: false, username, password });
        if (loginRes?.error) setError('Login failed after registration');
        else router.push('/');
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    } else {
      // Login flow
      const res = await signIn('credentials', { redirect: false, username, password });
      if (res?.error) setError('Invalid credentials — try again');
      else router.push('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: 'radial-gradient(ellipse at 50% 0%, #001029 0%, #0a0805 70%)' }}>
      <Head><title>{`Activity Tracker — ${isRegister ? 'Create Account' : 'Sign In'}`}</title></Head>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none glow-pulse"
           style={{ background: 'radial-gradient(circle, #3b82f618 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full blur-3xl pointer-events-none glow-pulse"
           style={{ background: 'radial-gradient(circle, #60a5fa15 0%, transparent 70%)', animationDelay: '1.5s' }} />

      <div className="z-10 w-full max-w-md px-6 py-10">
        <div className="text-center mb-8">
          {/* AI Avatar Upload */}
          {isRegister ? (
            <div className="relative inline-block mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-[#3b82f640] glass transition-all group-hover:border-[#3b82f6] shadow-2xl relative">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#3b82f605]">
                       <i className="fas fa-camera text-[#3b82f6] text-xl mb-1" />
                       <span className="text-[8px] font-black uppercase text-[#3b82f6]">Add Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <i className="fas fa-cloud-upload text-white text-xs" />
                  </div>
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                 }}
               />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-4 float shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                 style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
              <span className="text-white font-black text-2xl tracking-tighter">AT</span>
            </div>
          )}
          <h1 className="text-3xl font-black text-white tracking-tight">Activity Tracker</h1>
          <p className="text-sm mt-2 font-medium" style={{ color: '#78716c' }}>
            {isRegister ? 'Join the next-gen productivity system' : 'Your personal habits, tasks & goals hub'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 border backdrop-blur-xl"
             style={{ background: '#13100a80', borderColor: '#2a2015' }}>
          <h2 className="text-base font-black text-white mb-6 uppercase tracking-wider">
            {isRegister ? 'Initialize Access 🚀' : 'Welcome back 👋'}
          </h2>

          {error && (
            <div className="rounded-xl p-3 mb-5 text-sm font-bold text-center"
                 style={{ background: '#7f1d1d33', color: '#fca5a5', border: '1px solid #7f1d1d55' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#78716c' }}>
                  Full Name
                </label>
                <input type="text"
                  className="w-full rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                  style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#2a2015'}
                  required />
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#78716c' }}>
                Email / Username
              </label>
              <input type="text"
                className="w-full rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                style={{ background: '#0a0805', border: '1px solid #2a2015' }}
                placeholder="your@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
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
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#2a2015'}
                required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-black text-sm tracking-wide text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', boxShadow: '0 0 20px #3b82f633' }}>
              {loading ? 'Processing...' : isRegister ? 'SIGN UP →' : 'LOG IN →'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2a2015] text-center">
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs font-black uppercase tracking-widest transition-all hover:text-[#3b82f6]"
              style={{ color: '#78716c' }}
            >
              {isRegister ? 'Already registered? Login' : 'New here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

