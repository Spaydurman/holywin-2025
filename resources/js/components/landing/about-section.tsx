
import { useState } from 'react';
import TextType from "../ui/text-type";
import PixelTransition from "../ui/pixel-transition";
import Coin from '../ui/coin';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface CoinPosition {
    id: number;
    x: number;
    y: number;
}

export default function AboutSection() {
    const [coins, setCoins] = useState<CoinPosition[]>([]);
    const { setRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newCoin = {
            id: Date.now(),
            x,
            y
        };

        setCoins(prev => [...prev, newCoin]);

        setTimeout(() => {
            setCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
        }, 1000);
    };

    return (
        <div
            ref={setRef}
            className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]"
            onClick={handleClick}
        >
            {coins.map(coin => (
                <Coin key={coin.id} x={coin.x} y={coin.y} id={coin.id} />
            ))}

            <div className="absolute w-full h-screen z-0">
                <img
                    src="/images/2825771.gif"
                    alt=""
                    className="w-full h-full object-cover [mask-image:linear-gradient(to_bottom,transparent,black)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
                />
            </div>

            <div className="max-w-5xl w-full relative">

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center">
                        <div className="absolute z-10 w-[300px] sm:w-[300px] md:w-[300px] lg:w-[400px] xl:w-[400px]">
                            <img src="/images/monitor.PNG" alt="" />
                        </div>
                        <div className="p-1 lg:p-8 xl:p-8 h-[300px]">
                            <PixelTransition
                                contents={[
                                    <img
                                        src="/images/H5.jpg"
                                        alt="H5"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                     <img
                                        src="/images/H3.png"
                                        alt="H4"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="/images/H3.png"
                                        alt="H3"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="/images/H2.png"
                                        alt="H2"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="/images/H1.png"
                                        alt="H1"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="/images/H5.1.png"
                                        alt="H5.1"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                ]}
                                gridSize={12}
                                pixelColor='#ffffff'
                                animationStepDuration={0.4}
                                cycleInterval={2000}
                                autoCycle={true}
                                className="custom-pixel-card"
                                enabled={isIntersecting}
                            />
                        </div>

                    </div>

                    <div className="z-10 min-h-[300px] sm:w-[300px] md:w-[300px] lg:w-[600px] xl:w-[600px]">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 vt323 about-us">About Holywin</h2>
                        {isIntersecting && (
                            <TextType
                                text={[
                                    `Holywin is annual celebration organized by the Young People of Pasig Corps since 2019. Held every October, it serves as a gathering that reaches out to the youth and highlights God’s victories in our lives. Through fellowship, uplifting music, interactive activities, and the preaching of His Word, it reminds us that in every season, holiness truly wins!`
                                ]}
                                typingSpeed={75}
                                pauseDuration={1500}
                                showCursor={true}
                                cursorCharacter="_" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
