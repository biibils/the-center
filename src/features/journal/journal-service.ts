import { createClient } from "@/lib/supabase/client";
import { ensureExplorerUserId } from "@/lib/supabase/session";
import type {
  JournalCategory,
  JournalEntry,
  JournalEntrySource,
} from "./types";

const STORAGE_KEY = "the-center-journal";
const JOURNAL_EVENT = "the-center-journal-updated";

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

function saveJournalEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(JOURNAL_EVENT));
}

export async function syncJournalFromCloud(): Promise<JournalEntry[]> {
  if (typeof window === "undefined") return [];

  const userId = await ensureExplorerUserId();
  if (!userId) return getJournalEntries();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed syncing journal:", error?.message);
    return getJournalEntries();
  }

  const mapped: JournalEntry[] = data.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category as JournalCategory,
    source: row.source as JournalEntrySource,
    chapterId: row.chapter_id ?? undefined,
    locationId: row.location_id ?? undefined,
    objectId: row.object_id ?? undefined,
    createdAt: row.created_at,
  }));

  saveJournalEntries(mapped);
  return mapped;
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

  saveJournalEntries([newEntry, ...entries]);

  void (async () => {
    const userId = await ensureExplorerUserId();
    if (!userId) return;
    const supabase = createClient();

    await supabase.from("journal_entries").insert({
      id: newEntry.id,
      user_id: userId,
      title: newEntry.title,
      content: newEntry.content,
      category: newEntry.category,
      source: newEntry.source,
      chapter_id: newEntry.chapterId ?? null,
      location_id: newEntry.locationId ?? null,
      object_id: newEntry.objectId ?? null,
      created_at: newEntry.createdAt,
    });
  })();

  return newEntry;
}

export function deleteJournalEntry(entryId: string): void {
  const entries = getJournalEntries();
  saveJournalEntries(entries.filter((entry) => entry.id !== entryId));

  void (async () => {
    const userId = await ensureExplorerUserId();
    if (!userId) return;
    const supabase = createClient();

    await supabase
      .from("journal_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", userId);
  })();
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
