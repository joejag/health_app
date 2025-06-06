import { FAT_LOSS_GOAL, NEXT_BIG_EVENT, NEXT_BIG_EVENT_DATE } from './config'

export interface HealthResult {
  ate: number
  date: string
  fat: number
  diff: number
  exercise: number
  steps: number
  lean: number
  totalWeight: number
  total: number
}

export interface DecoratedHealthResult extends HealthResult {
  diff: number
  exercise: number
  weightColor: string
  fatColor: string
}

export interface HealthCalculations {
  amountLost: number
  startWeight: number
  startWeightTotal: number
  currentWeight: number
  periodProgress: number
  amountLeftToLose: number
  fatLossProgress: number
  desiredWeight: number
  desiredWeightTotal: number
}

export interface NextBigEventDetails {
  daysToNextBigEvent: number
  weeksToNextBigEvent: number
  nextBigEvent: string
}

function getDaysInCurrentMonth() {
  return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
}

export const calculateProgress = (items: DecoratedHealthResult[]): HealthCalculations => {
  const dataToday = items[0]
  const dataAtStart = items[items.length - 1]

  const desiredWeight = dataAtStart.fat - FAT_LOSS_GOAL
  const desiredWeightTotal = dataAtStart.totalWeight - FAT_LOSS_GOAL
  const amountLost = dataToday.fat - dataAtStart.fat
  const amountLeftToLose = dataToday.fat - desiredWeight > 0 ? dataToday.fat - desiredWeight : 0
  const fatLossProgress = Math.abs(amountLost) / FAT_LOSS_GOAL
  const periodProgress = daysTo(new Date(dataAtStart.date)) / getDaysInCurrentMonth()

  return {
    startWeight: dataAtStart.fat,
    startWeightTotal: dataAtStart.totalWeight,
    currentWeight: dataToday.fat,
    desiredWeight: Math.round(desiredWeight * 10) / 10,
    desiredWeightTotal: Math.round(desiredWeightTotal * 10) / 10,
    amountLost: Math.round(amountLost * 10) / 10,
    amountLeftToLose: Math.round(amountLeftToLose * 10) / 10,
    fatLossProgress: Math.round(fatLossProgress * 100),
    periodProgress: Math.round(periodProgress * 100),
  }
}

export const nextBigEventDates = (): NextBigEventDetails => {
  const weeksToNextBigEvent = daysTo(NEXT_BIG_EVENT_DATE) / 7
  const daysToNextBigEvent = daysTo(NEXT_BIG_EVENT_DATE) % 7

  return {
    weeksToNextBigEvent: Math.floor(weeksToNextBigEvent),
    daysToNextBigEvent: daysToNextBigEvent,
    nextBigEvent: NEXT_BIG_EVENT,
  }
}

function daysTo(start: Date) {
  const date1 = new Date(start)
  const date2 = new Date()

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime()

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay)

  return Math.abs(diffInDays)
}

export const decorate = (input: HealthResult[]): DecoratedHealthResult[] => {
  const result: DecoratedHealthResult[] = []
  for (let i = 0; i < input.length; i++) {
    const day = input[i]

    let weightColor = 'gray'
    let fatColor = 'gray'

    if (i !== 0) {
      const previous = input[i - 1]
      weightColor = day.totalWeight > previous.totalWeight ? 'red' : 'green'
      if (day.totalWeight > previous.totalWeight && day.fat <= previous.fat) {
        weightColor = 'gray'
      }
      fatColor = day.fat > previous.fat ? 'red' : 'green'
    }

    result.push({
      ...day,
      weightColor,
      fatColor,
    })
  }

  return result
}

export const baseMetabolicRate = (weight: number) => {
  const age = calculateAge(new Date(1982, 4, 20))
  const size = 174
  return Math.round(10 * weight + 6.25 * size - 5 * age + 5)
}

function calculateAge(birthday: any) {
  var ageDifMs = Date.now() - birthday
  var ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}
