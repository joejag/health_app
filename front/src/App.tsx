import './App.css'

import React from 'react'
import Confetti from 'react-confetti'

import { Estimate, estimate } from './biz/estimate'
import { fetchData, fetchHistorical } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import { baseMetabolicRate, calculations, DecoratedHealthResult } from './biz/logic'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const datesOfInterest = [
  { when: '2023-01-01', label: 'Jan 2023' },
  { when: '2023-02-01', label: 'Feb 2023' },
  { when: '2023-03-01', label: 'Mar 2023' },
  { when: '2023-04-01', label: 'Apr 2023' },
  { when: '2023-05-01', label: 'May 2023' },
  { when: '2023-06-01', label: 'Jun 2023' },
  { when: '2023-07-01', label: 'Jul 2023' },
  { when: '2023-08-01', label: 'Aug 2023' },
  { when: '2023-09-01', label: 'Sep 2023' },
  { when: '2023-10-01', label: 'Oct 2023' },
  { when: '2023-11-01', label: 'Nov 2023' },
  { when: '2023-12-01', label: 'Dec 2023' },
].filter((doi) => new Date(doi.when) < new Date())

export interface HistoricalDate {
  when: string
  label: string
  result: DecoratedHealthResult
}

function App() {
  const { width, height } = useWindowSize()
  const [items, setItems] = React.useState<DecoratedHealthResult[]>([])
  const [historicalWeights, setHistoricalWeights] = React.useState<HistoricalDate[]>([])

  React.useEffect(() => {
    const today = new Date()
    const firstDay = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`
    fetchData(setItems, firstDay)

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
    daysToNextBigEvent,
    weeksToNextBigEvent,
    nextBigEvent,
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

  const historicalSorted = historicalWeights.sort((h1, h2) => (h1.when > h2.when ? -1 : 1))
  let futureEstimates: Estimate[] = []
  let bmr = 2000
  if (historicalSorted.length > 0) {
    futureEstimates = estimate(historicalSorted[0])
    bmr = baseMetabolicRate(historicalSorted[0].result.total)
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
          <h3 className="justify">
            {startWeight}kg | <span className="green">{amountLost}kg</span> | <span className={`fat`}>{currentWeight}kg</span> |{' '}
            <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
            kg
          </h3>
          <p className="target-date">
            <em>
              {weeksToNextBigEvent} weeks and {daysToNextBigEvent} days remaining to {nextBigEvent}
            </em>
          </p>

          <h3>This Month - BMR {bmr}</h3>

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
                <Row result={result[0]} previous={result[1]} key={result[0].date} bmr={bmr} />
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Estimate to 20kg fat</h3>

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
            <tr key={est.when}>
              <td>{est.label}</td>
              <td>{est.total}kg</td>
              <td>{est.fat}kg</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Historical</h3>

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
          {historicalSorted.map((doi) => (
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
      <div style={{ marginTop: '3em' }}>&nbsp;</div>
    </main>
  )
}

const Row = ({ result, previous, bmr }: { result: DecoratedHealthResult; previous: [DecoratedHealthResult]; bmr: number }) => {
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
        <td>
          <span className={result.ate < bmr ? 'green' : 'red'}>{result.ate}</span>
        </td>
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
