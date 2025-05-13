import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { calculateProgress, DecoratedHealthResult } from '../biz/logic'
import { NextBigEvent } from './NextBigEvent'

Chart.register(CategoryScale)

const padDataToCurrentMonth = (data: any) => {
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => data[i] ?? null)
}

export const ProgressSummary = ({
  healthResults,
  firstDayOfTheMonth,
}: {
  healthResults: DecoratedHealthResult[]
  firstDayOfTheMonth: Date
}) => {
  const { startWeight, startWeightTotal, amountLost, desiredWeight, desiredWeightTotal } = calculateProgress(healthResults)
  const [showFatChart, setShowFatChart] = React.useState(true)
  const showWeightChart = !showFatChart
  const [chartData, setChartData] = React.useState<any>()

  React.useEffect(() => {
    const labels = Array.from(
      { length: new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate() },
      (_, i) => i + 1
    )
    const data = padDataToCurrentMonth([])
    healthResults
      .slice()
      .reverse()
      .forEach((d) => {
        // handle missing data
        const idx = new Date(d.date).getDate() - 1
        data[idx] = d.fat
      })

    // Calculate the desired loss trendline
    const trendline = labels.map((day, index) => {
      const slope = (desiredWeight - startWeight) / (labels.length - 1)
      return startWeight + slope * index
    })

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
          label: 'Desired Loss Trendline',
          data: trendline, // Trendline data
          borderColor: 'blue',
          borderWidth: 2,
          borderDash: [5, 5], // Make the line dashed
          pointRadius: 0, // Remove points
        },
      ],
    })
  }, [healthResults, firstDayOfTheMonth, desiredWeight, startWeight])

  const [weightChartData, setWeightChartData] = React.useState<any>()
  React.useEffect(() => {
    const labels = Array.from(
      { length: new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 0).getDate() },
      (_, i) => i + 1
    )
    const data = padDataToCurrentMonth([])
    healthResults
      .slice()
      .reverse()
      .forEach((d) => {
        // handle missing data
        const idx = new Date(d.date).getDate() - 1
        data[idx] = d.totalWeight
      })

    // Calculate the desired loss trendline
    const trendline = labels.map((day, index) => {
      const slope = (desiredWeightTotal - startWeightTotal) / (labels.length - 1)
      return startWeightTotal + slope * index
    })

    setWeightChartData({
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
          label: 'Desired Loss Trendline',
          data: trendline, // Trendline data
          borderColor: 'blue',
          borderWidth: 2,
          borderDash: [5, 5], // Make the line dashed
          pointRadius: 0, // Remove points
        },
      ],
    })
  }, [healthResults, firstDayOfTheMonth, desiredWeightTotal, startWeightTotal])

  return (
    <>
      <h3 className="justify" style={{ marginTop: '0.2em', marginBottom: 0 }}>
        {showFatChart && (
          <>
            <span>SW:{startWeight}kg</span> <span className="green">{amountLost}kg</span> <span>GW:{desiredWeight}</span>
            kg
          </>
        )}{' '}
        {showWeightChart && (
          <>
            <span>SW:{startWeightTotal}kg</span> <span className="green">{amountLost}kg</span> <span>GW:{desiredWeightTotal}</span>
            kg
          </>
        )}
      </h3>
      <div className="justify" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <NextBigEvent />
        <Toggle initialValue={true} onChange={setShowFatChart} />
      </div>
      {showFatChart && chartData && <Line data={chartData} options={{ spanGaps: true }} />}
      {showWeightChart && weightChartData && <Line data={weightChartData} options={{ spanGaps: true }} />}
    </>
  )
}

interface ToggleProps {
  initialValue?: boolean
  onChange?: (value: boolean) => void
}

function Toggle({ initialValue = false, onChange }: ToggleProps) {
  const [isOn, setIsOn] = React.useState(initialValue)

  const handleToggle = () => {
    const newValue = !isOn
    setIsOn(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="toggle-container">
      <span className={`label ${!isOn ? 'active' : ''}`}>Weight</span>
      <button type="button" className="toggle-switch" onClick={handleToggle} aria-pressed={isOn}>
        <span className="slider" />
      </button>
      <span className={`label ${isOn ? 'active' : ''}`}>Fat</span>
    </div>
  )
}
