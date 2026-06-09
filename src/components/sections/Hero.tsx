'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import TextType from "@/components/band/TextType";
import { supabase } from "@/lib/supabase";

const App = dynamic(() => import("@/components/band/App"), { ssr: false });

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error("3D canvas error:", error); }
  render() {
    if (this.state.hasError) return null; // silent fail — don't show error text
    return this.props.children;
  }
}

type HeroProps = { showApp: boolean };

export default function Hero({ showApp }: HeroProps) {
  const [startAnim, setStartAnim] = useState(false);
  const [sceneWords, setSceneWords] = useState<any[]>([]);

  // Fetch 3D words from Supabase
  useEffect(() => {
    const fetchWords = async () => {
      const { data } = await supabase
        .from("scene3d_words")
        .select("*")
        .order("created_at", { ascending: true });
      if (data && data.length > 0) setSceneWords(data);
    };
    fetchWords();
  }, []);

  useEffect(() => {
    const heroPlayed = sessionStorage.getItem("heroPlayed");
    if (heroPlayed === "true") { setStartAnim(true); return; }
    const t1 = setTimeout(() => setStartAnim(true), 3600);
    const t2 = setTimeout(() => sessionStorage.setItem("heroPlayed", "true"), 5100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section
      id="home"
      className="px-6 md:pl-[120px] md:pr-[60px]"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "flex-start", position: "relative", overflow: "hidden" }}
    >
      {/* 3D CANVAS — right half, never blocks scroll */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", zIndex: 2, pointerEvents: "none", opacity: 0.85 }}>
        {showApp && (
          <AppErrorBoundary>
            <App words={sceneWords} />
          </AppErrorBoundary>
        )}
      </div>

      {/* HERO TEXT */}
      <div className="md:max-w-[600px]" style={{ width: "100%", position: "relative", zIndex: 5 }}>
        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 20 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            ✦ Available for work
          </span>
        </motion.div>

        <div>
          <motion.h1
            initial={false}
            animate={startAnim ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(32px, 6vw, 62px)", fontWeight: 800, lineHeight: 1.05, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 0 }}
          >
            Frontend
          </motion.h1>

          <motion.h1
            initial={false}
            animate={startAnim ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: -80, rotate: -4 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(32px, 6vw, 62px)", fontWeight: 800, lineHeight: 1.05, color: "var(--text-secondary)", letterSpacing: "-0.03em", marginBottom: 24 }}
          >
            Developer
          </motion.h1>
        </div>

        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ marginBottom: 12 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, color: "var(--text-secondary)", letterSpacing: "0.1em" }}>
            <TextType texts={["Junior Programmer"]} />
          </span>
        </motion.div>

        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ marginBottom: 28, width: "100%", maxWidth: 460 }}
        >
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.9, letterSpacing: "0.01em" }}>
            Creating modern websites with a clean, responsive, and elegant appearance.
            Transforming ideas and designs into engaging and user-friendly digital experiences.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={startAnim ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } } }}
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}
        >
          {["Typescript", "React.js", "Tailwind"].map((skill) => (
            <motion.span
              key={skill}
              variants={{ hidden: { opacity: 0, y: 25, scale: 0.85 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 999, padding: "5px 12px", backgroundColor: "var(--bg-card)" }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={false}
          animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--text-muted)" }}>↓ explore my work below</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--text-muted)" }}>↗ open to full-time & freelance opportunities</span>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={false}
        animate={startAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [1, 0.65, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center gap-2"
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>Scroll</span>
          <span style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1 }}>↓</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
