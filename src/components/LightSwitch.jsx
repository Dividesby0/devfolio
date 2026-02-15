import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';

const LightSwitch = ({ className = "" }) => {
  const [targetBrightness, setTargetBrightness] = useState(0); 
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  // Physics for the brightness value - heavy damping for a "weighted" physical feel
  const brightness = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1
  });

  // Independent motion value for the flicker effect
  const flicker = useMotionValue(1);

  // Sync React state to Framer Motion spring
  useEffect(() => {
    brightness.set(targetBrightness);
  }, [targetBrightness, brightness]);

  // Flicker Logic: Only active at very low brightness (0.01 - 0.25)
  useEffect(() => {
    let timeoutId;
    let isActive = true;

    const loop = () => {
      if (!isActive) return;
      const currentB = brightness.get();

      // "Unstable" zone
      if (currentB > 0.01 && currentB < 0.25) {
        if (Math.random() > 0.6) {
          // Quick dip in opacity
          const dip = 0.5 + Math.random() * 0.4; 
          flicker.set(dip);
          setTimeout(() => { if (isActive) flicker.set(1); }, 50 + Math.random() * 100);
        }
      } else {
        flicker.set(1);
      }
      timeoutId = setTimeout(loop, 150 + Math.random() * 300);
    };

    loop();
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [brightness, flicker]);

  // Event Listeners for Scroll and Touch
  // We attach these manually to ensure 'passive: false' which allows us to prevent default page scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Trackpad / Mouse Wheel Handler
    const handleWheel = (e) => {
      e.preventDefault(); 
      e.stopPropagation();

      const sensitivity = 0.001; // Fine control
      const delta = -e.deltaY * sensitivity;

      setTargetBrightness((prev) => {
        const next = prev + delta;
        return Math.max(0, Math.min(1, next));
      });
    };

    // Touch Handlers for Mobile/Tablet
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // CRITICAL: Prevent default browser scrolling while interacting with the switch
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();

      const currentY = e.touches[0].clientY;
      const delta = touchStartY.current - currentY; // Up is positive (increase brightness)
      const sensitivity = 0.003; // Adjusted for touch feel
      
      setTargetBrightness((prev) => {
        const next = prev + (delta * sensitivity);
        return Math.max(0, Math.min(1, next));
      });
      
      // Update start position for smooth "dragging" feel rather than absolute mapping
      touchStartY.current = currentY; 
    };

    // Add listeners with passive: false to enable preventDefault()
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // --- Visual Transforms ---

  // Final Output Opacity = Brightness Level * Flicker Factor
  const finalOpacity = useTransform([brightness, flicker], ([b, f]) => b * f);
  
  // Filament Color: Cool grey when off -> Hot Orange -> Bright White
  const filamentColor = useTransform(
    finalOpacity,
    [0, 0.2, 1],
    ["#333", "#ff6b00", "#ffffff"]
  );

  const filamentGlowColor = useTransform(
    finalOpacity,
    [0, 0.4, 1],
    ["rgba(0,0,0,0)", "rgba(255, 100, 0, 0.3)", "rgba(255, 220, 150, 0.6)"]
  );

  // Bulb Glass Surface Glow
  const glassSurfaceOpacity = useTransform(finalOpacity, [0, 1], [0.1, 0.9]);
  
  // Bulb Glow (Atmosphere/Halo)
  const bulbGlowOpacity = useTransform(finalOpacity, [0, 1], [0, 0.95]);
  const bulbGlowScale = useTransform(finalOpacity, [0, 1], [0.8, 1.8]);

  // --- Wheel Animation ---
  const wheelTextureY = useTransform(brightness, [0, 1], ["0px", "-150px"]);
  const wheelHighlightY = useTransform(brightness, [0, 1], ["0%", "30%"]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center justify-start pt-0 lg:pt-20 w-48 h-[500px] lg:h-[600px] select-none cursor-grab active:cursor-grabbing group perspective-[1000px] touch-none ${className}`}
      aria-label="Light Control System"
    >
      {/* 1. Hanging Cord */}
      <div className="absolute top-0 w-[2px] h-12 lg:h-20 bg-gradient-to-b from-transparent via-neutral-500 to-neutral-800 dark:via-neutral-400 dark:to-neutral-900 shadow-sm" />

      {/* 2. The Realistic Bulb Assembly */}
      <div className="relative z-10 flex flex-col items-center mt-12 lg:mt-20 pointer-events-none">
        
        {/* Socket (Metal Base) */}
        <div className="w-10 h-12 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 rounded-sm border-t border-b border-neutral-900 shadow-lg flex flex-col items-center justify-end pb-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="w-full h-[1px] bg-neutral-900/50 mb-1" />
          <div className="w-full h-[1px] bg-neutral-900/50 mb-1" />
          <div className="w-full h-[1px] bg-neutral-900/50 mb-1" />
        </div>

        {/* The Glass Bulb */}
        <div className="relative -mt-1">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-200/40 dark:bg-amber-100/30 blur-[70px] pointer-events-none mix-blend-screen"
            style={{ 
              opacity: bulbGlowOpacity,
              scale: bulbGlowScale
            }}
          />

          <svg 
            width="100" 
            height="140" 
            viewBox="0 0 100 140" 
            className="drop-shadow-2xl overflow-visible"
          >
            <defs>
              <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="85%" stopColor="rgba(200,200,200,0.1)" />
                <stop offset="100%" stopColor="rgba(100,100,100,0.2)" />
              </radialGradient>
              
              <radialGradient id="litGlassGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(255,255,240,0.9)" />
                <stop offset="40%" stopColor="rgba(255,220,150,0.5)" />
                <stop offset="100%" stopColor="rgba(255,200,100,0.1)" />
              </radialGradient>

              <filter id="filamentGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <path 
              d="M32,0 L68,0 C68,0 72,5 72,15 C72,25 95,45 95,85 C95,115 75,138 50,138 C25,138 5,115 5,85 C5,45 28,25 28,15 C28,5 32,0 32,0 Z" 
              fill="url(#glassGrad)"
              stroke="rgba(100,100,100,0.3)" 
              strokeWidth="1.5"
              className="dark:stroke-white/20"
            />

            <motion.path 
              d="M32,0 L68,0 C68,0 72,5 72,15 C72,25 95,45 95,85 C95,115 75,138 50,138 C25,138 5,115 5,85 C5,45 28,25 28,15 C28,5 32,0 32,0 Z" 
              fill="url(#litGlassGrad)"
              stroke="none"
              style={{ opacity: glassSurfaceOpacity }}
            />
            
            <path 
              d="M35,30 Q20,50 20,80" 
              fill="none" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth="3" 
              strokeLinecap="round"
              filter="blur(1px)"
            />
            <ellipse cx="65" cy="50" rx="4" ry="8" fill="rgba(255,255,255,0.5)" filter="blur(2px)" transform="rotate(-15 65 50)" />

            <path d="M45,0 L45,40" stroke="rgba(100,100,100,0.5)" strokeWidth="2" />
            <path d="M55,0 L55,40" stroke="rgba(100,100,100,0.5)" strokeWidth="2" />
            <path d="M45,40 L35,60" stroke="rgba(100,100,100,0.5)" strokeWidth="1" />
            <path d="M55,40 L65,60" stroke="rgba(100,100,100,0.5)" strokeWidth="1" />

            <motion.path 
              d="M35,60 C38,55 42,65 44,60 C46,55 48,65 50,60 C52,55 54,65 56,60 C58,55 62,65 65,60"
              fill="none"
              stroke={filamentColor}
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#filamentGlow)"
              style={{
                filter: useMotionTemplate`drop-shadow(0 0 8px ${filamentGlowColor})`
              }}
            />
          </svg>
        </div>
      </div>

      {/* 3. Connecting Wire (Bulb to Switch) */}
      <div className="w-[1.5px] h-32 bg-neutral-400/50 dark:bg-neutral-600/30 my-0 relative pointer-events-none">
         <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      {/* 4. Realistic 3D Scroll Wheel Control */}
      <div className="relative group/wheel pointer-events-auto">
        <div className="w-16 h-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl shadow-2xl border border-white/50 dark:border-white/10 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none rounded-xl" />
          
          <div className="w-10 h-24 relative overflow-hidden rounded-sm">
            <motion.div 
              className="absolute inset-0 bg-neutral-800"
              style={{
                backgroundPosition: useMotionTemplate`center ${wheelTextureY}`,
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(60,60,60,0) 20%, rgba(60,60,60,0) 80%, rgba(0,0,0,0.9) 100%),
                  repeating-linear-gradient(
                    0deg, 
                    rgba(0,0,0,0) 0px, 
                    rgba(0,0,0,0) 4px, 
                    rgba(0,0,0,0.8) 5px, 
                    rgba(255,255,255,0.1) 6px, 
                    rgba(0,0,0,0) 7px
                  )
                `,
                backgroundSize: '100% 100%, 100% 8px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10 pointer-events-none" />
            <motion.div 
              className="absolute left-0 right-0 h-4 bg-white/10 blur-[2px] z-10" 
              style={{ top: '45%', y: wheelHighlightY }}
            />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-80">
          <motion.div 
            className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            style={{ opacity: useTransform(brightness, [0, 0.1], [0, 1]) }}
          />
        </div>

        <motion.div 
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-neutral-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        >
          BRIGHTNESS
        </motion.div>
      </div>

      <div className="w-[1px] h-20 bg-gradient-to-b from-neutral-400/20 to-transparent dark:from-neutral-600/20 pointer-events-none" />
    </div>
  );
};

export default LightSwitch;