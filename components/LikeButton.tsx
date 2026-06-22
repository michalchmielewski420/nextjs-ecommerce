'use client';

import { useState, useEffect } from 'react';
import { toggleLikeAction } from '@/app/actions/like';

interface LikeButtonProps {
  productId: string;
  initialLikes: number;
}

export default function LikeButton({ productId, initialLikes }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isPending, setIsPending] = useState(false);

  // Po załadowaniu strony sprawdzamy w LocalStorage, czy ten produkt jest już polubiony
  useEffect(() => {
    const savedLikes = localStorage.getItem('liked_products');
    if (savedLikes) {
      const likedIds = JSON.parse(savedLikes) as string[];
      if (likedIds.includes(productId)) {
        setIsLiked(true);
      }
    }
  }, [productId]);

  // Synchronizujemy licznik z bazy, jeśli zmieni się na serwerze
  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Blokujemy przeładowanie strony
    if (isPending) return; // Blokujemy wielokrotne kliknięcia w ułamku sekundy

    setIsPending(true);
    const savedLikes = localStorage.getItem('liked_products');
    let likedIds: string[] = savedLikes ? JSON.parse(savedLikes) : [];

    if (isLiked) {
      // 1. COFANIE LAJKA (Unlike)
      likedIds = likedIds.filter(id => id !== productId);
      setLikesCount(prev => Math.max(0, prev - 1)); // Wizualna zmiana od razu dla użytkownika
      setIsLiked(false);
      
      localStorage.setItem('liked_products', JSON.stringify(likedIds));
      await toggleLikeAction(productId, 'unlike');
    } else {
      // 2. DODAWANIE LAJKA (Like)
      likedIds.push(productId);
      setLikesCount(prev => prev + 1); // Wizualna zmiana od razu
      setIsLiked(true);
      
      localStorage.setItem('liked_products', JSON.stringify(likedIds));
      await toggleLikeAction(productId, 'like');
    }
    
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleLikeClick}
      disabled={isPending}
      className={`absolute top-3 right-3 z-10 px-3 py-2 text-xs font-bold rounded-xl shadow-xs cursor-pointer border transition-all duration-200 flex items-center gap-1.5 backdrop-blur-xs ${
        isLiked 
          ? 'bg-pink-100 text-pink-600 border-pink-200 hover:bg-pink-200' 
          : 'bg-white/90 text-gray-500 border-gray-100 hover:bg-pink-50 hover:text-pink-600'
      }`}
    >
      <span>❤️</span> 
      <span>{likesCount}</span>
    </button>
  );
}