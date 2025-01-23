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
      ],
    })
  }, [futureEstimates])

  return (
    <>
      <h2>Estimate to 12kg fat</h2>
      {chartData && <Line data={chartData} options={{}} />}

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
