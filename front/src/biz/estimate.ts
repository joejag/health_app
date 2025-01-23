import { FAT_LOSS_GOAL } from './config'
import { tenMonths } from './dateRange'
import { DecoratedHealthResult } from './logic'

export interface Estimate {
  when: string
  label: string
  total: number
  fat: number
}

export const estimate = (latest: DecoratedHealthResult): Estimate[] => {
  const total = Math.round(latest.totalWeight)
  const fat = Math.round(latest.fat)
  let monthsSince = 0

  const datesOfInterest = tenMonths(1)

  const estimates = datesOfInterest.map((doi) => {
    monthsSince++
    return { ...doi, total: total - FAT_LOSS_GOAL * monthsSince, fat: fat - FAT_LOSS_GOAL * monthsSince }
  })

  return estimates.filter((est) => est.fat > 11)
}
