import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Card3D = ({ title, items, index }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative group h-full"
    >
      <div style={{ transform: "translateZ(50px)" }}>
        <h3 className="text-2xl font-bold mb-6 text-cyan-400">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Glow effect */}
      <motion.div
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${useTransform(x, [-0.5, 0.5], ['0%', '100%'])} ${useTransform(y, [-0.5, 0.5], ['0%', '100%'])}, rgba(34, 211, 238, 0.15), transparent 80%)`
        }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </motion.div>
  );
};

const ExperienceItem = ({ year, title, company, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pl-12 py-8 border-l border-white/10 group"
    >
      <div className="absolute left-[-5px] top-10 w-2.5 h-2.5 rounded-full bg-slate-800 group-hover:bg-cyan-400 transition-colors duration-300" />
      <span className="text-sm font-mono text-cyan-400 mb-2 block">{year}</span>
      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <h4 className="text-lg text-slate-400 mb-4">{company}</h4>
      <p className="text-slate-400 leading-relaxed max-w-2xl">{description}</p>
    </motion.div>
  );
};

const AboutPage = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <>
      <Helmet>
        <title>About - Blessed Nkengafac</title>
      </Helmet>

      <motion.div 
        className="pt-32 px-6 md:px-20 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ scale }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <section className="mb-32">
            <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.6, 0.05, -0.01, 0.9] }}
              className="text-[10vw] font-bold leading-none tracking-tighter mb-10"
            >
              PROFILE
            </motion.h1>
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
                I'm Blessed Nkengafac, a <strong className="text-foreground font-semibold">Quality Engineer at Cyberweaponz</strong>, a military-grade private equipment research company, and Software Engineering graduate from UT Arlington. 
                I'm also an active cryptographic researcher and participate in bug bounty programs including <strong className="text-foreground font-semibold">Google's Bug Presearch program</strong> and <strong className="text-foreground font-semibold">HackerOne</strong>. 
                What drives me is the deep desire to understand how intelligent non-human systems work, bridging robust engineering and fluid interactive design, creating digital products 
                that feel alive.
              </p>
              <div className="flex gap-4 flex-wrap">
                 {[
                  { label: "Github", link: "https://github.com/Blessed120" },
                  { label: "LinkedIn", link: "https://www.linkedin.com/in/blessed-n-284629279/" },
                  { label: "Email", link: "mailto:brnkeng04@gmail.com" }
                ].map((item) => (
                  <a 
                    key={item.label}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {item.label} <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* 3D Skill Cards */}
          <section className="mb-32">
            <h2 className="text-4xl font-bold mb-16 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-cyan-400" />
              Technical Arsenal
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card3D 
                title="Languages" 
                items={['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C++']} 
                index={0}
              />
              <Card3D 
                title="Frameworks" 
                items={['React', 'Node.js', 'Spring Boot', 'Next.js', 'TailwindCSS']} 
                index={1}
              />
              <Card3D 
                title="Infrastructure" 
                items={['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux']} 
                index={2}
              />
            </div>
          </section>

          {/* Experience */}
          <section className="mb-32">
            <h2 className="text-4xl font-bold mb-16 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-cyan-400" />
              Experience
            </h2>
            <div className="max-w-4xl">
              <ExperienceItem 
                year="Current"
                title="Quality Engineer"
                company="Cyberweaponz"
                description="Spearheading automated testing frameworks for cloud security compliance solutions. Ensuring 99.9% system reliability through rigorous QA strategies at a military-grade private equipment research company."
              />
              <ExperienceItem 
                year="May 2025 - Sep 2025"
                title="Software Engineer Intern"
                company="Kelly Services"
                description="Architected internal tools that boosted team productivity by 30%. Collaborated with senior engineers on full-stack feature implementation."
              />
              <ExperienceItem 
                year="Feb 2021 - Feb 2025"
                title="Senior Tech Support Engineer"
                company="Kelly Services (Apple)"
                description="Managed critical enterprise systems for high-value clients, maintaining strict SLAs and resolving complex technical escalations."
              />
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default AboutPage;