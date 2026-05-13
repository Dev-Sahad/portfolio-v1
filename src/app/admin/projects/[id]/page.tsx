'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/app/admin/Sidebar';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchProject = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      if (id) {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          router.push('/admin/projects');
        } else {
          setProject(data);
        }
      }

      setLoading(false);
    };

    checkUserAndFetchProject();
  }, [id, router]);

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white'>
      <Sidebar />

      <main className='lg:ml-[250px] min-h-screen px-4 sm:px-6 lg:px-8 pt-[90px] lg:pt-6 pb-6'>
        <div className='py-6 lg:py-8'>
          {loading ? (
            <div className='text-white/50'>Loading project...</div>
          ) : project ? (
            <div>
              <h1 className='text-2xl sm:text-3xl font-bold mb-2'>{project.title}</h1>
              <p className='text-white/50 mb-6'>{project.description}</p>

              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className='rounded-2xl border border-white/10 w-full max-w-full sm:max-w-lg object-cover mb-4'
                />
              )}

              <div className='flex flex-wrap gap-2'>
                {project.technologies.map((tech: string, index: number) => (
                  <span key={index} className='text-xs px-2 py-1 rounded-full bg-white/10'>
                    {tech}
                  </span>
                ))}
              </div>

              <div className='mt-6 flex gap-4'>
                <a href={project.live_url} target='_blank' rel='noopener noreferrer' className='px-4 py-2 rounded-xl bg-white text-black'>
                  Live Demo
                </a>
                <a href={project.github_url} target='_blank' rel='noopener noreferrer' className='px-4 py-2 rounded-xl border border-white/10'>
                  GitHub
                </a>
              </div>
            </div>
          ) : (
            <div className='text-white/50'>Project not found</div>
          )}
        </div>
      </main>
    </div>
  );
}
