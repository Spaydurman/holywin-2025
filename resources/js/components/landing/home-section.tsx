import { useState, useEffect, useRef } from 'react';
import RandomizeText from '@/components/landing/randomize-text';
import HalftoneArrow from '@/components/landing/halftone-arrow';
// import GridDistortion from '@/components/background/grid-distortion';
import PixelBlast from '@/components/background/pixel';

interface HomeSectionProps {
    activeSection?: string;
}

export default function HomeSection({ activeSection }: HomeSectionProps) {
    const [displayText, setDisplayText] = useState('HOLYWIN');
    const [arrows, setArrows] = useState<Array<{id: number, left: number, delay: number}>>([]);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sectionElement = sectionRef.current;
        if (!sectionElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionElement);

        return () => {
            if (sectionElement) {
                observer.unobserve(sectionElement);
            }
        };
    }, []);

    useEffect(() => {
        let textSwitchInterval: NodeJS.Timeout;

        if (isVisible) {
            textSwitchInterval = setInterval(() => {
                setDisplayText(prev => prev === 'HOLYWIN' ? 'LEVEL UP' : 'HOLYWIN');
            }, 5000);
        }

        return () => {
            if (textSwitchInterval) {
                clearInterval(textSwitchInterval);
            }
        };
    }, [isVisible]);

    useEffect(() => {
        // Determine arrow count based on screen size
        const getArrowCount = () => {
            if (window.innerWidth >= 1024) { // PC/desktop
                return 20;
            } else if (window.innerWidth >= 768) { // Tablet
                return 15;
            } else { // Mobile
                return 10;
            }
        };

        const initialArrowCount = getArrowCount();
        const initialArrows = Array.from({ length: initialArrowCount }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5000
        }));
        setArrows(initialArrows);

        let arrowInterval: NodeJS.Timeout;

        if (isVisible) {
            arrowInterval = setInterval(() => {
                setArrows(prev => {
                    const currentArrowCount = getArrowCount();
                    const newArrows = [...prev.slice(1)];
                    newArrows.push({
                        id: Date.now(),
                        left: Math.random() * 100,
                        delay: 0
                    });
                    
                    // Ensure we maintain the correct length based on screen size
                    if (newArrows.length > currentArrowCount) {
                        return newArrows.slice(-currentArrowCount);
                    }
                    return newArrows;
                });
            }, 1500);
        }

        // Add resize listener to adjust arrow count when window is resized
        const handleResize = () => {
            const currentArrowCount = getArrowCount();
            setArrows(prev => {
                if (prev.length !== currentArrowCount) {
                    if (prev.length > currentArrowCount) {
                        return prev.slice(0, currentArrowCount);
                    } else {
                        const additionalArrows = Array.from(
                            { length: currentArrowCount - prev.length },
                            (_, i) => ({
                                id: Date.now() + i,
                                left: Math.random() * 100,
                                delay: Math.random() * 5000
                            })
                        );
                        return [...prev, ...additionalArrows];
                    }
                }
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (arrowInterval) {
                clearInterval(arrowInterval);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [isVisible]);

    return (
        <div ref={sectionRef} className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-b from-[#001636] to-[#000B1B] relative overflow-hidden">
            {/* Halftone arrows */}

            <div className="">
                {(activeSection === 'home' || activeSection === undefined) && arrows.map(arrow => (
                    <HalftoneArrow
                        key={arrow.id}
                        delay={arrow.delay}
                        leftPosition={arrow.left}
                    />
                ))}
            </div>

            <div className="absolute inset-0 w-full h-full z-0">
                <PixelBlast
                    variant="triangle"
                    pixelSize={6}
                    color="#B19EEF"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            <div className="max-w-7xl w-full text-center px-4">

                <div className="relative mb-8 space-mono">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] 2xl:text-[120px] font-bold mb-4 press-start-2p leading-tight">
                        <RandomizeText text={displayText} />
                    </h1>
                </div>
            </div>


        </div>
    );
}

