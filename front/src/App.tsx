import React from 'react'
import './App.css'

interface HealthResult {
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
  leanColor: string
  fatColor: string
  diffColor: string
}

const decorate = (input: HealthResult[]): DecoratedHealthResult[] => {
  const result: DecoratedHealthResult[] = []
  for (let i = 0; i < input.length; i++) {
    const day = input[i]

    let weightColor = 'yellow'
    let leanColor = 'yellow'
    let fatColor = 'yellow'
    const diffColor = day.diff > 0 ? 'red' : 'green'

    if (i !== 0) {
      const previous = input[i - 1]
      weightColor = day.totalWeight > previous.totalWeight ? 'red' : 'green'
      if (day.totalWeight > previous.totalWeight && day.fat <= previous.fat) {
        weightColor = 'yellow'
      }
      leanColor = day.lean < previous.lean ? 'red' : 'green'
      fatColor = day.fat > previous.fat ? 'red' : 'green'
    }

    result.push({
      weightColor,
      leanColor,
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
      'https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/hello'
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
    items.length > 0 ? Math.round((items[0].fat - 19) * 100) / 100 : 0

  const dGone = Math.ceil(
    (new Date().getTime() - new Date('01/03/2022').getTime()) /
      (1000 * 3600 * 24)
  )
  const dRemain = Math.ceil(
    (new Date('04/26/2022').getTime() - new Date().getTime()) /
      (1000 * 3600 * 24)
  )

  return (
    <main>
      {items.length > 0 && (
        <h3>
          Current: {items[0].fat}kg from {items[items.length - 1].fat}kg (
          <span className="green">{differenceLost}kg</span>
          )
          <br />
          Target: 19kg (<span className="red">{differenceToGo}kg</span>)
          <br />
          Days gone: {dGone}, remaining: {dRemain}
        </h3>
      )}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Lean</th>
            <th>Fat</th>
            <th>Exercise</th>
            <th>Ate</th>
            <th>Diff</th>
          </tr>
        </thead>
        <tbody>
          {items.map((result: DecoratedHealthResult) => (
            <tr key={result.date}>
              <td>{result.date}</td>
              <td className={result.weightColor}>{result.totalWeight}</td>
              <td className={result.leanColor}>{result.lean}</td>
              <td className={result.fatColor}>{result.fat}</td>
              <td>{result.exercise}</td>
              <td>{result.ate}</td>
              <td className={result.diffColor}>{result.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Ben More: 19kg
        <br />
        West Highland Way: 21kg
        <br />
        Ben An: 24kg
        <br />
        South Glen Sheil Ridge: 27kg
      </p>
    </main>
  )
}

export default App

export const RESULT = [
  {
    ate: '1371',
    date: '2022-01-03',
    diff: -383,
    exercise: '1754',
    fat: 37.5,
    lean: 58.1,
    totalWeight: 95.6,
  },
  {
    ate: '1365',
    date: '2022-01-04',
    diff: -1395,
    exercise: '2760',
    fat: 37.1,
    lean: 58.7,
    totalWeight: 95.8,
  },
  {
    ate: '1427',
    date: '2022-01-05',
    diff: -912,
    exercise: '2339',
    fat: 36.3,
    lean: 59.6,
    totalWeight: 95.9,
  },
  {
    ate: '1655',
    date: '2022-01-06',
    diff: -451,
    exercise: '2106',
    fat: 35.8,
    lean: 59.7,
    totalWeight: 95.6,
  },
  {
    ate: '1692',
    date: '2022-01-07',
    diff: +343,
    exercise: '1349',
    fat: 35.3,
    lean: 60.5,
    totalWeight: 95.8,
  },
  {
    ate: '1519',
    date: '2022-01-08',
    diff: -444,
    exercise: '1963',
    fat: 35.0,
    lean: 60.6,
    totalWeight: 95.6,
  },
  {
    ate: '1890',
    date: '2022-01-09',
    diff: -2538,
    exercise: '4428',
    fat: 34.5,
    lean: 60.4,
    totalWeight: 95.0,
  },
  {
    ate: '1610',
    date: '2022-01-10',
    diff: -529,
    exercise: '2139',
    fat: 34.2,
    lean: 60.5,
    totalWeight: 94.8,
  },
  {
    ate: '1739',
    date: '2022-01-11',
    diff: -188,
    exercise: '1927',
    fat: 34.1,
    lean: 60.6,
    totalWeight: 94.7,
  },
  {
    ate: '1739',
    date: '2022-01-12',
    diff: -188,
    exercise: '1927',
    fat: 34.2,
    lean: 60.8,
    totalWeight: 94.8,
  },
] as HealthResult[]
