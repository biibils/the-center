export type ExplorerBadge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
};

export type XPActivity = {
  id: string;
  activity: string;
  description: string;
  points: number;
  earnedAt: string;
};

export type ExplorerProgress = {
  totalXP: number;
  completedChapters: string[];
  badges: ExplorerBadge[];
  activities: XPActivity[];
};
