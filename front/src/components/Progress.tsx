import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { calculateProgress, DecoratedHealthResult } from '../biz/logic'

Chart.register(CategoryScale)

export const ProgressSummary = ({ healthResults }: { healthResults: DecoratedHealthResult[] }) => {
  const { startWeight, currentWeight, amountLost, amountLeftToLose, fatLossProgress, desiredWeight } = calculateProgress(healthResults)

  const [chartData, setChartData] = React.useState<any>()
  React.useEffect(() => {
    const labels = healthResults
      .slice()
      .reverse()
      .map((day) => day.date.split('-')[2])
    const data = healthResults
      .slice()
      .reverse()
      .map((day) => day.fat)
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
      ],
    })
  }, [healthResults])

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
