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

export function awardXP(
  activity: string,
  description: string,
  points: number,
): XPActivity {
  const progress = getExplorerProgress();

  const newActivity: XPActivity = {
    id: crypto.randomUUID(),
    activity,
    description,
    points,
    earnedAt: new Date().toISOString(),
  };

  saveProgress({
    ...progress,
    totalXP: progress.totalXP + points,
    activities: [newActivity, ...progress.activities],
  });

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

  return newBadge;
}

export function completeChapter(chapterId: string): boolean {
  const progress = getExplorerProgress();

  if (progress.completedChapters.includes(chapterId)) {
    return false;
  }

  saveProgress({
    ...progress,
    completedChapters: [...progress.completedChapters, chapterId],
  });

  awardXP("Chapter Completion", `Menyelesaikan ${chapterId}`, 100);

  awardBadge({
    id: "the-first-discovery",
    title: "The First Discovery",
    description: "Menyelesaikan investigasi dan perjalanan Chapter 01.",
    icon: "compass",
  });

  return true;
}
