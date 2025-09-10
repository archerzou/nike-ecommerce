'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { parseSearchParams, stringifyFilters, type FilterParams } from './query';

export function useUpdateUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (updates: Partial<FilterParams>) => {
    const current = parseSearchParams(searchParams);
    const merged = { ...current, ...updates };
    
    if (!('page' in updates) && Object.keys(updates).length > 0) {
      merged.page = 1;
    }

    const queryStr = stringifyFilters(merged);
    const newUrl = queryStr ? `?${queryStr}` : '';
    
    router.push(newUrl, { scroll: false });
  };
}

export function useRemoveFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (filterType: keyof FilterParams, value?: string) => {
    const current = parseSearchParams(searchParams);
    
    if (Array.isArray(current[filterType]) && value) {
      const updated = (current[filterType] as string[]).filter(v => v !== value);
      (current as Record<string, unknown>)[filterType] = updated.length > 0 ? updated : undefined;
    } else {
      delete (current as Record<string, unknown>)[filterType];
    }
    
    current.page = 1;
    
    const queryStr = stringifyFilters(current);
    const newUrl = queryStr ? `?${queryStr}` : '';
    
    router.push(newUrl, { scroll: false });
  };
}
