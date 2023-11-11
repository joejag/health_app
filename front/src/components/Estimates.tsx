import { Estimate } from '../biz/estimate'

export const Estimates = ({ futureEstimates }: { futureEstimates: Estimate[] }) => {
  return (
    <>
      <h2>Estimate to 20kg fat</h2>
      <table>
        <thead>
          <tr className="estimate">
            <th>When</th>
            <th>Weight</th>
            <th>Fat</th>
          </tr>
        </thead>
        <tbody className="estimate">
          {futureEstimates.map((est) => (
            <tr key={est.label}>
              <td>{est.label}</td>
              <td>{est.total}kg</td>
              <td>{est.fat}kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
