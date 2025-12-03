import { motion } from 'framer-motion';

export const FluidBackground = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
            {/* Deep Blue Blob */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[100px]"
            />

            {/* Purple Blob */}
            <motion.div
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[120px]"
            />

            {/* Indigo/Accent Blob */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-indigo-800/15 rounded-full blur-[90px]"
            />
        </div>
    );
};
