import { CSSProperties, useEffect } from 'react';

interface CoinProps {
    x: number;
    y: number;
    id: number;
}

export default function Coin({ x, y, id }: CoinProps) {
    const style: CSSProperties = {
        left: `${x}px`,
        top: `${y + window.innerHeight}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20
    };

    useEffect(() => {
        const playRandomCoinSound = () => {
            const randomSoundNumber = Math.floor(Math.random() * 7) + 1;
            const soundPath = `/sound/coin/${randomSoundNumber}.mp3`;
            
            const audio = new Audio(soundPath);
            audio.volume = 0.5; 
            audio.play().catch(e => console.log("Audio play error:", e)); 
        };
        
        playRandomCoinSound();
    }, [id]); 

    return (
        <div
            key={id}
            className="absolute w-7 h-7 pointer-events-none"
            style={style}
        >
            <img
                src="/images/coin.gif"
                alt="Coin"
                className="w-full h-full"
            />
        </div>
    );
}
