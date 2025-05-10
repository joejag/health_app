import React from 'react'

import { daysThisMonth, formatDateToYYYYMMDD } from '../biz/dateRange'
import { DecoratedHealthResult } from '../biz/logic'

const DAY_NAMES: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const StepsReport = ({
  healthResults,
  firstDayOfTheMonth,
}: {
  healthResults: DecoratedHealthResult[]
  firstDayOfTheMonth: Date
}) => {
  type MyDictionary = Record<string, DecoratedHealthResult>

  const knownDates: MyDictionary = {}
  healthResults.forEach((hr) => {
    knownDates[hr.date] = hr
  })
  const days = daysThisMonth(firstDayOfTheMonth).map((d) => {
    return { date: d, day: formatDateToYYYYMMDD(d) }
  })

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

const Block = ({ result, date }: { result: DecoratedHealthResult; date: Date }) => {
  const exerciseColor = result.steps > 10000 ? '#009879' : '#c93402'

  return (
    <div className="vertical-container">
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
