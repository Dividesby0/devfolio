import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ opacity }}
      className={`min-h-[80vh] flex flex-col md:flex-row items-center gap-10 md:gap-20 py-20 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
      <div className="w-full md:w-1/2">
        <motion.div style={{ y }} className="relative overflow-hidden rounded-xl aspect-[4/3] group">
          <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500" />
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
      </div>

      <div className="w-full md:w-1/2 space-y-8">
        <div className="space-y-4">
          <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase">0{index + 1} / Featured Project</span>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">{project.title}</h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 border border-white/10 rounded-full text-sm text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-6 pt-4">
          <a 
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm font-bold group"
          >
            Live Demo 
            <ExternalLink className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors uppercase tracking-widest text-sm font-bold group"
          >
            GitHub
            <Github className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsPage = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory management, secure payment processing, and advanced analytics dashboard. Built with modern technologies for optimal performance.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      github: 'https://github.com/Blessed120',
      demo: 'https://demo.com'
    },
    {
      title: 'Task Management System',
      description: 'Collaborative project management tool featuring real-time collaboration, kanban boards, Gantt charts, and team analytics. Designed for agile teams with seamless workflow integration.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
      tags: ['Vue.js', 'Express', 'MongoDB', 'Socket.io', 'Docker'],
      github: 'https://github.com/Blessed120',
      demo: 'https://demo.com'
    },
    {
      title: 'Social Media Analytics',
      description: 'Advanced analytics platform that aggregates data from multiple social media platforms, providing actionable insights through interactive visualizations and AI-powered recommendations.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      tags: ['Next.js', 'Python', 'FastAPI', 'Redis', 'TensorFlow'],
      github: 'https://github.com/Blessed120',
      demo: 'https://demo.com'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Projects - Blessed Nkengafac</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-40 px-6 md:px-20 min-h-screen"
      >
        <div className="max-w-[1600px] mx-auto">
           <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.6, 0.05, -0.01, 0.9] }}
              className="text-[10vw] font-bold leading-none tracking-tighter mb-32"
            >
              SELECTED<br/>WORKS
            </motion.h1>

          <div className="space-y-20">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
          
          <div className="py-40 text-center">
            <h3 className="text-2xl font-bold mb-4">Want to see more?</h3>
            <a 
              href="https://github.com/Blessed120" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block border-b border-white hover:border-cyan-400 hover:text-cyan-400 transition-all pb-1 text-xl"
            >
              Visit my GitHub Archive
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectsPage;