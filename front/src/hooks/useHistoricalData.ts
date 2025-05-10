import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchHistorical } from '../biz/fetchData'

export function useHistoricalData(when: string[]) {
  const queryKey = useMemo(() => ['historical', 'weights', ...when.sort()], [when])

  return useQuery({
    queryKey,
    queryFn: () => fetchHistorical(when),
  })
}
