'use client'

import { FormEvent, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import {
  Send,
  User,
  Mail,
  MessageSquare,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import {
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa'
import { SiteSettings } from '@/lib/siteSettings'

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const fieldVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

type ContactFormProps = {
  settings: SiteSettings
}

export default function ContactForm({ settings }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const socialLinks = [
    { title: 'Instagram', user: '@sahad_____sha', icon: FaInstagram, link: settings.instagram_url },
    { title: 'Youtube', user: '@SAHAD-IS-LIVE', icon: FaYoutube, link: settings.youtube_url },
    { title: 'Github', user: '@Dev-Sahad', icon: FaGithub, link: settings.github_url },
    { title: 'TikTok', user: '@sahad_____sha', icon: FaTiktok, link: settings.tiktok_url },
  ].filter((item) => item.link)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          page: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })

      if (!res.ok) throw new Error('Failed to send')

      setName('')
      setEmail('')
      setMessage('')
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: smoothEase }}
      viewport={{ once: false, amount: 0.2 }}
      className="rounded-[28px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 md:p-8 flex flex-col h-full"
    >
      <motion.div
        variants={fieldVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Contact Me</h2>

        <p className="text-sm text-white/50 mb-7">
          Feel free to reach out if you want to collaborate, discuss ideas, or simply say hello.
        </p>
      </motion.div>

      {status === 'sent' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm"
        >
          <CheckCircle size={16} />
          Message sent successfully.
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 text-sm"
        >
          <AlertCircle size={16} />
          Message failed. Please try again.
        </motion.div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <motion.div variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: false }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: false }} transition={{ delay: 0.16 }}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" whileInView="show" viewport={{ once: false }} transition={{ delay: 0.22 }}>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-5 text-white/40" size={16} />
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              required
              className="w-full rounded-2xl border border-white/15 bg-black/20 pl-12 pr-4 py-4 outline-none resize-none transition duration-200 focus:border-white focus:ring-1 focus:ring-white/40"
            />
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={status === 'sending'}
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.28 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.12 } }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl py-4 bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          <Send size={16} />
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </motion.button>
      </form>

      <div className="border-t border-white/10 pt-5 mt-6">
        <motion.p
          variants={fieldVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false }}
          transition={{ delay: 0.34 }}
          className="text-sm text-white/55 mb-4"
        >
          Connect With Me
        </motion.p>

        {settings.linkedin_url && (
          <motion.a
            href={settings.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            variants={fieldVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false }}
            transition={{ delay: 0.36 }}
            whileHover={{ scale: 1.03, transition: { duration: 0.12 } }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 mb-3 flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-white/[0.04] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />

            <div className="relative z-10 flex items-center gap-3">
              <FaLinkedinIn />
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                <p className="text-xs text-white/35">@muhammad-sahad</p>
              </div>
            </div>

            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <ArrowUpRight size={14} />
              </div>
            </div>
          </motion.a>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialLinks.map((item, i) => {
            const Icon = item.icon

            return (
              <motion.a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={fieldVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                transition={{ delay: 0.42 + i * 0.05 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.12 } }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 flex items-center justify-between"
              >
                <div className="absolute inset-0 bg-white/[0.04] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />

                <div className="relative z-10 flex items-center gap-3">
                  <Icon />
                  <div>
                    <p className="text-sm">{item.title}</p>
                    <p className="text-[11px] text-white/35">{item.user}</p>
                  </div>
                </div>

                <div className="relative z-10 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
