import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  icon: Icon,
  onClick,
  hover = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 border border-slate-800/80 shadow-lg ${
        hover ? 'hover:border-primary-500/30 hover:shadow-glow-primary transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {(title || action || Icon) && (
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && <h3 className="text-base font-semibold text-slate-100 truncate">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
