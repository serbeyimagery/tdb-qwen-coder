import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const bg = "hsl(var(--hero-bg))";
  const beam = "hsl(var(--accent))";

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-end overflow-hidden rounded-md",
        className
      )}
      style={{ background: bg }}
    >
      <div className="relative flex w-full flex-1 items-end justify-center isolate z-0 pt-24">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 70deg at center top, ${beam} 0deg, transparent 90deg, transparent 360deg)`,
            position: "absolute",
            inset: "auto",
            right: "50%",
            height: "14rem",
            overflow: "visible",
            top: "30%",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "10rem",
              background: bg,
              zIndex: 20,
              WebkitMaskImage: "linear-gradient(to top, white, transparent)",
              maskImage: "linear-gradient(to top, white, transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "10rem",
              height: "100%",
              background: bg,
              zIndex: 20,
              WebkitMaskImage: "linear-gradient(to right, white, transparent)",
              maskImage: "linear-gradient(to right, white, transparent)",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(from 290deg at center top, transparent 0deg, transparent 270deg, ${beam} 360deg)`,
            position: "absolute",
            inset: "auto",
            left: "50%",
            height: "14rem",
            overflow: "visible",
            top: "30%",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "10rem",
              height: "100%",
              background: bg,
              zIndex: 20,
              WebkitMaskImage: "linear-gradient(to left, white, transparent)",
              maskImage: "linear-gradient(to left, white, transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "100%",
              height: "10rem",
              background: bg,
              zIndex: 20,
              WebkitMaskImage: "linear-gradient(to top, white, transparent)",
              maskImage: "linear-gradient(to top, white, transparent)",
            }}
          />
        </motion.div>

        <div
          className="absolute h-48 w-full translate-y-12 scale-x-150 blur-2xl"
          style={{ background: bg, top: "45%" }}
        />
        <div className="absolute z-10 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" style={{ top: "45%" }} />
        <div
          className="absolute inset-auto z-10 h-36 w-[28rem] rounded-full opacity-50 blur-3xl"
          style={{ background: beam, top: "35%" }}
        />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 rounded-full blur-2xl"
          style={{ background: beam, filter: "blur(16px)", top: "28%" }}
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-10 h-0.5"
          style={{ background: beam, top: "26%" }}
        />
        <div
          className="absolute inset-auto z-40 h-44 w-full"
          style={{ background: bg, top: "10%" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pb-16 md:pb-24" style={{ marginTop: "-12rem" }}>
        {children}
      </div>
    </div>
  );
};
