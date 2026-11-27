import { createClient } from "@/lib/supabase/client";
import { syncProgressFromCloud } from "@/features/explorer/progression-service";
import { syncJournalFromCloud } from "@/features/journal/journal-service";

export async function ensureExplorerUserId(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function syncProfileFromCloud() {
  if (typeof window === "undefined") return null;

  const userId = await ensureExplorerUserId();
  if (!userId) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("explorer_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) {
    const mapped = {
      displayName: data.display_name,
      username: data.username,
      bio: data.bio ?? "",
      motivation: data.motivation ?? "",
      curiosity: data.curiosity ?? "",
      intention: data.intention ?? "",
      createdAt: data.created_at,
    };
    localStorage.setItem("the-center-explorer-profile", JSON.stringify(mapped));
    window.dispatchEvent(new Event("storage"));
    return mapped;
  }

  return null;
}

export async function syncAllExplorerData() {
  await Promise.all([
    syncProfileFromCloud(),
    syncProgressFromCloud(),
    syncJournalFromCloud(),
  ]);
}
