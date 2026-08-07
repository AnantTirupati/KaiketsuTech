"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroDoneContext } from "@/components/marketing/IntroDoneContext";

/**
 * Kaiketsu (解決) is Japanese for "solution." The intro leans on that literal
 * fact rather than an invented metaphor: a terminal boot sequence resolves
 * the company name to its meaning, then reveals the wordmark. Plays once per
 * cold load of a marketing page (mounted by SiteChrome, only while a
 * marketing route is active — it will NOT replay when navigating between
 * marketing pages client-side, and never mounts at all on /dashboard, /login,
 * etc.).
 */

const LINES = [
  { prompt: "$", text: "whoami" },
  { prompt: ">", text: "kaiketsu_tech" },
  { prompt: "$", text: "translate --lang ja kaiketsu" },
  { prompt: ">", text: "解決 → “solution”", accent: true },
];

const TYPE_MS = 28;
const LINE_PAUSE_MS = 260;

export default function TerminalIntro({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [showWordmark, setShowWordmark] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let elapsed = 0;
    LINES.forEach((line, i) => {
      const full = `${line.prompt} ${line.text}`;
      for (let c = 1; c <= full.length; c++) {
        const t = setTimeout(() => {
          setTypedLines((prev) => {
            const next = [...prev];
            next[i] = full.slice(0, c);
            return next;
          });
        }, elapsed + c * TYPE_MS);
        timers.current.push(t);
      }
      elapsed += full.length * TYPE_MS + LINE_PAUSE_MS;
    });

    timers.current.push(setTimeout(() => setShowWordmark(true), elapsed + 200));
    timers.current.push(setTimeout(() => finish(), elapsed + 1500));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.current.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setDone(true);
    document.body.style.overflow = "";
    setTimeout(() => setVisible(false), 700);
  };

  const skip = () => {
    timers.current.forEach(clearTimeout);
    finish();
  };

  return (
    <IntroDoneContext.Provider value={done}>
      <AnimatePresence>
        {visible && !done ? (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col justify-center bg-marketing-bg px-[7vw] font-marketing-mono"
            exit={{ clipPath: "circle(0% at 90% 10%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <button
              onClick={skip}
              className="absolute right-6 top-6 rounded border border-marketing-border-strong px-3 py-1.5 text-xs tracking-wider text-marketing-muted-dim transition-colors hover:border-marketing-accent hover:text-marketing-accent"
            >
              SKIP [ESC]
            </button>

            <div className="max-w-xl">
              {LINES.map((line, i) => (
                <div key={i} className="mb-1 min-h-[1.6em] text-sm sm:text-base">
                  <span className={line.accent ? "text-marketing-accent" : "text-marketing-muted-dim"}>
                    {typedLines[i]?.split(" ")[0]}
                  </span>{" "}
                  <span className={line.accent ? "text-marketing-accent" : "text-marketing-fg"}>
                    {typedLines[i]?.split(" ").slice(1).join(" ")}
                  </span>
                  {typedLines[i] && typedLines[i].length < `${line.prompt} ${line.text}`.length && (
                    <span className="ml-0.5 inline-block h-[1em] w-[0.5em] animate-marketing-blink bg-marketing-fg align-middle" />
                  )}
                </div>
              ))}

              <AnimatePresence>
                {showWordmark && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-8"
                  >
                    <div className="font-marketing-sans text-[clamp(40px,8vw,88px)] font-bold leading-[0.95] tracking-tight text-marketing-fg">
                      KAIKETSU
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-marketing-accent">
                      解決 — the solution crew
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </IntroDoneContext.Provider>
  );
}
