import queryString from 'query-string';

export interface FilterParams {
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
}

export function parseSearchParams(searchParams: URLSearchParams): FilterParams {
  const parsed = queryString.parse(searchParams.toString(), {
    arrayFormat: 'comma',
    parseNumbers: true,
  });

  const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : undefined;
  };

  return {
    gender: parseStringArray(parsed.gender),
    color: parseStringArray(parsed.color),
    size: parseStringArray(parsed.size),
    priceMin: typeof parsed.priceMin === 'number' ? parsed.priceMin : undefined,
    priceMax: typeof parsed.priceMax === 'number' ? parsed.priceMax : undefined,
    sort: typeof parsed.sort === 'string' ? parsed.sort : undefined,
    page: typeof parsed.page === 'number' ? parsed.page : 1,
  };
}

export function stringifyFilters(filters: FilterParams): string {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    })
  );

  return queryString.stringify(cleanFilters, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
  });
}
