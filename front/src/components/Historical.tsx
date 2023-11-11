import React from 'react'

import { tenMonths } from '../biz/dateRange'
import { fetchHistorical } from '../biz/fetchData'

export const Historical = () => {
  const [historicalWeights, setHistoricalWeights] = React.useState<any[]>([])

  React.useEffect(() => {
    const datesOfInterest = tenMonths(-1).filter((doi) => new Date(doi.when) < new Date())
    const dates = datesOfInterest.map((d: any) => d.when)
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
          <tr>
            <td>Sep 2020</td>
            <td>Ben More</td>
            <td>80kg</td>
            <td>19kg</td>
          </tr>
          <tr>
            <td>May 2021</td>
            <td>WHW</td>
            <td>85kg</td>
            <td>21kg</td>
          </tr>
          <tr>
            <td>Apr 2022</td>
            <td>RRW</td>
            <td>89kg</td>
            <td>27kg</td>
          </tr>
          <tr>
            <td>Jul 2022</td>
            <td>Iceland</td>
            <td>96kg</td>
            <td>34kg</td>
          </tr>

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
