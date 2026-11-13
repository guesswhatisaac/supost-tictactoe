import type { ReactNode } from "react";

export function DeskScene({ children }: { children: ReactNode }) {
  return (
    <div className="desk-scene">
      <div className="desk-lamp" aria-hidden="true">
        <div className="lamp-light" />
        <div className="lamp-arm" />
        <div className="lamp-shade" />
        <div className="lamp-base" />
      </div>
      <div className="desk-mug" aria-hidden="true" />
      {children}
      <div className="desk-keyboard" aria-hidden="true">
        <div className="keyboard-keys" />
        <div className="keyboard-spacebar" />
      </div>
    </div>
  );
}
