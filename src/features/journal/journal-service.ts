import type { JournalEntry } from "./types";

const STORAGE_KEY = "the-center-journal";

export function getJournalEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) return [];

  try {
    return JSON.parse(stored) as JournalEntry[];
  } catch {
    return [];
  }
}

export function addJournalEntry(
  entry: Omit<JournalEntry, "id" | "createdAt">,
): JournalEntry {
  const entries = getJournalEntries();

  const newEntry: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...entries]));

  return newEntry;
}

export function deleteJournalEntry(entryId: string): void {
  const entries = getJournalEntries();
  const updated = entries.filter((entry) => entry.id !== entryId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

type RecordDiscoveryInput = {
  title: string;
  content: string;
  chapterId: string;
  locationId: string;
  objectId: string;
};

export function recordDiscovery(
  discovery: RecordDiscoveryInput,
): JournalEntry | null {
  const entries = getJournalEntries();

  const alreadyRecorded = entries.some(
    (entry) =>
      entry.source === "exploration" &&
      entry.chapterId === discovery.chapterId &&
      entry.objectId === discovery.objectId,
  );

  if (alreadyRecorded) return null;

  return addJournalEntry({
    title: discovery.title,
    content: discovery.content,
    category: "discoveries",
    source: "exploration",
    chapterId: discovery.chapterId,
    locationId: discovery.locationId,
    objectId: discovery.objectId,
  });
}
