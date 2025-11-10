import React from 'react';
import { SavedStudyGuide } from '../types';
import StudySection from './StudySection';

interface DashboardProps {
    guides: SavedStudyGuide[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
}

const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const LoadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;


const Dashboard: React.FC<DashboardProps> = ({ guides, onLoad, onDelete }) => {
    return (
        <div className="mt-10 animate-fade-in">
            <StudySection title="Mi Archivero de Estudio" icon={<FolderIcon />}>
                {guides.length === 0 ? (
                    <p className="text-center text-slate-400">
                        Aún no has generado ninguna guía. ¡Introduce un tema arriba para empezar!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {guides.map(guide => (
                            <div key={guide.id} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg hover:bg-slate-800 transition-colors duration-200">
                                <div>
                                    <h3 className="font-bold text-sky-400">{guide.title}</h3>
                                    <p className="text-xs text-slate-500">
                                        Guardado: {new Date(guide.savedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => onLoad(guide.id)}
                                        className="p-2 rounded-full text-slate-300 bg-slate-700 hover:bg-sky-600 hover:text-white transition"
                                        title="Cargar guía"
                                    >
                                        <LoadIcon />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(guide.id)}
                                        className="p-2 rounded-full text-slate-300 bg-slate-700 hover:bg-red-600 hover:text-white transition"
                                        title="Eliminar guía"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </StudySection>
        </div>
    );
};

export default Dashboard;