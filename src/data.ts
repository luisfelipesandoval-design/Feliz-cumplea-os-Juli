import { Wish, MemoryChapter } from './types';

export const PRESET_MEMORIES: MemoryChapter[] = [
  {
    id: 'mem-1',
    title: 'La Gran Tarde de Picnic 🧺',
    description: 'Rodeados de risas, globos de colores y mucha comida deliciosa. Platicamos de todo bajo la sombra de aquel árbol gigante y prometimos celebrar siempre juntas.',
    date: '14 de Abril, 2023',
    emoji: '🌸',
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80',
    tag: 'Risas'
  },
  {
    id: 'mem-2',
    title: 'Noche de Películas & Snack attack 🍿',
    description: 'Aquella maratón inolvidable donde terminamos viendo comedias hasta el amanecer, comiendo palomitas con chocolate y riendo hasta que nos dolió la panza.',
    date: '28 de Septiembre, 2023',
    emoji: '🍕',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    tag: 'Pijamada'
  },
  {
    id: 'mem-3',
    title: 'Aventuras en la Ciudad 🏙️',
    description: 'Caminar sin rumbo bajo los letreros luminosos, tomándonos fotos divertidas en cada esquina y probando aquel helado de unicornio que se derritió en tres segundos.',
    date: '03 de Diciembre, 2023',
    emoji: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    tag: 'Aventura'
  },
  {
    id: 'mem-4',
    title: 'Viaje a la Playa Dorada 🌊',
    description: 'Sintiendo el viento marino y el calor del atardecer. Gritamos nuestros deseos al océano y vimos cómo el cielo se teñía de tonos rosa y lila, como tu color favorito.',
    date: '18 de Enero, 2024',
    emoji: '🐚',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
    tag: 'Paz'
  }
];

export const PRESET_WISHES: Wish[] = [
  {
    id: 'wish-1',
    sender: 'Santi',
    text: '¡Cumpleaños súper feliz para la mejor compañera de aventuras! Que hoy y siempre brilles con esa hermosa energía que contagia a todos. ¡Te quiero mil! 💖🎈',
    color: 'pink',
    sticker: '🎉',
    date: 'Hace 2 horas',
    likes: 8
  },
  {
    id: 'wish-2',
    sender: 'Ma y Pa',
    text: 'Hija querida, estamos sumamente orgullosos del gran ser humano en el que te has convertido. Nunca pierdas tu hermosa sonrisa ni esa dulzura. ¡Feliz día, princesa! ✨🎂',
    color: 'yellow',
    sticker: '👑',
    date: 'Hace 5 horas',
    likes: 12
  },
  {
    id: 'wish-3',
    sender: 'Valen',
    text: '¡Juli de mi corazón! 🌈 Sos un arcoíris en la vida de quienes te conocemos. Que la pases increíble y que este nuevo año esté lleno de magia, ropa aesthetic y mucha felicidad.',
    color: 'lavender',
    sticker: '🦄',
    date: 'Hace 6 horas',
    likes: 5
  },
  {
    id: 'wish-4',
    sender: 'Sofi',
    text: '¡Feliz cumpleee! Que se te cumplan todos tus sueños más locos. Sos la mejor confidente y la reina indiscutible del estilo Roblox ✨🥳 ¡Te mando abrazos y pastel virtual!',
    color: 'blue',
    sticker: '🎂',
    date: 'Hace 8 horas',
    likes: 7
  },
  {
    id: 'wish-5',
    sender: 'Lucas',
    text: '¡Felicidades Juli! Gracias por estar siempre dispuesta a echar una mano y por ser tan asombrosamente fiel con tus amigos. Sos una crack total ⚽🍦',
    color: 'mint',
    sticker: '🍦',
    date: 'Ayer',
    likes: 3
  }
];

export const COMPLIMENTS: string[] = [
  '¡Eres súper carismática y llenas cualquier lugar de alegría! 🌸',
  '¡Siempre sabes cómo hacer reír a los demás con tus comentarios e ingenio! 😂',
  '¡Tu creatividad es de otro planeta! Tienes ideas brillantes y hermosas 🎨',
  '¡Tienes el mejor estilo y la vibra más chic del mundo! 👗✨',
  '¡Eres una persona increíblemente leal y compresiva con tus amigos! 🧸',
  '¡Tienes el súper poder de tranquilizar e inspirar con solo hablar! 🍃',
  '¡Tu sonrisa ilumina cualquier día gris! Nunca dejes de sonreír 😁💛',
  '¡Eres súper talentosa e inteligente! Logras todo lo que te propones 💪',
  '¡Impecable, elegante y fabulosa hoy y siempre! 🕶️✨'
];

export const SOUND_OPTIONS = [
  { name: 'Confetti Pop 🎉', emoji: '🎉', frequency: 587.33 }, // D5
  { name: 'Crystal Chime ✨', emoji: '✨', frequency: 880 }, // A5
  { name: 'Tada Fanfare 🎺', emoji: '🎺', frequency: 659.25 }, // E5
  { name: 'Warm Hug Chord 💕', emoji: '💕', frequency: 440 }, // A4
  { name: 'Retro Beep 🕹️', emoji: '🕹️', frequency: 1200 }
];

export const AVAILABLE_STICKERS: string[] = ['🎉', '🎂', '💖', '🦄', '✨', '🎈', '🍭', '🥳', '🧁', '👑', '🌈', '🎁', '🧸', '🍪', '🌸', '🐾'];
