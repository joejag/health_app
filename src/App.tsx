import React from "react"
import { BARS } from "./bars"
import "./App.css"

// Images: https://www.google.com/search?q=tesco
// List: http://www.chocolatereview.co.uk/choctalk/index.php?topic=2942.0

interface BarSearchResult {
  year: number
  bars: string[]
  exact: boolean
}

const toSnakeCase = (string: string) => {
  return string
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_")
}

const THIS_YEAR = new Date().getUTCFullYear()
const YEARS = Array(THIS_YEAR - (THIS_YEAR - (new Date().getUTCFullYear() - 1899)))
  .fill("")
  .map((v, idx) => THIS_YEAR - idx)

function App() {
  const [year, setYear] = React.useState<number | null>(null)

  const showChoc = (year: string) => {
    setYear(+year)
  }

  const findChoc = (year: number): BarSearchResult => {
    if (year in BARS) {
      return { year, bars: BARS[year], exact: true }
    }

    // search for years either side of the birth year
    let previousYear = year - 1
    let nextYear = year + 1
    while (!(previousYear in BARS) && !(nextYear in BARS)) {
      previousYear = previousYear - 1
      nextYear = nextYear + 1
    }
    let availableYear = previousYear in BARS ? previousYear : nextYear
    return { year: availableYear, bars: BARS[availableYear], exact: false }
  }

  if (year === null) {
    return (
      <div id="search-screen">
        <h1>What is your birth year chocolate?</h1>

        <div id="search">
          <label htmlFor="year">Year: </label>
          <select id="year" onChange={(e) => showChoc(e.target.value)}>
            {YEARS.map((year) => (
              <option key={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  const searchResults = findChoc(year)

  const everything: number[] = Object.keys(BARS)
    .map((s) => +s)
    .reverse()

  return (
    <main>
      {searchResults.exact && <h1>{`In ${year} these chocolate bars were launched`}</h1>}
      {!searchResults.exact && (
        <h1>{`Close to that year, in ${searchResults.year} these chocolate bars were launched`}</h1>
      )}

      <div id="results">
        {searchResults.bars.map((bar) => (
          <div className="result" key={bar}>
            <img src={`bars/${toSnakeCase(bar)}.jpeg`} alt={bar} />
            <span>{bar}</span>
          </div>
        ))}
      </div>

      <h2>The great chocolate bar timeline</h2>

      <div className="timeline">
        {everything.map((year, index) => (
          <div key={year} className={`container ${index % 2 === 0 ? "left" : "right"}`}>
            <div className="content">
              <h3>{year}</h3>
              <div>
                {BARS[year].map((bar) => (
                  <span key={bar}>
                    <img src={`bars/${toSnakeCase(bar)}.jpeg`} alt={bar} />
                    <p>{bar}</p>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="feedback">
        <p>Method: UK release dates, must have a Wikipedia page to qualify.</p>
        <p>
          Something wrong or missing? Send me an email to joe@joejag.com, or tell me on{" "}
          <a href="https://twitter.com/joe_jag">Twitter</a>
        </p>
      </div>
    </main>
  )
}

export default App
