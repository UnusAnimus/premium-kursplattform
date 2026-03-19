import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', glow = false, hover = false }: CardProps) {
  return (
    <div
      className={`bg-[#13131a] border border-[#1e1e2e] rounded-xl p-6 ${glow ? 'shadow-[0_0_40px_rgba(124,58,237,0.3)]' : ''} ${hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
