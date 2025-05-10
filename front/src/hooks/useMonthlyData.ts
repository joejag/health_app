import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchData } from '../biz/fetchData'

const firstDayOfTheMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

function convertDateToApiString(when: Date) {
  return `${when.getFullYear()}-${(when.getMonth() + 1).toString().padStart(2, '0')}-01`
}

export function useMonthlyData(when: Date) {
  const dontCacheDate = convertDateToApiString(firstDayOfTheMonth)
  const apiDate = convertDateToApiString(when)

  const queryKey = useMemo(() => ['monthly', apiDate], [apiDate])
  const shouldCache = apiDate !== dontCacheDate

  return useQuery({
    queryKey,
    queryFn: () => fetchData(apiDate),
    staleTime: shouldCache ? Infinity : 0,
    gcTime: Infinity,
  })
}
