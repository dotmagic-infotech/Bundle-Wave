import React from 'react';

const YoutubeVideo = () => {
    return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
                title="YouTube video player"
                src="https://www.youtube.com/embed/ky2sJ_4x-hk?si=957uqLMhDYuVEktm"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '10px' }}>
            </iframe>
        </div>
    );
};

export default YoutubeVideo;

