import { decorate, DecoratedHealthResult } from './logic'

const PRODUCTION_URL = 'https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/weight'
const LOCAL_URL = 'http://localhost:8000'

export const fetchData = async (when: string): Promise<DecoratedHealthResult[]> => {
  let url = PRODUCTION_URL
  if (window.location.href.includes('localhost')) {
    url = LOCAL_URL
  }
  url += `?from_date=${when}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const result = await response.json()
  return decorate(result).reverse()
}

interface HistoricalData {
  date: string
  dateTime: string
  fat: number
  lean: number
  total: number
}

export const fetchHistorical = (when: string[]): Promise<HistoricalData[]> => {
  return new Promise((resolve, reject) => {
    let url = PRODUCTION_URL
    if (window.location.href.includes('localhost')) {
      url = LOCAL_URL
    }
    url += '?historical=' + when.join(',')

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(resolve)
      .catch(reject)
  })
}

export interface StepResult {
  date: string
  steps: number
}

export const fetchStepData = async (when: string): Promise<StepResult[]> => {
  let url = PRODUCTION_URL
  if (window.location.href.includes('localhost')) {
    url = LOCAL_URL
  }
  url += `?from_date=${when}&steps=only`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const result = await response.json()
  return decorate(result).reverse()
}
