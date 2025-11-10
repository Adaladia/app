import React, { useState, useEffect, useCallback } from 'react';
import { QuizItem } from '../types';
import ReadableText from './ReadableText';
import StudySection from './StudySection';

interface QuizProps {
  items: QuizItem[];
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const CrossIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const RedoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>

// FIX: In a `.tsx` file, generic type parameters like `<T>` can be misinterpreted as JSX tags.
// Using `<T,>` with a trailing comma disambiguates the syntax for the TypeScript compiler.
// This ensures `shuffleArray` correctly infers its generic type, fixing the issue where
// array elements were being treated as `unknown`, causing spread and property access errors.
function shuffleArray<T,>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const Quiz: React.FC<QuizProps> = ({ items }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<QuizItem[]>([]);

  const prepareQuiz = useCallback(() => {
    const shuffledQuestions = shuffleArray(items);
    const shuffledQuestionsWithOptions = shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledItems(shuffledQuestionsWithOptions);
    setSelectedAnswers({});
    setIsSubmitted(false);
  }, [items]);

  useEffect(() => {
    prepareQuiz();
  }, [prepareQuiz]);

  const handleSelectAnswer = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };
  
  const handleSubmit = () => {
      setIsSubmitted(true);
  }

  const getOptionClass = (questionIndex: number, option: string) => {
    if (!isSubmitted) {
      return selectedAnswers[questionIndex] === option 
        ? 'bg-sky-800/80 ring-2 ring-sky-500' 
        : 'bg-slate-700/50 hover:bg-slate-700';
    }

    const isCorrect = option === shuffledItems[questionIndex].answer;
    const isSelected = selectedAnswers[questionIndex] === option;

    if (isCorrect) return 'bg-green-500/30 ring-2 ring-green-500 text-white';
    if (isSelected && !isCorrect) return 'bg-red-500/30 ring-2 ring-red-500 text-white';

    return 'bg-slate-700/50 opacity-60';
  };

  const score = shuffledItems.reduce((acc, item, index) => {
    return selectedAnswers[index] === item.answer ? acc + 1 : acc;
  }, 0);

  const getEncouragingMessage = () => {
    const percentage = (score / shuffledItems.length) * 100;
    if (percentage >= 90) return "¡Excelente! Tienes un dominio completo del tema. ¡Sigue así!";
    if (percentage >= 70) return "¡Muy buen trabajo! Estás muy cerca de dominarlo. Revisa las explicaciones para perfeccionar.";
    if (percentage >= 50) return "¡Buen intento! Vas por buen camino. Con un poco más de repaso, lo conseguirás.";
    return "¡No te rindas! El aprendizaje es un viaje. Cada error es una lección. ¡Revisa el material y vuelve a intentarlo!";
  };


  return (
    <div className="space-y-6">
      {isSubmitted && (
          <StudySection title="Resultados del Cuestionario" icon={<CheckIcon />}>
              <div className="text-center">
                <p className="text-2xl font-bold">Tu Puntuación: <span className="text-sky-400">{score} / {shuffledItems.length}</span></p>
                <p className="text-slate-300 mt-2 italic">{getEncouragingMessage()}</p>
                 <button
                    onClick={prepareQuiz}
                    className="mt-4 inline-flex items-center px-6 py-2 bg-slate-600/50 text-sky-300 font-semibold rounded-full hover:bg-slate-600 hover:text-sky-200 transition-all duration-300"
                >
                    <RedoIcon />
                    Volver a Intentar
                </button>
              </div>
          </StudySection>
      )}

      {shuffledItems.map((item, index) => (
        <div key={item.question} className="p-4 bg-slate-800/50 rounded-lg">
          <div className="font-semibold text-slate-100 mb-4 text-lg">
            {index + 1}. <ReadableText as="span">{item.question}</ReadableText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {item.options.map(option => (
              <button
                key={option}
                onClick={() => handleSelectAnswer(index, option)}
                disabled={isSubmitted}
                className={`p-3 rounded-lg text-left transition-all duration-200 text-slate-200 text-base ${getOptionClass(index, option)}`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {isSubmitted && (
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                    {selectedAnswers[index] === item.answer ? (
                        <span className="text-green-400"><CheckIcon /> ¡Correcto!</span>
                    ) : (
                        <span className="text-red-400"><CrossIcon /> Incorrecto.</span>
                    )}
                </div>
                <div className="text-sm text-slate-300 mb-2">
                    <span>Respuesta correcta: </span>
                    <strong className="text-green-400">{item.answer}</strong>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700">
                  <h4 className="font-bold text-sky-400 mb-1 flex items-center gap-1"><InfoIcon /> Explicación:</h4>
                  <ReadableText className="!text-sm !leading-relaxed">{item.explanation}</ReadableText>
                </div>
            </div>
          )}
        </div>
      ))}

      {!isSubmitted && (
        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== shuffledItems.length}
                className="w-full sm:w-auto px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-all duration-300"
            >
                Calificar Cuestionario
            </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
