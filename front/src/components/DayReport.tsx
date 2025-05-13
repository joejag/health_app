import { judgeDay } from '../biz/judge'
import { DecoratedHealthResult } from '../biz/logic'

export const CurrentMonth = ({
  zippedHealthResults,
  bmr,
  dataDate,
}: {
  zippedHealthResults: [DecoratedHealthResult, DecoratedHealthResult[]][]
  bmr: number
  dataDate: Date
}) => {
  return (
    <>
      {zippedHealthResults.map((result) => (
        <DayReport result={result[0]} previous={result[1]} key={result[0].date} />
      ))}
    </>
  )
}

const DayReport = ({ result, previous }: { result: DecoratedHealthResult; previous: DecoratedHealthResult[] }) => {
  const { celebrate } = judgeDay(result, previous)
  const dayOfMonth = new Date(result.date).getDate()
  const weekdayShort = new Date(result.date).toLocaleString('default', { weekday: 'short' })

  const pillStyles = {
    container: (celebrate: boolean) => ({
      display: 'flex',
      border: `${celebrate ? '3px' : '1px'} solid ${celebrate ? 'gold' : 'black'}`,
      borderRadius: '999px',
      overflow: 'hidden',
      width: '100%',
      fontFamily: 'sans-serif',
      marginBottom: '0.5rem',
      height: '50px',
      animation: celebrate ? 'celebrateBorder 3 s ease-in-out forwards' : 'none',
    }),
    segment: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      minWidth: 0,
      overflow: 'hidden',
    },
    date: {
      backgroundColor: 'white',
      color: 'black',
      borderRight: '1px solid black',
      padding: '0 8px',
    },
    weight: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.25rem',
    },
    fat: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    lean: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'black',
      borderTop: '1px solid rgba(0,0,0,0.1)',
    },
  } as const

  return (
    <div style={pillStyles.container(celebrate)}>
      {/* Date */}
      <div style={{ ...pillStyles.segment, ...pillStyles.date }}>
        <div style={{ fontWeight: 'bold', lineHeight: '1.2' }}>{dayOfMonth}</div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{weekdayShort}</div>
      </div>

      {/* Weight */}
      <div
        style={{
          ...pillStyles.segment,
          ...pillStyles.weight,
          backgroundColor: result.weightColor,
        }}
      >
        {result.totalWeight}
      </div>

      {/* Stacked Fat + Lean (rightmost) */}
      <div style={{ ...pillStyles.segment, padding: 0 }}>
        <div
          style={{
            ...pillStyles.fat,
            backgroundColor: result.fatColor,
          }}
        >
          {result.fat}
        </div>
        <div style={pillStyles.lean}>{result.lean}</div>
      </div>
    </div>
  )
}
