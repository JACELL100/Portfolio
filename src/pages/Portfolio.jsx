import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink, Award, Code, Briefcase, GraduationCap, User, ChevronDown, Star, ArrowRight, MapPin, Calendar, Menu, X, Trophy, Users, Target, Clock } from 'lucide-react';

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseTrail, setMouseTrail] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);
  const canvasRef = useRef(null);
  const planetCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const planetAnimationRef = useRef(null);

  // Particle system
  const particles = useRef([]);
  const particleCount = 100;

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      
      // Add to trail with timestamp
      setMouseTrail(prevTrail => {
        const newTrail = [...prevTrail, { ...newPosition, id: Date.now() }];
        return newTrail.slice(-15); // Keep last 15 positions
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initialize particles and planet
    initParticles();
    initPlanet();
    animate();
    animatePlanet();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (planetAnimationRef.current) {
        cancelAnimationFrame(planetAnimationRef.current);
      }
    };
  }, []);

  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    particles.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: 250 + Math.random() * 60, // Purple to pink range
      });
    }
  };

  const initPlanet = () => {
    const canvas = planetCanvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
      ctx.fill();
      
      // Connect nearby particles
      for (let j = index + 1; j < particles.current.length; j++) {
        const other = particles.current[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          const opacity = (1 - distance / 100) * 0.1;
          ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const animatePlanet = () => {
    const canvas = planetCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const time = Date.now() * 0.001;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Enhanced planet that moves across the entire screen
    const centerX = canvas.width * 0.5 + Math.sin(time * 0.15) * (canvas.width * 0.35);
    const centerY = canvas.height * 0.4 + Math.cos(time * 0.12) * (canvas.height * 0.25);
    const radius = 120;
    const rotation = time * 0.5; // Planet rotation
    
    // Create enhanced planet gradient
    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.4, centerY - radius * 0.4, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.9)');
    gradient.addColorStop(0.2, 'rgba(124, 58, 237, 0.8)');
    gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)');
    gradient.addColorStop(0.8, 'rgba(147, 51, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)');
    
    // Draw planet base
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add planet surface details (rotating)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    
    // Surface patterns
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const patternRadius = radius * 0.6;
      const x = Math.cos(angle) * patternRadius;
      const y = Math.sin(angle) * patternRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 58, 237, ${0.4 + Math.sin(time + i) * 0.2})`;
      ctx.fill();
    }
    
    // Add surface craters/continents
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const craterRadius = radius * (0.3 + Math.sin(time * 2 + i) * 0.2);
      const x = Math.cos(angle) * craterRadius;
      const y = Math.sin(angle) * craterRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(88, 28, 135, ${0.6 + Math.cos(time + i) * 0.3})`;
      ctx.fill();
    }
    
    ctx.restore();
    
    // Enhanced planet rings with rotation
    for (let i = 0; i < 4; i++) {
      const ringRadius = radius + 25 + i * 18;
      const ringRotation = rotation * (1 + i * 0.2);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(ringRotation);
      
      // Draw ring segments for more realistic look
      const segments = 60;
      for (let j = 0; j < segments; j++) {
        const segmentAngle = (j / segments) * Math.PI * 2;
        const nextAngle = ((j + 1) / segments) * Math.PI * 2;
        const opacity = 0.4 - i * 0.08 + Math.sin(time * 3 + j * 0.1) * 0.1;
        
        if (opacity > 0.1) {
          ctx.beginPath();
          ctx.arc(0, 0, ringRadius, segmentAngle, nextAngle);
          ctx.strokeStyle = `rgba(147, 51, 234, ${opacity})`;
          ctx.lineWidth = 3 - i * 0.5;
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }
    
    // Add atmospheric glow
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.8,
      centerX, centerY, radius * 1.8
    );
    glowGradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
    glowGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.1)');
    glowGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Add twinkling stars around the planet
    for (let i = 0; i < 15; i++) {
      const starAngle = (i / 15) * Math.PI * 2 + time * 0.3;
      const starDistance = radius * (2.5 + Math.sin(time + i) * 0.5);
      const starX = centerX + Math.cos(starAngle) * starDistance;
      const starY = centerY + Math.sin(starAngle) * starDistance;
      const starOpacity = 0.5 + Math.sin(time * 4 + i) * 0.5;
      
      ctx.beginPath();
      ctx.arc(starX, starY, 1 + Math.sin(time * 6 + i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
      ctx.fill();
    }
    
    planetAnimationRef.current = requestAnimationFrame(animatePlanet);
  };

  const projects = [
    {
      name: "BharatSecure",
      description: "Incident Reporting & Response System with AI-powered incident categorization, real-time alerts to authorities, anonymous reporting, safety heatmaps, and 24/7 AI chatbot support for emotional, legal, and medical assistance.",
      tech: ["React.js", "Django Rest Framework", "SQLite", "NLP", "GPS"],
      github: "https://github.com/BharatSecure/TechFiesta25.git",
      live: "https://bharat-secure.vercel.app/",
      featured: true,
      color: "from-purple-600 via-violet-600 to-indigo-600",
      image: "/images/bs.png"
    },
    {
      name: "TravelSafeAI",
      description: "Personalized Itinerary & Safety Planner with real-time crime insights, AI-powered route safety scoring, crowdsourced safety reports, and AI travel risk forecasting using Google Gemini LLM.",
      tech: ["React + Vite", "Node.js + Express", "MongoDB", "Google Gemini LLM", "OpenStreetMap"],
      github: "https://github.com/Shane-Dias/PlanMyTrip.git",
      live: "https://travel-safe-ai-jqdm.vercel.app/",
      featured: true,
      color: "from-emerald-600 via-teal-600 to-cyan-600",
      image: "/images/ts.png"
    },
    {
      name: "BrightBuilds",
      description: "Creative coding showcase platform for student projects mapped to UN SDGs. Features role-based dashboards, project ratings, mentorship system, and community collaboration tools.",
      tech: ["React", "Node.js", "MongoDB", "JWT", "Tailwind CSS"],
      github: "https://github.com/JACELL100/FSD.git",
      live: "https://bright-builds.vercel.app/",
      featured: false,
      color: "from-violet-600 via-purple-600 to-fuchsia-600",
      image: "/images/bb.png"
    },
    {
      name: "SwaadSupplier",
      description: "Raw material sourcing platform for street food vendors with Gemini-powered AI ingredient estimation, blockchain trust system, FSSAI verification, and smart supplier matching.",
      tech: ["React", "Node.js", "MongoDB", "Solidity", "Gemini AI"],
      github: "https://github.com/JACELL100/SwaadSupplier.git",
      live: "https://swaad-supplier.vercel.app/",
      featured: false,
      color: "from-orange-500 via-rose-500 to-pink-600",
      image: "/images/ss.png"
    }
  ];

  const achievements = [
    { 
      title: "TECHMANIA'25", 
      position: "Winner", 
      org: "L.S. Raheja College", 
      date: "2025",
      link: "https://www.lsraheja.org/"
    },
    { 
      title: "CODESTORM Hack 2025", 
      position: "Winner - 2 Track Wins & 2 Extra Awards", 
      org: "Florida International University", 
      date: "2025",
      link: "https://www.fiu.edu/"
    },
    { 
      title: "Oscillation Hackathon", 
      position: "Runner-Up", 
      org: "Vasantdada Patil Pratishthan's College", 
      date: "2024",
      link: "https://www.vppcs.org/"
    },
    { 
      title: "Saksham Ideathon'25", 
      position: "2nd Runner-Up", 
      org: "Rajiv Gandhi Institute of Technology", 
      date: "2025",
      link: "https://www.rgit.ac.in/"
    },
    { 
      title: "GDSC UI/UX Competition'24", 
      position: "2nd Runner-Up", 
      org: "Google Developer Student Clubs", 
      date: "2024",
      link: "https://developers.google.com/community/gdsc"
    },
    { 
      title: "FullStack.AI Hackathon", 
      position: "Winner", 
      org: "CertifyO", 
      date: "2024",
      link: "https://www.certifyo.com/"
    },
    { 
      title: "TechFiesta International 2025", 
      position: "Finalist", 
      org: "International Hackathon", 
      date: "2025",
      link: "https://techfiesta.org/"
    },
    { 
      title: "Changators-Ideate", 
      position: "Runner-Up", 
      org: "Hackathon", 
      date: "2024",
      link: "https://changators.com/"
    }
  ];

  const skills = {
    "Frontend": ["HTML", "CSS", "JavaScript", "React"],
    "Backend": ["Django", "REST APIs"],
    "Design": ["Figma", "Canva", "Framer"],
    "Programming": ["C", "Python", "Solidity", "JavaScript"],
    "Web3": ["Solidity", "MetaMask", "Remix IDE", "Hardhat"],
    "IoT": ["Arduino", "Arduino IDE", "Sensor Integration"],
  };

  const FloatingOrb = ({ delay = 0 }) => (
    <div 
      className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
      style={{
        background: `radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(124, 58, 237, 0.3) 30%, rgba(168, 85, 247, 0.2) 60%, transparent 80%)`,
        left: `${30 + Math.sin(Date.now() * 0.001 + delay) * 20}%`,
        top: `${20 + Math.cos(Date.now() * 0.001 + delay) * 20}%`,
        animationDelay: `${delay}s`,
        transform: `rotate(${delay * 45}deg)`
      }}
    />
  );

  const GradientText = ({ children, className = "" }) => (
    <span className={`bg-gradient-to-r from-purple-200 via-violet-300 to-fuchsia-200 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );

  const ProjectCard = ({ project, index }) => (
    <div className={`group relative transform hover:scale-[1.02] transition-all duration-500 flex`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition duration-700 blur-sm rounded-3xl"
           style={{ background: `linear-gradient(45deg, ${project.color.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})` }}>
      </div>
      <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-700 h-full flex flex-col w-full overflow-hidden">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden rounded-t-3xl">
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                <GradientText>{project.name}</GradientText>
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r opacity-90 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0"
                 style={{ background: `linear-gradient(45deg, ${project.color.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})` }}>
              <Code className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 leading-relaxed text-sm flex-grow">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((tech, techIndex) => (
              <span key={techIndex} 
                    className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-gray-700/50 hover:border-purple-500/50 hover:text-white transition-all duration-300">
                {tech}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 mt-auto">
            <a href={project.github} 
               className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group/link text-sm">
              <Github className="w-4 h-4" />
              <span>Code</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
            </a>
            <a href={project.live} 
               className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group/link text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>Live</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const AchievementCard = ({ achievement, index }) => {
    const isFlipped = flippedCard === index;
    
    return (
      <div 
        className="group relative h-56 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlippedCard(isFlipped ? null : index)}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-1000 ease-out transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''} hover:scale-105`}
          style={{ 
            transformStyle: 'preserve-3d',
            animation: `slowFlip${index} 8s infinite linear`
          }}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-gradient-to-br from-gray-900/60 via-purple-900/20 to-violet-900/30 backdrop-blur-2xl rounded-3xl p-6 border border-gray-800/50 hover:border-purple-500/40 transition-all duration-500 shadow-xl shadow-purple-500/10 h-full flex flex-col justify-between group-hover:shadow-2xl group-hover:shadow-purple-500/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-500">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-purple-400 ml-2">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs font-medium">{achievement.date}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 font-semibold text-sm">
                      {achievement.position}
                    </p>
                    <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      {achievement.org}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Achievement</span>
                </div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                  <ArrowRight className="w-4 h-4 text-purple-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 rotate-y-180 backface-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div 
              className="bg-gradient-to-br from-purple-900/80 via-violet-900/70 to-indigo-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-purple-500/40 h-full flex flex-col cursor-pointer hover:border-purple-400/60 transition-all duration-500"
              onClick={(e) => {
                e.stopPropagation();
                window.open(achievement.link, '_blank');
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{achievement.title}</h3>
                    <p className="text-sm text-purple-300">{achievement.date}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="bg-gray-800/40 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-400">Position Achieved</span>
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-white font-bold">{achievement.position}</p>
                </div>
                
                <div className="bg-gray-800/40 rounded-xl p-4 border border-violet-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-violet-400">Organization</span>
                    <Users className="w-4 h-4 text-violet-400" />
                  </div>
                  <p className="text-gray-200 font-medium">{achievement.org}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Click to visit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* 3D Planet Canvas */}
      <canvas 
        ref={planetCanvasRef}
        className="fixed inset-0 pointer-events-none z-5"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Mouse Trail */}
      {mouseTrail.map((point, index) => (
        <div
          key={point.id}
          className="fixed w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 animate-pulse"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            opacity: (index + 1) / mouseTrail.length * 0.8,
            transform: `scale(${(index + 1) / mouseTrail.length})`,
            transition: 'all 0.3s ease-out'
          }}
        />
      ))}
      
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        <FloatingOrb delay={0} />
        <FloatingOrb delay={2} />
        <FloatingOrb delay={4} />
        <FloatingOrb delay={6} />
        
        {/* Additional gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-500/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600/20 via-transparent to-transparent blur-3xl" />
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="bg-black/40 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-500/10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                <GradientText>JACELL</GradientText>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                {['About', 'Projects', 'Skills', 'Achievements'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                     className="text-gray-400 hover:text-white transition-all duration-300 relative group text-sm font-medium">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-500"></span>
                  </a>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="border-t border-purple-500/20 pt-4 space-y-4">
                {['About', 'Projects', 'Skills', 'Achievements'].map((item) => (
                  <a key={item} 
                     href={`#${item.toLowerCase()}`}
                     className="block text-gray-400 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-purple-500/10"
                     onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-20 pt-32">
        <div className={`text-center max-w-5xl mx-auto px-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Enhanced Profile Image */}
          <div className="mb-12 relative">
            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 p-1 animate-pulse shadow-2xl shadow-purple-500/30">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-violet-600/20" />
                <User className="w-18 h-18 text-gray-300 relative z-10" />
              </div>
            </div>
            <div className="absolute inset-0 w-36 h-36 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 animate-ping opacity-20" />
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-purple-300 font-medium tracking-wider uppercase text-sm animate-pulse">Computer Engineering Student</p>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <GradientText>Jacell Jamble</GradientText>
              </h1>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span>Available for opportunities</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-light">
              5x Hackathon Winner & Full-Stack Developer passionate about Web3, AI, and creating 
              innovative solutions that bridge technology and real-world impact.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto my-12">
              {[
                { value: "5+", label: "Hackathon Wins" },
                { value: "8.5", label: "CGPA" },
                { value: "15+", label: "Technologies" },
                { value: "4+", label: "Major Projects" }
              ].map((stat, index) => (
                <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex space-x-4">
                <a href="https://github.com/JACELL100" 
                   className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full font-medium hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4" />
                    <span>View Work</span>
                  </div>
                </a>
                
                <a href="https://www.linkedin.com/in/jacell-jamble-8236ba286/" 
                   className="group relative overflow-hidden px-8 py-4 border border-purple-500/50 rounded-full font-medium hover:border-purple-400 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>Connect</span>
                  </div>
                </a>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="mailto:jacelljamble@gmail.com" className="hover:text-purple-300 transition-colors flex items-center space-x-2 group">
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">jacelljamble@gmail.com</span>
                  <span className="sm:hidden">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-purple-400 w-6 h-6" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>About Me</GradientText>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Passionate about creating technology that matters
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 shadow-2xl shadow-purple-500/10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    I'm a passionate Computer Engineering student with a multidisciplinary understanding of emerging technologies. 
                    My expertise spans across Web Development, UI/UX Design, AI, IoT, and Blockchain.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I thrive on creativity and problem-solving, always eager to push boundaries and create innovative solutions 
                    that make a real impact in the world.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Current Focus</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Web3 Development", level: 80 },
                        { name: "Full-Stack Development", level: 95 },
                        { name: "UI/UX Design", level: 75 }
                      ].map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-400">{skill.name}</span>
                          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>Featured Projects</GradientText>
            </h2>
            <p className="text-xl text-gray-400">
              Building the future, one project at a time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>Tech Stack</GradientText>
            </h2>
            <p className="text-xl text-gray-400">
              Technologies I work with daily
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(skills).map(([category, skillList], index) => (
              <div key={index} className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-6 border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-500 h-full shadow-xl shadow-purple-500/5">
                  <h3 className="text-lg font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {skillList.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center space-x-3 group/skill">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                        <span className="text-gray-300 text-sm group-hover/skill:text-white transition-colors duration-300">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-24 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText>Achievements</GradientText>
            </h2>
            <p className="text-xl text-gray-400 mb-4">
              Recognition for innovation and excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900/30 backdrop-blur-2xl border-t border-purple-500/20 relative z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              <GradientText>Let's build something amazing together</GradientText>
            </h3>
            <p className="text-gray-400 mb-8">
              Always excited to collaborate on innovative projects
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://github.com/JACELL100" 
                 className="w-12 h-12 bg-gray-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-purple-500/30">
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://www.linkedin.com/in/jacell-jamble-8236ba286/" 
                 className="w-12 h-12 bg-gray-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-purple-500/30">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="mailto:jacelljamble@gmail.com" 
                 className="w-12 h-12 bg-gray-800/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-600 hover:to-violet-600 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg hover:shadow-purple-500/30">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <p>© 2025 Jacell Jamble. Crafted with passion.</p>
              <div className="flex items-center space-x-1">
                <span>Built with</span>
                <span className="text-red-400 animate-pulse">♥</span>
                <span>and lots of</span>
                <span className="animate-bounce">☕</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for card animations */}
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        @keyframes slowFlip0 {
          0%, 85% { transform: rotateY(0deg); }
          90%, 95% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip1 {
          0%, 80% { transform: rotateY(0deg); }
          85%, 95% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip2 {
          0%, 75% { transform: rotateY(0deg); }
          80%, 90% { transform: rotateY(180deg); }
          95%, 100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip3 {
          0%, 70% { transform: rotateY(0deg); }
          75%, 85% { transform: rotateY(180deg); }
          90%, 100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip4 {
          0%, 65% { transform: rotateY(0deg); }
          70%, 80% { transform: rotateY(180deg); }
          85%, 100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip5 {
          0%, 60% { transform: rotateY(0deg); }
          65%, 75% { transform: rotateY(180deg); }
          80%, 100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip6 {
          0%, 55% { transform: rotateY(0deg); }
          60%, 70% { transform: rotateY(180deg); }
          75%, 100% { transform: rotateY(0deg); }
        }
        @keyframes slowFlip7 {
          0%, 50% { transform: rotateY(0deg); }
          55%, 65% { transform: rotateY(180deg); }
          70%, 100% { transform: rotateY(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;