import { Button } from "@/components/ui/button";

export function SoundToggle({ enabled, onToggle, onHover }: { enabled: boolean; onToggle: () => void; onHover: () => void }) {
  return (
    <Button type="button" variant="ghost" className="sound-toggle" aria-label="Sound effects" aria-pressed={enabled} title={enabled ? "Mute sound effects" : "Enable sound effects"} onPointerEnter={(event) => { if (event.pointerType !== "touch") onHover(); }} onFocus={onHover} onClick={onToggle}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {enabled ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
      </svg>
    </Button>
  );
}
