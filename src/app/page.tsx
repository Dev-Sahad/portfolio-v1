import PageClient from './PageClient'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, technologies(*)')
    .order('id', { ascending: true })

  const { data: technologies } = await supabase
    .from('technologies')
    .select('*')
    .order('name', { ascending: true })

  return <PageClient projects={projects || []} technologies={technologies || []} />
}
