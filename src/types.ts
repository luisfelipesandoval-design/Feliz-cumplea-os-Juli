export interface Wish {
  id: string;
  sender: string;
  text: string;
  color: 'pink' | 'lavender' | 'yellow' | 'blue' | 'mint';
  sticker: string;
  date: string;
  likes: number;
}

export interface MemoryChapter {
  id: string;
  title: string;
  description: string;
  date: string;
  emoji: string;
  imageUrl: string;
  tag: string;
}
