export function tenMonths(direction: number, months = 10, offset = 1) {
  const today = new Date()
  const result = []

  for (let i = 0; i < months; i++) {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + (i + offset) * direction, 1)
    result.push({ when: formatDateToYYYYMMDD(nextMonth), label: formatDateToMMMYYYY(nextMonth) })
  }

  return result
}

function formatDateToMMMYYYY(date: Date): string {
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month: string = months[date.getMonth()]
  const year: number = date.getFullYear()
  return `${month} ${year}`
}

export function formatDateToYYYYMMDD(date: Date): string {
  const year: string = date.getFullYear().toString().padStart(4, '0')
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
  const day: string = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const daysThisMonth = (monthToUse: Date): Date[] => {
  const currentDate: Date = new Date()
  const currentMonth: number = monthToUse.getMonth()
  const currentYear: number = monthToUse.getFullYear()

  // Check if the monthToUse is the current month
  const isCurrentMonth: boolean = currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()

  // Get the number of days in the month
  const daysInMonth: number = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Generate the dates
  const dates: Date[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay: Date = new Date(currentYear, currentMonth, day)

    // If it's the current month, only include dates up to the current day
    if (isCurrentMonth && currentDay > currentDate) {
      break
    }

    dates.push(currentDay)
  }

  return dates
}
