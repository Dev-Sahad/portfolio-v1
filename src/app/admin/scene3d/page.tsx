'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/admin/Sidebar';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Pencil, X, Save, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';

const COLOR_PRESETS = ['#ffffff', '#aaaaff', '#88aaff', '#ff6688', '#66ffaa', '#ffcc44', '#ff44aa'];

export default function Scene3DPage() {
  const router = useRouter();
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    text: '',
    color: '#ffffff',
    fontSize: 1.8,
    opacity: 0.75,
  });

  const fetchWords = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push('/admin/login'); return; }
    const { data } = await supabase.from('scene3d_words').select('*').order('created_at', { ascending: true });
    setWords(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWords(); }, []);

  const resetForm = () => {
    setForm({ text: '', color: '#ffffff', fontSize: 1.8, opacity: 0.75 });
    setEditId(null);
  };

  const handleOpen = (item?: any) => {
    if (item) {
      setForm({ text: item.text, color: item.color || '#ffffff', fontSize: item.fontSize || 1.8, opacity: item.opacity || 0.75 });
      setEditId(item.id);
    } else {
      resetForm();
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.text.trim()) return;
    setSaving(true);

    if (editId) {
      await supabase.from('scene3d_words').update({ text: form.text, color: form.color, fontSize: form.fontSize, opacity: form.opacity }).eq('id', editId);
    } else {
      await supabase.from('scene3d_words').insert([{ text: form.text, color: form.color, fontSize: form.fontSize, opacity: form.opacity }]);
    }

    setSaving(false);
    setOpen(false);
    resetForm();
    fetchWords();
    Swal.fire({ title: 'Saved!', icon: 'success', timer: 1200, showConfirmButton: false, background: '#0f0f0f', color: '#fff' });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete word?', icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Delete', cancelButtonText: 'Cancel',
      background: '#0f0f0f', color: '#fff', confirmButtonColor: '#ef4444', cancelButtonColor: '#27272a',
    });
    if (!result.isConfirmed) return;
    await supabase.from('scene3d_words').delete().eq('id', id);
    setWords(w => w.filter(x => x.id !== id));
  };

  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      title: 'Reset to defaults?', text: 'This will clear all words and restore defaults.',
      icon: 'warning', showCancelButton: true, confirmButtonText: 'Reset',
      background: '#0f0f0f', color: '#fff', confirmButtonColor: '#ef4444', cancelButtonColor: '#27272a',
    });
    if (!result.isConfirmed) return;

    await supabase.from('scene3d_words').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const defaults = [
      { text: 'Design', color: '#ffffff', fontSize: 1.8, opacity: 0.75 },
      { text: 'Frontend', color: '#aaaaff', fontSize: 2.0, opacity: 0.8 },
      { text: 'React', color: '#ffffff', fontSize: 1.8, opacity: 0.7 },
      { text: 'TypeScript', color: '#88aaff', fontSize: 1.6, opacity: 0.7 },
      { text: '設計', color: '#ffffff', fontSize: 2.2, opacity: 0.6 },
      { text: '開発', color: '#aaaaff', fontSize: 2.0, opacity: 0.6 },
      { text: 'Three.js', color: '#ffffff', fontSize: 1.6, opacity: 0.7 },
      { text: 'Tailwind', color: '#66ffaa', fontSize: 1.6, opacity: 0.65 },
      { text: 'Next.js', color: '#ffffff', fontSize: 1.8, opacity: 0.75 },
      { text: 'Creative', color: '#ffcc44', fontSize: 1.8, opacity: 0.7 },
      { text: 'UI / UX', color: '#ff6688', fontSize: 1.8, opacity: 0.7 },
      { text: 'Portfolio', color: '#ffffff', fontSize: 1.6, opacity: 0.65 },
    ];

    await supabase.from('scene3d_words').insert(defaults);
    fetchWords();
    Swal.fire({ title: 'Reset!', icon: 'success', timer: 1400, showConfirmButton: false, background: '#0f0f0f', color: '#fff' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <main className="lg:ml-[250px] min-h-screen px-4 sm:px-6 lg:px-8 pt-[90px] lg:pt-6 pb-8">
        <div className="max-w-[1200px] mx-auto py-6 lg:py-8">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-white/40" />
                <span className="text-xs text-white/40 uppercase tracking-widest">3D Scene</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">Word Cloud Editor</h1>
              <p className="text-sm text-white/40 mt-1">Manage the floating words on your hero 3D scene</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleResetDefaults}
                className="px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-sm transition"
              >
                Reset Defaults
              </button>
              <button
                onClick={() => handleOpen()}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-black font-medium text-sm hover:opacity-90 transition"
              >
                <Plus size={16} /> Add Word
              </button>
            </div>
          </div>

          {/* PREVIEW NOTE */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/50">
            💡 Changes appear live on your portfolio hero section. Words are distributed in a 3D sphere and slowly auto-rotate.
          </div>

          {/* WORD GRID */}
          {loading ? (
            <div className="text-white/40 text-sm">Loading words...</div>
          ) : words.length === 0 ? (
            <div className="rounded-2xl border border-white/10 h-48 flex flex-col items-center justify-center gap-3 text-white/30">
              <Sparkles size={28} />
              <p>No words yet — add some or reset to defaults</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 transition-all flex flex-col gap-3"
                >
                  {/* PREVIEW */}
                  <div
                    className="rounded-xl h-14 flex items-center justify-center text-lg font-semibold"
                    style={{ color: word.color || '#fff', opacity: word.opacity || 0.75, background: 'rgba(255,255,255,0.04)' }}
                  >
                    {word.text}
                  </div>

                  {/* META */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ background: word.color || '#fff' }} />
                    <span className="text-[11px] text-white/35 truncate">
                      size {word.fontSize || 1.8} · opacity {Math.round((word.opacity || 0.75) * 100)}%
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpen(word)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs transition"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center px-3 py-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#111] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{editId ? 'Edit Word' : 'Add Word'}</h2>
              <button onClick={() => { setOpen(false); resetForm(); }} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* TEXT */}
            <div className="mb-4">
              <label className="text-xs text-white/40 mb-1.5 block">Word Text</label>
              <input
                value={form.text}
                onChange={(e) => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="e.g. Design, React, UI/UX..."
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/10 rounded-2xl outline-none text-sm focus:border-white/25 transition"
              />
            </div>

            {/* COLOR */}
            <div className="mb-4">
              <label className="text-xs text-white/40 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    className={`w-7 h-7 rounded-full border-2 transition ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-7 h-7 rounded-full cursor-pointer border border-white/20 bg-transparent"
                  title="Custom color"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full" style={{ background: form.color }} />
                <span className="text-xs text-white/40">{form.color}</span>
              </div>
            </div>

            {/* FONT SIZE */}
            <div className="mb-4">
              <label className="text-xs text-white/40 mb-1.5 block">Font Size: {form.fontSize}</label>
              <input
                type="range" min="0.8" max="4" step="0.1"
                value={form.fontSize}
                onChange={(e) => setForm(f => ({ ...f, fontSize: parseFloat(e.target.value) }))}
                className="w-full accent-white"
              />
            </div>

            {/* OPACITY */}
            <div className="mb-6">
              <label className="text-xs text-white/40 mb-1.5 block">Opacity: {Math.round(form.opacity * 100)}%</label>
              <input
                type="range" min="0.1" max="1" step="0.05"
                value={form.opacity}
                onChange={(e) => setForm(f => ({ ...f, opacity: parseFloat(e.target.value) }))}
                className="w-full accent-white"
              />
            </div>

            {/* LIVE PREVIEW */}
            <div className="mb-5 rounded-2xl border border-white/10 bg-[#0a0a0a] h-16 flex items-center justify-center">
              <span style={{ color: form.color, opacity: form.opacity, fontSize: `${Math.max(12, form.fontSize * 10)}px`, fontWeight: 600 }}>
                {form.text || 'Preview'}
              </span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setOpen(false); resetForm(); }} className="flex-1 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-sm transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-2xl bg-white text-black font-medium text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                <Save size={15} />
                {saving ? 'Saving...' : 'Save Word'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
