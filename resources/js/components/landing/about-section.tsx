
import { useState } from 'react';
import TextType from "../ui/text-type";
import PixelTransition from "../ui/pixel-transition";
import Coin from '../ui/coin';
interface CoinPosition {
    id: number;
    x: number;
    y: number;
}

export default function AboutSection() {
    const [coins, setCoins] = useState<CoinPosition[]>([]);

    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newCoin = {
            id: Date.now(),
            x,
            y
        };
        console.log('test');
        setCoins(prev => [...prev, newCoin]);
        
        setTimeout(() => {
            setCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
        }, 1000);
    };

    return (
        <div
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="absolute z-10 w-[400px] ">
                            <img src="/images/monitor.png" alt="" />
                        </div>
                        <div className="p-8 h-[400px]">
                            <PixelTransition
                                contents={[
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                                        alt="Cat 1"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg"
                                        alt="Cat 2"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />,
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/1200px-Cat_poster_1.jpg"
                                        alt="Cat 3"
                                        style={{ width: "100%", height: "10%", objectFit: "cover" }}
                                    />,
                                    <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "grid",
                                        placeItems: "center",
                                        backgroundColor: "#111"
                                    }}
                                    >
                                    <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                                    </div>
                                ]}
                                gridSize={12}
                                pixelColor='#ffffff'
                                animationStepDuration={0.4}
                                cycleInterval={2000}
                                autoCycle={true}
                                className="custom-pixel-card"
                            />
                        </div>

                    </div>

                    <div className="z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 vt323 about-us">About Meow</h2>
                            <TextType
                                text={[
                                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
                                    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                                ]}
                                typingSpeed={75}
                                pauseDuration={1500}
                                showCursor={true}
                                cursorCharacter="_"
                            />
                    </div>
                </div>
            </div>
        </div>
    );
}

