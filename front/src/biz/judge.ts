import { DecoratedHealthResult } from './logic'

export const judgeDay = (result: DecoratedHealthResult, previous: DecoratedHealthResult[]) => {
  const bestWeight = Math.min(...previous.map((p) => p.totalWeight))
  const isDropInWeight = previous.length > 0 && Math.floor(result.totalWeight) < Math.floor(bestWeight)

  const bestFat = Math.min(...previous.map((p) => p.fat))
  const isDropInFat = previous.length > 0 && Math.floor(result.fat) < Math.floor(bestFat)

  return {
    celebrate: isDropInFat || isDropInWeight,
    isDropInFat,
    isDropInWeight,
  }
}
