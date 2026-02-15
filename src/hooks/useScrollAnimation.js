import { useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const useScrollAnimation = (options = {}) => {
  const { 
    threshold = 0.1, 
    once = true, 
    margin = "-50px" 
  } = options;

  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold,
    margin 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return { ref, controls, isInView };
};