"use client";

import { Fragment, useLayoutEffect, useState, type ReactNode } from "react";

/**
 * Remounts its children every time the page comes back into view. Next keeps pages you've left alive
 * in a hidden React `<Activity>` and restores their state on return, which suits most of the page but
 * not entrance animations: they'd come back mid-way, half played and half skipped. React cleans up
 * layout effects as a page is hidden, so bumping the key there leaves fresh children waiting for the
 * page's return.
 */
export function FreshOnShow({ children }: { children: ReactNode }) {
  const [key, setKey] = useState(0);

  useLayoutEffect(() => () => setKey((k) => k + 1), []);

  return <Fragment key={key}>{children}</Fragment>;
}
