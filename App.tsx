import React, { useState, useCallback, useEffect } from 'react';
import { generateStudyGuide } from './services/geminiService';
import { exportGuideToMarkdown } from './services/exportService';
import { SavedStudyGuide } from './types';

import TopicInput from './components/TopicInput';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './components/Dashboard';
import StudySession from './components/StudySession';
import SavedGuidesModal from './components/SavedGuidesModal';
import WelcomeTutorial from './components/WelcomeTutorial';

const LOADING_MESSAGES = [
  'Analizando el tema...',
  'Consultando con la inteligencia artificial...',
  'Creando conceptos clave y analogías...',
  'Diseñando un cuestionario a tu medida...',
  'Generando tarjetas de memoria para repasar...',
  'Creando imágenes y diagramas ilustrativos...',
  'Compilando tu guía de estudio personalizada...',
  '¡Casi está listo!',
];

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;


const App: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<SavedStudyGuide | null>(null);
  const [savedGuides, setSavedGuides] = useState<SavedStudyGuide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expertMode, setExpertMode] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    try {
      const storedGuides = localStorage.getItem('savedGuides');
      if (storedGuides) {
        const parsedGuides = JSON.parse(storedGuides);
        setSavedGuides(parsedGuides);
        if (parsedGuides.length === 0) {
          setShowTutorial(true);
        }
      } else {
        setShowTutorial(true);
      }
    } catch (error) {
      console.error("Failed to load guides from localStorage", error);
      setSavedGuides([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedGuides', JSON.stringify(savedGuides));
    } catch (error) {
      console.error("Failed to save guides to localStorage", error);
    }
  }, [savedGuides]);


  useEffect(() => {
    let interval: any = null;
    if (isLoading) {
      let messageIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]); 
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 2500);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);


  const handleGenerate = useCallback(async (topic: string) => {
    if (!topic) {
      setError('Por favor, introduce un tema para estudiar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveGuide(null);

    try {
      const data = await generateStudyGuide(topic, expertMode);
      const newGuide: SavedStudyGuide = {
        id: Date.now().toString(),
        title: topic,
        savedAt: new Date().toISOString(),
        guideData: data
      };
      setSavedGuides(prev => [newGuide, ...prev]);
      setActiveGuide(newGuide);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [expertMode]);
  
  const handleLoadGuide = (id: string) => {
    const guideToLoad = savedGuides.find(g => g.id === id);
    if (guideToLoad) {
      setActiveGuide(guideToLoad);
      setIsGuidesModalOpen(false);
    }
  };
  
  const handleDeleteGuide = (id: string) => {
    setSavedGuides(prev => prev.filter(g => g.id !== id));
  };
  
  const handleExitSession = () => {
    setActiveGuide(null);
  };
  
  const handleExportGuide = () => {
    if (activeGuide) {
      exportGuideToMarkdown(activeGuide);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
           <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Guía de Estudio Creativa
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {activeGuide ? `Estudiando: ${activeGuide.title}` : 'Transforma cualquier tema en un curso interactivo con IA.'}
          </p>
        </header>

        <main>
          {activeGuide ? (
            <>
              <div className="flex justify-between items-center mb-4">
                  <button onClick={handleExitSession} className="text-sky-400 hover:text-sky-300 transition">&lt; Volver al Archivero</button>
                  <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsGuidesModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-700 transition"
                        title="Ver mis guías guardadas"
                      >
                        <FolderIcon />
                        <span className="hidden sm:inline text-sm">Mis Guías</span>
                      </button>
                      <button
                        onClick={handleExportGuide}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full hover:bg-slate-700 transition"
                        title="Exportar guía como Markdown"
                      >
                        <ExportIcon />
                        <span className="hidden sm:inline text-sm">Exportar</span>
                      </button>
                  </div>
              </div>
              <StudySession guide={activeGuide} />
            </>
          ) : (
            <>
              <TopicInput 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
                expertMode={expertMode}
                onExpertModeChange={setExpertMode}
              />
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center mt-12 text-center">
                  <LoadingSpinner />
                  <p key={loadingMessage} className="mt-4 text-sky-300 text-lg animate-fade-in">
                    {loadingMessage}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-10 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                  <p className="font-semibold">Ocurrió un Error</p>
                  <p>{error}</p>
                </div>
              )}

              {!isLoading && !error && (
                <>
                  {showTutorial && <WelcomeTutorial onDismiss={() => setShowTutorial(false)} />}
                  <Dashboard 
                    guides={savedGuides}
                    onLoad={handleLoadGuide}
                    onDelete={handleDeleteGuide}
                  />
                </>
              )}
            </>
          )}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Desarrollado con Google Gemini</p>
        </footer>
      </div>
      
      <SavedGuidesModal 
        isOpen={isGuidesModalOpen}
        onClose={() => setIsGuidesModalOpen(false)}
        guides={savedGuides}
        onLoad={handleLoadGuide}
        onDelete={handleDeleteGuide}
      />
    </div>
  );
};

export default App;