import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const GradientBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Subtle colors for light mode, slightly more vibrant for dark mode
  const glowColor = isDark ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.15)'; 
  const secondaryGlow = isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(192, 132, 252, 0.15)';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500 bg-background">
      {/* Dynamic Cursor Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 50%)`
        }}
      />
      
      {/* Static ambient blob top right */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-pulse"
        style={{ background: secondaryGlow }}
      />
      
      {/* Static ambient blob bottom left */}
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 animate-pulse"
        style={{ background: glowColor, animationDuration: '4s' }}
      />
    </div>
  );
};

export default GradientBackground;