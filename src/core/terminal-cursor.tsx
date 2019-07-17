import * as React from 'react';

export const CursorWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="cursor-wrapper active blink">{children}</span>
);

export class TerminalCursor {
  public position: number;
}
