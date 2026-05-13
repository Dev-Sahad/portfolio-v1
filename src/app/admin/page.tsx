'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const checkUserAndFetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const [projects, technologies, certificates, comments] = await Promise.all([
        supabase.from('projects').select('count', { count: 'exact' }),
        supabase.from('technologies').select('count', { count: 'exact' }),
        supabase.from('certificates').select('count', { count: 'exact' }),
        supabase.from('comments').select('count', { count: 'exact' }),
      ]);

      setStats({
        projects: projects.count,
        technologies: technologies.count,
        certificates: certificates.count,
        comments: comments.count,
      });

      setLoading(false);
    };

    checkUserAndFetchStats();
  }, [router]);

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white'>
      <Sidebar />

      <main className='lg:ml-[250px] min-h-screen px-4 sm:px-6 lg:px-8 pt-[90px] lg:pt-6 pb-6'>
        <div className='py-6 lg:py-8'>
          <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Dashboard</h1>

          {loading ? (
            <div className='text-white/50'>Loading stats...</div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              <div className='border border-white/10 bg-white/[0.03] rounded-2xl p-5'>
                <h2 className='text-sm text-white/50 mb-2'>Projects</h2>
                <p className='text-3xl font-bold'>{stats.projects}</p>
              </div>

              <div className='border border-white/10 bg-white/[0.03] rounded-2xl p-5'>
                <h2 className='text-sm text-white/50 mb-2'>Technologies</h2>
                <p className='text-3xl font-bold'>{stats.technologies}</p>
              </div>

              <div className='border border-white/10 bg-white/[0.03] rounded-2xl p-5'>
                <h2 className='text-sm text-white/50 mb-2'>Certificates</h2>
                <p className='text-3xl font-bold'>{stats.certificates}</p>
              </div>

              <div className='border border-white/10 bg-white/[0.03] rounded-2xl p-5'>
                <h2 className='text-sm text-white/50 mb-2'>Comments</h2>
                <p className='text-3xl font-bold'>{stats.comments}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
