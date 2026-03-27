import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/pages/_app';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, mounted } = useTheme();
  
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Feedback');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchAdminData();
    }
  }, [status, router]);

  const fetchAdminData = async () => {
    try {
      // Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const fetchedUsers = [];
      usersSnap.forEach(doc => fetchedUsers.push({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);

      // Fetch Feedback
      const feedbackQ = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
      const feedbackSnap = await getDocs(feedbackQ);
      const fetchedFeedbacks = [];
      feedbackSnap.forEach(doc => fetchedFeedbacks.push({ id: doc.id, ...doc.data() }));
      setFeedbacks(fetchedFeedbacks);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthLoading = status === 'loading';
  const isDark = mounted ? theme === 'dark' : true;

  if (!mounted || isAuthLoading) return null;

  return (
    <>
      <Head><title>Admin Core — Activity Tracker</title></Head>
      <div suppressHydrationWarning className="min-h-screen relative overflow-x-hidden selection:bg-[#3b82f620]">
        <NavBar session={session} active="/admin" />

        {/* Background Glows */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[100px] opacity-10" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
        </div>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8b5cf630] bg-[#8b5cf610] text-[#8b5cf6] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <i className="fas fa-shield-halved" /> Admin Protocols
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                System <span className="text-[#8b5cf6]">Control</span>
              </h1>
              <p className="text-sm font-medium text-[var(--text-muted)] mt-2 max-w-md">
                Monitor platform utilization and review incoming end-user diagnostics.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="glass p-4 rounded-2xl border border-[var(--border-color)] text-center min-w-[120px]">
                 <div className="text-3xl font-black text-[#3b82f6]">{users.length}</div>
                 <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Registered</div>
              </div>
              <div className="glass p-4 rounded-2xl border border-[var(--border-color)] text-center min-w-[120px]">
                 <div className="text-3xl font-black text-[#10b981]">{feedbacks.length}</div>
                 <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Responses</div>
              </div>
            </div>
          </motion.section>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 border-b border-[var(--border-color)] pb-4">
            {['Feedback', 'Users'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[var(--surface-layer)] border border-[#8b5cf6] text-[#8b5cf6]' : 'border border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-layer)]'}`}
              >
                {tab} Records
              </button>
            ))}
          </div>

          {/* Table Area */}
          <div className="glass rounded-[2rem] border border-[var(--border-color)] overflow-hidden">
             {isLoading ? (
               <div className="p-20 text-center text-[var(--text-muted)]">
                 <i className="fas fa-circle-notch fa-spin text-3xl text-[#8b5cf6] mb-4" />
                 <p className="text-xs font-black uppercase tracking-widest">Decrypting Secure DB...</p>
               </div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] bg-[var(--surface-layer)]">
                        {activeTab === 'Feedback' ? (
                          <>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">User</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Rating</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] w-1/2">Insight / Message</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] text-right">Timestamp</th>
                          </>
                        ) : (
                          <>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Identity</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Email</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === 'Feedback' ? (
                        feedbacks.length > 0 ? feedbacks.map((fb, idx) => (
                          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} key={fb.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--surface-layer)] transition-colors">
                            <td className="p-6">
                              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{fb.userName}</div>
                              <div className="text-xs text-[var(--text-muted)] font-medium mt-1">{fb.userEmail}</div>
                            </td>
                            <td className="p-6">
                              <div className="flex items-center gap-1 text-[#fbbf24]">
                                {Array.from({ length: fb.rating }).map((_, i) => <i key={i} className="fas fa-star text-xs" />)}
                              </div>
                            </td>
                            <td className="p-6">
                              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{fb.message}</p>
                            </td>
                            <td className="p-6 text-right">
                              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                {new Date(fb.createdAt).toLocaleDateString('en-US', { disable: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                          </motion.tr>
                        )) : (
                          <tr><td colSpan="4" className="p-12 text-center text-[var(--text-muted)] text-sm font-bold">No feedback transmissions found.</td></tr>
                        )
                      ) : (
                        users.length > 0 ? users.map((u, idx) => (
                          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} key={u.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--surface-layer)] transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[var(--surface-layer)] rounded-xl border border-[var(--border-color)] overflow-hidden flex items-center justify-center font-black text-[#8b5cf6]">
                                  {u.image ? (
                                    <img src={u.image} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    u.name?.charAt(0) || 'U'
                                  )}
                                </div>
                                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{u.name || 'Unknown Agent'}</span>
                              </div>
                            </td>
                            <td className="p-6">
                              <span className="text-sm font-medium text-[var(--text-muted)]">{u.username || u.email || 'No email provided'}</span>
                            </td>
                          </motion.tr>
                        )) : (
                          <tr><td colSpan="2" className="p-12 text-center text-[var(--text-muted)] text-sm font-bold">No external agents registered.</td></tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
             )}
          </div>
        </main>
      </div>
    </>
  );
}
