import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const useCryptoReveal = (text, duration = 2000) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let startTime;
    let animationFrameId;
    const length = text.length;
    
    // Initial state: random characters matching length
    const initialRandom = Array(length).fill(0).map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
    setDisplayText(initialRandom);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Calculate how many characters should be "resolved" based on progress
      const resolveIndex = Math.floor(progress * length);
      
      let currentText = '';
      for (let i = 0; i < length; i++) {
        if (i < resolveIndex) {
          // Resolved characters
          currentText += text[i];
        } else {
          // Scrambled characters for the rest
          currentText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      setDisplayText(currentText);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, duration]);

  return displayText;
};