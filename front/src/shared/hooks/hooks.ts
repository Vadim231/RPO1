import Fuse from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';
import { MessageType } from '../types/type';
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
function debouncedSearch(
  data: Array<object>,
  search: string,
  delay: number = 500,
  threshold: number = 0.4
): MessageType[] {
  const debouncedQuery = useDebounce(search, delay);
  const fuse = useMemo(
    () => new Fuse(data, { keys: ['message_content'], threshold: threshold }),
    [data]
  );
  const results = useMemo(() => {
    if (!debouncedQuery) return data;
    return fuse.search(debouncedQuery).map((r: { item: any }) => r.item);
  }, [debouncedQuery, fuse, data]);
  console.log(results);
  return results;
}
export default debouncedSearch;
