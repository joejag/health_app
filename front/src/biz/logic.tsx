export interface HealthResult {
  ate: string
  date: string
  diff: number
  exercise: string
  fat: number
  lean: number
  totalWeight: number
}

export interface DecoratedHealthResult extends HealthResult {
  weightColor: string
  fatColor: string
  diffColor: string
}

export interface HealthCalculations {
  amountLost: number
  startWeight: number
  currentWeight: number
  periodProgress: number
  amountLeftToLose: number
  daysToRobRoyWay: number
  weeksToRobRoyWay: number
  fatLossProgress: number
  desiredWeight: number
}

const FAT_LOSS_GOAL = 3 // kgs
export const ROB_ROY_WAY_DATE = new Date('03/10/2023')
const PERIOD_LENGTH = 4 * 7

export const calculations = (
  items: DecoratedHealthResult[]
): HealthCalculations => {
  if (items.length === 0) {
    return {
      amountLost: 0,
      startWeight: 0,
      currentWeight: 0,
      amountLeftToLose: 0,
      daysToRobRoyWay: 0,
      weeksToRobRoyWay: 0,
      fatLossProgress: 0,
      periodProgress: 0,
      desiredWeight: 0,
    }
  }

  const dataToday = items[0]
  const dataAtStart = items[items.length - 1]

  const weeksToRobRoyWay = daysTo(ROB_ROY_WAY_DATE) / 7
  const daysToRobRoyWay = daysTo(ROB_ROY_WAY_DATE) % 7
  const desiredWeight = dataAtStart.fat - FAT_LOSS_GOAL
  const amountLost = dataToday.fat - dataAtStart.fat
  const amountLeftToLose =
    dataToday.fat - desiredWeight > 0 ? dataToday.fat - desiredWeight : 0
  const fatLossProgress = Math.abs(amountLost) / FAT_LOSS_GOAL
  const periodProgress = daysTo(new Date(dataAtStart.date)) / PERIOD_LENGTH

  return {
    weeksToRobRoyWay: Math.floor(weeksToRobRoyWay),
    daysToRobRoyWay,
    startWeight: dataAtStart.fat,
    currentWeight: dataToday.fat,
    desiredWeight: Math.round(desiredWeight * 10) / 10,
    amountLost: Math.round(amountLost * 10) / 10,
    amountLeftToLose: Math.round(amountLeftToLose * 10) / 10,
    fatLossProgress: Math.round(fatLossProgress * 100),
    periodProgress: Math.round(periodProgress * 100),
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

    let weightColor = 'yellow'
    let fatColor = 'yellow'
    const diffColor = day.diff > 0 ? 'red' : 'green'

    if (i !== 0) {
      const previous = input[i - 1]
      weightColor = day.totalWeight > previous.totalWeight ? 'red' : 'green'
      if (day.totalWeight > previous.totalWeight && day.fat <= previous.fat) {
        weightColor = 'yellow'
      }
      fatColor = day.fat > previous.fat ? 'red' : 'green'
    }

    result.push({
      ...day,
      weightColor,
      fatColor,
      diffColor,
    })
  }

  return result
}
