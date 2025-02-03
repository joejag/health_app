import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { Estimate } from '../biz/estimate'

Chart.register(CategoryScale)

export const Estimates = ({ futureEstimates }: { futureEstimates: Estimate[] }) => {
  const [chartData, setChartData] = React.useState<any>()
  React.useEffect(() => {
    const labels = futureEstimates.map((day) => new Date(day.when).toLocaleString('default', { month: 'short', year: 'numeric' }))
    const data = futureEstimates.map((day) => day.fat)

    const fitnessLine = Array(labels.length).fill(10)
    const healthyLine = Array(labels.length).fill(12)
    const tooMuchLine = Array(labels.length).fill(19)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Fat',
          data,
          backgroundColor: '#a29809',
          borderColor: 'black',
          borderWidth: 1,
        },
        {
          label: 'Fitness 10-12 (14-17%)',
          data: fitnessLine,
          borderColor: 'green',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Healthy 13-19 (18-24%)',
          data: healthyLine,
          borderColor: 'orange',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Overweight >19',
          data: tooMuchLine,
          borderColor: 'red',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    })
  }, [futureEstimates])

  return (
    <>
      <h2>Estimate to 12kg fat</h2>
      {chartData && (
        <div style={{ height: '300px', width: '100%' }}>
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
          <tr className="estimate">
            <th>When</th>
            <th>Weight</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody className="estimate">
          {futureEstimates.map((est) => (
            <tr key={est.label}>
              <td>{est.label}</td>
              <td>{est.total}kg</td>
              <td>{est.fat}kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
