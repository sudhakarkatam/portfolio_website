import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypewriterEffectProps {
    words: string[];
    className?: string;
    cursorClassName?: string;
}

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
}: TypewriterEffectProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const word = words[currentWordIndex];
        const typeSpeed = isDeleting ? 50 : 100;
        const delay = isDeleting ? 0 : 1500; // Pause at end of word

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                setCurrentText(word.substring(0, currentText.length + 1));
                if (currentText.length === word.length) {
                    setTimeout(() => setIsDeleting(true), delay);
                }
            } else {
                // Deleting
                setCurrentText(word.substring(0, currentText.length - 1));
                if (currentText.length === 0) {
                    setIsDeleting(false);
                    setCurrentWordIndex((prev) => (prev + 1) % words.length);
                }
            }
        }, typeSpeed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words]);

    return (
        <div className={`inline-flex items-center ${className}`}>
            <span>{currentText}</span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className={`ml-1 inline-block w-[2px] h-[1em] bg-primary ${cursorClassName}`}
            />
        </div>
    );
};
