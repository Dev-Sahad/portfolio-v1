"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  Users,
  MessageSquare,
  Layers,
  RefreshCcw,
  TrendingUp,
  Folder,
  Award,
  Pin,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  projects: number;
  certificates: number;
  comments: number;
  pinned: number;
  technologies: number;
}

export default function DashboardPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [stats, setStats] = useState<Stats>({
    projects: 4,
    certificates: 2,
    comments: 100+,
    pinned: 2,
    technologies: 0,
  });

  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [
        projectsRes,
        certificatesRes,
        commentsRes,
        pinnedRes,
        technologiesRes,
        recentCommentsRes,
        recentProjectsRes,
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*", { count: "exact", head: true }).eq("is_pinned", true),
        supabase.from("technologies").select("*", { count: "exact", head: true }),
        supabase.from("comments").select("*").order("created_at", { ascending: false }).limit(8),
        supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(4),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        certificates: certificatesRes.count || 0,
        comments: commentsRes.count || 0,
        pinned: pinnedRes.count || 0,
        technologies: technologiesRes.count || 0,
      });

      setRecentComments(recentCommentsRes.data || []);
      setRecentProjects(recentProjectsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setAuthorized(true);
      fetchDashboard();
    };

    checkAuth();
  }, [fetchDashboard, router]);

  const topCards = [
    { icon: Folder, title: "Total Projects", value: stats.projects, href: "/admin/projects", color: "from-blue-500/10" },
    { icon: Award, title: "Certificates", value: stats.certificates, href: "/admin/certificates", color: "from-amber-500/10" },
    { icon: MessageSquare, title: "Comments", value: stats.comments, href: "/admin/comments", color: "from-emerald-500/10" },
    { icon: Pin, title: "Pinned", value: stats.pinned, href: "/admin/comments", color: "from-purple-500/10" },
    { icon: Layers, title: "Technologies", value: stats.technologies, href: "/admin/technologies", color: "from-pink-500/10" },
  ];

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40 text-sm">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar />

      <main className="lg:ml-[250px] pt-[95px] lg:pt-6 min-h-screen px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity size={16} className="text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-widest">Overview</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
              <p className="text-sm text-white/40 mt-1">Welcome back, Admin</p>
            </div>

            <button
              onClick={fetchDashboard}
              className="h-11 px-5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm group w-full sm:w-auto"
            >
              <RefreshCcw
                size={14}
                className="group-hover:rotate-180 transition duration-500"
              />
              Refresh
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {topCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className={`group rounded-2xl border border-white/10 px-4 py-4 bg-gradient-to-b ${card.color} to-transparent hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] block`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] text-white/45 mb-2">{card.title}</p>
                      <h2 className="text-[22px] sm:text-[26px] font-bold leading-none">
                        {loading ? "—" : card.value}
                      </h2>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition">
                      <Icon size={14} />
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] text-white/25">Live data</p>
                    <TrendingUp size={11} className="text-white/25" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* RECENT COMMENTS */}
            <div className="xl:col-span-2 rounded-2xl border border-white/10 p-5 sm:p-6 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/15 transition">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-medium">Recent Comments</h2>
                  <p className="text-xs text-white/35 mt-1">Latest visitor activity</p>
                </div>
                <Link href="/admin/comments" className="text-xs text-white/35 hover:text-white transition flex items-center gap-1">
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>

              <div className="max-h-[480px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {loading ? (
                  <div className="text-sm text-white/30 py-8 text-center">Loading comments...</div>
                ) : recentComments.length === 0 ? (
                  <div className="text-sm text-white/30 py-8 text-center flex flex-col items-center gap-2">
                    <MessageSquare size={24} />
                    No comments yet
                  </div>
                ) : (
                  recentComments.map((comment, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-medium shrink-0">
                          {comment.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-[13px] font-medium truncate">{comment.name}</p>
                            {comment.is_pinned && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">PIN</span>
                            )}
                            <span className="text-[10px] text-white/25 ml-auto">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[12px] text-white/45 line-clamp-2 leading-relaxed break-words">
                            {comment.comment}
                          </p>
                        </div>
                        <div className="text-[11px] text-white/35 shrink-0">
                          ❤️ {comment.likes || 0}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              {/* RECENT PROJECTS */}
              <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/15 transition">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium">Recent Projects</h2>
                  <Link href="/admin/projects" className="text-xs text-white/35 hover:text-white transition flex items-center gap-1">
                    View all <ArrowUpRight size={12} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-sm text-white/30 text-center py-4">Loading...</div>
                  ) : recentProjects.length === 0 ? (
                    <div className="text-sm text-white/30 text-center py-4">No projects yet</div>
                  ) : (
                    recentProjects.map((project, i) => (
                      <Link
                        key={i}
                        href={`/admin/projects/${project.id}`}
                        className="flex items-center gap-3 rounded-xl border border-white/5 hover:border-white/15 p-3 hover:bg-white/[0.03] transition group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Folder size={14} className="text-white/30" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{project.title}</p>
                          <p className="text-[11px] text-white/35 truncate">{project.description}</p>
                        </div>
                        <ArrowUpRight size={13} className="text-white/25 group-hover:text-white/60 transition shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="rounded-2xl border border-white/10 p-5 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/15 transition">
                <h2 className="text-base font-medium mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: "Add Project", href: "/admin/projects", icon: Folder },
                    { label: "Add Certificate", href: "/admin/certificates", icon: Award },
                    { label: "Manage Comments", href: "/admin/comments", icon: MessageSquare },
                    { label: "Manage Technologies", href: "/admin/technologies", icon: Layers },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        className="flex items-center gap-3 w-full rounded-xl border border-white/5 hover:border-white/15 px-4 py-3 hover:bg-white/[0.04] transition text-sm text-white/60 hover:text-white group"
                      >
                        <Icon size={14} />
                        {item.label}
                        <ArrowUpRight size={12} className="ml-auto opacity-0 group-hover:opacity-60 transition" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
