'use client';

import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="progress-container">
      <motion.div
        className="progress-bar"
        initial={{ width: '20%', x: '-200px' }}
        animate={{
          x: ['-200px', '100vw'],
          width: ['20%', '60%', '20%'],
        }}
        transition={{
          duration: 1.25,
          ease: 'easeInOut',
          times: [0, 1],
          repeat: Infinity,
          repeatDelay: 0,
        }}
      />
    </div>
  );
}
