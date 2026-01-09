import { motion } from 'framer-motion';
import { useEffect, useState, memo } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import {
  Shield, Radar, Bug, Github, Linkedin, Mail,
  GraduationCap, Award, Terminal, Globe, Network,
  Cpu, Database, Briefcase, User, Download, Menu, X
} from 'lucide-react';

import type { LucideIcon } from "lucide-react";

/* ===================== TYPES ===================== */

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

type SkillProps = {
  icon: LucideIcon;
  title: string;
  desc: string;
  index: number;
};

type ToolProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  index: number;
};

type ExperienceProps = {
  role: string;
  org: string;
  year: string;
  points: string[];
  index: number;
};

type EducationProps = {
  degree: string;
  inst: string;
  year: string;
  index: number;
};

type CertProps = {
  text: string;
  link: string;
  index: number;
};

type IconLinkProps = {
  href: string;
  icon: LucideIcon;
  index: number;
};

/* ===================== MOUSE SCROLL ===================== */
const MouseScroll = () => {
  return (
    <div className="flex justify-center">
      <div className="w-7 h-12 border-2 border-gray-300 rounded-full flex justify-center relative">
        <motion.div
          className="w-1.5 h-1.5 bg-gray-300 rounded-full absolute top-2"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

/* ===================== TYPING EFFECT - FIXED ===================== */
const TypingText = memo(() => {
  const words = ['Breaking', 'Analyzing', 'Securing'];
  const [w, setW] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const word = words[w];
    let t: ReturnType<typeof setTimeout> | undefined;

    if (!d && c < word.length) {
      t = setTimeout(() => setC(c + 1), 160);
    } else if (!d && c === word.length) {
      t = setTimeout(() => setD(true), 900);
    } else if (d && c > 0) {
      t = setTimeout(() => setC(c - 1), 90);
    } else if (d && c === 0) {
      setD(false);
      setW((w + 1) % words.length);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [c, d, w]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="text-emerald-400 inline-flex items-center">
      <span className="whitespace-nowrap">{words[w].slice(0, c)}</span>
      <span className={`inline-block w-[2px] h-5 bg-emerald-400 ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}></span>
    </span>
  );
});

TypingText.displayName = 'TypingText';

/* ===================== SCROLL SPY ===================== */
const sections = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];

const useScrollSpy = () => {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const handler = () => {
      let current = active;
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [active]);
  return active;
};

/* ===================== NAVBAR ===================== */
const Navbar = () => {
  const active = useScrollSpy();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <span className="text-emerald-400 font-bold text-lg sm:text-xl">&lt;AK /&gt;</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 lg:gap-6 text-sm">
          {sections.map(s => (
            <a
              key={s}
              href={`#${s}`}
              onClick={(e) => handleClick(e, s)}
              className={`transition-colors duration-300 ${active === s ? 'text-emerald-400' : 'text-gray-400 hover:text-emerald-400'}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-emerald-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-black/95 border-t border-emerald-500/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 px-6 py-6">
            {sections.map(s => (
              <a
                key={s}
                href={`#${s}`}
                onClick={(e) => handleClick(e, s)}
                className={`transition-colors duration-300 text-base ${active === s ? 'text-emerald-400' : 'text-gray-400 hover:text-emerald-400'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

/* ===================== SECTION ===================== */
const Section = ({ id, title, children }: SectionProps) => (
  <motion.section
    id={id}
    className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 lg:py-32 scroll-mt-24"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-center sm:text-left">
      <span className="text-emerald-400">// </span>{title}
    </h2>
    {children}
  </motion.section>
);

/* ===================== COMPONENTS ===================== */
const Skill = ({ icon: Icon, title, desc, index }: SkillProps) => (
  <motion.div
    className="bg-gray-900/60 p-4 sm:p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 hover:scale-105"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
    >
      <Icon className="text-emerald-400 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
    </motion.div>
    <h3 className="font-semibold text-base sm:text-lg mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{desc}</p>
  </motion.div>
);

const Tool = ({ icon: Icon, title, text, index }: ToolProps) => (
  <motion.div
    className="bg-gray-900/60 p-4 sm:p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 hover:scale-105"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <motion.div
      initial={{ rotate: -180, opacity: 0 }}
      whileInView={{ rotate: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
    >
      <Icon className="text-emerald-400 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
    </motion.div>
    <h4 className="font-semibold text-base sm:text-lg mb-2">{title}</h4>
    <p className="text-gray-400 text-sm">{text}</p>
  </motion.div>
);

const Experience = ({ role, org, year, points, index }: ExperienceProps) => (
  <motion.div
    className="bg-gray-900/60 p-4 sm:p-6 rounded-xl border border-emerald-500/20 mb-6 hover:border-emerald-500/60 transition-all duration-300"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
    >
      <Briefcase className="text-emerald-400 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
    </motion.div>
    <h3 className="font-semibold text-lg sm:text-xl">{role}</h3>
    <p className="text-gray-400 text-sm sm:text-base">{org} ({year})</p>
    <motion.ul
      className="list-disc list-inside text-gray-400 mt-3 text-sm sm:text-base"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
    >
      {points.map((p: string) => (
        <li key={p}>{p}</li>
      ))}
    </motion.ul>
  </motion.div>
);

const Edu = ({ degree, inst, year, index }: EducationProps) => (
  <motion.div
    className="bg-gray-900/60 p-4 sm:p-6 rounded-xl border border-emerald-500/20 mb-6 hover:border-emerald-500/60 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    <motion.div
      initial={{ rotate: -90, opacity: 0 }}
      whileInView={{ rotate: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
    >
      <GraduationCap className="text-emerald-400 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
    </motion.div>
    <h3 className="font-semibold text-lg sm:text-xl">{degree}</h3>
    <p className="text-gray-400 text-sm sm:text-base">{inst}</p>
    <p className="text-gray-500 text-sm">{year}</p>
  </motion.div>
);

const Cert = ({ text, link, index }: CertProps) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-900/60 p-4 rounded-xl border border-emerald-500/20 mb-3 flex items-center gap-3 hover:border-emerald-500/60 transition-all duration-300 cursor-pointer"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    whileHover={{ scale: 1.02, x: 5 }}
  >
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
    >
      <Award className="text-emerald-400 flex-shrink-0" />
    </motion.div>
    <span className="flex-1 text-sm sm:text-base">{text}</span>
    <Globe className="text-emerald-400/60 flex-shrink-0" size={16} />
  </motion.a>
);

const IconLink = ({ href, icon: Icon, index }: IconLinkProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400"
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={24} className="sm:w-7 sm:h-7" />
  </motion.a>
);

/* ===================== MAIN ===================== */
export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="bg-black text-gray-100 font-sans overflow-x-hidden">

      {/* HERO */}
      <section className="min-h-[100dvh] flex items-center justify-center text-center px-4 sm:px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-emerald-400 mb-6" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent leading-tight sm:leading-normal">
            Akash Kumar A S
          </h1>
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-300 px-4">
            Cybersecurity & Digital Forensics Enthusiast
          </p>
          <div className="mt-6 font-mono text-sm sm:text-base text-gray-400 h-7 flex items-center justify-center">
            <span className="text-emerald-400">&gt; </span>
            {isClient && <TypingText />}
            <span className="ml-1">the digital frontier</span>
          </div>

          <a
            href="https://drive.google.com/file/d/1U8NzBistiR2VhF4QEcfOjz40lLcW7iXv/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-sm sm:text-base transition-colors duration-300"
          >
            <Download size={18} /> Download CV
          </a>

          <div className="mt-16">
            <MouseScroll />
          </div>

        </motion.div>
      </section>

      <Navbar />

      {/* ABOUT - UPDATED CONTENT */}
      <Section id="about" title="About Me">
        <motion.div
          className="bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 text-gray-300"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="space-y-4 sm:space-y-6 text-justify leading-relaxed text-sm sm:text-base md:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>
              <span className="text-white font-medium">Cyber Forensics postgraduate</span> with hands-on experience across offensive and defensive cybersecurity domains. Skilled in OSINT investigations, digital forensics, malware analysis, vulnerability assessment, and incident response, with a strong understanding of attacker and defender methodologies. Gained practical industry exposure through internships with law enforcement agencies, supporting real-world cybercrime investigations at{' '}
              <span className="text-white font-medium">
                District Forensic Science Laboratories and Cyber Police Stations
              </span>, working within legally compliant forensic workflows. Actively strengthen technical skills through hands-on labs on platforms like{' '}
              <span className="text-white font-medium">TryHackMe</span>, focusing on SOC operations, threat detection, and incident analysis. Motivated, detail-oriented, and committed to ethical security practices, seeking an entry-level role as a{' '}
              <span className="text-white font-medium">
                SOC Analyst or Cybersecurity Analyst
              </span>.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills & Tools">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Skill icon={Radar} title="OSINT & Recon" desc="Digital footprinting, threat intel, Google dorking." index={0} />
          <Skill icon={Bug} title="Penetration Testing" desc="Reconnaissance, vulnerability assessment." index={1} />
          <Skill icon={Shield} title="Malware Analysis" desc="Static & dynamic analysis, mitigation." index={2} />
          <Skill icon={Shield} title="Incident Response" desc="Alert triage, investigation, recovery." index={3} />
        </div>

        <motion.h3
          className="text-xl sm:text-2xl text-emerald-400 mb-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Tools & Platforms
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Tool icon={Terminal} title="Security Tools" text="Nmap, Nessus, Metasploit, Burp Suite, Wireshark" index={0} />
          <Tool icon={Globe} title="OSINT Platforms" text="Shodan, Censys, Recon-ng, Sherlock" index={1} />
          <Tool icon={Network} title="Networking" text="TCP/IP, DNS, HTTP/HTTPS, Firewalls" index={2} />
          <Tool icon={Cpu} title="Operating Systems" text="Kali Linux, Ubuntu, Windows" index={3} />
          <Tool icon={Database} title="Frameworks" text="OWASP Top 10, CIA Triad" index={4} />
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects">
        <div className="space-y-8 sm:space-y-10">

          {/* PROJECT 1 */}
          <motion.div
            className="bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <Shield className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white break-words">
                Behavioral Analysis of Wiper Malware | Malware Analysis
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Conducted an in-depth analysis of destructive wiper malware to understand
              its execution flow, persistence mechanisms, and impact on compromised
              systems. The goal was to study how data destruction occurs and how such
              attacks can be detected and mitigated in real-world environments.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4 text-sm sm:text-base">
              <li>Performed static analysis to inspect binaries, strings, and metadata</li>
              <li>Executed dynamic analysis in a controlled sandbox environment</li>
              <li>Identified persistence techniques and file destruction behavior</li>
              <li>Extracted Indicators of Compromise (IOCs)</li>
            </ul>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Tools & Techniques:</span>{' '}
              Floss, PEView, PEStudio, IDA View, x32dbg, Ollydbg, VirusTotal, Windows Sandbox
            </p>

            <p className="text-gray-300 text-sm sm:text-base">
              <span className="text-white font-medium">Outcome:</span>{' '}
              Designed mitigation strategies including endpoint hardening, Backup
              enforcement, and Network monitoring rules.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm italic mt-4">
              🛡 <span className="text-white font-medium">Disclaimer:</span> This project is strictly for educational and academic purposes to study destructive malware behavior and cybersecurity defense. No malicious intent or activity is involved.
            </p>
          </motion.div>

          {/* PROJECT 2 */}
          <motion.div
            className="bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <Mail className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white break-words">
                Mitigating Phishing Attacks Using ZPhisher | Social Engineering Defense
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              This Mini project presents a detailed academic and practical study of
              phishing attacks, focusing on common social engineering techniques and
              defensive strategies used to detect and prevent them. The objective was to
              understand how phishing campaigns are designed and how organizations can
              effectively mitigate such threats.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4 text-sm sm:text-base">
              <li>Studied phishing attack methodologies and social engineering tactics</li>
              <li>Created and analyzed phishing pages using the ZPhisher tool</li>
              <li>Documented step-by-step methodology with screenshots</li>
              <li>Explored ethical and legal considerations of phishing research</li>
            </ul>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Tools & Techniques:</span>{' '}
              Kali Linux, ZPhisher, Phishing page analysis, Awareness-driven testing
            </p>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Outcome:</span>{' '}
              Strengthened understanding of phishing attack lifecycles and improved
              defensive knowledge related to email security, user awareness, and incident
              prevention.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm italic mt-4">
              🛡 <span className="text-white font-medium">Disclaimer:</span> This project
              was conducted strictly for educational and academic purposes to study
              phishing techniques and improve cybersecurity defenses. No malicious intent
              or activity was involved.
            </p>
          </motion.div>

          {/* PROJECT 3 */}
          <motion.div
            className="bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <Network className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white break-words">
                Metasploitable2 – SMB Vulnerability Exploitation | VAPT
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Focused on exploiting critical SMB vulnerabilities in the Metasploitable2
              virtual machine to understand how outdated Samba services can expose
              systems to sensitive data disclosure and full remote compromise. All
              exploitation was performed in a safe, isolated lab environment.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4 text-sm sm:text-base">
              <li>Exploited SMB directory traversal to access sensitive system files</li>
              <li>Retrieved confidential files such as <code>/etc/passwd</code></li>
              <li>Abused Samba usermap script vulnerability for command execution</li>
              <li>Achieved unauthenticated root-level system access</li>
            </ul>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Tools & Techniques:</span>{' '}
              Kali Linux, SMB enumeration tools, Manual exploitation, Metasploitable2 VM
            </p>

            <p className="text-gray-300 text-sm sm:text-base">
              <span className="text-white font-medium">Outcome:</span>{' '}
              Strengthened practical understanding of SMB exploitation, privilege
              escalation, and the risks posed by outdated Samba configurations.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm italic mt-4">
              🛡 <span className="text-white font-medium">Disclaimer:</span> All testing was performed in a safe, isolated lab using intentionally vulnerable systems for educational purposes only. No real-world systems were targeted. This content is intended for ethical learning and defensive security awareness.
            </p>
          </motion.div>

          {/* PROJECT 4 */}
          <motion.div
            className="bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <Terminal className="text-emerald-400 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-semibold text-white">
                Metasploitable2 – VSFTPD 2.3.4 Vulnerability Assessment | VAPT
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
              Analyzed a critical FTP vulnerability in Metasploitable2 to understand how
              outdated and backdoored services can lead to full system compromise. The
              assessment was conducted in a controlled lab environment to simulate
              real-world attack scenarios.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4 text-sm sm:text-base">
              <li>Identified the backdoored VSFTPD 2.3.4 service</li>
              <li>Triggered the backdoor using a crafted username</li>
              <li>Obtained unauthorized remote shell access</li>
              <li>Analyzed attacker impact and exploitation flow</li>
            </ul>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Tools & Techniques:</span>{' '}
              Kali Linux, Metasploit Framework, Reconnaissance tools, Metasploitable2 VM
            </p>

            <p className="text-gray-300 mb-2 text-sm sm:text-base">
              <span className="text-white font-medium">Mitigation:</span>{' '}
              Upgrade vsftpd, disable unused FTP services, enforce firewall rules, and
              use secure alternatives such as SFTP or FTPS.
            </p>

            <p className="text-gray-300 text-sm sm:text-base">
              <span className="text-white font-medium">Outcome:</span>{' '}
              Improved hands-on penetration testing skills and deeper understanding of
              how insecure services can lead to rapid system compromise.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm italic mt-4">
              🛡 <span className="text-white font-medium">Disclaimer:</span> All testing was performed in a safe, isolated lab using intentionally vulnerable systems for educational purposes only. No real-world systems were targeted. This content is intended for ethical learning and defensive security awareness.
            </p>
          </motion.div>

        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience">
        <Experience
          role="Cybersecurity Intern"
          org="City Police Office"
          year="Jan 2025– Feb 2025"
          points={[
            "Supported cybercrime investigations",
            "Assisted digital forensic analysis",
            "Incident response support"
          ]}
          index={0}
        />
        <Experience
          role="Cybersecurity Intern"
          org="IICSF"
          year="Aug 2024– Sep 2024"
          points={[
            "OSINT investigations",
            "Vulnerability assessments",
            "Threat intelligence analysis"
          ]}
          index={1}
        />
      </Section>

      {/* EDUCATION */}
      <Section id="education" title="Education">
        <Edu degree="M.Sc. Cyber Forensics"
          inst="Shri Vaishnav Vidyapeeth Vishwavidyalaya"
          year="2023 – 2025"
          index={0} />
        <Edu degree="B.Sc. Forensic Science"
          inst="Annai Fathima College of Arts & Science"
          year="2020 – 2023"
          index={1} />
      </Section>

      {/* CERTIFICATIONS */}
      <Section id="certifications" title="Certifications">
        {[
          {
            text: "TryHackMe – Offensive Security",
            link: "https://tryhackme.com/p/cyberhack07?tab=completed-rooms"
          },
          {
            text: "TryHackMe – Defensive Security",
            link: "https://tryhackme.com/p/cyberhack07?tab=completed-rooms"
          },
          {
            text: "Linux Fundamentals – TryHackMe",
            link: "https://tryhackme.com/p/cyberhack07?tab=completed-rooms"
          },
          {
            text: "Advent of Cyber 2025",
            link: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-98BWJMFXKC.pdf"
          },
          {
            text: "NPTEL – Soft Skill Development (IIT Kharagpur)",
            link: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25HS72S63900189801306376"
          }
        ].map((c, i) => <Cert key={c.text} text={c.text} link={c.link} index={i} />)}
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact">
        <div className="space-y-12 sm:space-y-16">

          {/* ICON-ONLY CLICKABLE LINKS */}
          <div className="flex justify-center gap-6 sm:gap-10">
            <IconLink href="mailto:kumarasakash04@gmail.com" icon={Mail} index={0} />
            <IconLink href="https://github.com/akashkumaras7" icon={Github} index={1} />
            <IconLink href="https://linkedin.com/in/akash-kumar-a-s-94bba0265" icon={Linkedin} index={2} />
          </div>

          {/* CONTACT FORM (FORMSPARK) */}
          <motion.form
            action="https://submit-form.com/AWV043eJg"
            method="POST"
            className="max-w-xl mx-auto bg-gray-900/60 p-6 sm:p-8 rounded-xl border border-emerald-500/20 space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Honeypot (Spam Protection) */}
            <input type="checkbox" name="_honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            {/* Redirect after submit (optional) */}
            <input type="hidden" name="_redirect" value="https://yourdomain.com/thanks" />

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <User className="absolute left-3 top-3 text-emerald-400" size={18} />
              <input
                type="text"
                name="first-name"
                placeholder="Your Name"
                required
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-100 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Mail className="absolute left-3 top-3 text-emerald-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-400 text-gray-100 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message"
                required
                className="w-full px-4 py-3 bg-black/60 border border-emerald-500/20 rounded-lg focus:outline-none focus:border-emerald-400 resize-none text-gray-100 text-sm sm:text-base"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </motion.form>

        </div>
      </Section>

      <footer className="py-8 sm:py-10 border-t border-emerald-500/20 text-center text-gray-400 text-sm sm:text-base px-4">
        © {new Date().getFullYear()} Akash Kumar A S — Secure by Design
      </footer>

    </main>
  );
}