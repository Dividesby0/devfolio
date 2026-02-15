import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Shield, Bug, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ResumePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Resume | Blessed Nkengafac</title>
        <meta name="description" content="Professional resume of Blessed Nkengafac - Quality Engineer and Cryptographic Researcher." />
      </Helmet>

      {/* Styles for print media to ensure clean PDF generation */}
      <style>
        {`
          @media print {
            @page { margin: 0.5cm; size: auto; }
            body { background-color: white !important; color: black !important; -webkit-print-color-adjust: exact; }
            .print-hidden { display: none !important; }
            .print-visible { display: block !important; }
            .resume-container { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
            a { text-decoration: none !important; color: black !important; }
            /* Force background colors to print */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}
      </style>

      <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 flex justify-center bg-slate-50/50 dark:bg-black/20 print:bg-white print:pt-0 print:pb-0">
        <div className="w-full max-w-[21cm] bg-white dark:bg-[#111111] shadow-2xl rounded-sm overflow-hidden print:shadow-none resume-container">
          
          {/* Header / Contact Info */}
          <header className="bg-slate-900 text-white p-8 print:bg-white print:text-black print:border-b-2 print:border-black print:p-0 print:pb-4 print:mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:flex-row">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 print:text-3xl">Blessed Nkengafac</h1>
                <h2 className="text-xl text-slate-300 font-medium print:text-slate-700">Quality Engineer & Cryptographic Researcher</h2>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-slate-300 print:text-black print:text-right print:items-end">
                <a href="mailto:info@blessnkeng.org" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" /> info@blessnkeng.org
                </a>
                <a href="tel:2406969402" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" /> (240) 696-9402
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Washington DC-Baltimore Area
                </div>
                <div className="flex gap-3 mt-1 print:hidden">
                   <a href="https://linkedin.com/in/blessed-n-284629279/" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Linkedin className="w-4 h-4"/></a>
                   <a href="https://github.com/Blessed120" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Github className="w-4 h-4"/></a>
                </div>
              </div>
            </div>
          </header>

          <div className="p-8 md:p-10 space-y-8 print:p-0 print:space-y-4 text-slate-800 dark:text-slate-200 print:text-black">
            
            {/* Download Button (Hidden on Print) */}
            <div className="flex justify-end print:hidden mb-4">
              <Button onClick={handlePrint} className="gap-2 shadow-lg hover:shadow-primary/20">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>

            {/* Summary */}
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-200 dark:border-slate-800 mb-4 pb-1 text-slate-900 dark:text-white print:text-black print:border-black">
                Professional Summary
              </h3>
              <p className="leading-relaxed text-sm md:text-base text-justify">
                Driven by a deep desire to understand how intelligent non-human systems work, I am a dedicated <strong>Software Engineer</strong> and <strong>Cryptographic Researcher</strong> specializing in scalable backend systems, cloud architecture, and security compliance. Currently serving as a <strong>Quality Engineer at Cyberweaponz</strong>, I bridge the gap between complex engineering requirements and operational reliability. My background includes active participation in high-profile bug bounty programs and a proven track record of optimizing enterprise systems.
              </p>
            </section>

            {/* Experience */}
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-200 dark:border-slate-800 mb-6 pb-1 text-slate-900 dark:text-white print:text-black print:border-black">
                Experience
              </h3>
              
              <div className="space-y-6 print:space-y-4">
                {/* Job 1 */}
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 print:border-l-0 print:pl-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white print:text-black">Quality Engineer</h4>
                    <span className="font-mono text-sm text-slate-500 print:text-black">Current</span>
                  </div>
                  <div className="text-primary font-medium mb-2 print:text-black">Cyberweaponz</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                    <li>Spearheading automated testing frameworks for cloud security compliance solutions and military-grade private equipment research.</li>
                    <li>Ensuring 99.9% system reliability through rigorous QA strategies and load testing of critical infrastructure.</li>
                    <li>Collaborating with cross-functional teams to integrate cryptographic security standards into product development lifecycles.</li>
                  </ul>
                </div>

                {/* Job 2 */}
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 print:border-l-0 print:pl-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white print:text-black">Software Engineer Intern</h4>
                    <span className="font-mono text-sm text-slate-500 print:text-black">May 2025 - Sep 2025</span>
                  </div>
                  <div className="text-primary font-medium mb-2 print:text-black">Kelly Services (Apple Account)</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                    <li>Architected internal tooling that increased team productivity by 30% through automation of repetitive support workflows.</li>
                    <li>Collaborated with senior engineers on full-stack feature implementation using React and Node.js.</li>
                    <li>Optimized database queries reducing reporting latency by 45%.</li>
                  </ul>
                </div>

                {/* Job 3 */}
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-4 print:border-l-0 print:pl-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white print:text-black">Senior Tech Support Engineer</h4>
                    <span className="font-mono text-sm text-slate-500 print:text-black">Feb 2021 - Feb 2025</span>
                  </div>
                  <div className="text-primary font-medium mb-2 print:text-black">Kelly Services (Apple Account)</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                    <li>Managed critical enterprise systems for high-value clients, maintaining strict SLAs in high-pressure environments.</li>
                    <li>Resolved complex technical escalations involving iOS/macOS ecosystem integration and network security.</li>
                    <li>Mentored junior support staff, improving team resolution metrics by 15%.</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
              
              {/* Technical Skills */}
              <section>
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-200 dark:border-slate-800 mb-4 pb-1 text-slate-900 dark:text-white print:text-black print:border-black">
                  Technical Arsenal
                </h3>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-bold text-sm mb-1">Languages & Core</h5>
                    <p className="text-sm">Java, Python, JavaScript (ES6+), TypeScript, SQL, C++, Bash</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Frameworks & Libraries</h5>
                    <p className="text-sm">React, Node.js, Spring Boot, Next.js, TailwindCSS, TensorFlow</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Cloud & Infrastructure</h5>
                    <p className="text-sm">AWS (EC2, S3, Lambda), Docker, Kubernetes, Jenkins, Linux Admin</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">Security Standards</h5>
                    <p className="text-sm">OAuth 2.0, OIDC, OWASP Top 10, NIST Guidelines, PKI</p>
                  </div>
                </div>
              </section>

              {/* Research & Certs */}
              <section>
                <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-slate-200 dark:border-slate-800 mb-4 pb-1 text-slate-900 dark:text-white print:text-black print:border-black">
                  Research & Certifications
                </h3>
                
                <div className="mb-6">
                  <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Bug className="w-4 h-4 text-emerald-500 print:text-black" /> Bug Bounty & Research
                  </h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Google Bug Presearch Program</span>
                      <span className="text-muted-foreground print:text-black italic">Active Researcher</span>
                    </li>
                    <li className="flex justify-between">
                      <span>HackerOne</span>
                      <span className="text-muted-foreground print:text-black italic">Contributor</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 print:text-black" /> Industry Certifications
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-sm print:border-black print:text-black">Dell Certified Systems Expert</Badge>
                    <Badge variant="outline" className="rounded-sm print:border-black print:text-black">IBM Professional Certification</Badge>
                  </div>
                </div>
              </section>

            </div>
            
            {/* Footer for Resume (Hidden on Screen, Visible on Print) */}
            <div className="hidden print:block text-center text-xs mt-8 pt-4 border-t border-slate-300">
              <p>Online Portfolio: <strong>blessnkeng.dev</strong></p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ResumePage;