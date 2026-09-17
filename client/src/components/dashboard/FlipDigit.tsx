import React, { useEffect, useState } from 'react';

interface FlipDigitProps {
  digit: string;
}

export function FlipDigit({ digit }: FlipDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 600); // matches the total animation duration
      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  return (
    <div className="relative w-16 h-24 md:w-20 md:h-32 bg-[#E0E0E0] rounded-lg shadow-inner flex items-center justify-center font-display text-5xl md:text-7xl font-bold text-[#E03C3C] border border-gray-300" style={{ perspective: '1000px' }}>
      {/* Top half (Next digit) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#EEEEEE] overflow-hidden rounded-t-lg">
        <div className="absolute bottom-0 w-full flex justify-center translate-y-1/2">{nextDigit}</div>
      </div>
      
      {/* Bottom half (Current digit) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#E0E0E0] overflow-hidden rounded-b-lg">
        <div className="absolute top-0 w-full flex justify-center -translate-y-1/2">{currentDigit}</div>
      </div>

      {/* Flipping Top Half (Current digit flipping down to -90deg) */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1/2 bg-[#EEEEEE] overflow-hidden rounded-t-lg origin-bottom z-10
          ${isFlipping ? 'animate-flip-top' : ''}
        `}
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      >
        <div className="absolute bottom-0 w-full flex justify-center translate-y-1/2">{currentDigit}</div>
      </div>

      {/* Flipping Bottom Half (Next digit flipping down from 90deg to 0) */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-[#E0E0E0] overflow-hidden rounded-b-lg origin-top z-10
          ${isFlipping ? 'animate-flip-bottom' : 'hidden'}
        `}
        style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d', transform: isFlipping ? 'rotateX(90deg)' : 'rotateX(0deg)' }}
      >
        <div className="absolute top-0 w-full flex justify-center -translate-y-1/2">{nextDigit}</div>
      </div>

      {/* Center line overlay */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/20 -translate-y-1/2 z-20 shadow-sm"></div>
    </div>
  );
}
