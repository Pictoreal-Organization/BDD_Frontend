import React from 'react';
import { FlipDigit } from './FlipDigit';

interface FlipClockProps {
  count: number;
}

export function FlipClock({ count }: FlipClockProps) {
  // Pad the count to at least 3 digits
  const countStr = count.toString().padStart(3, '0');
  const digits = countStr.split('');

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <FlipDigit key={index} digit={digit} />
      ))}
    </div>
  );
}
