import { useState, useEffect } from 'react';
import RandomizeText from '@/components/landing/randomize-text';
import HalftoneArrow from '@/components/landing/halftone-arrow';
// import GridDistortion from '@/components/background/grid-distortion';
import PixelBlast from '@/components/background/pixel';

interface HomeSectionProps {
    activeSection?: string;
}

export default function HomeSection({ activeSection }: HomeSectionProps) {
    const [displayText, setDisplayText] = useState('CTRL ALT');
    const [arrows, setArrows] = useState<Array<{id: number, left: number, delay: number}>>([]);

    // Switch between "HOLYWIN" and "LEVEL UP" every 10 seconds
    useEffect(() => {
        const textSwitchInterval = setInterval(() => {
            setDisplayText(prev => prev === 'CTRL ALT' ? 'LEVEL UP' : 'CTRL ALT');
        }, 5000);

        return () => clearInterval(textSwitchInterval);
    }, []);

    useEffect(() => {
        const initialArrows = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 5000
        }));
        setArrows(initialArrows);

        const arrowInterval = setInterval(() => {
            setArrows(prev => {

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

            <div className="">
                {(activeSection === 'home' || activeSection === undefined) && arrows.map(arrow => (
                    <HalftoneArrow
                        key={arrow.id}
                        delay={arrow.delay}
                        leftPosition={arrow.left}
                    />
                ))}
            </div>

            <div style={{ width: '100%', height: '100vh', position: 'absolute' }}>
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

            <div className="max-w-9xl w-full text-center">
                {/* Randomizing title that switches between HOLYWIN and LEVEL UP */}

                <div className="relative mb-8 space-mono ">
                    <h1 className="text-6xl md:text-[120px] font-bold mb-4 press-start-2p">
                        <RandomizeText text={displayText} />
                    </h1>
                </div>
                {/* <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                    Discover amazing features and join our community today
                </p> */}
            </div>


        </div>
    );
}

