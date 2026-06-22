import { useState, useEffect } from 'react';

export const useSecretCode = (secretCode, callback) => {
  useEffect(() => {
    let inputBuffer = '';

    const handleKeyDown = (e) => {
      // Add key to buffer
      inputBuffer += e.key;

      // Keep buffer length to a reasonable maximum to save memory
      if (inputBuffer.length > 50) {
        inputBuffer = inputBuffer.slice(-50);
      }

      // Check if buffer ends with the secret code
      if (inputBuffer.endsWith(secretCode)) {
        callback();
        inputBuffer = ''; // Reset after triggering
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [secretCode, callback]);
};
