import React, { useState } from 'react';
import { TrueFalseItem } from '../types';
import ReadableText from './ReadableText';

interface TrueFalseSectionProps {
  items: TrueFalseItem[];
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;

const TrueFalseSection: React.FC<TrueFalseSectionProps> = ({ items }) => {
  const [selectedChoices, setSelectedChoices] = useState<Record<number, boolean | null>>({});

  const handleAnswer = (index: number, chosenAnswer: boolean) => {
    setSelectedChoices(prev => ({
      ...prev,
      [index]: chosenAnswer
    }));
  };
  
  const getButtonClass = (item: TrueFalseItem, index: number, choice: boolean) => {
    const selectedChoice = selectedChoices[index];
    const isAnswered = selectedChoice !== null && selectedChoice !== undefined;
    
    if (!isAnswered) {
      return 'bg-slate-700 hover:bg-slate-600 border-transparent';
    }

    const isCorrectAnswer = item.isTrue === choice;
    const isSelectedAnswer = selectedChoice === choice;

    if (isCorrectAnswer) {
      return 'bg-green-500/30 border-green-500 text-white';
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
      return 'bg-red-500/30 border-red-500 text-white';
    }
    
    return 'bg-slate-700 border-transparent opacity-60';
  };

  if (!items || items.length === 0) {
    return <p className="text-center text-slate-400">No hay preguntas de verdadero o falso disponibles.</p>
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const selectedChoice = selectedChoices[index];
        const isAnswered = selectedChoice !== null && selectedChoice !== undefined;
        const isCorrect = isAnswered && selectedChoice === item.isTrue;

        return (
          <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
            <ReadableText className="mb-4 !text-lg !text-slate-100">
              {index + 1}. {item.statement}
            </ReadableText>
            
            <div className="flex items-center gap-4">
              {[true, false].map(choice => (
                <button
                  key={String(choice)}
                  onClick={() => handleAnswer(index, choice)}
                  disabled={isAnswered}
                  className={`flex-1 py-2 px-4 font-semibold rounded-md transition-all duration-200 border-2 flex items-center justify-center gap-2 ${getButtonClass(item, index, choice)}`}
                >
                  {isAnswered && selectedChoice === choice && (isCorrect ? <CheckIcon/> : <CrossIcon/>)}
                  {choice ? 'Verdadero' : 'Falso'}
                </button>
              ))}
            </div>
            
            {isAnswered && (
                <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg animate-fade-in">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                        {isCorrect ? (
                            <span className="text-green-400"><CheckIcon /> ¡Correcto!</span>
                        ) : (
                            <span className="text-red-400"><CrossIcon /> Incorrecto.</span>
                        )}
                    </div>
                     <div className="text-sm text-slate-300 mb-2">
                        <span>La respuesta correcta es: </span>
                        <strong className="text-green-400">{item.isTrue ? 'Verdadero' : 'Falso'}</strong>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700">
                        <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1"><InfoIcon /> Explicación:</h4>
                        <ReadableText className="!text-sm !leading-relaxed">{item.explanation}</ReadableText>
                    </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrueFalseSection;