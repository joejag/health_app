import React from 'react'
import { SpinnerRoundOutlined } from 'spinners-react'

import { daysThisMonth, formatDateToYYYYMMDD } from '../biz/dateRange'
import { StepResult } from '../biz/fetchData'
import { useMonthlyStepData } from '../hooks/useMonthlyStepData'

const DAY_NAMES: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type MyDictionary = Record<string, StepResult>

export const StepsReport = ({ firstDayOfTheMonth }: { firstDayOfTheMonth: Date }) => {
  const [knownDates, setKnownDates] = React.useState<MyDictionary>({})
  const { data, isLoading } = useMonthlyStepData(firstDayOfTheMonth)

  React.useEffect(() => {
    if (data && data.length > 0) {
      const knownDates: MyDictionary = {}
      data.forEach((hr) => {
        knownDates[hr.date] = hr
      })
      setKnownDates(knownDates)
    }
  }, [data])

  const days = daysThisMonth(firstDayOfTheMonth).map((d) => {
    return { date: d, day: formatDateToYYYYMMDD(d) }
  })

  if (isLoading) {
    return (
      <div style={{ display: 'flex' }}>
        {days.map(({ date, day }) => (
          <div className="block" key={day}>
            <SpinnerRoundOutlined />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      {days.map(({ date, day }) => (
        <React.Fragment key={day}>
          {knownDates[day] !== undefined && <Block result={knownDates[day]} date={date} />}
          {knownDates[day] === undefined && <EmptyBlock date={date} />}
        </React.Fragment>
      ))}
    </div>
  )
}

const Block = ({ result, date }: { result: StepResult; date: Date }) => {
  const exerciseColor = result.steps > 10000 ? '#009879' : '#c93402'
  const celebrate = result.steps > 20000
  const celebrateStyle = {
    borderTop: celebrate ? '3px solid gold' : '',
    borderBottom: celebrate ? '3px solid gold' : '',
  }

  return (
    <div className="vertical-container" style={celebrateStyle}>
      <span className="block" style={{ backgroundColor: exerciseColor, color: 'white', alignContent: 'center' }}>
        {Math.floor(Math.round(result.steps) / 1000)}
      </span>
      <span>{DAY_NAMES[date.getDay()]}</span>
    </div>
  )
}

const EmptyBlock = ({ date }: { date: Date }) => {
  return (
    <div className="vertical-container">
      <span className="block" style={{ backgroundColor: 'grey' }}>
        &nbsp;
      </span>
      <span>{DAY_NAMES[date.getDay()]}</span>
    </div>
  )
}
