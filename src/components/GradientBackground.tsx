import { useEffect, useRef } from 'react';

export const GradientBackground = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Light Mode - Colorful Aurora */}
      <div className="hidden [.light_&]:block absolute inset-0 w-full h-full transition-opacity duration-500">
        <div
          className="absolute inset-0 w-full h-full opacity-40"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15), transparent 50%),
              radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.15), transparent 50%),
              radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15), transparent 50%)
            `,
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute inset-0 w-[200%] h-[200%] opacity-30 animate-gradient-slow"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, #e0e7ff, #c7d2fe, #a5b4fc, #e0e7ff)',
            top: '-50%',
            left: '-50%',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      {/* Dark Mode - Subtle/No Colors (Just deep atmosphere) */}
      <div className="block [.light_&]:hidden absolute inset-0 w-full h-full transition-opacity duration-500">
        <div
          className="absolute inset-0 w-full h-full opacity-20"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03), transparent 50%),
              radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.02), transparent 50%)
            `,
            filter: 'blur(80px)',
          }}
        />
      </div>

      <style>{`
        @keyframes gradient-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-gradient-slow {
          animation: gradient-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
};
