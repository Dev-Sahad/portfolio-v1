import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Lazy singleton — only instantiated when first accessed (client-side)
let _supabase: ReturnType<typeof createSupabaseBrowser> | null = null;

export const getSupabase = () => {
  if (!_supabase) {
    _supabase = createSupabaseBrowser();
  }
  return _supabase;
};

// Re-export as `supabase` for backward compat — but as a Proxy so it is
// only initialised when a property is actually accessed (i.e. at runtime,
// never during SSR module evaluation).
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseBrowser>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
