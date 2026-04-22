'use client';
import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Sample Royalty-Free Ambient Track */}
            <audio
                ref={audioRef}
                loop
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            <button
                onClick={toggleMusic}
                className={`p-3 rounded-full shadow-2xl backdrop-blur-md transition-all duration-500 flex items-center justify-center ${isPlaying
                        ? 'bg-blue-600/80 text-white scale-110'
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
                    } border border-white/20`}
            >
                {isPlaying ? (
                    <Volume2 className="w-5 h-5 animate-pulse" />
                ) : (
                    <VolumeX className="w-5 h-5" />
                )}
                <span className={`overflow-hidden transition-all duration-500 whitespace-nowrap font-bold text-xs ${isPlaying ? 'max-w-xs ml-2 pr-1' : 'max-w-0'}`}>
                    Ambience On
                </span>
            </button>
        </div>
    );
};

export default BackgroundMusic;
