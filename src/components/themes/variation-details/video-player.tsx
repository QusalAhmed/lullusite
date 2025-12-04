'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
    const [muted, setMuted] = useState(true);
    const [playing, setPlaying] = useState(false);
    const hasInteracted = useRef(false);

    useEffect(() => {
        const handleUserInteraction = () => {
            if (!hasInteracted.current) {
                hasInteracted.current = true;
                setMuted(false);
                setPlaying(true);
            }
        };

        // Listen for various user interactions
        const events = ['click', 'touchstart', 'keydown', 'mousemove'];
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
    }, []);

    return (
        <div className={'flex justify-center items-center my-8 px-4'}>
            <div className={'w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden'}>
                <ReactPlayer
                    src='https://www.youtube.com/watch?v=LXb3EKWsInQ'
                    playing={playing}
                    controls
                    loop
                    muted={muted}
                    width='100%'
                    height='100%'
                />
            </div>
        </div>
    );
};

export default VideoPlayer;