import { calculateProgress, DecoratedHealthResult } from '../biz/logic'

export const ProgressSummary = ({ healthResults }: { healthResults: DecoratedHealthResult[] }) => {
  const { startWeight, currentWeight, amountLost, amountLeftToLose, fatLossProgress, periodProgress, desiredWeight } =
    calculateProgress(healthResults)

  return (
    <>
      <div className="progress-container tooltip">
        <div className="progress-bar">
          <span
            className={amountLost < 0 ? 'progress-bar-fill-loss' : 'progress-bar-fill-gain'}
            style={{
              width: `${fatLossProgress > 100 ? 100 : fatLossProgress}%`,
            }}
          ></span>
          <span className="tooltiptext">{fatLossProgress}% fat lost</span>
        </div>
      </div>

      <h3 className="justify" style={{ marginTop: '0.2em' }}>
        {startWeight}kg | <span className="green">{amountLost}kg</span> | <span className={`fat`}>{currentWeight}kg</span> |{' '}
        <span className="red">{amountLeftToLose}kg</span> | {desiredWeight}
        kg
      </h3>
    </>
  )
}
