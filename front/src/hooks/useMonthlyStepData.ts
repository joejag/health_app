import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { fetchStepData } from '../biz/fetchData'

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000
const firstDayOfTheMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

function convertDateToApiString(when: Date) {
  return `${when.getFullYear()}-${(when.getMonth() + 1).toString().padStart(2, '0')}-01`
}

export function useMonthlyStepData(when: Date) {
  const dontCacheDate = convertDateToApiString(firstDayOfTheMonth)
  const apiDate = convertDateToApiString(when)

  const queryKey = useMemo(() => ['monthly_steps', apiDate], [apiDate])
  const shouldCache = apiDate !== dontCacheDate

  return useQuery({
    queryKey,
    queryFn: () => fetchStepData(apiDate),
    staleTime: shouldCache ? Infinity : FIVE_MINUTES_IN_MS,
    gcTime: Infinity,
  })
}
