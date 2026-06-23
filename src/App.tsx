import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Gift, 
  Volume2, 
  Star, 
  MousePointer, 
  Music,
  Info 
} from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import WishesView from './components/WishesView';
import CakeGiftView from './components/CakeGiftView';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'wishes' | 'gift'>('home');
  const [partyFactor, setPartyFactor] = useState(0);
  const [avatarAnim, setAvatarAnim] = useState<'jump' | 'spin' | 'flash' | null>(null);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  // Sound generator helper for easter egg clicks
  const playEasterEggSound = (type: 'jump' | 'spin' | 'flash') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      if (type === 'jump') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);
      } else if (type === 'spin') {
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      }
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Ignored
    }
  };

  // Easter egg actions
  const triggerAvatarAction = (type: 'jump' | 'spin' | 'flash') => {
    setAvatarAnim(type);
    playEasterEggSound(type);

    // Particle emissions
    confetti({
      particleCount: 15,
      angle: type === 'jump' ? 90 : type === 'spin' ? 180 : 360,
      spread: 40,
      origin: { y: 0.4 },
      colors: ['#d81b60', '#7e57c2', '#ffd8e7']
    });

    const duration = type === 'spin' ? 600 : 500;
    setTimeout(() => {
      setAvatarAnim(null);
    }, duration);
  };

  // Celebration trigger
  const triggerCelebration = (e: React.MouseEvent) => {
    setPartyFactor(1.0);
    
    // Play sound crescendo
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
        osc2.frequency.setValueAtTime(554.37, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1108.73, ctx.currentTime + 0.6);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.8);
      }
    } catch(err){}

    // Confetti effects
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#d81b60', '#7e57c2', '#ffeb3b', '#ffd8e7']
    });

    // Multi firework blasts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60 + i * 15,
          spread: 55,
          origin: { x: 0.15 + i * 0.18, y: 0.45 },
          colors: ['#d81b60', '#ffd8e7', '#7e57c2', '#00bfff']
        });
      }, i * 220);
    }

    // Cooldown on partyFactor
    setTimeout(() => {
      setPartyFactor(0);
    }, 4000);
  };

  // Tracker mouse move for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial greeting confetti
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fce4ec', '#ffd8e7', '#7e57c2']
      });
    }, 800);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen text-slate-800 flex flex-col justify-between font-sans relative pb-28 md:pb-0 ${showCursor ? 'custom-cursor-none' : ''}`}>
      
      {/* Interactive WebGL Backdrop */}
      <ParticleBackground partyFactor={partyFactor} />

      {/* Optional Whimsical Custom Floating Cursor (🥳) */}
      {showCursor && (
        <div 
          className="fixed pointer-events-none z-[9999] text-[32px] select-none transition-transform duration-75 text-center leading-none"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`,
            transform: 'translate(-50%, -50%) rotate(10deg)'
          }}
        >
          🥳
        </div>
      )}

      {/* Floating Sparkles & Gift Boxes decorations */}
      <div className="absolute top-[20%] left-[8%] float-emoji select-none opacity-85 pointer-events-none animate-float text-3xl md:text-4xl">🍰</div>
      <div className="absolute top-[15%] right-[12%] float-emoji select-none opacity-85 pointer-events-none animate-float text-3xl md:text-5xl" style={{ animationDelay: '2.5s' }}>🎈</div>
      <div className="absolute bottom-[35%] left-[10%] float-emoji select-none opacity-85 pointer-events-none animate-float text-3xl md:text-4xl" style={{ animationDelay: '4s' }}>✨</div>
      <div className="absolute bottom-[22%] right-[8%] float-emoji select-none opacity-85 pointer-events-none animate-float text-3xl md:text-4xl" style={{ animationDelay: '1.5s' }}>🎁</div>

      {/* Desktop Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 duration-300 transition-all ${
        scrolled ? 'bg-[#050510]/80 backdrop-blur-xl shadow-lg shadow-black/40 py-3.5 border-b border-white/5' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className="font-display font-extrabold text-2xl text-primary hover:scale-105 active:scale-95 duration-200 transition-transform cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-6 h-6 text-indigo-400 fill-indigo-900/40" />
            <span>Para Juli 🌸</span>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-sm">
            {[
              { id: 'home', label: '¡Hola Juli! 🎉', icon: Sparkles },
              { id: 'wishes', label: 'Muro Deseos 💌', icon: Heart },
              { id: 'gift', label: 'Pastel & Regalo 🎂', icon: Gift },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-md shadow-primary/30' 
                      : 'text-slate-350 hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Extra utility panel features */}
          <div className="flex items-center gap-3">
            {/* Whimsical Cursor Toggle Button */}
            <button
              onClick={() => setShowCursor(!showCursor)}
              className={`p-2.5 rounded-full border transition-all duration-150 relative cursor-pointer ${
                showCursor 
                  ? 'bg-primary/20 text-primary border-primary/40' 
                  : 'bg-black/45 text-slate-300 border-white/10 hover:bg-black/60'
              }`}
              title={showCursor ? "Restaurar cursor clásico" : "Activar cursor de fiesta 🥳"}
            >
              <MousePointer className="w-4.5 h-4.5" />
              {showCursor && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto pt-24 md:pt-28 flex flex-col justify-center items-center flex-grow px-4 md:px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl flex flex-col items-center justify-center my-6"
            >
              <div className="glass-card p-6 md:p-12 rounded-[2.5rem] flex flex-col items-center w-full relative z-10 shadow-2xl border border-white/10" id="main-hero-card">
                
                {/* Text section */}
                <div className="text-center w-full px-2">
                  <h1 className="font-display font-extrabold text-4xl md:text-6xl text-primary mb-3 drop-shadow-sm tracking-tight">
                    ¡Hola Juli!
                  </h1>
                  <p className="font-sans font-semibold text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-lg mx-auto">
                    ¡Hoy empezamos un viaje vibrante! Prepárate para la fiesta.
                  </p>

                  {/* Main CTA button with pulse effects */}
                  <button
                    onClick={triggerCelebration}
                    className="bg-primary hover:bg-opacity-90 text-white font-display font-bold text-lg md:text-2xl px-10 py-4.5 rounded-full shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 duration-300 transition-all cursor-pointer inline-flex items-center gap-3 relative overflow-hidden group border border-white/25 animate-pulse-vibrant"
                  >
                    {/* Star particles behind */}
                    <StarsInsideBtn />
                    <span>¡Feliz Cumpleaños Juli!</span>
                  </button>
                  
                  {/* Subtle guides below button to help user explore other views */}
                  <div className="flex items-center justify-center gap-6 mt-10 border-t border-dashed border-white/10 pt-6">
                    <button 
                      onClick={() => setActiveTab('wishes')}
                      className="text-xs font-bold text-slate-300 hover:text-primary flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-secondary" />
                      Dejar Deseo
                    </button>
                    <button 
                      onClick={() => setActiveTab('gift')}
                      className="text-xs font-bold text-slate-300 hover:text-primary flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Gift className="w-3.5 h-3.5 text-secondary" />
                      Sorpresas
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : activeTab === 'wishes' ? (
            <motion.div
              key="wishes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WishesView />
            </motion.div>
          ) : (
            <motion.div
              key="gift"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <CakeGiftView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile Viewports Only) */}
      <nav className="md:hidden fixed bottom-1.5 left-2 right-2 z-50 flex justify-around items-center px-6 py-3 bg-black/80 backdrop-blur-xl rounded-[1.8rem] shadow-2xl border border-white/10">
        {[
          { id: 'home', label: 'Inicio', icon: Sparkles },
          { id: 'wishes', label: 'Mensajes', icon: Heart },
          { id: 'gift', label: 'Regalo', icon: Gift },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 gap-1 cursor-pointer select-none ${
                isActive 
                  ? 'text-primary scale-110 font-bold bg-primary/20 px-4' 
                  : 'text-slate-400 hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className="text-[10px] font-sans font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Persistent Decorative Footer (Desktop) */}
      <footer className="w-full text-center py-8 text-slate-400 font-sans border-t border-white/5 bg-black/20 relative z-10 pt-10 mt-12 hidden md:block">
        <h4 className="font-display font-bold text-3xl text-primary tracking-wide mb-2">Para Juli</h4>
        <div className="flex items-center justify-center gap-6 text-sm font-semibold text-slate-300 mb-4">
          <button onClick={() => setActiveTab('wishes')} className="hover:text-primary transition-colors cursor-pointer">Send a Wish</button>
          <button onClick={() => setActiveTab('gift')} className="hover:text-primary transition-colors cursor-pointer">Play Games</button>
        </div>
        <p className="text-xs text-slate-500 font-medium font-mono">With love, for Juli — 2024</p>
      </footer>

      {/* Styled pulse element internally used inside app */}
      <style>{`
        @keyframes pulse-vibrant {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.45);
            transform: scale(1);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(99, 102, 241, 0);
            transform: scale(1.04);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// Inner aesthetic effect component
function StarsInsideBtn() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
      <Star className="w-4 h-4 text-white fill-white absolute top-1 left-4 animate-bounce" />
      <Star className="w-3 h-3 text-white fill-white absolute bottom-1 right-3 animate-ping" />
    </div>
  );
}
