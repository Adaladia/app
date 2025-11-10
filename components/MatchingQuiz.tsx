import React, { useState, useMemo, useEffect } from 'react';
import { MatchingPair } from '../types';
import ReadableText from './ReadableText';

interface MatchingQuizProps {
  items: MatchingPair[];
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const MatchingQuiz: React.FC<MatchingQuizProps> = ({ items }) => {
  const [shuffledDefinitions, setShuffledDefinitions] = useState<MatchingPair[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<MatchingPair | null>(null);
  const [selectedDef, setSelectedDef] = useState<MatchingPair | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledDefinitions(shuffled);
    setPairs({});
    setSelectedTerm(null);
    setSelectedDef(null);
    setIsVerified(false);
  }, [items]);

  useEffect(() => {
    if (selectedTerm && selectedDef) {
      setPairs(prev => ({ ...prev, [selectedTerm.term]: selectedDef.definition }));
      setSelectedTerm(null);
      setSelectedDef(null);
    }
  }, [selectedTerm, selectedDef]);

  const handleSelectTerm = (term: MatchingPair) => {
    if (isVerified || pairs[term.term]) return;
    setSelectedTerm(term);
  };

  const handleSelectDef = (def: MatchingPair) => {
    if (isVerified || Object.values(pairs).includes(def.definition)) return;
    setSelectedDef(def);
  };

  const handleVerify = () => setIsVerified(true);
  
  const allPaired = Object.keys(pairs).length === items.length;

  const getTermClass = (term: MatchingPair) => {
    if (selectedTerm?.term === term.term) return 'ring-2 ring-sky-400 bg-sky-900/50';
    if (pairs[term.term]) return 'bg-slate-700 text-slate-400 cursor-not-allowed';
    return 'bg-slate-800/60 hover:bg-slate-700/80';
  };
  
  const getDefClass = (def: MatchingPair) => {
    if (selectedDef?.definition === def.definition) return 'ring-2 ring-sky-400 bg-sky-900/50';
    if (Object.values(pairs).includes(def.definition)) return 'bg-slate-700 text-slate-400 cursor-not-allowed';
    return 'bg-slate-800/60 hover:bg-slate-700/80';
  };

  if (!items || items.length === 0) {
    return <p className="text-center text-slate-400">No hay ejercicios de relación de conceptos disponibles.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-slate-300">Haz clic en un concepto y luego en su definición correspondiente para unirlos.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Terms Column */}
        <div className="space-y-3">
          {items.map(item => (
            <button key={item.term} onClick={() => handleSelectTerm(item)} className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${getTermClass(item)}`}>
              <ReadableText as="span">{item.term}</ReadableText>
            </button>
          ))}
        </div>
        {/* Definitions Column */}
        <div className="space-y-3">
          {shuffledDefinitions.map(item => (
            <button key={item.definition} onClick={() => handleSelectDef(item)} className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${getDefClass(item)}`}>
              <ReadableText as="span">{item.definition}</ReadableText>
            </button>
          ))}
        </div>
      </div>

      {isVerified && (
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-bold text-center">Resultados</h3>
          {items.map(item => {
            const isCorrect = pairs[item.term] === item.definition;
            return (
              <div key={item.term} className={`p-3 rounded-lg flex items-center gap-3 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {isCorrect ? <CheckIcon/> : <CrossIcon/>}
                </div>
                <div>
                  <p className="font-semibold">{item.term}</p>
                  <p className="text-sm text-slate-300">{isCorrect ? 'Correctamente relacionado.' : `Relacionado incorrectamente.`}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {allPaired && !isVerified && (
        <div className="mt-6 text-center">
            <button
                onClick={handleVerify}
                className="w-full sm:w-auto px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-all duration-300"
            >
                Verificar Respuestas
            </button>
        </div>
      )}
    </div>
  );
};

export default MatchingQuiz;