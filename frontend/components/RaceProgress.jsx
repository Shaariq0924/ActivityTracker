import React from 'react';
import { motion } from 'framer-motion';

export default function RaceProgress({ progress = 0 }) {
    return (
        <div className="w-full mt-4">
            <div className="flex justify-between mb-2 font-orbitron text-xs text-gray-400 uppercase">
                <span>Start</span>
                <span>Finish</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden relative border border-gray-700">
                <motion.div
                    className="h-full bg-gradient-to-r from-f1-red to-[#e83737]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />

                {/* Checkered flag finish line marking */}
                <div className="absolute right-0 top-0 h-full w-4 bg-white" style={{
                    backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
                    backgroundSize: "4px 4px",
                    backgroundPosition: "0 0, 2px 2px"
                }} />
            </div>
            <div className="text-center mt-2 font-orbitron text-f1-red font-bold">
                {progress}% Completed
            </div>
        </div>
    );
}
