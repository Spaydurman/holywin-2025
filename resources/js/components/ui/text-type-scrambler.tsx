import React, { useEffect, useState } from "react";

interface TextTypeScramblerProps {
  text: string | string[]; // can accept a single string or multiple
  speed?: number; // typing speed (ms per character)
  scrambleSpeed?: number; // scramble effect speed (ms)
  onComplete?: () => void;
  className?: string;
  isActive?: boolean; // whether the animation should be active
}

const randomChars = "!<>-_\\/[]{}—=+*^?#________";

const TextTypeScrambler: React.FC<TextTypeScramblerProps> = ({
  text,
  speed = 100,
  scrambleSpeed = 30,
  onComplete,
  className,
  isActive = true, // default to true to maintain current behavior
}) => {
  const texts = Array.isArray(text) ? text : [text];
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Only run the animation if the component is active
    if (!isActive) return;

    // Reset completion state when becoming active
    setIsCompleted(false);

    let scrambleInterval: NodeJS.Timeout;
    let typingTimeout: NodeJS.Timeout;

    const currentText = texts[lineIndex] || "";

    if (charIndex < currentText.length) {
      // Scramble current character
      scrambleInterval = setInterval(() => {
        const scrambled =
          currentText.slice(0, charIndex) +
          randomChars[Math.floor(Math.random() * randomChars.length)];
        setLines((prev) => {
          const updated = [...prev];
          updated[lineIndex] = scrambled;
          return updated;
        });
      }, scrambleSpeed);

      // Reveal actual character
      typingTimeout = setTimeout(() => {
        clearInterval(scrambleInterval);
        setLines((prev) => {
          const updated = [...prev];
          updated[lineIndex] = currentText.slice(0, charIndex + 1);
          return updated;
        });
        setCharIndex((prev) => prev + 1);
      }, speed);
    } else if (lineIndex < texts.length - 1) {
      // move to next line
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
      setLines((prev) => [...prev, ""]);
    } else {
      // done typing all lines
      if (onComplete) onComplete();
      setIsCompleted(true);
    }

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(typingTimeout);
    };
  }, [charIndex, lineIndex, texts, speed, scrambleSpeed, onComplete, isActive]);

  // Reset the scrambler when the component becomes active again after being completed
  useEffect(() => {
    if (isActive) {
      // Reset completely when animation was completed and component becomes active again
      setLineIndex(0);
      setCharIndex(0);
      setLines([""]);
      setIsCompleted(false);
    }
  }, [isActive]);

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};

export default TextTypeScrambler;
