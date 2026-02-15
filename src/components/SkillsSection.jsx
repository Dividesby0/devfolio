import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Cloud, Shield, Info, Briefcase, Clock, Layout } from 'lucide-react';

const skillsData = [
  {
    category: "Frontend Engineering",
    icon: Layout,
    colors: {
      text: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-600 dark:bg-sky-400",
      icon: "text-sky-600 dark:text-sky-400"
    },
    skills: [
      { name: "React / Next.js", level: 92, desc: "Building complex SPAs and SSR applications with modern hooks and patterns.", source: "Both", exp: "4 years" },
      { name: "TypeScript", level: 88, desc: "Strict typing for large-scale applications to ensure code quality.", source: "Work", exp: "3 years" },
      { name: "TailwindCSS", level: 95, desc: "Rapid UI development with utility-first CSS and custom configuration.", source: "Work", exp: "3 years" },
      { name: "Framer Motion", level: 85, desc: "Creating complex, physics-based animations and micro-interactions.", source: "Personal", exp: "2 years" }
    ]
  },
  {
    category: "Backend Systems",
    icon: Server,
    colors: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-600 dark:bg-emerald-400",
      icon: "text-emerald-600 dark:text-emerald-400"
    },
    skills: [
      { name: "Node.js", level: 90, desc: "Scalable event-driven microservices and REST APIs.", source: "Work", exp: "4 years" },
      { name: "Java / Spring", level: 85, desc: "Enterprise-grade backend systems and dependency injection architecture.", source: "School", exp: "5 years" },
      { name: "PostgreSQL", level: 88, desc: "Complex queries, optimization, and database design.", source: "Work", exp: "4 years" },
      { name: "Python", level: 82, desc: "Scripting, data processing, and ML integration.", source: "Both", exp: "4 years" }
    ]
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    colors: {
      text: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-600 dark:bg-indigo-400",
      icon: "text-indigo-600 dark:text-indigo-400"
    },
    skills: [
      { name: "Docker / K8s", level: 78, desc: "Containerization and orchestration for production workloads.", source: "Work", exp: "3 years" },
      { name: "AWS Infrastructure", level: 75, desc: "EC2, S3, Lambda, and serverless architecture implementation.", source: "Work", exp: "2 years" },
      { name: "CI/CD Pipelines", level: 85, desc: "Automating build, test, and deployment pipelines (Jenkins/GitHub Actions).", source: "Work", exp: "3 years" }
    ]
  },
  {
    category: "Security",
    icon: Shield,
    colors: {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-600 dark:bg-rose-400",
      icon: "text-rose-600 dark:text-rose-400"
    },
    skills: [
      { name: "OAuth 2.0 / OIDC", level: 82, desc: "Implementing secure authentication and authorization flows.", source: "Work", exp: "3 years" },
      { name: "App Security", level: 75, desc: "OWASP Top 10 mitigation, vulnerability scanning, and security auditing.", source: "Both", exp: "2 years" }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const ProficiencyDots = ({ level, bgClass }) => {
  const activeDots = Math.round((level / 100) * 5);
  const dots = Array.from({ length: 5 }, (_, i) => i < activeDots);

  return (
    <div className="flex gap-1.5 mt-2">
      {dots.map((isActive, i) => (
        <div 
          key={i} 
          className={`h-1.5 w-6 rounded-full transition-all duration-500 ${isActive ? bgClass : 'bg-secondary dark:bg-secondary/40'}`}
        />
      ))}
    </div>
  );
};

const SkillCard = ({ skill, colors }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  return (
    <motion.div 
      variants={cardVariants}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-card hover:bg-card/80 dark:bg-card/50 dark:hover:bg-card border border-border/60 hover:border-primary/20 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-sm text-foreground">{skill.name}</span>
          <span className="text-xs font-mono text-muted-foreground">{skill.level}%</span>
        </div>
        
        <ProficiencyDots level={skill.level} bgClass={colors.bg} />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} animate-pulse`} />
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 right-0 bottom-full mb-3 p-4 bg-popover border border-border rounded-xl shadow-xl text-left ring-1 ring-black/5"
            style={{ width: '100%', minWidth: '240px' }} 
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/50">
               <h4 className="font-bold text-popover-foreground text-sm">{skill.name}</h4>
               <span className={`text-[10px] font-mono ${colors.text}`}>{skill.level}% Mastery</span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {skill.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-2">
               <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded">
                  <Briefcase className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Src: <span className="text-foreground font-medium">{skill.source}</span>
                  </span>
               </div>
               <div className="flex items-center gap-2 bg-secondary/50 p-1.5 rounded">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Exp: <span className="text-foreground font-medium">{skill.exp}</span>
                  </span>
               </div>
            </div>

            <div className="absolute bottom-0 left-6 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-border"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SkillsSection = () => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {skillsData.map((category, idx) => (
          <motion.div
            key={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="space-y-4"
          >
            <motion.div variants={cardVariants} className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-secondary border border-border/50`}>
                 <category.icon className={`w-5 h-5 ${category.colors.icon}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.skills.map((skill, skillIdx) => (
                <SkillCard 
                  key={skillIdx} 
                  skill={skill} 
                  colors={category.colors} 
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mt-12"
      >
         <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
            <Info className="w-4 h-4 opacity-70" />
            <span>Hover over any skill card for 2 seconds to view detailed experience metrics</span>
         </div>
      </motion.div>
    </div>
  );
};

export default SkillsSection;