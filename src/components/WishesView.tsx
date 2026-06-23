import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, Sparkles, Smile, Trash2, Search, Filter } from 'lucide-react';
import { Wish } from '../types';
import { PRESET_WISHES, AVAILABLE_STICKERS } from '../data';
import confetti from 'canvas-confetti';

export default function WishesView() {
  const [wishes, setWishes] = useState<Wish[]>(() => {
    const saved = localStorage.getItem('juli_muro_wishes_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PRESET_WISHES;
      }
    }
    return PRESET_WISHES;
  });

  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState<Wish['color']>('pink');
  const [selectedSticker, setSelectedSticker] = useState('🎉');
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState<'all' | Wish['color']>('all');

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !text.trim()) return;

    const newWish: Wish = {
      id: `wish-${Date.now()}`,
      sender: sender.trim(),
      text: text.trim(),
      color,
      sticker: selectedSticker,
      date: 'Hace un momento',
      likes: 0
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem('juli_muro_wishes_v3', JSON.stringify(updated));

    // Clear inputs
    setSender('');
    setText('');
    setSelectedSticker('🎉');

    // Fun confetti explosion!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#d81b60', '#7e57c2', '#fce4ec']
    });
  };

  const handleDeleteWish = (id: string) => {
    const updated = wishes.filter(w => w.id !== id);
    setWishes(updated);
    localStorage.setItem('juli_muro_wishes_v3', JSON.stringify(updated));
  };

  const handleLikeWish = (id: string) => {
    const updated = wishes.map(w => {
      if (w.id === id) {
        // Multi star pop animation for cute interaction
        if (Math.random() > 0.4) {
          confetti({
            particleCount: 15,
            spread: 30,
            origin: { y: 0.6 },
            ticks: 50,
            colors: ['#FFD700', '#FF8A80', '#e9bacd']
          });
        }
        return { ...w, likes: w.likes + 1 };
      }
      return w;
    });
    setWishes(updated);
    localStorage.setItem('juli_muro_wishes_v3', JSON.stringify(updated));
  };

  const colorStyles: Record<Wish['color'], { bg: string, text: string, border: string, accent: string }> = {
    pink: {
      bg: 'bg-pink-950/30 backdrop-blur-md',
      text: 'text-pink-100',
      border: 'border-pink-500/30 focus:ring-pink-500/20',
      accent: 'bg-pink-500'
    },
    lavender: {
      bg: 'bg-purple-950/30 backdrop-blur-md',
      text: 'text-purple-100',
      border: 'border-purple-500/30 focus:ring-purple-500/20',
      accent: 'bg-purple-500'
    },
    yellow: {
      bg: 'bg-amber-950/20 backdrop-blur-md',
      text: 'text-amber-100',
      border: 'border-amber-500/30 focus:ring-amber-500/20',
      accent: 'bg-amber-500'
    },
    blue: {
      bg: 'bg-blue-950/30 backdrop-blur-md',
      text: 'text-blue-100',
      border: 'border-blue-500/30 focus:ring-blue-500/20',
      accent: 'bg-blue-500'
    },
    mint: {
      bg: 'bg-emerald-950/30 backdrop-blur-md',
      text: 'text-emerald-100',
      border: 'border-emerald-500/30 focus:ring-emerald-500/20',
      accent: 'bg-emerald-500'
    }
  };

  const filteredWishes = wishes.filter(w => {
    const matchesSearch = w.sender.toLowerCase().includes(search.toLowerCase()) || 
                          w.text.toLowerCase().includes(search.toLowerCase());
    const matchesColor = colorFilter === 'all' || w.color === colorFilter;
    return matchesSearch && matchesColor;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl md:text-5xl text-primary inline-flex items-center gap-3 justify-center">
          <Sparkles className="w-8 h-8 text-secondary animate-bounce" />
          Muro de los Buenos Deseos 💖
        </h2>
        <p className="text-on-surface-variant font-semibold mt-3 max-w-xl mx-auto">
          ¡Dedícale un mensaje hermoso a Juli en su día especial! Elige tu sticker, el color del papel y pégalo en el muro interactivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wish Form (4 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-3xl shadow-xl sticky top-24">
          <form onSubmit={handleAddWish} className="space-y-5">
            <h3 className="font-display font-bold text-xl text-primary flex items-center gap-2">
              <Smile className="w-5.5 h-5.5 text-secondary" />
              Escribir Dedicatoria
            </h3>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">
                Tu nombre o apodo ❤️
              </label>
              <input
                type="text"
                required
                maxLength={25}
                placeholder="Ej. Primo Santi o Tu amigui Valen"
                value={sender}
                onChange={e => setSender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none bg-black/40 text-white placeholder-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">
                Tu mensaje de cumpleaños ✨
              </label>
              <textarea
                required
                rows={4}
                maxLength={280}
                placeholder="¡Qué este año sea súper maravilloso para ti! Mucho amor, pastel y sonrisas infinitas..."
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-primary focus:outline-none bg-black/40 text-white placeholder-slate-400 font-medium text-sm"
              />
            </div>

            {/* Sticker Picker */}
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Elige tu sticker decorativo:
              </label>
              <div className="flex flex-wrap gap-2 h-20 overflow-y-auto p-1.5 bg-black/40 rounded-xl border border-dashed border-white/10">
                {AVAILABLE_STICKERS.map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedSticker(st)}
                    className={`w-9 h-9 flex items-center justify-center text-lg rounded-full transition-all duration-150 transform active:scale-125 ${
                      selectedSticker === st 
                        ? 'bg-primary-container scale-110 shadow-md border border-primary' 
                        : 'bg-black/30 hover:bg-black/50 hover:scale-105 border border-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Elige el tono de tu tarjetita:
              </label>
              <div className="flex items-center gap-3">
                {(Object.keys(colorStyles) as Wish['color'][]).map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColor(col)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === col ? 'border-primary scale-110 shadow-md' : 'border-transparent hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: col === 'pink' ? '#ffd8e7' : 
                                       col === 'lavender' ? '#e1e1f5' : 
                                       col === 'yellow' ? '#fef3c7' : 
                                       col === 'blue' ? '#dbeafe' : '#dcfce7'
                    }}
                    title={col}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-95 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] mt-2 group"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              ¡Publicar Dedicatoria en el Muro!
            </button>
          </form>
        </div>

        {/* Wishes wall view (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filters shelf */}
          <div className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar dedicatorias..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-black/50 text-white placeholder-slate-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Color Filter Options */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Color:</span>
              <button
                onClick={() => setColorFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                  colorFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                Todos
              </button>
              {(Object.keys(colorStyles) as Wish['color'][]).map(col => (
                <button
                  key={col}
                  onClick={() => setColorFilter(col)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all ${
                    colorFilter === col ? 'bg-primary text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {col === 'pink' ? 'Rosa' : col === 'lavender' ? 'Lila' : col === 'yellow' ? 'Pajizo' : col === 'blue' ? 'Azul' : 'Menta'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[550px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {filteredWishes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-16 text-center text-slate-400 font-semibold"
                >
                  <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300 stroke-1" />
                  No se encontraron tarjetitas que coincidan.
                </motion.div>
              ) : (
                filteredWishes.map((w) => {
                  const style = colorStyles[w.color];
                  return (
                    <motion.div
                      key={w.id}
                      layout
                      initial={{ scale: 0.85, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                      whileHover={{ scale: 1.025, rotate: Math.random() > 0.5 ? 1 : -1 }}
                      className={`p-5 rounded-2xl relative shadow-md hover:shadow-lg transition-transform ${style.bg} ${style.text} border-t-4 ${style.accent === 'bg-pink-500' ? 'border-pink-300' : style.accent === 'bg-purple-500' ? 'border-purple-300' : style.accent === 'bg-amber-500' ? 'border-amber-300' : style.accent === 'bg-blue-500' ? 'border-blue-300' : 'border-emerald-300'} flex flex-col justify-between`}
                    >
                      {/* Floating Cute Sticker */}
                      <span className="absolute -top-3.5 -right-2 text-2.5xl drop-shadow-md select-none animate-bounce" style={{ animationDuration: '3s' }}>
                        {w.sticker}
                      </span>

                      {/* Content */}
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-3">
                          <span className="font-display font-bold text-base leading-tight">
                            De: {w.sender}
                          </span>
                          <span className="text-[10px] font-bold opacity-60">
                            {w.date}
                          </span>
                        </div>

                        <p className="text-sm font-medium leading-relaxed italic whitespace-pre-wrap">
                          "{w.text}"
                        </p>
                      </div>

                      {/* Footer actions */}
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10">
                        {/* Delete button (only for added ones or anyone) */}
                        <button
                          onClick={() => handleDeleteWish(w.id)}
                          className="text-white/40 hover:text-red-400 p-1 rounded-full transition-colors hover:bg-white/5"
                          title="Quitar este deseo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Likes counter */}
                        <button
                          onClick={() => handleLikeWish(w.id)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border transition-all active:scale-125 ${
                            w.likes > 0 ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-sm shadow-pink-500/20' : 'text-white/60 border-white/10 hover:bg-white/5'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${w.likes > 0 ? 'fill-pink-500 text-pink-400' : ''}`} />
                          <span>{w.likes || 'Me gusta'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
