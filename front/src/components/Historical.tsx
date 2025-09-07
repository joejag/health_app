import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Line } from 'react-chartjs-2'

import { useHistoricalData } from '../hooks/useHistoricalData'

Chart.register(CategoryScale)



function generateQuarters(startYear = 2019): string[] {
  const months = [3, 6, 9, 12];
  const dates: string[] = [];
  const exceptions: Record<string, string> = {
    "2020-09": "2020-09-20",
    "2022-09": "2022-09-05",
    "2022-12": "2022-12-05",
  };

  const now = new Date();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1;

  for (let y = startYear; y <= endYear; y++) {
    for (const m of months) {
      if (y === endYear && m > endMonth) break;

      const key = `${y}-${String(m).padStart(2, "0")}`;
      if (exceptions[key]) {
        dates.push(exceptions[key]);
      } else {
        dates.push(`${key}-01`);
      }
    }
  }

  return dates.reverse(); // newest → oldest
}

const everyQuarterSince2019 = generateQuarters();

export const Historical = () => {
  const [chartData, setChartData] = React.useState<any>()
  const { data: historicalWeights } = useHistoricalData(everyQuarterSince2019)

  React.useEffect(() => {
    if (historicalWeights && historicalWeights.length > 0) {
      const labels = historicalWeights
        .slice()
        .map((day) => new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' }))
      const weightTotals = historicalWeights.slice().map((day) => day.total)

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
