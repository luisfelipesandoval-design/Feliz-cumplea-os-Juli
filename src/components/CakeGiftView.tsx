import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Volume2, Smile, RefreshCw, Star, Heart } from 'lucide-react';
import { COMPLIMENTS, SOUND_OPTIONS } from '../data';
import confetti from 'canvas-confetti';

export default function CakeGiftView() {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true]);
  const [wishText, setWishText] = useState('');
  const [wishDeclared, setWishDeclared] = useState(false);
  const [giftClicks, setGiftClicks] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [activeCompliment, setActiveCompliment] = useState('¡Haz clic abajo para descubrir una cualidad hermosa! ✨');
  const [spinning, setSpinning] = useState(false);

  // Play synthetic audio dynamically using Web Audio API
  const playSound = (freq: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Synthesize a beautiful chiptune sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Quick pitch ramp up for chirpy "happy" feeling
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("AudioContext block by browser auto-play policy or not supported.");
    }
  };

  const blowCandle = (index: number) => {
    if (!candlesLit[index]) return;
    const next = [...candlesLit];
    next[index] = false;
    setCandlesLit(next);
    
    // Play sweet chime
    playSound(440 + index * 100);

    // Little local spark
    confetti({
      particleCount: 8,
      spread: 20,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500']
    });

    // If all blown
    if (next.every(c => !c)) {
      setTimeout(() => {
        // Grand flash
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#d81b60', '#ffeb3b', '#7e57c2']
        });
      }, 300);
    }
  };

  const resetCandles = () => {
    setCandlesLit([true, true, true, true]);
    setWishText('');
    setWishDeclared(false);
  };

  const handleGiftClick = () => {
    if (giftOpened) return;
    
    const nextClicks = giftClicks + 1;
    setGiftClicks(nextClicks);

    // Sound synth: higher pitches as we get closer to opening!
    playSound(300 + nextClicks * 50);

    // Trigger local sparks
    confetti({
      particleCount: 5,
      spread: 40,
      origin: { y: 0.65 },
      colors: ['#fce4ec', '#d81b60']
    });

    if (nextClicks >= 8) {
      setGiftOpened(true);
      // Unleash massive golden confetti explosion!
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#d81b60', '#7e57c2', '#ffffff']
      });
      // Sound celebratory fanfare
      setTimeout(() => playSound(659.25), 100);
      setTimeout(() => playSound(880), 200);
      setTimeout(() => playSound(1046.5), 350);
    }
  };

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    
    // Fake slot machine tick sounds
    let counter = 0;
    const interval = setInterval(() => {
      const randomComp = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
      setActiveCompliment(randomComp);
      playSound(300 + (counter % 5) * 80);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setSpinning(false);
        // Little sprinkle of success star particles
        confetti({
          particleCount: 15,
          angle: 45,
          spread: 45,
          origin: { x: 0.2, y: 0.7 }
        });
        confetti({
          particleCount: 15,
          angle: 135,
          spread: 45,
          origin: { x: 0.8, y: 0.7 }
        });
      }
    }, 150);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <span className="text-4xl">🎂🎁</span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-primary mt-2">
          La Sorpresa Interactiva
        </h2>
        <p className="text-on-surface-variant font-medium text-base mt-2 max-w-lg mx-auto">
          Apaga tus velitas digitales, unboxing interactivo del regalo misterioso y juega con el piano cumpleaños.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        
        {/* VIEW 1: Birthday Cake */}
        <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col items-center justify-between shadow-xl relative order-1">
          <div className="w-full text-center">
            <span className="text-xs font-bold text-primary bg-primary-container px-3 py-1 rounded-full uppercase tracking-wider">
              Pide tu Deseo ✨
            </span>
            <h3 className="font-display font-bold text-2xl text-white mt-3">
              Pastel de Cumpleaños Mágico
            </h3>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              Haz clic sobre cada velita para soplar y apagar las llamas.
            </p>
          </div>

          {/* Interactive Cake Illustration in CSS */}
          <div className="relative w-full h-64 flex items-center justify-center my-6">
            <div className="absolute bottom-6 w-56 h-18 bg-primary/20 rounded-full blur-xl pointer-events-none" />
            
            {/* The Cake */}
            <div className="relative flex flex-col items-center">
              {/* Candles group */}
              <div className="flex gap-7 -mb-2 z-10 relative">
                {candlesLit.map((isLit, i) => (
                  <button
                    key={i}
                    onClick={() => blowCandle(i)}
                    className="flex flex-col items-center focus:outline-none focus:scale-105 transition-transform relative group"
                    title="Apagar vela"
                  >
                    {/* Flame */}
                    <AnimatePresence>
                      {isLit ? (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1],
                            rotate: [-2, 2, -1, 3, 0],
                            y: [0, -1, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          exit={{ opacity: 0, scale: 0.1, y: -15 }}
                          className="w-4 h-7 bg-gradient-to-t from-yellow-300 via-amber-500 to-red-500 rounded-full shadow-[0_0_12px_#ffeb3b] absolute -top-8"
                        />
                      ) : (
                        // Smoke puff puff
                        <motion.span
                          initial={{ opacity: 0.8, scale: 0.4, y: -5 }}
                          animate={{ opacity: 0, scale: 1.5, y: -25 }}
                          transition={{ duration: 0.5 }}
                          className="absolute -top-7 text-xs pointer-events-none select-none"
                        >
                          💨
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Candle body */}
                    <div className={`w-3.5 h-12 rounded-t-md shadow-sm transition-all ${
                      i % 2 === 0 ? 'bg-gradient-to-b from-blue-300 to-indigo-400' : 'bg-gradient-to-b from-pink-300 to-rose-400'
                    }`} />
                    {/* Candle base */}
                    <div className="w-4 h-1 bg-slate-700/30 rounded-full" />
                  </button>
                ))}
              </div>

              {/* Top Layer */}
              <div className="w-36 h-12 bg-pink-100 rounded-t-2xl border-b-4 border-pink-200 relative shadow-inner z-3 flex items-center justify-center">
                <span className="text-[10px] font-bold text-pink-700 tracking-widest uppercase">Fresa</span>
                <div className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full" />
              </div>
              {/* Middle Layer */}
              <div className="w-48 h-12 bg-purple-100 border-b-4 border-purple-200 relative shadow-inner z-2 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-purple-700 tracking-widest uppercase">Crema Lila</span>
                <div className="absolute -bottom-1 left-2 right-2 h-2.5 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" />
              </div>
              {/* Bottom Layer */}
              <div className="w-56 h-14 bg-amber-50 rounded-b-2xl shadow-lg relative z-1 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Chocolate Sol</span>
                {/* Drips of strawberry syrup */}
                <div className="absolute top-0 left-6 w-3 h-4 bg-red-400 rounded-b-full" />
                <div className="absolute top-0 left-16 w-4 h-6 bg-red-400 rounded-b-full" />
                <div className="absolute top-0 left-28 w-3.5 h-4.5 bg-red-400 rounded-b-full" />
                <div className="absolute top-0 left-44 w-3.5 h-5 bg-red-400 rounded-b-full" />
              </div>
            </div>
          </div>

          <div className="w-full space-y-4">
            {candlesLit.every(c => !c) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-2xl"
              >
                {!wishDeclared ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-emerald-200">
                      ¡Todas las velitas apagadas! Escribe tu deseo secreto:
                    </p>
                    <div className="flex gap-2 overflow-hidden">
                      <input
                        type="text"
                        placeholder="Quiero viajar más / Ser súper feliz..."
                        value={wishText}
                        onChange={e => setWishText(e.target.value)}
                        className="flex-1 px-4 py-2 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-black/50 text-white placeholder-slate-400 text-sm"
                      />
                      <button
                        onClick={() => {
                          if (wishText.trim()) {
                            setWishDeclared(true);
                            confetti({ particleCount: 30, spread: 50, colors: ['#4ade80'] });
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shrink-0"
                      >
                        Enviar Deseo 🌟
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🌟 deseo registrado 🌟</p>
                    <p className="font-display font-semibold text-emerald-100 mt-1">
                      "¡Que todo lo que anheles se multiplique este año!"
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-center text-xs font-semibold text-slate-300">
                Sopla los {candlesLit.filter(Boolean).length} velitas que faltan para pedir tu deseo anual.
              </p>
            )}

            <div className="flex justify-center">
              <button
                onClick={resetCandles}
                className="text-xs hover:text-primary text-slate-400 flex items-center gap-1.5 font-bold focus:outline-none"
              >
                <RefreshCw className="w-3.5 h-3.5 text-secondary" />
                Volver a encender pastel
              </button>
            </div>
          </div>
        </div>

        {/* VIEW 2: Magic Gift Box */}
        <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col items-center justify-between shadow-xl order-2">
          <div className="w-full text-center">
            <span className="text-xs font-bold text-secondary bg-secondary-container px-3 py-1 rounded-full uppercase tracking-wider">
              Con cariño para Juli ✨
            </span>
            <h3 className="font-display font-bold text-2xl text-white mt-3">
              El Regalo Sorpresa
            </h3>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              {giftOpened 
                ? '¡Has desenvuelto tu regalo con éxito! Goza tus sorpresas.' 
                : 'Dale clics seguidos para romper el empaque dorado.'}
            </p>
          </div>

          {/* Interactive Gift Illustration */}
          <div className="my-6 relative flex flex-col items-center justify-center h-48 w-full">
            <AnimatePresence mode="wait">
              {!giftOpened ? (
                <motion.button
                  key="closed-gift"
                  onClick={handleGiftClick}
                  whileTap={{ scale: 0.9, rotate: [5, -5, 0] }}
                  className="focus:outline-none flex flex-col items-center cursor-pointer relative group"
                >
                  {/* Floating sparkles */}
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 absolute -top-8 -left-6 animate-pulse" />
                  <Star className="w-5 h-5 text-pink-400 fill-pink-400 absolute -bottom-4 right-10 animate-bounce" style={{ animationDuration: '4s' }} />

                  {/* Ribbon Bow */}
                  <div className="w-18 h-10 bg-rose-500 rounded-full shadow-sm relative -mb-3 z-10 flex justify-center items-center">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-white absolute" />
                  </div>
                  
                  {/* Gift Box Base */}
                  <div className="w-32 h-30 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 rounded-2xl shadow-xl flex flex-col items-center justify-center relative border-4 border-white/40 overflow-hidden transform hover:scale-105 active:scale-95 duration-250">
                    {/* Pink wrapping ribbon lines */}
                    <div className="absolute inset-y-0 w-6 bg-rose-500 h-full" />
                    <div className="absolute inset-x-0 h-6 bg-rose-500 w-full" />
                    <Gift className="w-12 h-12 text-white absolute z-5 stroke-1" />
                  </div>

                  {/* Clicks prompt tag */}
                  <span className="mt-4 text-xs font-bold text-primary bg-primary-container px-3 py-1 rounded-full animate-bounce">
                    💥 ¡Clickea! ({giftClicks}/8)
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  key="opened-gift"
                  initial={{ opacity: 0, scale: 0.7, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  <p className="text-xl font-display font-bold text-pink-400 flex items-center gap-1.5 animate-pulse">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                    ¡Sorpresa Abierta!
                  </p>
                  
                  {/* Complement Board inside Opened Box */}
                  <div className="mt-4 p-5 bg-black/40 border border-white/10 rounded-2xl shadow-inner text-center max-w-sm w-full relative">
                    <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1.5">🌟 Eres Súper Especial 🌟</p>
                    <p className="text-white text-sm md:text-base font-semibold leading-relaxed min-h-[48px] flex items-center justify-center px-2">
                      {activeCompliment}
                    </p>
                    
                    <button
                      onClick={spinWheel}
                      disabled={spinning}
                      className="mt-4 w-full bg-primary hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      {spinning ? 'Descubriendo...' : 'Girar Rueda de Halagos 🎡'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full bg-black/40 p-4 rounded-2xl border border-dashed border-white/15">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-center mb-3">
              🎵 Piano de Notas Cumpleañeras
            </h4>
            
            {/* Real Audio soundboard */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SOUND_OPTIONS.map((snd) => (
                <button
                  key={snd.name}
                  onClick={() => playSound(snd.frequency)}
                  className="flex items-center gap-1 bg-black/50 hover:bg-black/70 border border-white/5 hover:border-white/15 py-1.5 px-3 rounded-lg text-xs font-bold text-slate-200 transition-all transform active:scale-90 cursor-pointer"
                >
                  <span>{snd.emoji}</span>
                  <span>{snd.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
