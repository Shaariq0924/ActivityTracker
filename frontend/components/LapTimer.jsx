import React, { useState, useEffect } from 'react';

export default function FocusTimer() {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const toggle = () => setIsActive(!isActive);

    const reset = () => {
        if (seconds > 60) setSessions(s => s + 1);
        setSeconds(0);
        setIsActive(false);
    };

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const pct = Math.min((seconds / (25 * 60)) * 100, 100);
    const r = 52;
    const circ = 2 * Math.PI * r;
    const dash = circ - (pct / 100) * circ;

    return (
        <div className="flex flex-col items-center justify-center space-y-5">
            {/* Circular progress */}
            <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e30" strokeWidth="8" />
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#7c3aed" strokeWidth="8"
                        strokeDasharray={circ} strokeDashoffset={dash}
                        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{fmt(seconds)}</span>
                    {isActive && <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mt-1" />}
                </div>
            </div>

            <div className="text-xs font-bold text-nd-muted uppercase tracking-widest">
                {isActive ? 'In the zone' : seconds === 0 ? 'Ready to focus' : 'Paused'}
            </div>

            <div className="flex space-x-3">
                <button onClick={toggle}
                    className="px-5 py-2 rounded-xl text-sm font-black text-white transition-all"
                    style={{ background: isActive ? '#1e1e30' : 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
                    {isActive ? 'Pause' : 'Focus'}
                </button>
                <button onClick={reset}
                    className="px-4 py-2 rounded-xl text-sm font-black text-nd-muted border border-nd-border hover:border-purple-700 transition-all">
                    Reset
                </button>
            </div>

            {sessions > 0 && (
                <div className="text-xs text-purple-400 font-bold">
                    🔥 {sessions} session{sessions > 1 ? 's' : ''} completed today
                </div>
            )}
        </div>
    );
}
