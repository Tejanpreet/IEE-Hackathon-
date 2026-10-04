import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const read = (): Theme =>
  (document.documentElement.getAttribute('data-theme') as Theme | null) ?? 'dark';

/** Theme lives on <html data-theme>. index.html sets it before paint. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(read);

  useEffect(() => {
    const obs = new MutationObserver(() => setThemeState(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('cw-theme', t); } catch { /* private mode */ }
  }, []);

  return { theme, setTheme };
}
