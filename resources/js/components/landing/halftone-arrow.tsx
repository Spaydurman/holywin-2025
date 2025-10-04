import { useState, useEffect } from 'react';

interface HalftoneArrowProps {
    delay?: number;
    leftPosition?: number;
}

export default function HalftoneArrow({ delay = 0, leftPosition = 0 }: HalftoneArrowProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-float');

    useEffect(() => {
        // Randomly select animation class
        const animations = [
            'animate-float',
            'animate-float-to-top',
            'animate-float-short',
        ];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        setAnimationClass(randomAnimation);

        // Delay the appearance of the arrow
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`halftone-arrow fixed bottom-0 ${isVisible ? animationClass : 'opacity-0'}`}
            style={{ left: `${leftPosition}%` }}
        >
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B9BDF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="m17 11-5-5-5 5"/>
                <path d="m17 18-5-5-5 5"/>
            </svg> */}
            <img className="w-20"  src="/images/Arrow up.png" alt="" />
        </div>
    );
}
