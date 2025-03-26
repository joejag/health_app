import './App.css'

import React from 'react'
import Confetti from 'react-confetti'
import { SpinnerRoundOutlined } from 'spinners-react'

import { Estimate, estimate } from './biz/estimate'
import { fetchData } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import { baseMetabolicRate, DecoratedHealthResult } from './biz/logic'
import { Blocks } from './components/Blocks'
import { CurrentJourney } from './components/CurrentJourney'
import { Estimates } from './components/Estimates'
import { Historical } from './components/Historical'
import { NextBigEvent } from './components/NextBigEvent'
import { ProgressSummary } from './components/Progress'
import { useWindowSize } from './components/useWindowSize'

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
  const [firstDayOfTheMonth, setFirstDayOfTheMonth] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [loading, setLoading] = React.useState(true)

  const [healthResults, setHealthResults] = React.useState<DecoratedHealthResult[]>([])
  const [state, setState] = React.useState(DEFAULT_STATE)
  const { bmr, celebrate, futureEstimates, zippedHealthResults } = state

  React.useEffect(() => {
    const dataDate = `${firstDayOfTheMonth.getFullYear()}-${(firstDayOfTheMonth.getMonth() + 1).toString().padStart(2, '0')}-01`
    setLoading(true)
    fetchData((results: DecoratedHealthResult[]) => {
      setLoading(false)
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
    }, dataDate)
  }, [firstDayOfTheMonth])

  const goBackAMonth = () => {
    setFirstDayOfTheMonth(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
  }

  const goForwardAMonth = () => {
    setFirstDayOfTheMonth(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1))
  }

  return (
    <main>
      {celebrate && <Confetti width={width} height={height} opacity={0.5} numberOfPieces={1000} recycle={false} />}

      {!loading && healthResults.length > 0 && (
        <>
          <Blocks healthResults={healthResults} bmr={state.bmr} firstDayOfTheMonth={firstDayOfTheMonth} />
          <ProgressSummary healthResults={healthResults} firstDayOfTheMonth={firstDayOfTheMonth} />
          <div className="desktop-layout">
            <div>
              <div className="navigation-buttons">
                <button className="nav-button prev" onClick={goBackAMonth}>
                  Previous
                </button>
                <button className="nav-button next" onClick={goForwardAMonth}>
                  Next
                </button>
              </div>
              <CurrentMonth zippedHealthResults={zippedHealthResults} bmr={bmr} dataDate={firstDayOfTheMonth} />
            </div>
            <div>
              <NextBigEvent />
              <CurrentJourney />
              <Estimates futureEstimates={futureEstimates} />
              <Historical />
            </div>
          </div>
        </>
      )}
      {loading && (
        <div
          style={{
            width,
            height: window.innerHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SpinnerRoundOutlined />
        </div>
      )}

      <div style={{ marginTop: '1em' }}>&nbsp;</div>
    </main>
  )
}

const CurrentMonth = ({
  zippedHealthResults,
  bmr,
  dataDate,
}: {
  zippedHealthResults: [DecoratedHealthResult, DecoratedHealthResult[]][]
  bmr: number
  dataDate: Date
}) => {
  const currentMonth = dataDate.toLocaleString('default', { month: 'long' })

  return (
    <>
      <h2>
        {currentMonth} - BMR {bmr}
      </h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Fat + Lean</th>
          </tr>
        </thead>

        <tbody>
          {zippedHealthResults.map((result) => (
            <DayReport result={result[0]} previous={result[1]} key={result[0].date} />
          ))}
        </tbody>
      </table>
    </>
  )
}

const DayReport = ({ result, previous }: { result: DecoratedHealthResult; previous: DecoratedHealthResult[] }) => {
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
          <span className={`fat ${result.weightColor}`}>{result.totalWeight}</span>
        </td>
        <td>
          <span className={`fat ${result.fatColor}`}>{result.fat}</span> + <span>{result.lean}</span>
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

export default App
