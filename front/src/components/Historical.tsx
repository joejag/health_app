import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { useHistoricalData } from '../hooks/useHistoricalData'

Chart.register(CategoryScale)

const everyQuarterSince2019: string[] = [
  '2025-03-01',
  '2024-12-01',
  '2024-09-01',
  '2024-06-01',
  '2024-03-01',
  '2023-12-01',
  '2023-09-01',
  '2023-06-01',
  '2023-03-01',
  '2022-12-05',
  '2022-09-05',
  '2022-06-01',
  '2022-03-01',
  '2021-12-01',
  '2021-09-01',
  '2021-06-01',
  '2021-03-01',
  '2020-12-01',
  '2020-09-20',
  '2020-06-01',
  '2020-03-01',
  '2019-12-01',
  '2019-09-01',
]

export const Historical = () => {
  const [chartData, setChartData] = React.useState<any>()
  const { data: historicalWeights } = useHistoricalData(everyQuarterSince2019)

  React.useEffect(() => {
    if (historicalWeights && historicalWeights.length > 0) {
      const labels = historicalWeights
        .slice()
        .reverse()
        .map((day) => new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' }))
      const weightTotals = historicalWeights
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
            data: weightTotals,
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
    }
  }, [historicalWeights])

  return (
    <>
      <h2>Since 2019</h2>

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
    </>
  )
}
