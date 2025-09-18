import { useState, useEffect } from 'react';

interface GlitchTextProps {
    text: string;
    className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
    const [isGlitching, setIsGlitching] = useState(false);
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        // Trigger glitch effect
        setIsGlitching(true);

        // Update display text after a short delay
        const timer = setTimeout(() => {
            setDisplayText(text);
            setIsGlitching(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div className={`relative ${className}`}>
            <span
                className={`relative ${isGlitching ? 'animate-glitch text-white' : 'text-white'}`}
                data-text={displayText}
            >
                {displayText}
            </span>
            {isGlitching && (
                <>
                    <span
                        className="absolute top-0 left-0 text-red-500 transform translate-x-1 opacity-80 animate-glitch"
                        data-text={displayText}
                    >
                        {displayText}
                    </span>
                    <span
                        className="absolute top-0 left-0 text-blue-500 transform -translate-x-1 opacity-60 animate-glitch"
                        data-text={displayText}
                    >
                        {displayText}
                    </span>
                    <span
                        className="absolute top-0 left-0 text-green-500 transform translate-y-1 opacity-40 animate-glitch-green"
                        data-text={displayText}
                    >
                        {displayText}
                    </span>
                </>
            )}
        </div>
    );
}
