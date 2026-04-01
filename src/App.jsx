import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Cpu,
  ScanLine,
  Download,
  User,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Terminal as TerminalIcon,
  Activity,
  ExternalLink,
  Lock,
  Zap,
  Target,
  X,
  ChevronRight,
  Code2,
  Database,
  Globe
} from 'lucide-react';

// --- BOUNCING DVD SCREENSAVER ---
const BouncingDVD = () => {
  const logoRef = useRef(null);
  const requestRef = useRef();
  const audioRef = useRef(null);
  const [visible, setVisible] = useState(false); // Control visibility for delay

  const state = useRef({
    x: 100,
    y: 100,
    dx: 3,
    dy: 3,
    // Classic DVD logo colors
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff'],
    colorIndex: 4 // Start with Cyan like the image
  });

  // Init Audio & Timer
  useEffect(() => {
    // Initialize audio immediately to capture user gesture
    // Pointing to the file in the 'public' folder
    const audio = new Audio("/nightcall_kavinsky.mp3");
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Start playing immediately but MUTED to satisfy browser autoplay policy
    audio.volume = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Audio play blocked (browser policy):", error);
      });
    }

    const timer = setTimeout(() => {
      setVisible(true);
      // After 5 seconds:
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Restart song from beginning
        audioRef.current.volume = 0.008;   // Unmute to 2% volume (very subtle)
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Animation Effect
  useEffect(() => {
    if (!visible) return; // Don't start loop until visible

    // Initialize random start position slightly away from edges
    if (typeof window !== 'undefined' && logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      state.current.x = Math.random() * (window.innerWidth - rect.width);
      state.current.y = Math.random() * (window.innerHeight - rect.height);
    }

    const animate = () => {
      const logo = logoRef.current;
      if (!logo) return;

      const { innerWidth, innerHeight } = window;
      const rect = logo.getBoundingClientRect();
      const s = state.current;

      // Update position
      s.x += s.dx;
      s.y += s.dy;

      // Check collisions
      let hit = false;
      if (s.x + rect.width >= innerWidth) {
        s.x = innerWidth - rect.width;
        s.dx = -s.dx;
        hit = true;
      } else if (s.x <= 0) {
        s.x = 0;
        s.dx = -s.dx;
        hit = true;
      }

      if (s.y + rect.height >= innerHeight) {
        s.y = innerHeight - rect.height;
        s.dy = -s.dy;
        hit = true;
      } else if (s.y <= 0) {
        s.y = 0;
        s.dy = -s.dy;
        hit = true;
      }

      // Change color on hit
      if (hit) {
        s.colorIndex = (s.colorIndex + 1) % s.colors.length;
      }

      // Apply styles directly for performance
      const currentColor = s.colors[s.colorIndex];
      logo.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      logo.style.color = currentColor;
      logo.style.fill = currentColor;
      logo.style.filter = `drop-shadow(0 0 8px ${currentColor}80)`; // Add glow

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [visible]);

  if (!visible) return null; // Render nothing (black screen) during delay

  return (
    <div
      ref={logoRef}
      className="absolute top-0 left-0 w-48 h-24 flex items-center justify-center will-change-transform"
      style={{ color: '#00ffff' }} // Initial Cyan
    >
      <svg viewBox="0 0 200 100" className="w-full h-full fill-current">
        {/* DVD Text */}
        <text
          x="100"
          y="50"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="55"
          letterSpacing="-2"
          transform="scale(1, 0.8)"
        >
          DVD
        </text>

        {/* Disc Shape */}
        <ellipse cx="100" cy="70" rx="85" ry="14" />

        {/* VIDEO Text (Black to simulate cutout) */}
        <text
          x="100"
          y="75"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="bold"
          fontSize="14"
          fill="black"
          letterSpacing="4"
        >
          VIDEO
        </text>
      </svg>
    </div>
  );
};

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, speed = 10, className }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // Reset immediately when text changes
    setDisplayedText('');

    let i = 0;
    const timer = setInterval(() => {
      if (text && i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse inline-block w-2 h-4 align-middle ml-1 bg-current opacity-80"></span>
    </span>
  );
};

// --- CUSTOM CURSOR COMPONENT (Crosshair Only - Non Magnetic) ---
const CustomCursor = ({ darkMode }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <div
      ref={cursorRef}
      // Reverted to specific colors: Orange in Dark Mode, Inverted White (Black) in Light Mode
      className={`fixed top-0 left-0 w-4 h-4 border-l-2 border-t-2 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out
        ${darkMode ? 'border-[#ff5000]' : 'border-white'}`}
      style={{ marginTop: '-2px', marginLeft: '-2px' }}
    />
  );
};

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [booting, setBooting] = useState(true);
  const [glitch, setGlitch] = useState(false);
  const [powerOn, setPowerOn] = useState(true);
  const [bootText, setBootText] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({ cpu: 24, loss: "0.02%", sync: "STABLE" });
  const [shiftUI, setShiftUI] = useState(false);

  // Refs
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const name = "SHREYOJIT DAS";
  const capabilities = [
    { label: "PROG", skills: "C, C++, JAVA, PYTHON (OOPs)" },
    { label: "WEB", skills: "HTML, CSS, JS, REACT" },
    { label: "DATA", skills: "DBMS, SQL, DSA" },
    { label: "DOMAIN", skills: "DIGITAL ELECTRONICS, NETWORKING, BLOCKCHAIN, IoT" },
  ];

  const projects = [
    {
      id: "OBJ-00",
      title: "CAREER OBJECTIVE",
      category: "ASPIRANT",
      tech: "CYBERSECURITY // DATA ANALYTICS // AI",
      description: "HIGH-ACHIEVING BCA UNDERGRADUATE COMMITTED TO THE VISION OF 'GETTING TO THE FUTURE, FASTER', I OFFER PROVEN EXPERTISE ALIGNED WITH YOUR CORE SERVICE LINES. I BRING A CLIENT-CENTRIC MINDSET AND UNCONDITIONAL FLEXIBILITY TO DRIVE TECHNICAL EXCELLENCE.",
    },
    {
      id: "A-01",
      title: "TITAN VAULT",
      category: "SECURITY_ROOT",
      tech: "PYQT6 // USB_AUTH // AES-256",
      description: "SECURE LOCAL VAULT. REQUIRES PHYSICAL HARDWARE KEY AUTHENTICATION VIA ENCRYPTED USB HANDSHAKE. THE PRIMARY DEFENSE LAYER.",
    },
    {
      id: "B-02",
      title: "TACTILE BRAILLE",
      category: "IOT_HARDWARE",
      tech: "ARDUINO // C++",
      description: "REAL-TIME TRANSLATOR. CONVERTS DIGITAL STREAMS TO MECHANICAL OUTPUT FOR ACCESSIBILITY.",
    },
    {
      id: "C-03",
      title: "CRYPTO AI",
      category: "PREDICTION",
      tech: "LSTM // PYTHON",
      description: "HYBRID NEURAL NETWORK. SIMULATING CONSENSUS ALGORITHMS FOR MARKET STABILITY ANALYSIS.",
    },
    {
      id: "D-04",
      title: "SLEEP METRICS",
      category: "ZZZZZZZ",
      tech: "SCIKIT // ENSEMBLE",
      description: "BIO-MARKER ANALYSIS. ENSEMBLE LEARNING FOR REM-CYCLE DISORDER CLASSIFICATION.",
    }
  ];

  // --- AUDIO ENGINE ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq, type, duration, vol = 0.1, slideTo = null) => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
    }

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [initAudio]);

  const playClick = useCallback(() => {
    playTone(2000, 'sine', 0.035, 0.12, 600);
  }, [playTone]);

  const playHover = useCallback(() => {
    playTone(1200, 'sine', 0.03, 0.02, 1800);
  }, [playTone]);

  const playPowerSound = useCallback((poweringUp) => {
    const ctx = initAudio();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    if (poweringUp) {
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
    } else {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }, [initAudio]);

  const playTerminalSound = useCallback((isOpen) => {
    const ctx = initAudio();
    if (!ctx) return;
    playTone(isOpen ? 1500 : 800, 'square', 0.1, 0.05, isOpen ? 2000 : 400);
  }, [initAudio, playTone]);

  const playBootNoise = useCallback(() => {
    const count = 5;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        playTone(800 + Math.random() * 1000, 'sawtooth', 0.05, 0.02);
      }, i * 80);
    }
  }, [playTone]);

  useEffect(() => {
    const logs = [
      "LOADING KERNEL 6.8.0-VIRT...",
      "MOUNTING FILE SYSTEMS [OK]",
      "INITIALIZING SHREYOJIT_OS...",
      "CHECKING TELEMETRY STACK...",
      "AUTHENTICATING PORT_00...",
      "SYSTEM_READY: MISSION_START"
    ];

    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logs.length) {
        setBootText(prev => [...prev, logs[currentLog]]);
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          playTone(1000 + (currentLog * 200), 'square', 0.03, 0.01);
        }
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 500);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [playTone, initAudio]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * (28 - 21) + 21),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === '`' || e.key === '~') {
        setShowTerminal(prev => {
          playTerminalSound(!prev);
          return !prev;
        });
      }
      if (e.key === 'Escape') {
        if (showTerminal) playTerminalSound(false);
        setShowTerminal(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [playTerminalSound, showTerminal]);

  const changeProject = useCallback((direction) => {
    setActiveIndex(prev => {
      const next = prev + direction;
      if (next >= 0 && next < projects.length) {
        triggerHaptic();
        triggerGlitch();
        playClick();
        setShiftUI(true);
        setTimeout(() => setShiftUI(false), 120);
        return next;
      }
      return prev;
    });
  }, [projects.length, playClick]);

  const handleScroll = useCallback((e) => {
    if (window.innerWidth < 768) return;

    if (scrollContainerRef.current && scrollContainerRef.current.contains(e.target)) {
      return;
    }

    if (isScrolling || !powerOn || booting || showTerminal) return;
    if (Math.abs(e.deltaY) > 40) {
      e.preventDefault();
      setIsScrolling(true);
      const direction = e.deltaY > 0 ? 1 : -1;
      changeProject(direction);
      setTimeout(() => setIsScrolling(false), 200);
    }
  }, [isScrolling, powerOn, booting, showTerminal, changeProject]);

  const handleCapabilityScroll = (e) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 80);
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll, { passive: false });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [handleScroll]);

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(15);
    document.body.classList.add('haptic-shake');
    setTimeout(() => document.body.classList.remove('haptic-shake'), 100);
  };

  const togglePower = () => {
    triggerHaptic();
    playPowerSound(!darkMode);
    setBooting(true);
    setBootText(["RE-INITIALIZING_CORES..."]);
    playBootNoise();
    setTimeout(() => {
      setDarkMode(!darkMode);
      setBooting(false);
    }, 800);
  };

  const shutdown = () => {
    triggerHaptic();
    playPowerSound(!powerOn);
    setPowerOn(!powerOn);
  };

  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) changeProject(1);
    if (isRightSwipe) changeProject(-1);
  };

  const CapabilityItems = () => (
    <>
      {capabilities.map((cap, idx) => (
        <div key={idx} className="flex items-center gap-3 px-4 border-r border-current/10 flex-shrink-0 hover:bg-current/5 transition-colors duration-200 cursor-none" onMouseEnter={playHover}>
          <span className={`text-[8px] font-black uppercase tracking-tighter px-1 rounded-sm ${darkMode ? 'bg-[#ff5000] text-black' : 'bg-black text-white'}`}>
            {cap.label}
          </span>
          <span className="text-[9px] md:text-[10px] font-bold tracking-tight opacity-80">
            {cap.skills}
          </span>
        </div>
      ))}
    </>
  );

  return (
    <div
      className={`app-container h-[100dvh] w-full font-mono relative transition-colors duration-[400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col overflow-hidden cursor-none
      ${darkMode ? 'bg-[#0a0a0a] text-[#ff5000] selection:bg-[#ff5000] selection:text-black' : 'bg-[#d8d8d8] text-[#1a1a1a] selection:bg-black selection:text-white'}
    `}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={initAudio}
    >
      <CustomCursor darkMode={darkMode} />

      {booting && (
        <div className="absolute inset-0 z-[300] bg-black flex flex-col items-start justify-center p-12 overflow-hidden cursor-none">
          <div className="w-full h-[1px] bg-[#ff5000]/50 absolute top-0 animate-scanline"></div>
          <div className="flex flex-col gap-1">
            {bootText.map((text, i) => (
              <div key={i} className="text-[#ff5000] text-xs font-bold flex items-center gap-2">
                <ChevronRight size={12} /> {text}
              </div>
            ))}
            <div className="w-2 h-4 bg-[#ff5000] animate-pulse mt-2"></div>
          </div>
        </div>
      )}

      {showTerminal && (
        <div className="absolute inset-0 z-[250] bg-black/95 backdrop-blur-md p-6 md:p-12 flex flex-col border-4 border-[#ff5000]/20 m-4 rounded-xl cursor-none">
          <div className="flex justify-between items-center mb-8 border-b border-[#ff5000]/30 pb-4">
            <div className="flex items-center gap-3">
              <TerminalIcon className="text-[#ff5000]" />
              <span className="font-black text-lg tracking-widest uppercase">SYSTEM_COMMAND_OVERLAY</span>
            </div>
            <button onClick={() => setShowTerminal(false)} className="text-[#ff5000] hover:scale-110 transition-transform cursor-none">
              <X size={32} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 text-xs md:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[#ff5000]/50 uppercase font-bold tracking-widest">[ SYSTEM_LOGS ]</p>
                <p>&gt; AUTH_TOKEN_VALIDATED: SESSION_S_DAS</p>
                <p>&gt; IP_ADDR: 22.5726.88.3639</p>
                <p>&gt; ENCRYPTION: AES-256-GCM [ACTIVE]</p>
                <p>&gt; KERNEL_STATE: OPTIMIZED</p>
              </div>
              <div className="space-y-2">
                <p className="text-[#ff5000]/50 uppercase font-bold tracking-widest">[ PROJECT_METADATA ]</p>
                {projects.map(p => (
                  <p key={p.id}>&gt; {p.id}: {p.title} // {p.category}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-[#ff5000]/30 text-[10px] opacity-50 flex justify-between uppercase font-bold">
            <span>Operator: Shreyojit Das</span>
            <span>Esc to Exit Console</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className={`absolute inset-0 z-0 pointer-events-none opacity-20 transition-all duration-500`}
        style={{
          backgroundImage: `linear-gradient(${darkMode ? '#222' : '#999'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#222' : '#999'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}>
      </div>

      <div className={`absolute inset-0 z-[100] bg-black transition-opacity duration-1000 pointer-events-none ${powerOn ? 'opacity-0' : 'opacity-100'}`}>
        {!powerOn && <BouncingDVD />}
      </div>

      <header className="relative z-50 flex flex-shrink-0 flex-col md:flex-row justify-between items-start p-4 md:px-12 md:pt-6 gap-4 md:gap-0">
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="relative group laser-robot-container cursor-none">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none cursor-default uppercase flex overflow-hidden">
                {name.split("").map((char, i) => (
                  <span
                    key={i}
                    className={`laser-char ${char === " " ? "w-2" : ""}`}
                    style={{ '--index': i }}
                  >
                    {char}
                  </span>
                ))}
              </h1>
              <div className="laser-robot-arm">
                <div className="laser-spark"></div>
              </div>
            </div>
            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse ${powerOn ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-900'}`}></div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 text-[9px] md:text-[11px] font-bold tracking-widest opacity-80 uppercase">
            <span className="flex items-center gap-1.5"><MapPin size={11} /> Kolkata, IN</span>
            <span className="border border-current px-2 py-0.5 rounded-sm italic hidden md:inline">K-01.ALPHA</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={11} /> BCA STUDENT</span>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 items-center absolute top-4 right-4 md:static">
          <div className="flex flex-col items-end gap-1.5">
            <span className="hidden md:block text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]">System State</span>
            <MasterSwitch darkMode={darkMode} onClick={togglePower} onMouseEnter={playHover} />
          </div>
          <button
            onClick={shutdown}
            onMouseEnter={playHover}
            className={`w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center transition-all active:scale-95 cursor-none
                 ${powerOn ? 'border-red-500/50 text-red-500 hover:bg-red-500/10' : 'border-gray-500 text-gray-500'}`}
          >
            <Cpu size={18} className="md:w-[22px] md:h-[22px]" />
          </button>
        </div>
      </header>

      {/* CORE CAPABILITIES: IMPROVED TELEMETRY BAR */}
      <section className={`relative z-40 px-2 md:px-12 mb-2 transition-all duration-1000 flex-shrink-0 ${booting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <div className={`flex flex-col md:flex-row p-1 border-y border-current/10 overflow-hidden ${darkMode ? 'bg-current/5' : 'bg-white/50'}`}>
          <div className="flex items-center gap-2 px-3 py-1 border-r border-current/20 flex-shrink-0">
            <span className="text-[9px] font-black tracking-widest uppercase italic opacity-40">CAPABILITY_STREAM</span>
            <Activity size={10} className="animate-pulse text-green-500" />
          </div>
          {/* SCROLLABLE WRAPPER */}
          <div
            className="flex flex-1 overflow-x-auto no-scrollbar cursor-none"
            ref={scrollContainerRef}
            onWheel={handleCapabilityScroll}
            onMouseEnter={playHover}
          >
            {/* ANIMATED INNER WRAPPER */}
            <div className="flex animate-marquee whitespace-nowrap hover-pause gap-0 py-1 w-max cursor-none">
              {/* Render 4 sets for seamless loop on all screen sizes */}
              <CapabilityItems />
              <CapabilityItems />
              <CapabilityItems />
              <CapabilityItems />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA - Modified for Scroll on Mobile */}
      <main className={`flex-1 relative z-10 flex flex-col md:flex-row p-2 md:p-4 md:px-12 md:pb-8 gap-4 md:gap-10 overflow-y-auto md:overflow-hidden transition-all duration-[120ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${shiftUI ? '-translate-x-2' : 'translate-x-0'}
      `}>

        <div className={`w-full md:w-5/12 flex flex-col border-2 rounded-xl relative overflow-hidden transition-all duration-500 shadow-xl flex-shrink-0
            ${darkMode ? 'border-[#222] bg-[#0c0c0c]' : 'border-white bg-[#f0f0f0]'}
            h-[40vh] md:h-auto min-h-[250px]
        `}>
          <div className="p-3 md:p-4 flex justify-between items-center bg-current/5 border-b border-current/10 flex-shrink-0">
            <span className="text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.4em] font-black italic flex items-center gap-2">
              <TerminalIcon size={12} /> PROJECT_MANIFEST.EXE
            </span>
            <button
              onClick={() => { playTerminalSound(true); setShowTerminal(true); }}
              onMouseEnter={playHover}
              className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-current/20 hover:bg-[#ff5000] hover:text-black transition-colors cursor-none"
            >
              Open Terminal [~]
            </button>
          </div>

          <div
            onClick={() => { setActiveIndex(0); triggerHaptic(); triggerGlitch(); playClick(); }}
            onMouseEnter={playHover}
            className={`relative h-20 md:h-28 flex items-center px-4 md:px-8 border-b-2 border-dashed border-current/20 z-20 cursor-none group transition-all flex-shrink-0
              ${darkMode ? 'bg-black' : 'bg-white/80'} ${activeIndex === 0 ? 'bg-current/5' : ''}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${activeIndex === 0 ? 'bg-current animate-pulse' : 'bg-current/20'}`}></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold opacity-40 italic flex items-center gap-1.5 uppercase">
                <Target size={10} /> ROOT_OBJECTIVE // PORT_00
              </span>
              <h2 className={`text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-tight
                  ${activeIndex === 0 ? 'text-current' : 'opacity-30'} transition-opacity`}>
                CAREER_OBJECTIVE
              </h2>
              <span className="text-[9px] font-bold opacity-20 uppercase tracking-widest mt-1">Status: High_Achiever</span>
            </div>
            <Lock size={16} className={`ml-auto md:w-5 md:h-5 ${activeIndex === 0 ? 'opacity-100' : 'opacity-20'}`} />
          </div>

          <div className="flex-1 relative overflow-hidden cursor-none">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex items-center z-20 pointer-events-none px-2">
              <div className={`w-4 h-2 rounded-sm ${darkMode ? 'bg-[#ff5000] shadow-[0_0_10px_rgba(255,80,0,0.5)]' : 'bg-red-600'}`}></div>
              <div className={`flex-1 h-[1px] mx-2 ${darkMode ? 'bg-[#ff5000]/40' : 'bg-red-600/30'}`}></div>
              <div className={`w-4 h-2 rounded-sm ${darkMode ? 'bg-[#ff5000] shadow-[0_0_10px_rgba(255,80,0,0.5)]' : 'bg-red-600'}`}></div>
            </div>

            <div className="absolute top-1/2 w-full transition-transform duration-[180ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ transform: `translateY(-${activeIndex * (window.innerWidth < 768 ? 80 : 100) + (window.innerWidth < 768 ? 40 : 50)}px)` }}>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className={`h-[80px] md:h-[100px] flex items-center px-6 md:px-10 transition-all duration-[120ms] cursor-none group origin-left relative
                        ${i === activeIndex ? 'opacity-100 pl-10 md:pl-16 scale-105' : 'opacity-20 scale-90 blur-[0.5px] grayscale'}`}
                  onClick={() => { setActiveIndex(i); triggerHaptic(); triggerGlitch(); playClick(); }}
                  onMouseEnter={playHover}
                >
                  <div className="flex flex-col">
                    <span className={`text-[9px] md:text-[10px] font-bold mb-1 tracking-widest italic ${i === activeIndex ? 'block' : 'hidden'}`}>
                      {p.id} // NODE_LINK
                    </span>
                    <h2 className={`text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic font-header
                            ${darkMode ? 'text-[#ff5000]' : 'text-[#1a1a1a]'}
                          `}>
                      {p.title}
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 md:p-4 bg-current/5 flex justify-between items-center text-[10px] md:text-[11px] font-bold flex-shrink-0">
            <div className="flex items-center gap-2 opacity-50 italic uppercase">
              <div className={`w-2 h-2 rounded-full ${activeIndex === 0 ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
              UI_STATUS: {activeIndex === 0 ? 'GOAL_ALIGNED' : 'SYSTEM_OK'}
            </div>
            <div className="text-xl md:text-2xl font-black italic">{activeIndex + 1} / {projects.length}</div>
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col gap-4 overflow-hidden min-h-[400px]">

          <div className={`flex-1 rounded-xl p-4 md:p-10 flex flex-col relative overflow-y-auto md:overflow-hidden transition-all duration-500
              ${darkMode
              ? 'bg-[#0f0a00] border-2 border-[#222] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]'
              : 'bg-[#e2e2e2] border-2 border-white shadow-[inset_0_4px_15px_rgba(0,0,0,0.1)]'}
            `}>

            <div className="flex justify-between items-start border-b border-current/10 pb-5 mb-5 uppercase font-bold flex-shrink-0">
              <div className="flex flex-col gap-1.5">
                <div className={`px-4 py-1 text-[10px] md:text-[12px] font-black tracking-[0.2em] uppercase rounded-sm inline-block
                        ${darkMode ? 'bg-[#ff5000] text-black' : 'bg-black text-white'}`}>
                  {projects[activeIndex].category}
                </div>
                <span className="text-[9px] md:text-[10px] opacity-50 italic tracking-widest mt-1">LOG_UID: {projects[activeIndex].id}</span>
              </div>
              <div className="flex flex-col items-end">
                <Activity size={18} className="text-green-500/30 mb-1 md:w-5 md:h-5" />
                <span className="text-[8px] opacity-40">SYNC_STAT: {systemMetrics.sync}</span>
              </div>
            </div>

            <div className={`flex-1 flex flex-col justify-center relative transition-all duration-[80ms] ${glitch ? 'translate-x-2 skew-x-6 opacity-30 grayscale blur-[1px]' : ''}`}>
              <div className="absolute top-2 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-20"></div>
              <div className="absolute bottom-2 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-20"></div>

              <div className="pl-4 md:pl-6 border-l-2 border-current/10 py-2">
                <h3 className="text-[9px] md:text-[10px] font-bold opacity-30 tracking-[0.3em] mb-4 font-mono italic uppercase">
                  <span className="animate-pulse">&gt;</span> {activeIndex === 0 ? 'MISSION_PARAMETERS' : (projects[activeIndex].isSkills ? 'CAPABILITY_REPORT' : 'CORE_DATA_STREAM')}
                </h3>

                {/* TYPEWRITER EFFECT APPLIED HERE */}
                <p className={`font-black leading-[1.15] uppercase tracking-tighter italic font-header pr-2 transition-all duration-200
                        ${activeIndex === 0 ? 'text-lg md:text-2xl' : (projects[activeIndex].isSkills ? 'text-md md:text-xl' : 'text-xl md:text-3xl')}
                        ${darkMode ? 'drop-shadow-[0_0_8px_rgba(255,80,0,0.3)]' : ''}
                      `}>
                  <Typewriter text={`"${projects[activeIndex].description}"`} speed={15} />
                </p>

              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-current/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 flex-shrink-0">
              <div className="flex-1 min-w-0 w-full">
                <div className="text-[9px] md:text-[10px] tracking-[0.3em] font-bold opacity-30 mb-2 uppercase italic">
                  {activeIndex === 0 ? 'Core Expertise' : (projects[activeIndex].isSkills ? 'SYNTHESIZED_STACK' : 'Integrated Stack')}
                </div>
                <div className={`text-[10px] md:text-sm font-black px-4 py-2 inline-flex border rounded-sm italic break-words max-w-full leading-tight
                        ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}
                      `}>
                  {projects[activeIndex].tech}
                </div>
              </div>
              <div className="flex-shrink-0 flex gap-4 w-full md:w-auto">
                <button
                  onMouseEnter={playHover}
                  className="flex-1 md:flex-none justify-center items-center gap-2.5 text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-current px-4 py-2 hover:bg-current hover:text-black transition-colors whitespace-nowrap group cursor-none"
                >
                  <div className="w-1.5 h-1.5 bg-current mr-1 hidden group-hover:block animate-pulse"></div>
                  <ExternalLink size={13} /> {activeIndex === 0 ? 'PORTFOLIO_LINK' : 'SOURCE_CODE'}
                </button>
              </div>
            </div>
          </div>

          <div className={`h-auto md:h-28 flex-shrink-0 border-2 rounded-xl p-4 md:px-8 flex flex-col md:flex-row justify-between items-center transition-all duration-500 gap-4 md:gap-0 relative overflow-hidden
              ${darkMode ? 'bg-[#0a0a0a] border-[#222]' : 'bg-[#e8e8e8] border-white shadow-lg'}
            `}>
            <div className="flex gap-3 w-full md:w-auto justify-center">
              <ChicletButton icon={<Github size={20} />} href="https://github.com/SD10LEGACY" darkMode={darkMode} label="GHUB" playHover={playHover} />
              <ChicletButton icon={<Linkedin size={20} />} href="https://www.linkedin.com/in/shreyojit-das-659155283/" darkMode={darkMode} label="LINK" playHover={playHover} />
              <ChicletButton icon={<Mail size={20} />} href="mailto:shreyojit.iembca2026@gmail.com" darkMode={darkMode} label="MAIL" playHover={playHover} />
              <ChicletButton icon={<Download size={20} />} href="/ShreyojitDasResume.pdf" label="RESUME" darkMode={darkMode} highlight isDownload={true} downloadName="ShreyojitDasResume.pdf" playHover={playHover} />
            </div>

            <div className="flex items-center gap-4 md:gap-8 border-t md:border-t-0 md:border-l-2 border-current/10 pt-3 md:pt-0 md:pl-8 w-full md:w-auto justify-between md:justify-end h-auto md:h-16">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[11px] font-black opacity-30 tracking-widest uppercase italic leading-none mb-1.5">PERFORMANCE_AVG</span>
                <div className="text-3xl md:text-4xl font-black tracking-tighter italic leading-none">9.55<span className="text-sm opacity-50 ml-1.5 italic font-mono uppercase">CGPA</span></div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="w-14 h-1.5 bg-current/10 rounded-full flex overflow-hidden">
                  <div className={`h-full bg-[#ff5000] transition-all duration-700`} style={{ width: `${systemMetrics.cpu}%` }}></div>
                </div>
                <span className="text-[8px] md:text-[9px] opacity-40 font-bold uppercase italic tracking-wider">PROCESSOR_LOAD: {systemMetrics.cpu}%</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="relative z-10 flex-shrink-0 p-4 px-4 md:px-12 text-[9px] md:text-[10px] font-bold opacity-30 tracking-[0.2em] md:tracking-[0.4em] flex flex-col md:flex-row justify-between items-center border-t border-current/5 uppercase gap-2 md:gap-0">
        <span className="italic text-center md:text-left">&copy; 2026 OPERATOR_S_DAS // SYSTEMS ARCHITECT</span>
        <div className="flex gap-4 md:gap-10">
          <span>PACKET_LOSS: {systemMetrics.loss}</span>
          <span className="hidden md:inline">KERNEL: 6.8.0-VIRT</span>
          <span className="hidden md:inline">COORDS: 22.5700104&deg;N / 88.4297557&deg;E</span>
        </div>
      </footer>

      <Screw top="12px" left="12px" />
      <Screw top="12px" right="12px" />
      <Screw bottom="12px" left="12px" />
      <Screw bottom="12px" right="12px" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap');
        
        body { 
          font-family: 'Share Tech Mono', monospace; 
          overflow: hidden; 
          margin: 0;
          background: #000;
          cursor: none; /* Hide default cursor */
        }
        /* Marquee for mobile capabilities */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); } /* -25% because we have 4 duplicate sets */
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        .hover-pause:hover {
          animation-play-state: paused;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        h1, h2, .font-header {
          font-family: 'Rajdhani', sans-serif;
        }

        /* ROBOTIC LASER CRAFTING ANIMATION */
        .laser-robot-container {
          position: relative;
          padding: 5px 0;
        }

        .laser-char {
          display: inline-block;
          position: relative;
          color: rgba(255, 80, 0, 0.05);
          animation: char-reveal 0.1s linear forwards;
          animation-delay: calc(1.5s + (var(--index) * 0.15s));
          transition: color 0.1s;
        }

        @keyframes char-reveal {
          0% { color: rgba(255, 80, 0, 0.05); text-shadow: none; }
          50% { color: white; text-shadow: 0 0 10px #ff5000; }
          100% { color: inherit; text-shadow: none; }
        }

        .laser-robot-arm {
          position: absolute;
          top: -20%;
          left: -10px;
          height: 140%;
          width: 2px;
          background: linear-gradient(to bottom, transparent, #fff, transparent);
          box-shadow: 0 0 15px #ff5000;
          z-index: 20;
          pointer-events: none;
          opacity: 0;
          animation: robot-sweep 2.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 1.5s;
        }

        .laser-spark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 20px 5px #ff5000, 0 0 40px 10px #ff5000;
          animation: spark-jitter 0.05s infinite;
        }

        @keyframes robot-sweep {
          0% { left: 0; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes spark-jitter {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-45%, -55%) scale(1.3); opacity: 0.8; }
        }

        @keyframes haptic-shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        .animate-scanline {
          animation: scanline 2.5s linear infinite;
        }
        
        .haptic-shake {
          animation: haptic-shake 0.08s linear both;
        }
        
        .haptic-shake.bg-[#0a0a0a] {
          filter: drop-shadow(4px 0px 0px rgba(255, 80, 0, 0.5)) 
                  drop-shadow(-4px 0px 0px rgba(0, 246, 255, 0.2));
        }

        /* UPDATED: Changed selector from .h-screen to .app-container to fix scanlines */
        .app-container::after {
          content: " ";
          display: block;
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.005), rgba(0, 255, 0, 0.005), rgba(0, 0, 255, 0.005));
          z-index: 200;
          background-size: 100% 4px, 4px 100%;
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

const ChicletButton = ({ icon, href, darkMode, label, highlight, isDownload, downloadName, playHover }) => {
  return (
    <a
      href={href}
      target={isDownload ? undefined : "_blank"}
      rel="noopener noreferrer"
      download={isDownload ? downloadName : undefined}
      onMouseEnter={playHover}
      className={`
        w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center rounded-xl 
        transition-all duration-75 relative group cursor-none
        ${darkMode
          ? `bg-[#141414] hover:bg-[#1a1a1a] 
               ${highlight
            ? 'text-[#ff5000] shadow-[inset_0_0_0_1px_#ff5000,0_4px_0_rgba(255,80,0,0.5)]'
            : 'text-gray-500 shadow-[inset_0_0_0_1px_#000,0_4px_0_#000]'}`
          : `bg-[#f8f8f8] hover:bg-white text-black 
               ${highlight
            ? 'text-red-600 shadow-[inset_0_0_0_1px_#dc2626,0_4px_0_#dc2626]'
            : 'shadow-[inset_0_0_0_1px_#bbb,0_4px_0_#bbb]'}`}
        active:translate-y-[4px]
        ${darkMode
          ? `active:shadow-[inset_0_0_0_1px_${highlight ? '#ff5000' : '#000'}]`
          : `active:shadow-[inset_0_0_0_1px_${highlight ? '#dc2626' : '#bbb'}]`}
      `}
    >
      <div className="transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[7px] md:text-[8px] font-black mt-1.5 tracking-tighter opacity-60 uppercase italic">{label}</span>
      <div className={`absolute top-1 right-1 w-1 h-1 rounded-full ${highlight ? 'bg-[#ff5000] animate-pulse' : 'bg-current opacity-10'}`}></div>
    </a>
  );
};

const MasterSwitch = ({ darkMode, onClick, onMouseEnter }) => {
  return (
    <button onClick={onClick} onMouseEnter={onMouseEnter} className="group flex items-center gap-2 md:gap-4 cursor-none select-none">
      <div className={`text-[10px] font-black tracking-widest transition-all hidden md:block ${darkMode ? 'opacity-100 text-[#ff5000]' : 'opacity-20'}`}>NIGHT</div>
      <div className={`w-9 h-4 md:w-11 md:h-5 rounded-full border flex items-center p-0.5 transition-all duration-300 ${darkMode ? 'bg-[#ff5000]/10 border-[#ff5000]' : 'bg-[#ccc] border-[#999]'}`}>
        <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transform transition-all duration-300 ${darkMode ? 'translate-x-4 md:translate-x-5 bg-[#ff5000]' : 'translate-x-0 bg-[#333]'}`}></div>
      </div>
      <div className={`text-[10px] font-black tracking-widest transition-all hidden md:block ${!darkMode ? 'opacity-100' : 'opacity-20'}`}>DAY</div>
    </button>
  )
}

const Screw = ({ top, left, bottom, right }) => (
  <div
    className="absolute w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-gray-500/20 to-gray-800/20 border border-black/10 flex items-center justify-center opacity-10 pointer-events-none z-0 hidden md:flex"
    style={{ top, left, bottom, right }}
  >
    <div className="w-full h-[1px] bg-black/40 rotate-[45deg] absolute"></div>
    <div className="w-[1px] h-full bg-black/40 rotate-[45deg] absolute"></div>
  </div>
);

export default App;