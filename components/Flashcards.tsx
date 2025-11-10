import React, { useState, useMemo, useEffect } from 'react';
import { FlashcardItem } from '../types';
import ReadableText from './ReadableText';

interface FlashcardsProps {
  items: FlashcardItem[];
  onSessionComplete: () => void;
}

type CardStatus = 'review' | 'learned';

const Flashcards: React.FC<FlashcardsProps> = ({ items, onSessionComplete }) => {
  const [sessionItems, setSessionItems] = useState<FlashcardItem[]>([]);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionSize, setSessionSize] = useState(items.length);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statuses, setStatuses] = useState<Record<number, CardStatus>>({});
  
  const currentItem = sessionItems[currentIndex];

  const handleStartSession = (e: React.FormEvent) => {
      e.preventDefault();
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      const size = Math.max(1, Math.min(sessionSize, items.length));
      setSessionItems(shuffled.slice(0, size));
      setIsSessionStarted(true);
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNavigate = (direction: 'next' | 'prev') => {
    setIsFlipped(false);
    if (direction === 'next') {
      if (currentIndex === sessionItems.length - 1) {
        onSessionComplete();
        return;
      }
      setCurrentIndex((prev) => (prev + 1));
    } else {
      setCurrentIndex((prev) => (prev - 1 + sessionItems.length) % sessionItems.length);
    }
  };
  
  const handleSetStatus = (status: CardStatus) => {
    setStatuses(prev => ({...prev, [currentIndex]: status }));
    handleNavigate('next');
  };

  const { learnedCount, reviewCount } = useMemo(() => {
      const learned = Object.values(statuses).filter(s => s === 'learned').length;
      const total = sessionItems.length;
      return {
          learnedCount: learned,
          reviewCount: total - learned
      }
  }, [statuses, sessionItems.length]);

  if (!items || items.length === 0) {
    return <p className="text-slate-400">No hay tarjetas de memoria disponibles para este tema.</p>;
  }
  
  if (!isSessionStarted) {
      return (
          <div className="text-center p-4">
              <h3 className="text-xl font-bold mb-4">Configurar Sesión de Repaso</h3>
              <form onSubmit={handleStartSession} className="flex flex-col items-center gap-4">
                  <label htmlFor="session-size" className="text-slate-300">¿Cuántas tarjetas quieres repasar?</label>
                  <input
                    type="number"
                    id="session-size"
                    value={sessionSize}
                    onChange={(e) => setSessionSize(parseInt(e.target.value, 10))}
                    min="1"
                    max={items.length}
                    className="w-32 px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-center"
                  />
                  <button type="submit" className="px-6 py-2 bg-sky-600 font-semibold rounded-md hover:bg-sky-500 transition">
                    Iniciar Repaso
                  </button>
              </form>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center">
        {/* Card */}
        <div className="w-full max-w-lg h-64 [perspective:1000px] mb-4">
            <div 
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                onClick={handleFlip}
            >
                {/* Front */}
                <div className="absolute w-full h-full bg-slate-700 rounded-lg flex items-center justify-center p-6 text-center [backface-visibility:hidden] cursor-pointer">
                    <ReadableText className="text-xl !text-slate-100">{currentItem.front}</ReadableText>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-sky-800 rounded-lg flex items-center justify-center p-6 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer">
                    <ReadableText className="!text-white">{currentItem.back}</ReadableText>
                </div>
            </div>
        </div>
        <p className="text-slate-400 mb-4 cursor-pointer" onClick={handleFlip}>
          Haz clic en la tarjeta para voltearla
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full max-w-lg mb-6">
            <button onClick={() => handleNavigate('prev')} disabled={currentIndex === 0} className="px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600 transition disabled:opacity-50">&lt; Anterior</button>
            <span className="text-slate-300 font-semibold">{currentIndex + 1} / {sessionItems.length}</span>
            <button onClick={() => handleNavigate('next')} className="px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600 transition">
                {currentIndex === sessionItems.length - 1 ? 'Finalizar' : 'Siguiente'} &gt;
            </button>
        </div>

        {/* Status Actions */}
        <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={() => handleSetStatus('review')} 
                className="px-6 py-3 bg-amber-600/80 text-white font-bold rounded-full hover:bg-amber-500/80 transition-transform duration-200 hover:scale-105"
            >
                Repasar
            </button>
            <button 
                onClick={() => handleSetStatus('learned')}
                className="px-6 py-3 bg-green-600/80 text-white font-bold rounded-full hover:bg-green-500/80 transition-transform duration-200 hover:scale-105"
            >
                Aprendida
            </button>
        </div>

        {/* Progress */}
        <div className="w-full max-w-lg text-center">
            <div className="flex justify-around text-sm">
                <span className="text-green-400">Aprendidas: {learnedCount}</span>
                <span className="text-amber-400">Para Repasar: {reviewCount}</span>
            </div>
             <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(learnedCount / sessionItems.length) * 100}%` }}></div>
            </div>
        </div>
    </div>
  );
};

export default Flashcards;