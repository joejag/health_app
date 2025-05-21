import './App.css'

import React from 'react'
import Confetti from 'react-confetti'
import { SpinnerRoundOutlined } from 'spinners-react'

import { Estimate, estimate } from './biz/estimate'
import { judgeDay } from './biz/judge'
import { baseMetabolicRate, DecoratedHealthResult } from './biz/logic'
import { CurrentJourney } from './components/CurrentJourney'
import { CurrentMonth } from './components/DayReport'
import { Estimates } from './components/Estimates'
import { Historical } from './components/Historical'
import { MonthSwitcher } from './components/MonthSwitcher'
import { ProgressSummary } from './components/Progress'
import { StepsReport } from './components/StepsReport'
import { useWindowSize } from './components/useWindowSize'
import { useMonthlyData } from './hooks/useMonthlyData'

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
  const { data: results, isLoading } = useMonthlyData(firstDayOfTheMonth)

  const [healthResults, setHealthResults] = React.useState<DecoratedHealthResult[]>([])
  const [state, setState] = React.useState(DEFAULT_STATE)
  const { bmr, celebrate, futureEstimates, zippedHealthResults } = state

  React.useEffect(() => {
    if (results && results.length > 0) {
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
    }
  }, [results])

  return (
    <main>
      {isLoading && (
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

      {celebrate && <Confetti width={width} height={height} opacity={0.5} numberOfPieces={1000} recycle={false} />}

      {!isLoading && healthResults.length > 0 && (
        <>
          <StepsReport firstDayOfTheMonth={firstDayOfTheMonth} />

          <ProgressSummary healthResults={healthResults} firstDayOfTheMonth={firstDayOfTheMonth} />
          <div className="desktop-layout">
            <div style={{ minWidth: '250px' }}>
              <MonthSwitcher onChange={setFirstDayOfTheMonth} firstDayOfTheMonth={firstDayOfTheMonth} />
              <CurrentMonth zippedHealthResults={zippedHealthResults} bmr={bmr} dataDate={firstDayOfTheMonth} />
            </div>
            <div>
              <CurrentJourney />
              <Estimates futureEstimates={futureEstimates} />
              <Historical />
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: '1em' }}>&nbsp;</div>
    </main>
  )
}

export default App
