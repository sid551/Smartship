// src/components/BackgroundVideo.jsx
import React from "react";
import "../styles/BackgroundVideo.css";

function BackgroundVideo() {
  return (
    <video className="bg-video" autoPlay loop muted playsInline>
      <source
        src={
          import.meta.env.VITE_BACKGROUND_VIDEO_URL ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
}

export default BackgroundVideo;
