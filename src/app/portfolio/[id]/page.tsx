"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Code2,
  Layers,
  ExternalLink,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Project {
  id: string | number;
  title: string;
  description: string;
  technologies: string;
  key_features: string;
  live_url?: string;
  github_url?: string;
  image_url?: string;
  image_urls?: string[];
  dev_notes?: string;
}

export default function PortfolioDetailPage() {
  const id = useParams()?.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
  
      setProject(data);
      setIsLoading(false);
    };

    if (id) {
      fetchProject()
    }
  }, [id])

  const tech = (project?.technologies || "")
    .split(",")
    .filter((t) => t.trim() !== "");

  const features = (project?.key_features || "")
    .split(",")
    .filter((f) => f.trim() !== "");

  const galleryImages =
    project?.image_urls && Array.isArray(project.image_urls)
      ? project.image_urls
      : project?.image_url
        ? [project.image_url]
        : [];

  const nextImage = () => {
    if (currentImage < galleryImages.length - 1) {
      setCurrentImage((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentImage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Project not found</p>

          <button
            onClick={() => router.back()}
            className="text-white/50 hover:text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 md:px-8 lg:px-12 py-5 md:py-8">
      <motion.button
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => router.push("/#portfolio")} // Navigate to home with hash
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition mb-6"
      >
        <ArrowLeft size={14} />
        Back to Portfolio
      </motion.button>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.9fr] gap-8 xl:gap-12 items-start">
        {/* LEFT */}
        <motion.div

          initial="hidden"
          animate="show"
          className="w-full"
        >
          <motion.h1

            className="text-[28px] sm:text-[34px] md:text-[42px] font-bold leading-tight tracking-tight mb-3"
          >
            {project.title}
          </motion.h1>

          <motion.div

            className="w-16 h-[2px] rounded-full bg-white/20 mb-5"
          />

          <motion.p

            className="text-sm md:text-[13px] leading-7 text-white/60 text-justify mb-6"
          >
            {project.description}
          </motion.p>

          {/* STATS */}
          <motion.div

            className="grid grid-cols-2 gap-3 mb-6"
          >
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-[#101010] border border-white/10 rounded-2xl px-4 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Code2 size={16} />
              </div>

              <div>
                <p className="text-lg font-semibold">{tech.length}</p>

                <p className="text-[11px] text-white/40">Total Technology</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="bg-[#101010] border border-white/10 rounded-2xl px-4 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Layers size={16} />
              </div>

              <div>
                <p className="text-lg font-semibold">{features.length}</p>

                <p className="text-[11px] text-white/40">Main Features</p>
              </div>
            </motion.div>
          </motion.div>

          {/* BUTTONS */}
          <motion.div className="flex flex-wrap gap-3 mb-8">
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 hover:bg-white/5 transition"
              >
                <ExternalLink size={15} />
                <span className="text-sm">Live Demo</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-white/45">
                <ExternalLink size={15} />
                <span className="text-sm">No Link</span>
              </div>
            )}

            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 hover:bg-white/5 transition"
              >
                <GitBranch size={15} />
                <span className="text-sm">Github</span>
              </a>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#101010] border border-white/10 text-white/45">
                <GitBranch size={15} />
                <span className="text-sm">No Link</span>
              </div>
            )}
          </motion.div>

          {/* TECH STACK */}
          <motion.div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 size={15} className="text-white/70" />
              <p className="text-sm font-semibold">Technologies Used</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tech.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-2 rounded-xl bg-[#101010] border border-white/10 text-[11px] text-white/75"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          </motion.div>

          {project.dev_notes && (
            <motion.div className="mt-8">
              <h3 className="font-semibold mb-3">Developer Notes</h3>

              <p className="text-xs text-white/50 leading-6">
                {project.dev_notes}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT */}
        <motion.div

          initial="hidden"
          animate="show"
          className="w-full"
        >
          {galleryImages.length > 0 && (
            <motion.div className="mb-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#101010] shadow-2xl shadow-black/30">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0.5, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={galleryImages[currentImage]}
                  alt={`${project.title} - Image ${currentImage + 1}`}
                  className="w-full h-[200px] sm:h-[240px] md:h-[270px] xl:h-[300px] 2xl:h-[320px] object-cover"
                />

                {currentImage > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition"
                  >
                    <ChevronLeft size={17} />
                  </button>
                )}

                {currentImage < galleryImages.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition"
                  >
                    <ChevronRight size={17} />
                  </button>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`transition-all rounded-full ${
                        currentImage === i
                          ? "w-7 h-2 bg-white"
                          : "w-2 h-2 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <motion.div

            className="bg-[#101010] border border-white/10 rounded-3xl p-5 md:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-white/70" />
              <p className="text-sm font-semibold">Key Features</p>
            </div>

            <ul className="space-y-3 text-sm text-white/65 leading-6">
              {features.map((f, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-white/35 mt-[2px] shrink-0">•</span>

                  <span>{f.trim()}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
