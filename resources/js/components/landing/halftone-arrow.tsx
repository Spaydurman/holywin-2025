import { useState, useEffect, useMemo } from 'react';

interface HalftoneArrowProps {
  delay?: number;
  leftPosition?: number;
}

export default function HalftoneArrow({ delay = 0, leftPosition = 0 }: HalftoneArrowProps) {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState('animate-float');

  useEffect(() => {
    const animations = ['animate-float', 'animate-float-to-top', 'animate-float-short'];
    setAnimation(animations[Math.floor(Math.random() * animations.length)]);

    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const style = useMemo(
    () => ({
      left: `${Math.min(Math.max(leftPosition, 5), 90)}%`,
      zIndex: 10,
    }),
    [leftPosition]
  );

  return (
    <div
      className={`halftone-arrow fixed pointer-events-none bottom-[env(safe-area-inset-bottom,1rem)] transition-opacity duration-500 ${
        visible ? animation : 'opacity-0'
      }`}
      style={style}
    >
      <img
        className="w-12 sm:w-16 md:w-20 max-w-[20vw] select-none"
        src="/images/Arrow up.webp"
        alt="Floating arrow"
        loading="lazy"
      />
    </div>
  );
}
