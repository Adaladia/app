import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Orbiting particles */}
      <div className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-orbit" style={{ animationDelay: '0s' }}></div>
      <div className="absolute w-3 h-3 bg-sky-400 rounded-full animate-orbit" style={{ animationDelay: '-1.5s' }}></div>
      <div className="absolute w-2 h-2 bg-teal-300 rounded-full animate-orbit" style={{ animationDelay: '-3s' }}></div>
      
      {/* Central brain icon */}
      <div className="text-sky-400 animate-pulsate">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
            <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
            <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-1.5" />
            <path d="M13 9.5a3.5 3.5 0 0 0 -7 0" />
            <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h1.5" />
            <path d="M11 9.5a3.5 3.5 0 0 1 7 0" />
            <path d="M12 3a1 1 0 0 0 -1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0 -1 -1z" />
            <path d="M12 21a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -2 0v2a1 1 0 0 0 1 1z" />
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;