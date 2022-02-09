import React from 'react'
import './App.css'
import { fetchData } from './biz/fetchData'
import { calculations, DecoratedHealthResult } from './biz/logic'

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
    fatLossProgress,
    periodProgress,
    desiredWeight,
  } = calculations(items)

  return (
    <main>
      {items.length > 0 && (
        <>
          <h3>
            {startWeight}kg | <span className="green">{amountLost}kg</span> |{' '}
            <span className={`fat`}>{currentWeight}kg</span> |{' '}
            <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
            kg
          </h3>
          <p>
            <em>{daysToRobRoyWay} days remaining to 19kg goal</em>
          </p>
        </>
      )}

      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className="progress-bar-fill "
            style={{ width: `${fatLossProgress}%` }}
          ></span>
          <span className="tooltiptext">{fatLossProgress}% fat lost</span>
        </div>
      </div>
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className="progress-bar-fill-days"
            style={{ width: `${periodProgress}%` }}
          ></span>
          <span className="tooltiptext">
            {periodProgress}% into time period
          </span>
        </div>
      </div>

      {items.length > 0 && (
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
            {items.map((result: DecoratedHealthResult) => (
              <tr key={result.date}>
                <td>{result.date}</td>
                <td>
                  <span className={result.weightColor}>
                    {result.totalWeight}
                  </span>
                  <br />
                  <span className={`fat ${result.fatColor}`}>
                    {result.fat}
                  </span>{' '}
                  + <span>{result.lean}</span>
                </td>
                <td>
                  <span className={result.diffColor}>{result.diff}</span>
                  <br />
                  {result.exercise} - {result.ate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        Ben More: 19kg
        <br />
        West Highland Way / Beinn Eighe: 21kg
        <br />
        Ben An: 24kg
        <br />
        South Glen Sheil Ridge / Ben Lui: 27kg
      </p>
    </main>
  )
}

export default App
