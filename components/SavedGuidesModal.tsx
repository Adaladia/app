import React from 'react';
import { SavedStudyGuide } from '../types';

interface SavedGuidesModalProps {
    isOpen: boolean;
    onClose: () => void;
    guides: SavedStudyGuide[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
}

const LoadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const SavedGuidesModal: React.FC<SavedGuidesModalProps> = ({ isOpen, onClose, guides, onLoad, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-sky-400">Mis Guías Guardadas</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </header>
                <div className="p-4 overflow-y-auto">
                    {guides.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No tienes guías guardadas.</p>
                    ) : (
                        <div className="space-y-3">
                            {guides.map(guide => (
                                <div key={guide.id} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg hover:bg-slate-700/80 transition-colors duration-200">
                                    <div>
                                        <h3 className="font-bold text-slate-100">{guide.title}</h3>
                                        <p className="text-xs text-slate-500">
                                            {new Date(guide.savedAt).toLocaleString()}
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
                </div>
            </div>
        </div>
    );
};

export default SavedGuidesModal;
