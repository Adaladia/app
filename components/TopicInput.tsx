import React, { useState } from 'react';

interface TopicInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
  expertMode: boolean;
  onExpertModeChange: (isExpert: boolean) => void;
}

const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isLoading, expertMode, onExpertModeChange }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(topic);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Introduce un tema, ej., 'Agujeros Negros' o 'Fotosíntesis'"
          className="w-full px-5 py-3 bg-slate-800 border-2 border-slate-700 rounded-full text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-sky-500/50 focus:border-sky-500 transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex-shrink-0 px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/50 transition-all duration-300"
        >
          {isLoading ? 'Generando...' : 'Generar'}
        </button>
      </form>
      <div className="flex items-center justify-center mt-4">
        <div className="bg-slate-800 border border-slate-700 rounded-full p-1 flex items-center space-x-1">
          <button 
            onClick={() => onExpertModeChange(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${!expertMode ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            Modo Normal
          </button>
          <button 
            onClick={() => onExpertModeChange(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${expertMode ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            Modo Experto
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;