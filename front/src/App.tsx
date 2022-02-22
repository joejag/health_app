import React from 'react'
import './App.css'
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
              19kg goal
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
              {items.map((result: DecoratedHealthResult) => (
                <tr key={result.date}>
                  <td>
                    {result.date} - {days[new Date(result.date).getDay()]}
                  </td>
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
        </>
      )}

      <p>
        19kg: Ben More
        <br />
        21kg: West Highland Way / Beinn Eighe
        <br />
        24kg: Ben An
        <br />
        27kg: South Glen Sheil Ridge / Ben Lui
      </p>
    </main>
  )
}

export default App
