import { createClient } from "@/utils/supabase/server";
import PageClient from "./PageClient"; // Or wherever your client view component is

// 1. Ensure the main component function is async
export default async function Home() {
  
  // 2. FIX: Add 'await' right here to unwrap the client instance
  const supabase = await createClient();

  // 3. Now you can query data cleanly
  const { data: projects } = await supabase
    .from('projects')
    .select('*, technologies(*)')
    .order('id', { ascending: true });

  const { data: technologies } = await supabase
    .from('technologies')
    .select('*');

  return (
    <PageClient projects={projects || []} technologies={technologies || []} />
  );
}
