import './App.css'

import React from 'react'

import { fetchData } from './biz/fetchData'
import { calculations, DecoratedHealthResult } from './biz/logic'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function App() {
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

  return (
    <main>
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
              21kg goal
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
                <th>
                  Calories
                  <br />
                  (Exercise - Ate)
                </th>
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
        19kg: Ben More
        <br />
        21kg: West Highland Way / Beinn Eighe
        <br />
        24kg: Ben An
        <br />
        27kg: South Glen Sheil Ridge / Ben Lui
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
  const bestWeight = Math.min(...previous.map((p) => p.totalWeight))
  const isDropInWeight =
    previous.length > 0 &&
    Math.floor(result.totalWeight) < Math.floor(bestWeight)

  const bestFat = Math.min(...previous.map((p) => p.fat))
  const isDropInFat =
    previous.length > 0 && Math.floor(result.fat) < Math.floor(bestFat)

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
        <td>
          <span className={result.diffColor}>{result.diff}</span>
          <br />
          {result.exercise} - {result.ate}
        </td>
      </tr>
      {isDropInWeight && (
        <tr>
          <td colSpan={3}>
            <img src="/images/tada1.png" height="100px" />
            <br />
            <strong>Lean drop</strong>
          </td>
        </tr>
      )}
      {isDropInFat && (
        <tr>
          <td colSpan={3}>
            <img src="/images/tada2.webp" height="100px" />
            <br />
            <strong>Fat drop</strong>
          </td>
        </tr>
      )}
    </>
  )
}

export default App
