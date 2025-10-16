import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
    return text.split(/(\s+)/).map((word, index) =>
      word.match(/^\s+$/) ? (
        word
      ) : (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      )
    );
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;
    const triggers: ScrollTrigger[] = [];

    // Rotation
    const rotationTween = gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true
        }
      }
    );
    triggers.push(rotationTween.scrollTrigger!);

    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    // Combine word opacity & blur in one timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: wordAnimationEnd,
        scrub: true
      }
    });

    tl.fromTo(wordElements, { opacity: baseOpacity }, { opacity: 1, stagger: 0.05, ease: 'none' });

    if (enableBlur) {
      tl.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        { filter: 'blur(0)', stagger: 0.05, ease: 'none' },
        0
      );
    }

    triggers.push(tl.scrollTrigger!);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <span className={`block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>
        {splitText}
      </span>
    </h2>
  );
};

export default React.memo(ScrollReveal);
