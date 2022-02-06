import React from 'react'
import './App.css'

export interface HealthResult {
  ate: string
  date: string
  diff: number
  exercise: string
  fat: number
  lean: number
  totalWeight: number
}

interface DecoratedHealthResult extends HealthResult {
  weightColor: string
  fatColor: string
  diffColor: string
}

const DESIRED_WEIGHT = 26.4

const decorate = (input: HealthResult[]): DecoratedHealthResult[] => {
  const result: DecoratedHealthResult[] = []
  for (let i = 0; i < input.length; i++) {
    const day = input[i]

    let weightColor = 'yellow'
    let fatColor = 'yellow'
    const diffColor = day.diff > 0 ? 'red' : 'green'

    if (i !== 0) {
      const previous = input[i - 1]
      weightColor = day.totalWeight > previous.totalWeight ? 'red' : 'green'
      if (day.totalWeight > previous.totalWeight && day.fat <= previous.fat) {
        weightColor = 'yellow'
      }
      fatColor = day.fat > previous.fat ? 'red' : 'green'
    }

    result.push({
      weightColor,
      fatColor,
      diffColor,
      ...day,
    })
  }

  return result
}

function App() {
  // const items: DecoratedHealthResult[] = decorate(RESULT).reverse()

  const [items, setItems] = React.useState<DecoratedHealthResult[]>([])
  React.useEffect(() => {
    fetch(
      'https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/weight'
    )
      .then((res) => res.json())
      .then(
        (result: any) => {
          setItems(decorate(result).reverse())
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])

  const differenceLost =
    items.length > 0
      ? Math.round((items[0].fat - items[items.length - 1].fat) * 100) / 100
      : 0

  const differenceToGo =
    items.length > 0
      ? Math.round((items[0].fat - DESIRED_WEIGHT) * 100) / 100
      : 0

  const dRemain = Math.ceil(
    (new Date('04/26/2022').getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  )

  const progress =
    items.length > 0
      ? Math.abs(
          differenceLost / (items[items.length - 1].fat - DESIRED_WEIGHT)
        ) * 100
      : 0

  return (
    <main>
      {items.length > 0 && (
        <>
          <h3>
            {items[items.length - 1].fat}kg |{' '}
            <span className="green">{differenceLost}kg</span> |{' '}
            <span className={`fat`}>{items[0].fat}kg</span> |{' '}
            <span className="red">{differenceToGo}kg</span> | {DESIRED_WEIGHT}
            kg
          </h3>
          <p>
            <em>{dRemain} days remaining to 19kg goal</em>
          </p>
          <div className="progress-container">
            <div className="progress-bar">
              <span
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></span>
            </div>
          </div>
        </>
      )}
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
                <span className={result.weightColor}>{result.totalWeight}</span>
                <br />
                <span className={`fat ${result.fatColor}`}>
                  {result.fat}
                </span> + <span>{result.lean}</span>
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
