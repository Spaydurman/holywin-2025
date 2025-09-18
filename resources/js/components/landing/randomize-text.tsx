import { useState, useEffect } from 'react';

interface RandomizeTextProps {
    text: string;
    className?: string;
}

export default function RandomizeText({ text, className = '' }: RandomizeTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isRandomizing, setIsRandomizing] = useState(false);

    // Characters to use for randomization
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    useEffect(() => {
        // Trigger randomization effect
        setIsRandomizing(true);

        let counter = 0;
        const maxIterations = text.length; // Make maxIterations equal to text length
        const speed = 50; // ms per iteration

        const randomize = () => {
            if (counter < maxIterations) {
                // Create randomized string
                let randomized = '';
                for (let i = 0; i < text.length; i++) {
                    if (i < counter) {
                        // Keep solved characters
                        randomized += text[i];
                    } else {
                        // Randomize remaining characters
                        randomized += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                }
                setDisplayText(randomized);
                counter++;
                setTimeout(randomize, speed);
            } else {
                // Final state - show the target text
                setDisplayText(text);
                setIsRandomizing(false);
            }
        };

        randomize();
    }, [text]);

    return (
        <div className="relative-container">
            <span className={`${className} ${isRandomizing ? 'text-white' : 'text-white'} z-10`}>
                {displayText}
            </span>
            <span className={`${className} outlined-text  z-30`}>
                {displayText}
            </span>
        </div>
    );
}
