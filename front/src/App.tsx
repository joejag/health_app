import './App.css'

import React from 'react'
import Confetti from 'react-confetti'
import { SpinnerRoundOutlined } from 'spinners-react'

import { tenMonths } from './biz/dateRange'
import { Estimate, estimate } from './biz/estimate'
import { fetchData, fetchHistorical } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import {
    baseMetabolicRate, calculateProgress, DecoratedHealthResult, nextBigEventDates
} from './biz/logic'
import { useWindowSize } from './components/useWindowSize'

const TODAY = new Date()

export interface HistoricalDate {
  when: string
  label: string
  result: DecoratedHealthResult
}

interface State {
  bmr: number
  celebrate: boolean
  futureEstimates: Estimate[]
  zippedHealthResults: [DecoratedHealthResult, DecoratedHealthResult[]][]
}

const DEFAULT_STATE: State = {
  bmr: 2000,
  celebrate: false,
  futureEstimates: [],
  zippedHealthResults: [],
}

function App() {
  const { width, height } = useWindowSize()
  const [healthResults, setHealthResults] = React.useState<DecoratedHealthResult[]>([])
  const [state, setState] = React.useState(DEFAULT_STATE)

  React.useEffect(() => {
    const firstDayOfTheMonth = `${TODAY.getFullYear()}-${(TODAY.getMonth() + 1).toString().padStart(2, '0')}-01`
    fetchData((results: DecoratedHealthResult[]) => {
      const zippedHealthResults: [DecoratedHealthResult, DecoratedHealthResult[]][] = results.map((h: DecoratedHealthResult, i: number) => {
        return [h, results.slice(i + 1)]
      })
      const { celebrate } = judgeDay(zippedHealthResults[0][0], zippedHealthResults[0][1])

      setState({
        bmr: baseMetabolicRate(results[results.length - 1].totalWeight),
        celebrate,
        futureEstimates: estimate(results[results.length - 1]),
        zippedHealthResults,
      })

      setHealthResults(results)
    }, firstDayOfTheMonth)
  }, [])

  const { bmr, celebrate, futureEstimates, zippedHealthResults } = state

  return (
    <main>
      {celebrate && <Confetti width={width} height={height} opacity={0.5} />}

      {healthResults.length > 0 && (
        <>
          <ProgressSummary healthResults={healthResults} />
          <NextBigEvent />
          <CurrentMonth zippedHealthResults={zippedHealthResults} bmr={bmr} />
          <Historical />
          <Estimates futureEstimates={futureEstimates} />
        </>
      )}
      {healthResults.length === 0 && (
        <div
          style={{
            width,
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpinnerRoundOutlined />
        </div>
      )}

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
            className={amountLost < 0 ? 'progress-bar-fill-loss' : 'progress-bar-fill-gain'}
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
  const weekText = weeksToNextBigEvent > 1 ? `${weeksToNextBigEvent} weeks` : '1 week'
  const dayText = daysToNextBigEvent > 1 ? `${daysToNextBigEvent} days` : '1 day'

  return (
    <>
      <p className="target-date">
        <em>
          {weeksToNextBigEvent > 0 && <>{weekText}</>}
          {weeksToNextBigEvent > 0 && daysToNextBigEvent > 0 && <> and </>}
          {daysToNextBigEvent > 0 && <>{dayText}</>} until {nextBigEvent}
        </em>
      </p>
    </>
  )
}

const CurrentMonth = ({
  zippedHealthResults,
  bmr,
}: {
  zippedHealthResults: [DecoratedHealthResult, DecoratedHealthResult[]][]
  bmr: number
}) => {
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
            <th>
              Calories
              <br />
              (Exercise - Ate)
            </th>
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

const DayReport = ({ result, previous, bmr }: { result: DecoratedHealthResult; previous: DecoratedHealthResult[]; bmr: number }) => {
  const { celebrate, isDropInFat, isDropInWeight } = judgeDay(result, previous)
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
          <span className={result.exercise > result.ate ? 'green' : 'red'}>{result.diff}</span>
          <br />
          {result.exercise} - {result.ate}
        </td>
      </tr>

      {celebrate && (
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
  const [historicalWeights, setHistoricalWeights] = React.useState<any[]>([])

  React.useEffect(() => {
    const datesOfInterest = tenMonths(-1).filter((doi) => new Date(doi.when) < new Date())
    const dates = datesOfInterest.map((d: any) => d.when)
    fetchHistorical(setHistoricalWeights, dates)
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
          <tr>
            <td>Sep 2020</td>
            <td>Ben More</td>
            <td>80kg</td>
            <td>19kg</td>
          </tr>
          <tr>
            <td>May 2021</td>
            <td>WHW</td>
            <td>85kg</td>
            <td>21kg</td>
          </tr>
          <tr>
            <td>Apr 2022</td>
            <td>RRW</td>
            <td>89kg</td>
            <td>27kg</td>
          </tr>
          <tr>
            <td>Jul 2022</td>
            <td>Iceland</td>
            <td>96kg</td>
            <td>34kg</td>
          </tr>

          {historicalWeights.map((day) => (
            <tr key={day.date}>
              <td>{new Date(day.date).toLocaleString('default', { month: 'short', year: 'numeric' })}</td>
              <td>-</td>
              <td>{day.total}kg</td>
              <td>{day.fat}kg</td>
            </tr>
          ))}
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

export default App
