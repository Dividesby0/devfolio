import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, Linkedin, Mail, ArrowRight, ExternalLink, Phone, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Helmet } from 'react-helmet';
import CicdDemo from '@/components/demos/CicdDemo';
import AnomalyDemo from '@/components/demos/AnomalyDemo';
import CredentialDemo from '@/components/demos/CredentialDemo';
import SkillsSection from '@/components/SkillsSection';
import LightSwitch from '@/components/LightSwitch';
import { useCryptoReveal } from '@/hooks/useCryptoReveal';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Helper Components
const Section = ({ children, id, className = "" }) => (
  <section id={id} className={`py-20 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const GradientText = ({ children, className = "" }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 ${className}`}>
    {children}
  </span>
);

const GradientBar = () => (
  <div className="h-1 w-12 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
);

const CryptoTitle = () => {
  const { text } = useCryptoReveal("Software Engineer");
  
  return (
    <h1 className="text-5xl md:text-7xl font-bold mb-6">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
        {text}
      </span>
    </h1>
  );
};

const HomePage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const projects = [
    {
      id: "cicd",
      title: "CI/CD Pipeline Architecture",
      description: "Automated deployment pipeline reducing release time by 40% with integrated security scanning. Features automated rollback capabilities and real-time build monitoring.",
      tags: ["Jenkins", "Docker", "AWS", "Bash"],
      techBadges: ["DevOps", "Automation", "Cloud"],
      image: <img alt="CI/CD Pipeline Visualization with graphs and server logs" src="https://images.unsplash.com/photo-1572982408141-5444f29ca3ca" className="w-full h-full object-cover" />
    },
    {
      id: "anomaly",
      title: "Anomaly Detection System",
      description: "ML-powered monitoring system for industrial equipment with real-time predictive alerts. Utilizes isolation forests for outlier detection in high-frequency data streams.",
      tags: ["Python", "TensorFlow", "Kafka", "ElasticSearch"],
      techBadges: ["Machine Learning", "Big Data", "Real-time"],
      image: <img alt="Data Anomaly Detection Dashboard" src="https://images.unsplash.com/photo-1586448428670-33f1c28fce94" className="w-full h-full object-cover" />
    },
    {
      id: "credential",
      title: "Secure Credential Generator",
      description: "Enterprise credential management tool with automated rotation and encrypted storage. Compliant with NIST guidelines and features a zero-knowledge architecture.",
      tags: ["React", "Java", "Spring Boot", "PostgreSQL"],
      techBadges: ["Security", "Cryptography", "Full Stack"],
      image: <img alt="Cybersecurity Lock Interface" src="https://images.unsplash.com/photo-1654588836190-d8e6c12122f8" className="w-full h-full object-cover" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Blessed Nkengafac | Software Engineer</title>
        <meta name="description" content="Portfolio of Blessed Nkengafac, a Software Engineer specializing in backend systems, cloud infrastructure, and security." />
      </Helmet>

      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex items-center justify-center pt-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full relative">
          
          {/* Mobile Light Switch - Positioned to the right, scaled appropriately */}
          {/* Text padding in the main content ensures text doesn't overlap */}
          <div className="absolute top-0 right-0 z-40 lg:hidden transform scale-[0.6] sm:scale-75 origin-top-right -mr-2">
             <LightSwitch />
          </div>

          {/* Main Content Column */}
          {/* Added pr-24 sm:pr-32 lg:pr-0 to prevent text from overlapping with the LightSwitch on mobile */}
          <motion.div 
            className="lg:col-span-8 lg:col-start-2 pt-16 lg:pt-0 pr-24 sm:pr-32 lg:pr-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available for new opportunities
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <CryptoTitle />
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Hi, I'm <span className="text-foreground font-semibold">Blessed Nkengafac</span>. What truly drives me is the deep desire to understand how intelligent non-human systems work.
              A Software Engineer specializing in scalable backend systems, cloud architecture, and automated quality assurance. 
              Currently serving as a <strong className="text-foreground font-semibold">Quality Engineer at Cyberweaponz</strong>, a military-grade private equipment research company.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-primary/20 transition-all" asChild>
                <a href="#projects">
                  View My Work <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Link to="/resume">
                <Button size="lg" variant="secondary" className="rounded-full px-8 bg-secondary/80 hover:bg-secondary text-secondary-foreground shadow-sm">
                  <FileText className="mr-2 w-4 h-4" /> View Resume
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm bg-white/50 dark:bg-black/20 border-primary/20 hover:bg-white/80 dark:hover:bg-black/40 text-foreground" asChild>
                <a href="https://github.com/Blessed120" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 w-4 h-4" /> GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm bg-white/50 dark:bg-black/20 border-primary/20 hover:bg-white/80 dark:hover:bg-black/40 text-foreground" asChild>
                <a href="https://www.linkedin.com/in/blessed-n-284629279/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 w-4 h-4" /> LinkedIn
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-4 backdrop-blur-sm bg-white/50 dark:bg-black/20 border-primary/20 hover:bg-white/80 dark:hover:bg-black/40 text-foreground" asChild>
                <a href="https://www.credly.com/badges/c4dc3378-a7fb-44c0-9186-543b8824bab0/linked_in_profile" target="_blank" rel="noopener noreferrer">
                  <img className="mr-2 h-5 w-auto object-contain" alt="Dell Logo" src="https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" /> Dell
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-4 backdrop-blur-sm bg-white/50 dark:bg-black/20 border-primary/20 hover:bg-white/80 dark:hover:bg-black/40 text-foreground" asChild>
                <a href="https://www.credly.com/badges/f26c0ee7-cbf8-4674-949c-fcaa4f156e9a/linked_in?t=t0bz1p" target="_blank" rel="noopener noreferrer">
                  <img className="mr-2 h-5 w-auto object-contain" alt="IBM Logo" src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" /> IBM
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm bg-white/50 dark:bg-black/20 border-primary/20 hover:bg-white/80 dark:hover:bg-black/40 text-foreground" asChild>
                <a href="tel:2406969402">
                  <Phone className="mr-2 w-4 h-4" /> 240-696-9402
                </a>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Light Switch Column - Desktop Only */}
          <motion.div 
            className="hidden lg:flex lg:col-span-2 items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <LightSwitch />
          </motion.div>
        </div>
      </Section>

      {/* About Section */}
      <Section id="about">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <GradientBar />
            <GradientText>About Me</GradientText>
          </h2>
          <div className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden bg-white/80 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-loose mb-6">
              I am a results-driven Software Engineer with a strong foundation in computer science and a passion for engineering excellence. Currently serving as a <strong className="text-foreground font-semibold">Quality Engineer at Cyberweaponz</strong>, a military-grade private equipment research company, I bridge the gap between development and operations by building tools that ensure reliability and security at scale.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-loose mb-6">
              My journey includes impactful roles at <strong className="text-foreground font-semibold">Kelly Services</strong> (Apple Account), where I honed my problem-solving skills in high-pressure enterprise environments. Whether I'm optimizing a CI/CD pipeline or architecting a new microservice, I focus on writing clean, maintainable code that stands the test of time.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-loose">
              I am also an active <strong className="text-foreground font-semibold">cryptographic researcher</strong> and currently enrolled in bug bounty programs including <strong className="text-foreground font-semibold">Google's Bug Presearch program</strong> and <strong className="text-foreground font-semibold">HackerOne</strong>.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* Skills Section */}
      <Section id="skills">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3 text-foreground">
            <GradientBar />
            <GradientText>Technical Expertise</GradientText>
          </h2>
          
          <SkillsSection />
          
        </motion.div>
      </Section>

      {/* Projects Section */}
      <Section id="projects">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-12 flex items-center gap-3 text-foreground">
            <GradientBar />
            <GradientText>Featured Projects</GradientText>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div key={index} variants={cardAnimation} className="h-full">
                <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-card/80 dark:bg-card/40 backdrop-blur-sm group">
                  {/* High Definition Image Area */}
                  <div className="relative h-48 w-full overflow-hidden bg-secondary">
                    <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
                      {project.image}
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 mb-2">
                        {project.techBadges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-[10px] px-2 h-5 font-medium bg-secondary text-secondary-foreground">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors text-foreground">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 bg-secondary/50 rounded text-muted-foreground border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-6">
                    <Button 
                      className="w-full group/btn" 
                      variant="outline"
                      onClick={() => setActiveModal(project.id)}
                    >
                      View Implementation
                      <ExternalLink className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="glass-card rounded-3xl p-8 md:p-16 text-center border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden bg-gradient-to-br from-card to-secondary/20"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100/[0.03] mask-image-b-0" />
          <h2 className="text-4xl font-bold mb-6 relative z-10">
            <GradientText>Ready to collaborate?</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
            I'm currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
            <Button size="lg" className="rounded-full h-14 px-8 text-lg min-w-[200px] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-shadow" asChild>
              <a href="mailto:brnkeng04@gmail.com">
                <Mail className="mr-2 w-5 h-5" /> Send Email
              </a>
            </Button>
            
            <div className="flex gap-4">
              <Button size="lg" variant="outline" className="rounded-full h-14 w-14 p-0 bg-background/50 backdrop-blur-sm" asChild>
                <a href="https://www.linkedin.com/in/blessed-n-284629279/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 w-14 p-0 bg-background/50 backdrop-blur-sm" asChild>
                <a href="https://github.com/Blessed120" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground relative z-10">
            © {new Date().getFullYear()} Blessed Nkengafac. All rights reserved.
          </div>
        </motion.div>
      </Section>

      {/* Demo Modals */}
      <AnomalyDemo isOpen={activeModal === 'anomaly'} onClose={() => setActiveModal(null)} />
      <CicdDemo isOpen={activeModal === 'cicd'} onClose={() => setActiveModal(null)} />
      <CredentialDemo isOpen={activeModal === 'credential'} onClose={() => setActiveModal(null)} />
    </>
  );
};

export default HomePage;