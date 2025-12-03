import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface DeepWorkPlayerProps {
    onToggle: (isPlaying: boolean) => void;
}

import codingMusic from "@/assets/lofi-chill-study-_-coding-_-focus-beats-002-440477.mp3";
import concentrationMusic from "@/assets/concentration-music-for-studying-and-memorizingmeditation-sleep-150326.mp3";

export const DeepWorkPlayer = ({ onToggle }: DeepWorkPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState([0.5]);
    const [showControls, setShowControls] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const tracks = [
        { title: "Lofi Study", src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112762.mp3" },
        { title: "Focus Flow", src: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-beat-140866.mp3" },
        { title: "Deep Concentration", src: concentrationMusic },
        { title: "Coding Mode", src: codingMusic },
        { title: "Ambient Study", src: "https://cdn.pixabay.com/download/audio/2023/02/28/audio_550d815fa5.mp3?filename=mel-spectrogram.mp3" }
    ];

    useEffect(() => {
        audioRef.current = new Audio(tracks[currentTrackIndex].src);
        audioRef.current.volume = volume[0];

        const handleEnded = () => {
            playNextTrack();
        };

        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current = null;
            }
        };
    }, []);

    // Handle track changes
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.src = tracks[currentTrackIndex].src;
            audioRef.current.volume = isMuted ? 0 : volume[0];
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Play failed:", e));
            }
        }
    }, [currentTrackIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume[0];
        }
    }, [volume, isMuted]);

    const playNextTrack = () => {
        if (isShuffle) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * tracks.length);
            } while (nextIndex === currentTrackIndex && tracks.length > 1);
            setCurrentTrackIndex(nextIndex);
        } else {
            setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }

        setIsPlaying(!isPlaying);
        onToggle(!isPlaying);
    };

    return (
        <div
            className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl w-72 mb-2 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white/90 uppercase tracking-widest">Deep Work</span>
                                {isPlaying && (
                                    <div className="flex gap-0.5 items-end h-3">
                                        {[1, 2, 3].map((i) => (
                                            <motion.div
                                                key={i}
                                                className="w-1 bg-primary rounded-full"
                                                animate={{ height: [4, 12, 4] }}
                                                transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setIsShuffle(!isShuffle)}
                                    className={`p-1.5 rounded-full transition-all ${isShuffle ? "bg-primary text-white" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
                                    title="Shuffle"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l14.2-12.6c.8-1.1 2-1.7 3.3-1.7H22" /><path d="M2 5h1.4c1.3 0 2.5.6 3.3 1.7l14.2 12.6c.8 1.1 2 1.7 3.3 1.7H22" /></svg>
                                </button>
                                <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-all">
                                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Track List */}
                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar mb-4">
                            {tracks.map((track, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => {
                                        setCurrentTrackIndex(index);
                                        if (!isPlaying) togglePlay();
                                    }}
                                    whileHover={{ scale: 1.02, x: 2 }}
                                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${currentTrackIndex === index
                                        ? "bg-white/10 border border-white/5 shadow-inner"
                                        : "hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentTrackIndex === index ? "bg-primary text-white" : "bg-white/5 text-white/30"}`}>
                                        {currentTrackIndex === index && isPlaying ? (
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                                                <Pause size={12} fill="currentColor" />
                                            </motion.div>
                                        ) : (
                                            <Play size={12} fill="currentColor" className="ml-0.5" />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className={`text-xs font-medium truncate w-full ${currentTrackIndex === index ? "text-white" : "text-white/70"}`}>
                                            {track.title}
                                        </span>
                                        <span className="text-[10px] text-white/40">Lofi Series</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>

                        {/* Volume Slider */}
                        <div className="px-1">
                            <Slider
                                value={volume}
                                max={1}
                                step={0.01}
                                onValueChange={setVolume}
                                className="w-full"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ${isPlaying
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-primary/40"
                    : "bg-white dark:bg-gray-800 text-muted-foreground hover:text-primary"
                    }`}
                onClick={togglePlay}
            >
                {/* Pulsing Ring when playing */}
                {isPlaying && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full border border-white/30"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-white/20"
                            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        />
                    </>
                )}

                <div className="relative z-10 flex items-center justify-center">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Headphones size={24} />}
                </div>
            </motion.button>
        </div>
    );
};
