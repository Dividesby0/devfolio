import React from 'react';
import { motion } from 'framer-motion';

const BackgroundMesh = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Primary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-cyan-900/20 blur-[120px]"
      />
      
      {/* Secondary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -60, 0],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-[20%] right-[0%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[120px]"
      />

      {/* Tertiary Blob */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[100px]"
      />
    </div>
  );
};

export default BackgroundMesh;