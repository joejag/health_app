import './App.css'

import React from 'react'
import Confetti from 'react-confetti'

import { fetchData } from './biz/fetchData'
import { judgeDay } from './biz/judge'
import { calculations, DecoratedHealthResult } from './biz/logic'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function App() {
  const { width, height } = useWindowSize()
  const [items, setItems] = React.useState<DecoratedHealthResult[]>([])

  React.useEffect(() => {
    fetchData(setItems)
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
    const { isDropInFat, isDropInWeight } = judgeDay(
      zippedItems[0][0],
      zippedItems[0][1]
    )
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
          <span
            className="progress-bar-fill-days"
            style={{ width: `${periodProgress > 100 ? 100 : periodProgress}%` }}
          ></span>
          <span className="tooltiptext">
            {periodProgress}% into time period
          </span>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <h3>
            {startWeight}kg | <span className="green">{amountLost}kg</span> |{' '}
            <span className={`fat`}>{currentWeight}kg</span> |{' '}
            <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
            kg
          </h3>
          <p className="target-date">
            <em>
              {weeksToRobRoyWay} weeks and {daysToRobRoyWay} days remaining to
              Morocco Trek
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
                <Row
                  result={result[0]}
                  previous={result[1]}
                  key={result.date}
                />
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="previous-weights">
        19kg: Ben More (80kg)
        <br />
        21kg: West Highland Way (85kg)
        <br />
        27kg: Rob Roy Way (89kg)
        <br />
        34kg: Laugavegur (96kg)
      </div>
    </main>
  )
}

const Row = ({
  result,
  previous,
}: {
  result: DecoratedHealthResult
  previous: [DecoratedHealthResult]
}) => {
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
          <span className={`fat ${result.fatColor}`}>{result.fat}</span> +{' '}
          <span>{result.lean}</span>
        </td>
        <td>{result.ate}</td>
      </tr>
      {(isDropInWeight || isDropInFat) && (
        <tr>
          <td colSpan={3}>
            {isDropInWeight && <img src="/images/tada1.png" height="100px" />}
            {isDropInFat && <img src="/images/tada2.webp" height="100px" />}

            <br />

            {isDropInWeight && isDropInFat && (
              <strong> Weight &amp; Fat drop </strong>
            )}
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
