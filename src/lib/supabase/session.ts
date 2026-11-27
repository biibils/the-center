import { createClient } from "@/lib/supabase/client";

export async function ensureExplorerUserId(): Promise<string | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    console.error("Supabase anonymous auth error:", error?.message);
    return null;
  }

  return data.user.id;
}
