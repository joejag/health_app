import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { calculateProgress, DecoratedHealthResult } from '../biz/logic'

Chart.register(CategoryScale)

const padDataToCurrentMonth = (data: any) => {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => data[i] ?? null)
}

export const ProgressSummary = ({ healthResults }: { healthResults: DecoratedHealthResult[] }) => {
  const { startWeight, amountLost, desiredWeight } = calculateProgress(healthResults)

  const [chartData, setChartData] = React.useState<any>()
  React.useEffect(() => {
    const labels = Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1)

    const data = padDataToCurrentMonth([])
    healthResults
      .slice()
      .reverse()
      .forEach((d) => {
        // handle missing data
        const idx = new Date(d.date).getDate() - 1
        data[idx] = d.fat
      })

    setChartData({
      labels,
      datasets: [
        {
          label: 'Fat',
          data,
          backgroundColor: '#009879',
          borderColor: 'black',
          borderWidth: 1,
        },
        {
          label: 'Goal Weight',
          data: Array(labels.length).fill(desiredWeight), // Goal weight for every day
          borderColor: 'red',
          borderWidth: 2,
          borderDash: [5, 5], // Make the line dashed
          pointRadius: 0, // Remove points
        },
      ],
    })
  }, [healthResults, desiredWeight])

  return (
    <>
      <h3 className="justify" style={{ marginTop: '0.2em' }}>
        <span>SW:{startWeight}kg</span> <span className="green">{amountLost}kg</span> <span>GW:{desiredWeight}</span>
        kg
      </h3>

      {chartData && <Line data={chartData} options={{ spanGaps: true }} />}
    </>
  )
}
