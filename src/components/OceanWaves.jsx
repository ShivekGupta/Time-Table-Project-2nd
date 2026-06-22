import React from 'react';

const OceanWaves = () => {
  return (
    <div className="ocean-waves-container">
      <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          {/* Wave layers using the pirate palette with varying opacities */}
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(212, 175, 55, 0.15)" /> {/* Gold tint */}
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(27, 73, 101, 0.4)" /> {/* Nautical Teal */}
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(11, 29, 58, 0.6)" /> {/* Deep Sea Blue */}
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--bg-primary)" /> {/* Base Color */}
        </g>
      </svg>
    </div>
  );
}

export default React.memo(OceanWaves);
