"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { recordDiscovery } from "@/features/journal/journal-service";

export type SceneObject = {
  id: string;
  label: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
};

type InteractiveSceneProps = {
  title: string;
  chapterId: string;
  locationId: string;
  objects: SceneObject[];
};

export function InteractiveScene({
  title,
  chapterId,
  locationId,
  objects,
}: InteractiveSceneProps) {
  const [discoveredObjects, setDiscoveredObjects] = useState<string[]>([]);
  const [activeObject, setActiveObject] = useState<SceneObject | null>(null);

  function handleDiscover(object: SceneObject) {
    setActiveObject(object);

    setDiscoveredObjects((previous) =>
      previous.includes(object.id) ? previous : [...previous, object.id],
    );

    recordDiscovery({
      title: object.label,
      content: object.description,
      chapterId,
      locationId,
      objectId: object.id,
    });
  }

  return (
    <section className="space-y-5">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          Eksplorasi Lokasi
        </span>
        <h3 className="mt-2 font-display text-2xl">{title}</h3>
        <p className="mt-2 text-sm text-muted">
          Amati lingkungan sekitar dan temukan objek yang menyimpan petunjuk.
        </p>
      </div>

      <div className="relative aspect-video overflow-hidden border border-border bg-surface">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-sm italic text-muted">
            Ilustrasi lokasi akan ditampilkan di sini
          </span>
        </div>

        {objects.map((object) => {
          const isDiscovered = discoveredObjects.includes(object.id);

          return (
            <button
              key={object.id}
              onClick={() => handleDiscover(object)}
              aria-label={`Temukan ${object.label}`}
              className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all ${
                isDiscovered
                  ? "border-accent bg-accent text-background"
                  : "border-accent bg-background/80 text-accent hover:scale-110"
              }`}
              style={{
                left: `${object.position.x}%`,
                top: `${object.position.y}%`,
              }}
            >
              <Search size={16} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Objek ditemukan</span>
        <span>
          {discoveredObjects.length} / {objects.length}
        </span>
      </div>

      {activeObject && (
        <article className="border border-border bg-surface p-6">
          <span className="text-xs uppercase tracking-[0.2em] text-accent">
            Petunjuk Ditemukan
          </span>

          <h4 className="mt-3 font-display text-xl">{activeObject.label}</h4>

          <p className="mt-3 text-sm leading-7 text-muted">
            {activeObject.description}
          </p>
        </article>
      )}
    </section>
  );
}
