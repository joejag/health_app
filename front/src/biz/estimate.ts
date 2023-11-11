import { FAT_LOSS_GOAL } from './config'
import { DecoratedHealthResult } from './logic'

export function firstOfTheMonthDatesArrayForYear(direction: number) {
  const today = new Date()
  const nextSixMonthsDates = []

  for (let i = 0; i < 10; i++) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + (i + 1) * direction, 1)
    nextSixMonthsDates.push(nextMonth)
  }

  return nextSixMonthsDates
}

export function formatDate(date: Date): string {
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month: string = months[date.getMonth()]
  const year: number = date.getFullYear()
  return `${month} ${year}`
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year: string = date.getFullYear().toString().padStart(4, '0')
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0') // Months are 0-based
  const day: string = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

const datesOfInterest = firstOfTheMonthDatesArrayForYear(1).map((d) => {
  return { when: formatDateToYYYYMMDD(d), label: formatDate(d) }
})

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

  const estimates = datesOfInterest.map((doi) => {
    monthsSince++
    return { ...doi, total: total - FAT_LOSS_GOAL * monthsSince, fat: fat - FAT_LOSS_GOAL * monthsSince }
  })

  return estimates.filter((est) => est.fat > 18)
}
