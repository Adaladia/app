import React, { useState } from 'react';
import { SavedStudyGuide } from '../types';
import StudySection from './StudySection';
import Quiz from './Quiz';
import Flashcards from './Flashcards';
import ReadableText from './ReadableText';
import TrueFalseSection from './TrueFalseSection';
import MatchingQuiz from './MatchingQuiz';

interface StudySessionProps {
  guide: SavedStudyGuide;
}

type StudyStep = 'study' | 'flashcards' | 'quiz';

// Icons
const BookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const BrainIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-1.806.547" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
const LinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>);
const PuzzleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CardsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
const BeakerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-1.806.547" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>);
const QuestionMarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const TocIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const ConnectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;


const NextStepButton: React.FC<{onClick: () => void; children: React.ReactNode}> = ({ onClick, children }) => (
    <div className="mt-8 text-center">
        <button 
            onClick={onClick}
            className="px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-all duration-300"
        >
            {children}
        </button>
    </div>
);

const StudySession: React.FC<StudySessionProps> = ({ guide }) => {
  const [step, setStep] = useState<StudyStep>('study');
  const data = guide.guideData;

  const renderContent = () => {
    switch(step) {
      case 'study':
        const tocItems = [
          { id: 'concepts', title: 'Conceptos Clave', icon: <LightbulbIcon /> },
          { id: 'eli5', title: 'Explicación Sencilla', icon: <BrainIcon /> },
          { id: 'analogy', title: 'Analogía', icon: <LinkIcon /> },
          { id: 'examples', title: 'Ejemplos Prácticos', icon: <BeakerIcon /> },
          { id: 'true-false', title: 'Verdadero o Falso', icon: <QuestionMarkIcon /> },
          { id: 'matching', title: 'Relacionar Conceptos', icon: <ConnectIcon />},
          { id: 'mnemonics', title: 'Mnemotecnia', icon: <PuzzleIcon /> },
          { id: 'takeaways', title: 'Puntos Clave', icon: <StarIcon /> },
        ];
        return (
          <div className="space-y-8">
            <StudySection title="Tabla de Contenido" icon={<TocIcon />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tocItems.map(item => (
                  <a key={item.id} href={`#${item.id}`} className="flex flex-col items-center justify-center text-center p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors duration-200">
                    <div className="text-sky-400 mb-2">{React.cloneElement(item.icon, { className: 'h-6 w-6'})}</div>
                    <span className="text-sm font-semibold text-slate-200">{item.title}</span>
                  </a>
                ))}
              </div>
            </StudySection>
            
            <div id="concepts" className="pt-4">
              <StudySection title="Conceptos Clave" icon={<LightbulbIcon />}>
                <div className="space-y-6">
                  {data.keyConcepts.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg md:flex md:items-center md:gap-6">
                      {item.imageUrl && (
                          <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
                              <img src={item.imageUrl} alt={`Ilustración de ${item.concept}`} className="w-full h-auto rounded-md object-cover bg-slate-700" />
                          </div>
                      )}
                      <div className="md:w-2/3">
                        <p className="font-bold text-sky-400 text-lg">
                          {item.concept}
                        </p>
                        <ReadableText className="mt-1 !text-slate-300">{item.definition}</ReadableText>
                      </div>
                    </div>
                  ))}
                </div>
              </StudySection>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div id="eli5" className="pt-4">
                <StudySection title="Explicado como para un niño de 5 años" icon={<BrainIcon />}>
                  <ReadableText>{data.eli5}</ReadableText>
                </StudySection>
              </div>
              <div id="analogy" className="pt-4">
                <StudySection title="Analogía" icon={<LinkIcon />}>
                  <ReadableText>{data.analogy}</ReadableText>
                </StudySection>
              </div>
            </div>
             <div id="examples" className="pt-4">
              <StudySection title="Ejemplos Prácticos" icon={<BeakerIcon />}>
                <div className="space-y-4">
                  {data.examples.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="font-bold text-sky-400 text-lg">{item.example}</p>
                      <ReadableText className="mt-1 !text-slate-300">{item.explanation}</ReadableText>
                    </div>
                  ))}
                </div>
              </StudySection>
            </div>

            <div id="true-false" className="pt-4">
              <StudySection title="Verdadero o Falso" icon={<QuestionMarkIcon/>}>
                  <TrueFalseSection items={data.trueFalse} />
              </StudySection>
            </div>

            <div id="matching" className="pt-4">
              <StudySection title="Relacionar Conceptos" icon={<ConnectIcon/>}>
                  <MatchingQuiz items={data.matchingConcepts} />
              </StudySection>
            </div>
            
            <div id="mnemonics" className="pt-4">
              <StudySection title="Mnemotecnia" icon={<PuzzleIcon />}>
                <div className="space-y-4">
                  {data.mnemonics.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                      <p className="font-bold text-sky-400 text-lg">{item.term}</p>
                      <ReadableText className="mt-1">{item.mnemonic}</ReadableText>
                    </div>
                  ))}
                </div>
              </StudySection>
            </div>

            <div id="takeaways" className="pt-4">
               <StudySection title="Puntos Clave para Recordar" icon={<StarIcon />}>
                  <ul className="space-y-3">
                    {data.takeaways.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-sky-400 mt-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        </div>
                        <ReadableText>{item}</ReadableText>
                      </li>
                    ))}
                  </ul>
              </StudySection>
            </div>

            <NextStepButton onClick={() => setStep('flashcards')}>
                He estudiado el material. ¡Vamos a las tarjetas!
            </NextStepButton>
          </div>
        );
      case 'flashcards':
          return (
              <StudySection title="Tarjetas de Memoria" icon={<CardsIcon />}>
                  <Flashcards items={data.flashcards} onSessionComplete={() => setStep('quiz')} />
              </StudySection>
          );
      case 'quiz':
          return (
              <StudySection title="Pon a Prueba tu Conocimiento" icon={<CheckIcon />}>
                  <Quiz items={data.quiz} />
              </StudySection>
          );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
        {data.imageUrl && (
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl mb-8">
                <img src={data.imageUrl} alt="Conceptual image for the study topic" className="w-full h-auto object-cover" />
            </div>
        )}
        {renderContent()}
    </div>
  );
};

export default StudySession;