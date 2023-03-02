import { HistoricalDate } from '../App'

const datesOfInterest = [
  { when: '2023-01-01', label: 'Jan 2023' },
  { when: '2023-02-01', label: 'Feb 2023' },
  { when: '2023-03-01', label: 'Mar 2023' },
  { when: '2023-04-01', label: 'Apr 2023' },
  { when: '2023-05-01', label: 'May 2023' },
  { when: '2023-06-01', label: 'Jun 2023' },
  { when: '2023-07-01', label: 'Jul 2023' },
  { when: '2023-08-01', label: 'Aug 2023' },
  { when: '2023-09-01', label: 'Sep 2023' },
  { when: '2023-10-01', label: 'Oct 2023' },
  { when: '2023-11-01', label: 'Nov 2023' },
  { when: '2023-12-01', label: 'Dec 2023' },
].filter((doi) => new Date(doi.when) > new Date())

const LOSS_RATE = 3

export interface Estimate {
  when: string
  label: string
  total: number
  fat: number
}

export const estimate = (latest: HistoricalDate): Estimate[] => {
  const total = latest.result.total
  const fat = latest.result.fat
  let monthsSince = 0

  const estimates = datesOfInterest.map((doi) => {
    monthsSince++
    return { ...doi, total: total - LOSS_RATE * monthsSince, fat: fat - LOSS_RATE * monthsSince }
  })

  return estimates.filter((est) => est.fat > 18)
}