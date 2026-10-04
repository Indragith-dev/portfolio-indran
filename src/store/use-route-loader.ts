import { create } from "zustand";

type RouteLoaderState = {
  /** Path we are navigating away from while the loader is up; null when idle. */
  from: string | null;
  /** Where we are heading, for the label under the bar. */
  to: string | null;
  start: (from: string, to: string) => void;
  finish: () => void;
};

/**
 * Drives the AIRA page-transition loader (components/route-loader.tsx).
 * Link clicks are caught automatically; call `start` yourself before a
 * programmatic router.push.
 */
export const useRouteLoader = create<RouteLoaderState>()((set) => ({
  from: null,
  to: null,
  start: (from, to) => set({ from, to }),
  finish: () => set({ from: null, to: null }),
}));

/** Navigations that start on these paths get the loader. */
export const LOADER_FROM_PATHS = ["/"];
