import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function Feedback({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          message,
          userName: session?.user?.name || 'Anonymous',
          userEmail: session?.user?.email || 'N/A'
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
          setRating(0);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md p-8 rounded-3xl border shadow-2xl relative overflow-hidden"
            style={{ background: 'var(--background-main, #0f0f0f)', borderColor: 'var(--border-color, #333)' }}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] rounded-full blur-[100px] opacity-10 pointer-events-none" />
            
            <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#3b82f630] transition-colors text-[#3b82f6]">
              <i className="fas fa-times" />
            </button>

            {success ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <i className="fas fa-check text-3xl text-white" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary, #fff)' }}>Feedback Secured</h3>
                <p className="text-sm font-medium text-[var(--text-muted, #aaa)]">Your transmission has been logged. Thank you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <h3 className="text-xl font-black mb-1" style={{ color: 'var(--text-primary, #fff)' }}>System Feedback</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] mb-8">Data Collection Protocol</p>
                
                <div className="mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted, #aaa)] mb-3 block">Overall Effectiveness</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-110' : 'bg-transparent text-[var(--text-muted, #aaa)] border border-[var(--border-color, #333)] hover:border-[#3b82f650]'}`}
                      >
                        <i className="fas fa-star text-[14px]" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted, #aaa)] mb-3 block">Operational Insights</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Suggest improvements, report anomalies, or share your experience..."
                    className="w-full h-32 bg-transparent border border-[var(--border-color, #333)] rounded-2xl p-4 text-sm font-medium outline-none focus:border-[#3b82f6] transition-colors resize-none"
                    style={{ color: 'var(--text-primary, #fff)' }}
                  />
                </div>

                <div className="flex items-center gap-3">
                   <button 
                     type="button" 
                     onClick={onClose}
                     className="px-6 py-3 rounded-xl border border-[var(--border-color, #333)] text-xs font-black text-[var(--text-muted, #aaa)] hover:bg-[#3b82f610] hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all uppercase tracking-widest"
                   >
                     Abort
                   </button>
                   <button 
                     type="submit" 
                     disabled={isSubmitting || !message.trim() || rating === 0}
                     className="flex-1 py-3 rounded-xl bg-[#3b82f6] text-white text-xs font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                   >
                     {isSubmitting ? <i className="fas fa-circle-notch fa-spin" /> : 'Transmit Data'}
                   </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
