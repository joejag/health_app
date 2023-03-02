import { decorate } from './logic'

const PRODUCTION_URL = 'https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/weight'
const LOCAL_URL = 'http://localhost:8000'

export const fetchData = (setItems: any, when: string) => {
  let url = PRODUCTION_URL
  if (window.location.href.indexOf('localhost') > -1) {
    url = LOCAL_URL
  }
  url += '?from=' + when

  fetch(url)
    .then((res) => res.json())
    .then(
      (result: any) => {
        setItems(decorate(result).reverse())
      },
      (error) => {
        console.log(error)
      }
    )
}
