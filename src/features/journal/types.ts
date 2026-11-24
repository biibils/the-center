export type JournalCategory =
  | "discoveries"
  | "historical-figures"
  | "timeline"
  | "knowledge"
  | "clues"
  | "reflections";

export type JournalEntrySource = "exploration" | "manual";

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  category: JournalCategory;
  source: JournalEntrySource;

  chapterId?: string;
  locationId?: string;
  objectId?: string;

  createdAt: string;
};
