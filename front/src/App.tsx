import './App.css'

import React from 'react'
import Confetti from 'react-confetti'

import { fetchData, fetchHistorical } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import { calculations, DecoratedHealthResult } from './biz/logic'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const datesOfInterest = [
  { when: '2023-01-04', label: 'Jan 2023' },
  { when: '2023-02-01', label: 'Feb 2023' },
  { when: '2023-03-01', label: 'Mar 2023' },
]

interface HistoricalDate {
  when: string
  label: string
  result: DecoratedHealthResult
}

function App() {
  const { width, height } = useWindowSize()
  const [items, setItems] = React.useState<DecoratedHealthResult[]>([])
  const [historicalWeights, setHistoricalWeights] = React.useState<HistoricalDate[]>([])

  React.useEffect(() => {
    fetchData(setItems, '2023-03-01')

    datesOfInterest.forEach((d) => {
      fetchHistorical((result: any) => {
        setHistoricalWeights((c) => [{ ...d, result }, ...c])
      }, d.when)
    })
  }, [])

  const {
    startWeight,
    currentWeight,
    amountLost,
    amountLeftToLose,
    daysToRobRoyWay,
    weeksToRobRoyWay,
    fatLossProgress,
    periodProgress,
    desiredWeight,
  } = calculations(items)

  const zippedItems = items.map((e: any, i: number) => {
    return [e, items.slice(i + 1)]
  })

  let celebration = false
  if (items.length > 0) {
    const { isDropInFat, isDropInWeight } = judgeDay(zippedItems[0][0], zippedItems[0][1])
    celebration = isDropInFat || isDropInWeight
  }

  return (
    <main>
      {celebration && <Confetti width={width} height={height} opacity={0.5} />}
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className="progress-bar-fill "
            style={{
              width: `${fatLossProgress > 100 ? 100 : fatLossProgress}%`,
            }}
          ></span>
          <span className="tooltiptext">{fatLossProgress}% fat lost</span>
        </div>
      </div>
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span className="progress-bar-fill-days" style={{ width: `${periodProgress > 100 ? 100 : periodProgress}%` }}></span>
          <span className="tooltiptext">{periodProgress}% into time period</span>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <h3>
            {startWeight}kg | <span className="green">{amountLost}kg</span> | <span className={`fat`}>{currentWeight}kg</span> |{' '}
            <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
            kg
          </h3>
          <p className="target-date">
            <em>
              {weeksToRobRoyWay} weeks and {daysToRobRoyWay} days remaining to Morocco Trek
            </em>
          </p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>
                  Weight
                  <br />
                  (Fat + Lean)
                </th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {zippedItems.map((result: any) => (
                <Row result={result[0]} previous={result[1]} key={result[0].date} />
              ))}
            </tbody>
          </table>
        </>
      )}

      <table>
        <thead>
          <tr className="past">
            <th>When</th>
            <th>Event</th>
            <th>Weight</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody className="past">
          {historicalWeights
            .sort((h1, h2) => (h1.when > h2.when ? -1 : 1))
            .map((doi) => (
              <tr key={doi.label}>
                <td>{doi.label}</td>
                <td>-</td>
                <td>{doi.result.total}kg</td>
                <td>{doi.result.fat}kg</td>
              </tr>
            ))}
          <tr>
            <td>Jul 2022</td>
            <td>Iceland</td>
            <td>96kg</td>
            <td>34kg</td>
          </tr>
          <tr>
            <td>Apr 2022</td>
            <td>RRW</td>
            <td>89kg</td>
            <td>27kg</td>
          </tr>
          <tr>
            <td>May 2021</td>
            <td>WHW</td>
            <td>85kg</td>
            <td>21kg</td>
          </tr>
          <tr>
            <td>Sep 2020</td>
            <td>Ben More</td>
            <td>80kg</td>
            <td>19kg</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}

const Row = ({ result, previous }: { result: DecoratedHealthResult; previous: [DecoratedHealthResult] }) => {
  const { isDropInFat, isDropInWeight } = judgeDay(result, previous)

  return (
    <>
      <tr>
        <td>
          {days[new Date(result.date).getDay()]}
          <br />
          {result.date}
        </td>
        <td>
          <span className={result.weightColor}>{result.totalWeight}</span>
          <br />
          <span className={`fat ${result.fatColor}`}>{result.fat}</span> + <span>{result.lean}</span>
        </td>
        <td>{result.ate}</td>
      </tr>
      {(isDropInWeight || isDropInFat) && (
        <tr>
          <td colSpan={3}>
            {isDropInWeight && <img src="/images/tada1.png" height="100px" alt="" />}
            {isDropInFat && <img src="/images/tada2.webp" height="100px" alt="" />}

            <br />

            {isDropInWeight && isDropInFat && <strong> Weight &amp; Fat drop </strong>}
            {isDropInWeight && !isDropInFat && <strong>Weight drop</strong>}
            {isDropInFat && !isDropInWeight && <strong>Fat drop</strong>}
          </td>
        </tr>
      )}
    </>
  )
}

const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  React.useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])
  const resizeHandler = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }
  return windowSize
}

export default App
