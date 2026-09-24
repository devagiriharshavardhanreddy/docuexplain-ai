import React from 'react';

export const Skeleton = ({ className = '', variant = 'text', count = 1 }) => {
  const base = 'animate-shimmer bg-slate-800/70 rounded-lg';

  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    card: 'h-36 w-full rounded-2xl',
    circle: 'h-10 w-10 rounded-full',
    button: 'h-10 w-28 rounded-xl',
  };

  if (count > 1) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${base} ${variants[variant]} ${className}`} />
        ))}
      </div>
    );
  }

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};
