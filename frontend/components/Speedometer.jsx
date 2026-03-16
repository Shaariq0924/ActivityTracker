import React from 'react';
import ReactSpeedometer from 'react-d3-speedometer';

export default function Speedometer({ value = 0, max = 100 }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <ReactSpeedometer
                maxValue={max}
                value={value}
                needleColor="#E10600"
                startColor="#1E1E1E"
                segments={10}
                endColor="#FFFFFF"
                textColor="#FFFFFF"
                currentValueText={`${value}%`}
                ringWidth={20}
                needleTransitionDuration={3333}
                needleTransition="easeElastic"
                width={300}
                height={200}
            />
            <div className="font-orbitron text-f1-red text-sm tracking-widest mt-[-20px] uppercase">
                Goal Progress
            </div>
        </div>
    );
}
