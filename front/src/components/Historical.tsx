import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { tenMonths } from '../biz/dateRange'
import { fetchHistorical } from '../biz/fetchData'

Chart.register(CategoryScale)

export const Historical = () => {
  const [historicalWeights, setHistoricalWeights] = React.useState<any[]>([])

  const [chartData, setChartData] = React.useState<any>()

  React.useEffect(() => {
    const labels = historicalWeights
      .slice()
      .reverse()
      .map((day) => new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' }))
    const data = historicalWeights
      .slice()
      .reverse()
      .map((day) => day.total)

    // Add the BMI classification lines
    const bmiNormalUpperLine = Array(labels.length).fill(75.3) // Upper limit of normal weight
    const bmiOverweightUpperLine = Array(labels.length).fill(89.8) // Upper limit of overweight
    const bmiObesityClass1UpperLine = Array(labels.length).fill(104.4) // Upper limit of obesity class 1

    setChartData({
      labels,
      datasets: [
        {
          label: 'Weight',
          data,
          backgroundColor: '#095798',
          borderColor: 'black',
          borderWidth: 1,
        },
        {
          label: 'Normal 64-75',
          data: bmiNormalUpperLine,
          borderColor: 'green',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Overweight 75-90',
          data: bmiOverweightUpperLine,
          borderColor: 'orange',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Obesity 90-104',
          data: bmiObesityClass1UpperLine,
          borderColor: 'red',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    })
  }, [historicalWeights])

  React.useEffect(() => {
    const datesOfInterest = tenMonths(-1, 3, 0).filter((doi) => new Date(doi.when) < new Date())
    const dates = datesOfInterest.map((d: any) => d.when)
    dates.push('2024-09-01')
    dates.push('2024-03-01')
    dates.push('2023-09-01')
    dates.push('2023-03-01')
    dates.push('2022-09-05')
    dates.push('2022-03-01')
    dates.push('2021-09-01')
    dates.push('2021-03-01')
    dates.push('2020-09-01')
    dates.push('2020-03-01')
    dates.push('2019-09-01')
    fetchHistorical(setHistoricalWeights, dates)
  }, [])

  return (
    <>
      <h2>Historical</h2>

      {chartData && (
        <div style={{ height: '500px', width: '100%' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      )}

      <table>
        <thead>
          <tr className="past">
            <th>When</th>
            <th>Weight</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody className="past">
          {historicalWeights.map((day) => (
            <tr key={day.date}>
              <td>{new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
              <td>{day.total}kg</td>
              <td>{day.fat}kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
