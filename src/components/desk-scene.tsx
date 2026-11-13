import type { ReactNode } from "react";

export function DeskScene({ children }: { children: ReactNode }) {
  return (
    <div className="desk-scene">
      <div className="desk-lamp" data-scene-object="lamp" role="button" tabIndex={0} aria-label="Desk lamp">
        <div className="lamp-light" />
        <div className="lamp-arm" />
        <div className="lamp-shade" />
        <div className="lamp-base" />
      </div>
      <div className="desk-mug" data-scene-object="mug" role="button" tabIndex={0} aria-label="Coffee mug"><div className="mug-body" /></div>
      {children}
      <div className="desk-keyboard" data-scene-object="keyboard" role="button" tabIndex={0} aria-label="Desk keyboard">
        <div className="keyboard-keys" />
        <div className="keyboard-spacebar" />
      </div>
    </div>
  );
}
