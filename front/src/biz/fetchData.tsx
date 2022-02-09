import { decorate } from './logic'
import { RESULT } from './fake'

const WEIGHT_LAMBA_URL =
  'https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/weight'

export const fetchData = (setItems: any) => {
  // Fake version for testing
  // setTimeout(() => {
  //   setItems(decorate(RESULT).reverse())
  // }, 1000)

  fetch(WEIGHT_LAMBA_URL)
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
