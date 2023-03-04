import './App.css'

import React from 'react'
import Confetti from 'react-confetti'

import { Estimate, estimate } from './biz/estimate'
import { fetchData, fetchHistorical } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import {
    baseMetabolicRate, calculateProgress, DecoratedHealthResult, nextBigEventDates
} from './biz/logic'
import { useWindowSize } from './components/useWindowSize'

const TODAY = new Date()

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
  const [healthResults, setHealthResults] = React.useState<DecoratedHealthResult[]>([])

  const zippedHealthResults = healthResults.map((e: any, i: number) => {
    return [e, healthResults.slice(i + 1)]
  })

  let celebration = false
  let bmr = 2000
  let futureEstimates: Estimate[] = []
  if (healthResults.length > 0) {
    const { isDropInFat, isDropInWeight } = judgeDay(zippedHealthResults[0][0], zippedHealthResults[0][1])
    celebration = isDropInFat || isDropInWeight

    bmr = baseMetabolicRate(healthResults[healthResults.length - 1].totalWeight)
    futureEstimates = estimate(healthResults[healthResults.length - 1])
  }

  React.useEffect(() => {
    const firstDayOfTheMonth = `${TODAY.getFullYear()}-${(TODAY.getMonth() + 1).toString().padStart(2, '0')}-01`
    fetchData(setHealthResults, firstDayOfTheMonth)
  }, [])

  return (
    <main>
      {celebration && <Confetti width={width} height={height} opacity={0.5} />}

      {healthResults.length > 0 && (
        <>
          <ProgressSummary healthResults={healthResults} />
          <NextBigEvent />
          <CurrentMonth zippedHealthResults={zippedHealthResults} bmr={bmr} />
        </>
      )}

      <Historical />
      <Estimates futureEstimates={futureEstimates} />
      <div style={{ marginTop: '3em' }}>&nbsp;</div>
    </main>
  )
}

const ProgressSummary = ({ healthResults }: { healthResults: DecoratedHealthResult[] }) => {
  const { startWeight, currentWeight, amountLost, amountLeftToLose, fatLossProgress, periodProgress, desiredWeight } =
    calculateProgress(healthResults)

  return (
    <>
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className="progress-bar-fill"
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

      <h3 className="justify" style={{ marginTop: '0.2em' }}>
        {startWeight}kg | <span className="green">{amountLost}kg</span> | <span className={`fat`}>{currentWeight}kg</span> |{' '}
        <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
        kg
      </h3>
    </>
  )
}

const NextBigEvent = () => {
  const { daysToNextBigEvent, weeksToNextBigEvent, nextBigEvent } = nextBigEventDates()

  return (
    <>
      <p className="target-date">
        <em>
          {weeksToNextBigEvent > 0 && <>{weeksToNextBigEvent} weeks</>}
          {weeksToNextBigEvent > 0 && daysToNextBigEvent > 0 && <> and </>}
          {daysToNextBigEvent > 0 && <>{daysToNextBigEvent} days</>} until {nextBigEvent}
        </em>
      </p>
    </>
  )
}

const CurrentMonth = ({ zippedHealthResults, bmr }: { zippedHealthResults: any[][]; bmr: number }) => {
  const currentMonth = TODAY.toLocaleString('default', { month: 'long' })

  return (
    <>
      <h2>
        {currentMonth} - BMR {bmr}
      </h2>

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
          {zippedHealthResults.map((result) => (
            <DayReport result={result[0]} previous={result[1]} key={result[0].date} bmr={bmr} />
          ))}
        </tbody>
      </table>
    </>
  )
}

const DayReport = ({ result, previous, bmr }: { result: DecoratedHealthResult; previous: [DecoratedHealthResult]; bmr: number }) => {
  const { isDropInFat, isDropInWeight } = judgeDay(result, previous)
  const dayOfTheWeek = new Date(result.date).toLocaleString('default', { weekday: 'short' })

  return (
    <>
      <tr>
        <td>
          {dayOfTheWeek}
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

const Historical = () => {
  const [historicalWeights, setHistoricalWeights] = React.useState<HistoricalDate[]>([])
  const historical = historicalWeights.sort((h1, h2) => (h1.when > h2.when ? -1 : 1))

  React.useEffect(() => {
    setHistoricalWeights([])
    datesOfInterest.forEach((d) => {
      fetchHistorical((result: any) => {
        setHistoricalWeights((c) => [{ ...d, result }, ...c])
      }, d.when)
    })
  }, [])

  return (
    <>
      <h2>Historical</h2>
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
          {historical.map((day) => (
            <tr key={day.when}>
              <td>{day.label}</td>
              <td>-</td>
              <td>{day.result.total}kg</td>
              <td>{day.result.fat}kg</td>
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
    </>
  )
}

const Estimates = ({ futureEstimates }: { futureEstimates: Estimate[] }) => {
  return (
    <>
      <h2>Estimate to 20kg fat</h2>
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
    </>
  )
}

export default App
