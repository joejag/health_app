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

export const daysThisMonth = () => {
  const currentDate: Date = new Date()
  const currentMonth: number = currentDate.getMonth()
  const currentYear: number = currentDate.getFullYear()

  const passedDates: Date[] = []
  for (let day = 1; day <= currentDate.getDate(); day++) {
    const currentDay: Date = new Date(currentYear, currentMonth, day)

    if (currentDay <= currentDate) {
      passedDates.push(currentDay)
    }
  }

  return passedDates
}
