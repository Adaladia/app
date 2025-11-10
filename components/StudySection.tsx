
import React from 'react';

interface StudySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const StudySection: React.FC<StudySectionProps> = ({ title, icon, children }) => {
  return (
    <section className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden">
      <header className="flex items-center gap-4 p-4 sm:p-5 bg-slate-900/30 border-b border-slate-700">
        <div className="flex-shrink-0 text-sky-400">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{title}</h2>
      </header>
      <div className="p-5 sm:p-8">
        {children}
      </div>
    </section>
  );
};

export default StudySection;