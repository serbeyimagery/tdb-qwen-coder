import type { ReactNode } from "react";

interface GlowingCardProps {
  children: ReactNode;
}

export function GlowingCard({ children }: GlowingCardProps) {
  return (
    <>
      <style>{`
        @property --rotate {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }

        .glow-container {
          --card-radius: 1.5rem;
          --card-width: min(680px, 92vw);
          --border-width: 3px;
          --animation-speed: 4s;

          width: var(--card-width);
          aspect-ratio: auto;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          border-radius: var(--card-radius);
          background: hsl(var(--misty));
          color: hsl(var(--foreground));
        }

        .glow-container:before {
          content: "";
          display: block;
          position: absolute;
          width: calc(100% + 8px);
          height: calc(100% + 8px);
          left: -4px;
          top: -4px;
          border-radius: var(--card-radius);
          background: conic-gradient(
            from calc(var(--rotate) * 1deg),
            hsl(var(--accent)) 0deg,
            hsl(var(--primary)) 60deg,
            hsl(var(--accent) / 0.3) 120deg,
            hsl(var(--primary) / 0.5) 180deg,
            hsl(var(--accent)) 240deg,
            hsl(var(--primary)) 300deg,
            hsl(var(--accent)) 360deg
          );
          animation: glow-spin var(--animation-speed) linear infinite;
          z-index: -1;
        }

        .glow-container:after {
          content: "";
          display: block;
          position: absolute;
          width: calc(100% + 16px);
          height: calc(100% + 16px);
          left: -8px;
          top: -8px;
          border-radius: var(--card-radius);
          background: conic-gradient(
            from calc(var(--rotate) * 1deg),
            hsl(var(--accent) / 0.4) 0deg,
            transparent 60deg,
            hsl(var(--accent) / 0.2) 120deg,
            transparent 180deg,
            hsl(var(--accent) / 0.4) 240deg,
            transparent 300deg,
            hsl(var(--accent) / 0.4) 360deg
          );
          animation: glow-spin var(--animation-speed) linear infinite;
          filter: blur(20px);
          z-index: -2;
        }

        .glow-content {
          position: relative;
          width: 100%;
          background: hsl(var(--misty));
          border-radius: calc(var(--card-radius) * 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
          box-shadow: 0 4px 24px hsl(var(--primary) / 0.1);
        }

        @media (min-width: 640px) {
          .glow-content {
            padding: 2rem 2.5rem;
          }
        }

        @keyframes glow-spin {
          from { --rotate: 0; }
          to { --rotate: 360; }
        }
      `}</style>

      <div className="glow-container">
        <div className="glow-content">{children}</div>
      </div>
    </>
  );
}
