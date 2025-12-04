import React from 'react';
import ReactPlayer from 'react-player'

const VideoPlayer = () => {
    return (
        <div className={'flex justify-center items-center my-8'}>
            <ReactPlayer
                src='https://www.youtube.com/watch?v=LXb3EKWsInQ'
                playing
                controls
                loop
                muted
                crossOrigin={'anonymous'}
            />
        </div>
    );
};

export default VideoPlayer;