import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  contents?: React.ReactNode[];
  firstContent?: React.ReactNode;
  secondContent?: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  cycleInterval?: number;
  autoCycle?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
  enabled?: boolean;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  contents = [],
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  cycleInterval = 2000,
  autoCycle = false,
  className = '',
  style = {},
  aspectRatio = '100%',
  enabled = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pixelGridRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Determine the content array to use
  const contentArray = contents && contents.length > 0
    ? contents
    : firstContent && secondContent
      ? [firstContent, secondContent]
      : [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [nextIndex, setNextIndex] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

  // Set up Intersection Observer to detect when component is in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;

    pixelGridEl.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.classList.add('absolute', 'hidden');
        pixel.style.backgroundColor = pixelColor;

        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;

        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  // Handle automatic cycling only when component is visible
    useEffect(() => {
      if (autoCycle && contentArray.length > 1 && enabled && isVisible) {
        intervalRef.current = setInterval(() => {
          if (!isAnimating) {
            animatePixels();
          }
        }, cycleInterval);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
  
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [autoCycle, contentArray, cycleInterval, isAnimating, enabled, isVisible]);

  const animatePixels = (): void => {
    if (contentArray.length === 0 || !isVisible) return; // Only animate if component is visible

    setIsAnimating(true);

    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) {
      setIsAnimating(false);
      return;
    }

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>('.pixelated-image-card__pixel');
    if (!pixels.length) {
      setIsAnimating(false);
      return;
    }

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) {
      delayedCallRef.current.kill();
    }

    gsap.set(pixels, { display: 'none' });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      // Update indices for next transition
      const next = (currentIndex + 1) % contentArray.length;
      setCurrentIndex(next);
      setNextIndex((next + 1) % contentArray.length);

      activeEl.style.display = 'block';
      activeEl.style.pointerEvents = 'none';
      setIsAnimating(false);
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: {
        each: staggerDuration,
        from: 'random'
      }
    });
  };

  const handleMouseEnter = (): void => {
    if (!isAnimating && !autoCycle && isVisible) animatePixels(); // Only animate if visible
  };
  const handleMouseLeave = (): void => {
    // No action on mouse leave for auto cycling
  };
  const handleClick = (): void => {
    if (!isAnimating && !autoCycle && isVisible) animatePixels(); // Only animate if visible
  };

  return (
    <div
      ref={containerRef}
      className={`
        ${className}
        bg-[#222]
        text-white
        rounded-[15px]
        border-2
        border-white
        w-[280px]
        lg:w-[340px] xl:w-[340px]
        h-[200px]
        lg:h-[250px] xl:h-[250px]
        relative
        overflow-hidden
      `}
      style={style}
      onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
    >
      <div style={{ paddingTop: aspectRatio }} />

      <div className="absolute inset-0 w-full h-full">
        {contentArray.length > 0 ? contentArray[currentIndex] : firstContent}
      </div>

      <div ref={activeRef} className="absolute inset-0 w-full h-full z-[2]" style={{ display: 'none' }}>
        {contentArray.length > 1 ? contentArray[nextIndex] : secondContent}
      </div>

      <div ref={pixelGridRef} className="absolute inset-0 w-full h-full pointer-events-none z-[3]" />
    </div>
  );
};

export default PixelTransition;
