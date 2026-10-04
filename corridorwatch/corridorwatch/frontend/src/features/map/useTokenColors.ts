import { useMemo } from 'react';
import type { Theme } from '../../hooks/useTheme';

/** Google Maps overlays need real colour strings, not CSS vars. Re-read when the theme changes. */
export function useTokenColors(theme: Theme) {
  return useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    const v = (name: string) => css.getPropertyValue(name).trim();
    return {
      primary: v('--brand-primary'),
      pipeline: theme === 'dark' ? '#CBD5E1' : '#334155',
      pipelineGas: v('--action-blue'),
      surface: v('--bg-surface'),
      level: { 1: v('--incident-1'), 2: v('--incident-2'), 3: v('--incident-3'), 4: v('--incident-4'), 5: v('--incident-5') } as Record<number, string>,
    };
    // theme is the trigger for re-reading computed styles
  }, [theme]);
}
