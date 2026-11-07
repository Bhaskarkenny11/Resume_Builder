import React from 'react';

export const AppleGradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#09090b]">
      {/* Linear / Raycast Style Delicate Radial Header Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(120,119,198,0.12),rgba(9,9,11,0))] pointer-events-none" />
      
      {/* Subtle Micro-Dot Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Top 1px Horizon Border Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />
    </div>
  );
};
