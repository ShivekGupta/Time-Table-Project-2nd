import React, { useState } from 'react';
import { useSecretCode } from '../hooks/useSecretCode.js';
import { audioSynth } from '../utils/audioSynth.js';

export default function Gamification({ isAudioPlaying, onToggleGhostShip }) {
  const [weather, setWeather] = useState('clear'); // 'clear', 'rain', 'snow'

  useSecretCode('ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba', () => {
    onToggleGhostShip();
    if (isAudioPlaying) audioSynth.playSplash();
  });

  useSecretCode('arrr', () => {
    if (isAudioPlaying) audioSynth.playPirateGrowl();
  });

  const toggleWeather = () => {
    setWeather((prev) => {
      if (prev === 'clear') return 'rain';
      if (prev === 'rain') return 'snow';
      return 'clear';
    });
  };

  const getWeatherIcon = () => {
    if (weather === 'rain') return '🌧️ Rain';
    if (weather === 'snow') return '❄️ Snow';
    return '☀️ Clear';
  };

  return (
    <>
      <button
        className="toggle-icon-btn has-tooltip"
        onClick={toggleWeather}
        data-tooltip="Toggle Weather"
      >
        {getWeatherIcon()}
      </button>

      {weather !== 'clear' && (
        <div className={`weather-overlay ${weather}-effect`}></div>
      )}
    </>
  );
}
