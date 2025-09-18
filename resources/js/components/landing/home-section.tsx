import { useState, useEffect } from 'react';
import RandomizeText from '@/components/landing/randomize-text';
import HalftoneArrow from '@/components/landing/halftone-arrow';

interface HomeSectionProps {
    activeSection?: string;
}

export default function HomeSection({ activeSection }: HomeSectionProps) {
    const [displayText, setDisplayText] = useState('CLARK VELASCO');
    const [arrows, setArrows] = useState<Array<{id: number, left: number, delay: number}>>([]);

    // Switch between "HOLYWIN" and "LEVEL UP" every 10 seconds
    useEffect(() => {
        const textSwitchInterval = setInterval(() => {
            setDisplayText(prev => prev === 'CLARK VELASCO' ? 'LEVEL UP' : 'CLARK VELASCO');
        }, 5000);

        return () => clearInterval(textSwitchInterval);
    }, []);

    // Create and manage halftone arrows
    useEffect(() => {
        // Initialize arrows
        const initialArrows = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5000
        }));
        setArrows(initialArrows);

        // Add new arrows periodically
        const arrowInterval = setInterval(() => {
            setArrows(prev => {
                // Remove the oldest arrow and add a new one
                const newArrows = [...prev.slice(1)];
                newArrows.push({
                    id: Date.now(),
                    left: Math.random() * 100,
                    delay: 0
                });
                return newArrows;
            });
        }, 1500);

        return () => clearInterval(arrowInterval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B] relative overflow-hidden">
            {/* Halftone arrows */}

            <div className="z-20">
                {(activeSection === 'home' || activeSection === undefined) && arrows.map(arrow => (
                    <HalftoneArrow
                        key={arrow.id}
                        delay={arrow.delay}
                        leftPosition={arrow.left}
                    />
                ))}
            </div>

            <div className="max-w-9xl w-full text-center z-10">
                {/* Randomizing title that switches between HOLYWIN and LEVEL UP */}

                <div className="relative mb-8 space-mono ">
                    <h1 className="text-6xl md:text-[200px] font-bold mb-4">
                        <RandomizeText text={displayText} />
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                    Discover amazing features and join our community today
                </p>
            </div>


        </div>
    );
}
