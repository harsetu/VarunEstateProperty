import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { NewProject, Property } from '@/domain/property';
import { uniqueSectors } from '@/domain/propertyRules';
import { propertyRepository } from '@/app/container';

export type LoadStatus = 'loading' | 'ready' | 'error';

interface Catalog {
  status: LoadStatus;
  error?: string;
  properties: Property[];
  projects: NewProject[];
  /** Distinct property locations, most listings first. */
  sectors: string[];
  reload: () => void;
}

const CatalogContext = createContext<Catalog | null>(null);

/** Loads the listings once and shares them with every view model. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<Catalog, 'reload' | 'sectors'>>({ status: 'loading', properties: [], projects: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading', error: undefined }));
    Promise.all([propertyRepository.getAll(), propertyRepository.getNewProjects()])
      .then(([properties, projects]) => !cancelled && setState({ status: 'ready', properties, projects }))
      .catch((e: unknown) =>
        !cancelled && setState({ status: 'error', error: e instanceof Error ? e.message : 'Something went wrong', properties: [], projects: [] }),
      );
    return () => { cancelled = true; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const value = useMemo(
    () => ({ ...state, sectors: uniqueSectors(state.properties), reload }),
    [state, reload],
  );
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}
