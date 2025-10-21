import React from 'react';

interface LanyardMobileProps {
  cardText?: string;
}

export default function LanyardMobile({ cardText = "49" }: LanyardMobileProps) {
  return (
    <div className="relative w-full max-w-md mx-auto my-8">
      <img
        src="/images/Lanyard Mobile.webp"
        alt="Registration count display"
        className="w-full h-auto object-contain rounded-md"
        loading='lazy'
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl md:text-5xl font-bold text-black">
            {cardText}
          </div>
          <div className="text-2xl md:text-xl font-semibold text-black mt-1">
            Registered
          </div>
        </div>
      </div>
    </div>
  );
}