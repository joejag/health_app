import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchData } from '../biz/fetchData'

export function useMonthlyData(when: string) {
  const queryKey = useMemo(() => ['monthly', when], [when])
  const shouldCache = when !== '2025-05-01'

  return useQuery({
    queryKey,
    queryFn: () => fetchData(when),
    staleTime: shouldCache ? Infinity : 0,
    gcTime: Infinity,
  })
}
