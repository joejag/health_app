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
  const { startWeight, currentWeight, amountLost, amountLeftToLose, fatLossProgress, desiredWeight } = calculateProgress(healthResults)

  const [chartData, setChartData] = React.useState<any>()
  React.useEffect(() => {
    const labels = Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1)

    const dataKnown = healthResults
      .slice()
      .reverse()
      .map((day) => day.fat)
    const data = padDataToCurrentMonth(dataKnown)

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
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className={amountLost < 0 ? 'progress-bar-fill-loss' : 'progress-bar-fill-gain'}
            style={{
              width: `${fatLossProgress > 100 ? 100 : fatLossProgress}%`,
            }}
          ></span>
          <span className="tooltiptext">{fatLossProgress}% fat lost</span>
        </div>
      </div>

      <h3 className="justify" style={{ marginTop: '0.2em' }}>
        {startWeight}kg | <span className="green">{amountLost}kg</span> | <span className={`fat`}>{currentWeight}kg</span> |{' '}
        <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
        kg
      </h3>

      {chartData && <Line data={chartData} options={{}} />}
    </>
  )
}
