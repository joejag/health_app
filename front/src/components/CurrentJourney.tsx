import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { START_DATE } from '../biz/config'
import { useHistoricalData } from '../hooks/useHistoricalData'

Chart.register(CategoryScale)

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateWeeklyDatesUntilNow(START_DATE: Date): string[] {
  const dates: string[] = []
  const currentDate = new Date(START_DATE)
  const today = new Date() // Get today's date

  while (currentDate <= today) {
    dates.push(formatDate(currentDate))
    currentDate.setDate(currentDate.getDate() + 7) // Increment by 7 days (1 week)
  }

  return dates
}

export const CurrentJourney = () => {
  const [chartData, setChartData] = React.useState<any>()

  const weeklyDatesArray = generateWeeklyDatesUntilNow(START_DATE)
  const { data: historicalWeights } = useHistoricalData(weeklyDatesArray)

  React.useEffect(() => {
    if (historicalWeights && historicalWeights.length > 0) {
      const weeklyDatesArray = generateWeeklyDatesUntilNow(START_DATE)

      const labels = weeklyDatesArray.map((day) =>
        new Date(day).toLocaleString('default', { day: 'numeric', month: 'short', year: '2-digit' })
      )

      const data = new Array(labels.length).fill(null)

      historicalWeights.forEach((d) => {
        // handle missing data
        const idx = labels.indexOf(new Date(d.date).toLocaleString('default', { day: 'numeric', month: 'short', year: '2-digit' }))
        data[idx] = d.total
      })

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
            backgroundColor: '#004298',
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
    }
  }, [historicalWeights])

  return (
    <>
      <h2>Current Journey</h2>

      {chartData && (
        <div style={{ height: '500px', width: '100%' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              spanGaps: true,
            }}
          />
        </div>
      )}

      {historicalWeights && historicalWeights.length > 0 && (
        <table style={{ width: '100%' }}>
          <thead>
            <tr className="journey">
              <th>When</th>
              <th>Weight</th>
              <th>Fat</th>
            </tr>
          </thead>
          <tbody className="journey">
            {historicalWeights.map((day) => (
              <tr key={day.date}>
                <td>{new Date(day.date).toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td>{day.total}kg</td>
                <td>{day.fat}kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
