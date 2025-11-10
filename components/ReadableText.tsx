import React from 'react';

interface ReadableTextProps {
  children: React.ReactNode;
  as?: 'p' | 'div' | 'span';
  className?: string;
}

const ReadableText: React.FC<ReadableTextProps> = ({ 
  children, 
  as: Component = 'p',
  className = '' 
}) => {
  // Mayor interlineado y mejor contraste para la legibilidad
  const baseClasses = "leading-relaxed text-slate-200 text-base md:text-lg";
  const combinedClasses = `${baseClasses} ${className}`;

  return <Component className={combinedClasses}>{children}</Component>;
};

export default ReadableText;