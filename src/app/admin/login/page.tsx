'use client'
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [supabase] = useState(() => typeof window !== 'undefined' ? createClient() : null as any)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleLogin = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    if (!email || !password) { setErrorMsg('Please enter both email and password.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setErrorMsg('Invalid credentials. Please try again.')
    } else {
      setSuccessMsg('Login successful! Redirecting...')
      setTimeout(() => router.push('/admin/dashboard'), 800)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }

  // Floating particles for background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }))

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex items-center justify-center px-4">

      {/* ANIMATED PARTICLE BG */}
      {mounted && particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* GLOW BLOBS */}
      <div className="absolute w-[600px] h-[600px] rounded-full top-[-200px] left-[-200px]"
        style={{ background: 'radial-gradient(circle, rgba(100,100,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full bottom-[-150px] right-[-150px]"
        style={{ background: 'radial-gradient(circle, rgba(255,100,150,0.04) 0%, transparent 70%)' }} />

      {/* GRID LINES */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)]">

          {/* LOGO / TOP */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative mb-5"
            >
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/[0.04] flex items-center justify-center relative overflow-hidden">
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.08), transparent 70%)' }} />
                <span className="text-3xl relative z-10">⚡</span>
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl border border-white/20"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-white/40 mt-1.5">Sign in to manage your portfolio</p>
            </motion.div>
          </div>

          {/* MESSAGES */}
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
              ✓ {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
              ✕ {errorMsg}
            </motion.div>
          )}

          {/* EMAIL */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="mb-4">
            <label className="text-xs text-white/50 mb-2 block font-medium tracking-wide">Email</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full h-[52px] rounded-2xl bg-white/[0.05] border border-white/10 pl-11 pr-4 text-white text-sm outline-none focus:border-white/30 focus:bg-white/[0.07] transition placeholder:text-white/20"
              />
            </div>
          </motion.div>

          {/* PASSWORD */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="mb-6">
            <label className="text-xs text-white/50 mb-2 block font-medium tracking-wide">Password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full h-[52px] rounded-2xl bg-white/[0.05] border border-white/10 pl-11 pr-12 text-white text-sm outline-none focus:border-white/30 focus:bg-white/[0.07] transition placeholder:text-white/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </motion.div>

          {/* LOGIN BUTTON */}
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-[52px] rounded-2xl bg-white text-black font-semibold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {loading ? <><Loader2 size={17} className="animate-spin" /> Signing In...</> : 'Sign In'}
          </motion.button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAUTH */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleOAuth('google')}
              className="h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/10 transition text-sm font-medium"
            >
              <FaGoogle size={16} /> Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleOAuth('github')}
              className="h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center gap-2 text-white/60 hover:text-white hover:bg-white/10 transition text-sm font-medium"
            >
              <FaGithub size={16} /> GitHub
            </motion.button>
          </div>

          {/* FOOTER */}
          <p className="text-center text-[11px] text-white/20 mt-6">
            Restricted access · Portfolio Admin Panel
          </p>
        </div>
      </motion.div>
    </div>
  )
}
