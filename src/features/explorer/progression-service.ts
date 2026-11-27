import { createClient } from "@/lib/supabase/client";
import { ensureExplorerUserId } from "@/lib/supabase/session";
import type {
  ExplorerBadge,
  ExplorerProgress,
  XPActivity,
} from "./progression-types";

const STORAGE_KEY = "the-center-explorer-progress";
const PROGRESS_EVENT = "the-center-progress-updated";

const INITIAL_PROGRESS: ExplorerProgress = {
  totalXP: 0,
  completedChapters: [],
  badges: [],
  activities: [],
};

const CHAPTER_BADGES: Record<string, Omit<ExplorerBadge, "earnedAt">> = {
  "chapter-01": {
    id: "the-first-discovery",
    title: "The First Discovery",
    description: "Menyelesaikan investigasi dan perjalanan Chapter 01.",
    icon: "compass",
  },
};

export function getExplorerProgress(): ExplorerProgress {
  if (typeof window === "undefined") {
    return INITIAL_PROGRESS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_PROGRESS;

  try {
    return JSON.parse(stored) as ExplorerProgress;
  } catch {
    return INITIAL_PROGRESS;
  }
}

function saveProgress(progress: ExplorerProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function subscribeToProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PROGRESS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROGRESS_EVENT, callback);
  };
}

/**
 * Tarik state progres terbaru dari Supabase & perbarui cache lokal
 */
export async function syncProgressFromCloud(): Promise<ExplorerProgress> {
  if (typeof window === "undefined") return INITIAL_PROGRESS;

  const userId = await ensureExplorerUserId();
  if (!userId) return getExplorerProgress();

  const supabase = createClient();

  const [progressRes, badgesRes, activitiesRes] = await Promise.all([
    supabase
      .from("explorer_progress")
      .select("total_xp, completed_chapters")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("explorer_badges")
      .select("badge_code, title, description, icon, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false }),
    supabase
      .from("xp_activities")
      .select("id, activity, description, points, earned_at")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(30),
  ]);

  if (progressRes.error) {
    console.error("Failed syncing progress:", progressRes.error.message);
    return getExplorerProgress();
  }

  const merged: ExplorerProgress = {
    totalXP: progressRes.data?.total_xp ?? 0,
    completedChapters: progressRes.data?.completed_chapters ?? [],
    badges: (badgesRes.data ?? []).map((b) => ({
      id: b.badge_code,
      title: b.title,
      description: b.description,
      icon: b.icon,
      earnedAt: b.earned_at,
    })),
    activities: (activitiesRes.data ?? []).map((a) => ({
      id: a.id,
      activity: a.activity,
      description: a.description,
      points: a.points,
      earnedAt: a.earned_at,
    })),
  };

  saveProgress(merged);
  return merged;
}

export function awardXP(
  activity: string,
  description: string,
  points: number,
): XPActivity {
  const progress = getExplorerProgress();
  const nextTotalXP = progress.totalXP + points;

  const newActivity: XPActivity = {
    id: crypto.randomUUID(),
    activity,
    description,
    points,
    earnedAt: new Date().toISOString(),
  };

  saveProgress({
    ...progress,
    totalXP: nextTotalXP,
    activities: [newActivity, ...progress.activities],
  });

  // Sync ke Supabase di latar belakang
  void (async () => {
    const userId = await ensureExplorerUserId();
    if (!userId) return;
    const supabase = createClient();

    await Promise.all([
      supabase.from("explorer_progress").upsert({
        user_id: userId,
        total_xp: nextTotalXP,
        completed_chapters: progress.completedChapters,
        updated_at: new Date().toISOString(),
      }),
      supabase.from("xp_activities").insert({
        id: newActivity.id,
        user_id: userId,
        activity: newActivity.activity,
        description: newActivity.description,
        points: newActivity.points,
        earned_at: newActivity.earnedAt,
      }),
    ]);
  })();

  return newActivity;
}

export function awardBadge(
  badge: Omit<ExplorerBadge, "earnedAt">,
): ExplorerBadge | null {
  const progress = getExplorerProgress();
  const alreadyEarned = progress.badges.some((item) => item.id === badge.id);

  if (alreadyEarned) return null;

  const newBadge: ExplorerBadge = {
    ...badge,
    earnedAt: new Date().toISOString(),
  };

  saveProgress({
    ...progress,
    badges: [newBadge, ...progress.badges],
  });

  // Sync ke Supabase di latar belakang
  void (async () => {
    const userId = await ensureExplorerUserId();
    if (!userId) return;
    const supabase = createClient();

    await supabase.from("explorer_badges").upsert(
      {
        user_id: userId,
        badge_code: newBadge.id,
        title: newBadge.title,
        description: newBadge.description,
        icon: newBadge.icon,
        earned_at: newBadge.earnedAt,
      },
      { onConflict: "user_id,badge_code" },
    );
  })();

  return newBadge;
}

export function completeChapter(chapterId: string): boolean {
  const progress = getExplorerProgress();

  if (progress.completedChapters.includes(chapterId)) {
    return false;
  }

  const nextCompleted = [...progress.completedChapters, chapterId];

  saveProgress({
    ...progress,
    completedChapters: nextCompleted,
  });

  // Sync daftar chapter selesai ke Supabase
  void (async () => {
    const userId = await ensureExplorerUserId();
    if (!userId) return;
    const supabase = createClient();

    await supabase.from("explorer_progress").upsert({
      user_id: userId,
      total_xp: getExplorerProgress().totalXP,
      completed_chapters: nextCompleted,
      updated_at: new Date().toISOString(),
    });
  })();

  awardXP("Chapter Completion", `Menyelesaikan ${chapterId}`, 100);

  const chapterBadge = CHAPTER_BADGES[chapterId];
  if (chapterBadge) {
    awardBadge(chapterBadge);
  }

  return true;
}
