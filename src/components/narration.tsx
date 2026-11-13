type NarrationProps = { caption: string };

export function Narration({ caption }: NarrationProps) {
  return (
    <aside className="narration-panel" aria-label="Narration">
      <p className="narrator-caption" aria-live="polite" aria-atomic="true">
        {caption}
      </p>
    </aside>
  );
}
