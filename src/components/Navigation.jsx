import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Index' },
    { path: '/about', label: 'Profile' },
    { path: '/projects', label: 'Work' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-8 flex justify-between items-center mix-blend-difference"
    >
      <Link to="/" className="text-2xl font-bold tracking-tighter text-white group overflow-hidden">
        <motion.span 
          className="inline-block"
          whileHover={{ y: -25 }}
          transition={{ duration: 0.3 }}
        >
          <span className="block">BN</span>
          <span className="block text-cyan-400">BN</span>
        </motion.span>
      </Link>

      <div className="flex gap-8">
        {links.map((link) => (
          <Link key={link.path} to={link.path} className="relative group overflow-hidden">
            <motion.div
              className="flex flex-col text-sm font-medium tracking-wide uppercase"
              whileHover={{ y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <span className={`block ${location.pathname === link.path ? 'text-cyan-400' : 'text-white'}`}>
                {link.label}
              </span>
              <span className="block text-cyan-400 absolute top-5">
                {link.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;