import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDownToLine, ChevronRight, Linkedin, Mail } from 'lucide-react';
import './index.css';

function App() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null); // Reference for the hero pinning container

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  }); 

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    // High-performance canvas image sequence scrubber
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let active = true;
    const frameCount = 10; // Number of user-uploaded frames
    const images = [];

    let currentProgress = 0;

    // renderFrame now takes progress (0 to 1) and interpolates seamlessly
    const renderFrame = (progress) => {
      if (!active) return;
      currentProgress = progress;
      
      const exactIndex = progress * (frameCount - 1);
      const index1 = Math.floor(exactIndex);
      const index2 = Math.min(frameCount - 1, index1 + 1);
      const fraction = exactIndex - index1;

      const img1 = images[index1];
      const img2 = images[index2];

      if (img1 && img1.complete) {
        if (!canvas.width || canvas.width === 300) {
          canvas.width = img1.naturalWidth || img1.width;
          canvas.height = img1.naturalHeight || img1.height;
        }
        if (canvas.width > 0 && canvas.height > 0) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw base image fully opaque
          context.globalAlpha = 1.0;
          context.drawImage(img1, 0, 0, canvas.width, canvas.height);
          
          // Draw the next image overlapping with the fraction opacity to crossfade (creates 60fps illusion)
          if (img2 && img2.complete && fraction > 0) {
             context.globalAlpha = fraction;
             context.drawImage(img2, 0, 0, canvas.width, canvas.height);
          }
          context.globalAlpha = 1.0; // reset
        }
      }
    };

    // Preload all frames to memory 
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/frames_new/${i.toString().padStart(2, '0')}.png`;
      img.onload = () => {
        if (!active) return;
        // Draw the initial frame to bootstrap the canvas 
        if (currentProgress === 0 && i === 1) {
           renderFrame(0);
        }
      };
      images.push(img);
    }

    // Tie the image playback natively to the smoothly interpolated page scroll
    const unsubscribe = smoothProgress.onChange((latest) => {
      requestAnimationFrame(() => renderFrame(latest));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [smoothProgress]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="app-container">
      <nav className="navbar">
        <a href="#about" className="nav-link">About</a>
        <a href="#experience" className="nav-link">Experience</a>
        <a href="#projects" className="nav-link">Deep Dive</a>
        <a href="#skills" className="nav-link">Skills</a>
      </nav>

      {/* Pinned Hero Section Container (Extending height dramatically smooths out the scrub speed) */}
      <section ref={heroRef} style={{ height: '250vh', position: 'relative' }} id="about">
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          
          <canvas 
            ref={canvasRef}
            className="hero-video-bg" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2, opacity: 0.4 }}
          ></canvas>
          
          <div className="hero-overlay"></div>
          
          <div className="hero-section" style={{ position: 'relative', zIndex: 1, height: '100%', background: 'transparent' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="portrait-container"
            >
              <img src="/portrait.png" alt="Rahul Rathor" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="hero-title text-gradient"
            >
              Rahul Rathor
            </motion.h1>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="hero-subtitle"
            >
              MBA 2024-2026 | Marketing & Strategy | Data-Driven Growth
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="hero-actions"
            >
              <a href="#" className="btn btn-primary">
                Download Resume <ArrowDownToLine size={16} />
              </a>
              <a href="#projects" className="btn btn-glass">
                View Projects <ChevronRight size={16} />
              </a>
              <a href="https://linkedin.com/in/rahul-rathor" target="_blank" rel="noreferrer" className="btn btn-glass">
                LinkedIn <Linkedin size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="experience" className="section">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="section-title text-gradient"
        >
          Experience & Education
        </motion.h2>
        <div className="timeline">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="timeline-item"
          >
            <div className="timeline-dot"></div>
            <div className="timeline-date">Apr 2025 – May 2025</div>
            <div className="timeline-title">Sales & Marketing Intern</div>
            <div className="timeline-company">Air Flow Pvt Ltd</div>
            <ul className="timeline-bullets">
              <li>Created company website using WordPress and custom HTML/JS, cutting page load time by 70%, bounce rate by 40%, and increasing organic traffic by 257%, enabling improved lead conversion.</li>
              <li>Reduced lead response time by 87.5% by building an automated funnel with CRM, ERP, and Wati.</li>
              <li>Boosted email open rates by 87% and LinkedIn engagement by 180% by producing tailored content assets.</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="timeline-item"
          >
            <div className="timeline-dot"></div>
            <div className="timeline-date">Jan 2024 – May 2024</div>
            <div className="timeline-title">Marketing Intern</div>
            <div className="timeline-company">Adventure Supplier Pvt Ltd</div>
            <ul className="timeline-bullets">
              <li>Improved bid targeting accuracy by 15% through detailed market research across 3 sectors.</li>
              <li>Shortlisted ₹3.5 Cr+ in high-potential contracts by evaluating 100+ government tenders.</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="timeline-item"
          >
            <div className="timeline-dot"></div>
            <div className="timeline-date">Apr 2023 – Dec 2023</div>
            <div className="timeline-title">Intern</div>
            <div className="timeline-company">Rotary Club Burhanpur</div>
            <ul className="timeline-bullets">
              <li>Conducted Market Research (500+ people surveyed) and Digital media engagements across platforms.</li>
              <li>Planned and coordinated Events in 4 different verticals, building donor relationships.</li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="timeline-item"
          >
            <div className="timeline-dot"></div>
            <div className="timeline-date">Class of 2026</div>
            <div className="timeline-title">MBA</div>
            <div className="timeline-company">Indian Institute of Management, Bodh Gaya</div>
            <ul className="timeline-bullets">
              <li>Ranked Top 5 of 350+ students; Term III Topper (CGPA 9.8) and Multiple Subjects Topper.</li>
              <li>Secured 98 Percentile in CAT'23 & 99.31 in section verbal Ability.</li>
            </ul>
          </motion.div>

        </div>
      </section>

      <section id="projects" className="section">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="section-title text-gradient"
        >
          Deep Dive 
        </motion.h2>
        <div className="projects-grid">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="project-card glass">
            <h3 className="project-title">Air Flow Pvt Ltd</h3>
            <p className="project-desc">Executed SEO and digital marketing strategy optimizing website structure, keywords, and performance to boost organic search visibility, traffic, and leads.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="project-card glass">
            <h3 className="project-title">Phoenix Global</h3>
            <p className="project-desc">Conducted in-depth market research and competitor analysis analyzing data from over 50 industry reports in the $500 billion EV market.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="project-card glass">
            <h3 className="project-title">Skilled Sapiens</h3>
            <p className="project-desc">Enhanced product offerings by conducting a detailed analysis of the competitive landscape for skilled professionals.</p>
          </motion.div>
        </div>
      </section>

      <section id="skills" className="section">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="section-title text-gradient"
        >
          Skills & Arsenal
        </motion.h2>
        
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Core Competencies</h3>
          <div className="skills-container">
            <span className="skill-badge">HubSpot Inbound Marketing</span>
            <span className="skill-badge">Digital Marketing & SEO</span>
            <span className="skill-badge">Market Analytics</span>
            <span className="skill-badge">Google Analytics & Ads</span>
            <span className="skill-badge">CRM Principles</span>
            <span className="skill-badge">Lean Six Sigma Green Belt</span>
            <span className="skill-badge">Project Management</span>
            <span className="skill-badge">Data Analytics (SQL, Excel, Python, Power BI)</span>
          </div>
        </div>

      </section>

      <footer className="section" style={{ textAlign: 'center', paddingBottom: '4rem' }}>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hero-title text-gradient"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}
        >
          Let's build something great.
        </motion.h2>
        <a href="mailto:rahul.r2026@iimbg.ac.in" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.2rem' }}>
          <Mail size={20} /> Get In Touch
        </a>
      </footer>

    </div>
  );
}

export default App;
