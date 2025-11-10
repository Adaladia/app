import React from 'react';
import StudySection from './StudySection';

interface WelcomeTutorialProps {
    onDismiss: () => void;
}

const TutorialIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ onDismiss }) => {
    return (
        <div className="mt-10 animate-fade-in">
            <StudySection title="¡Bienvenido/a! Cómo Funciona" icon={<TutorialIcon />}>
                <div className="space-y-4 text-slate-300">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/30 text-sky-300 font-bold text-lg">1</div>
                        <p><strong>Genera tu Curso:</strong> Escribe cualquier tema que quieras aprender en la barra de búsqueda y haz clic en "Generar". La IA creará un curso completo para ti en segundos.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/30 text-sky-300 font-bold text-lg">2</div>
                        <p><strong>Sigue los Pasos:</strong> Cada curso se divide en 3 etapas: estudiar el material, repasar con tarjetas de memoria y evaluar tu conocimiento con un cuestionario.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/30 text-sky-300 font-bold text-lg">3</div>
                        <p><strong>Guarda y Repasa:</strong> Tus cursos se guardan automáticamente. Vuelve cuando quieras desde "Mi Archivero de Estudio" para repasar cualquier tema.</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={onDismiss}
                        className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-500 transition-all duration-300"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </StudySection>
        </div>
    );
};

export default WelcomeTutorial;
