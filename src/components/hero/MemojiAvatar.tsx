import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import memojiImage from "@/assets/memoji-technologist.png";

interface MemojiAvatarProps {
    state?: "idle" | "thinking" | "speaking" | "happy";
    sentiment?: "neutral" | "happy" | "sad" | "excited";
    isMusicPlaying?: boolean;
}

export const MemojiAvatar = ({ state = "idle", sentiment = "neutral", isMusicPlaying = false }: MemojiAvatarProps) => {
    // High-quality Memoji (Locally hosted for reliability)
    const memojiUrl = memojiImage;

    const [internalState, setInternalState] = useState(state);
    const [idleAnimation, setIdleAnimation] = useState<"none" | "bounce" | "look" | "tilt">("none");
    const [message, setMessage] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const lastInteraction = useRef(Date.now());
    const messageTimer = useRef<NodeJS.Timeout | null>(null);

    // Initial Greeting based on time
    useEffect(() => {
        const hour = new Date().getHours();
        let greeting = "Hi! 👋";
        if (hour < 12) greeting = "Good Morning! ☀️";
        else if (hour < 18) greeting = "Good Afternoon! 🌤️";
        else greeting = "Good Evening! 🌙";

        // Show greeting on mount
        showMessage(greeting, 4000, "low");
    }, []);

    // Sync internal state with props
    useEffect(() => {
        setInternalState(state);
    }, [state]);

    // React to sentiment changes
    useEffect(() => {
        if (sentiment === "happy" || sentiment === "excited") {
            setInternalState("happy");
            const timer = setTimeout(() => setInternalState("idle"), 3000);
            return () => clearTimeout(timer);
        }
    }, [sentiment]);

    // --- Message System ---
    const showMessage = (text: string, duration: number = 2000, priority: "low" | "high" = "high") => {
        // Don't override high priority messages with low priority ones (e.g. hover shouldn't hide click message)
        if (priority === "low" && messageTimer.current) return;

        if (messageTimer.current) clearTimeout(messageTimer.current);

        setMessage(text);

        if (duration > 0) {
            messageTimer.current = setTimeout(() => {
                setMessage(null);
                messageTimer.current = null;
            }, duration);
        }
    };

    // --- Idle "Living Breath" System ---
    useEffect(() => {
        const idleChecker = setInterval(() => {
            const timeSinceInteraction = Date.now() - lastInteraction.current;

            // Only trigger idle animations if inactive for > 4 seconds
            // AND not currently interacting (hovering/dragging)
            if (timeSinceInteraction > 4000 && internalState === "idle" && idleAnimation === "none" && !isHovered && !isDragging && !isMusicPlaying) {
                triggerRandomIdleAnimation();
            }
        }, 1000);

        return () => clearInterval(idleChecker);
    }, [internalState, idleAnimation, isHovered, isDragging, isMusicPlaying]);

    const triggerRandomIdleAnimation = () => {
        const animations = ["bounce", "look", "tilt"] as const;
        const randomAnim = animations[Math.floor(Math.random() * animations.length)];
        setIdleAnimation(randomAnim);

        setTimeout(() => {
            setIdleAnimation("none");
            // Don't reset lastInteraction here, let the user break the cycle
        }, 2000);
    };

    // --- Mouse Parallax Logic ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 250, damping: 15 }); // Snappy
    const mouseY = useSpring(y, { stiffness: 250, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-20deg", "20deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        lastInteraction.current = Date.now();

        // Instant interruption of idle animation
        if (idleAnimation !== "none") {
            setIdleAnimation("none");
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = (e.clientX - rect.left) / width - 0.5;
        const mouseYPos = (e.clientY - rect.top) / height - 0.5;

        x.set(mouseXPos);
        y.set(mouseYPos);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        // Don't show "Hi" if music is playing, maybe show "Vibing..."?
        if (isMusicPlaying) {
            showMessage("Vibing... 🎧", 0, "low");
        } else {
            const hour = new Date().getHours();
            let greeting = "Hi! 👋";
            if (hour < 12) greeting = "Good Morning! ☀️";
            else if (hour < 18) greeting = "Good Afternoon! 🌤️";
            else greeting = "Good Evening! 🌙";
            showMessage(greeting, 0, "low");
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);

        // Only clear message if it was the hover message
        if (message?.includes("Hi") || message?.includes("Good") || message?.includes("Vibing")) {
            setMessage(null);
        }
    };

    const handleClick = () => {
        setInternalState("happy");
        lastInteraction.current = Date.now();
        showMessage("Yay! 🎉", 2000, "high");

        setTimeout(() => setInternalState("idle"), 1000);
    };

    // --- Animation Variants ---
    const innerVariants = {
        idle: {
            y: 0,
            rotateZ: 0,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 300, damping: 20 }
        },
        thinking: {
            y: [0, -5, 0],
            rotate: [0, 2, -2, 0],
            transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const }
        },
        happy: {
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5, ease: "easeInOut" as const }
        },
        bounce: {
            y: [0, -15, 0],
            transition: { duration: 0.6, ease: "easeOut" as const }
        },
        look: {
            rotateY: [0, -15, 15, 0],
            transition: { duration: 1.5, ease: "easeInOut" as const }
        },
        tilt: {
            rotateZ: [0, -5, 5, 0],
            transition: { duration: 1, ease: "easeInOut" as const }
        },
        vibe: {
            y: [0, 8, 0],
            rotateZ: [0, 3, -3, 0],
            scale: [1, 1.02, 1],
            transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" as const }
        }
    };

    const getAnimateProp = () => {
        if (internalState === "thinking") return "thinking";
        if (internalState === "happy") return "happy";
        if (isMusicPlaying && !isHovered && !isDragging) return "vibe"; // Vibe to music if not busy
        if (idleAnimation !== "none") return idleAnimation;
        return "idle";
    };

    return (
        <div
            className="relative flex items-center justify-center w-full h-48 md:h-64 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ perspective: 1000 }}
        >
            {/* Background Glow */}
            <motion.div
                className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full blur-[60px]"
                animate={{
                    scale: internalState === "thinking" || isMusicPlaying ? [1, 1.3, 1] : 1,
                    opacity: internalState === "thinking" ? 0.6 : isMusicPlaying ? 0.8 : 0.3,
                    background: internalState === "thinking"
                        ? "rgba(168, 85, 247, 0.3)"
                        : isMusicPlaying
                            ? [
                                "rgba(255, 0, 0, 0.5)",    // Red
                                "rgba(255, 165, 0, 0.5)",  // Orange
                                "rgba(255, 255, 0, 0.5)",  // Yellow
                                "rgba(0, 128, 0, 0.5)",    // Green
                                "rgba(0, 0, 255, 0.5)",    // Blue
                                "rgba(75, 0, 130, 0.5)",   // Indigo
                                "rgba(238, 130, 238, 0.5)", // Violet
                                "rgba(255, 0, 0, 0.5)"     // Back to Red
                            ]
                            : "rgba(59, 130, 246, 0.2)"
                }}
                transition={{
                    repeat: Infinity,
                    duration: isMusicPlaying ? 3 : 2,
                    ease: "linear"
                }}
            />

            {/* 
        WRAPPER: Handles Drag and Parallax (Tilt).
      */}
            <motion.div
                className="relative z-10 w-40 h-40 md:w-52 md:h-52 cursor-grab active:cursor-grabbing drop-shadow-2xl"
                style={{
                    rotateX: internalState === "idle" && idleAnimation === "none" && !isMusicPlaying ? rotateX : 0,
                    rotateY: internalState === "idle" && idleAnimation === "none" && !isMusicPlaying ? rotateY : 0,
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragStart={() => {
                    setIsDragging(true);
                    showMessage("Wheee! 🌀", 0, "high");
                }}
                onDragEnd={() => {
                    setIsDragging(false);
                    setMessage(null);
                    // Restore hover message if still hovered
                    if (isHovered) showMessage(isMusicPlaying ? "Vibing... 🎧" : "Hi! 👋", 0, "low");
                }}
                whileHover={{ scale: 1.05 }}
                whileDrag={{ scale: 1.1 }}
            >
                {/* 
          INNER: Handles State Animations.
        */}
                <motion.div
                    className="w-full h-full"
                    variants={innerVariants}
                    animate={getAnimateProp()}
                >
                    <img
                        src={memojiUrl}
                        alt="Memoji"
                        className="w-full h-full object-contain pointer-events-none"
                    />
                </motion.div>

                {/* Thinking Bubble */}
                <AnimatePresence>
                    {internalState === "thinking" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 60, y: -60 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute top-0 right-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-lg border border-border/50 backdrop-blur-md pointer-events-none"
                        >
                            <div className="flex gap-1.5 items-center justify-center h-full">
                                <motion.span className="w-2 h-2 bg-blue-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                <motion.span className="w-2 h-2 bg-purple-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                <motion.span className="w-2 h-2 bg-pink-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dynamic Message Bubble */}
                <AnimatePresence>
                    {message && internalState !== "thinking" && (
                        <motion.div
                            key="message-bubble"
                            initial={{ opacity: 0, scale: 0, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: -40 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute top-0 right-10 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl rounded-bl-none shadow-lg border border-border/50 backdrop-blur-md pointer-events-none z-20"
                        >
                            <span className="text-sm font-medium whitespace-nowrap">{message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
