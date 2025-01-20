import React from 'react'

import { tenMonths } from '../biz/dateRange'
import { fetchHistorical } from '../biz/fetchData'

export const Historical = () => {
  const [historicalWeights, setHistoricalWeights] = React.useState<any[]>([])

  React.useEffect(() => {
    const datesOfInterest = tenMonths(-1, 3).filter((doi) => new Date(doi.when) < new Date())
    const dates = datesOfInterest.map((d: any) => d.when)
    dates.push('2024-09-01')
    dates.push('2023-09-01')
    dates.push('2022-09-05')
    dates.push('2021-09-01')
    dates.push('2020-09-01')
    dates.push('2019-09-01')
    fetchHistorical(setHistoricalWeights, dates)
  }, [])

  return (
    <>
      <h2>Historical</h2>
      <table>
        <thead>
          <tr className="past">
            <th>When</th>
            <th>Event</th>
            <th>Weight</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody className="past">
          {historicalWeights.map((day) => (
            <tr key={day.date}>
              <td>{new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
              <td>-</td>
              <td>{day.total}kg</td>
              <td>{day.fat}kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
