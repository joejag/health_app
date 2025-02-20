import React from 'react'

import { daysThisMonth, formatDateToYYYYMMDD } from '../biz/dateRange'
import { DecoratedHealthResult } from '../biz/logic'

const DAY_NAMES: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export const Blocks = ({
  healthResults,
  bmr,
  firstDayOfTheMonth,
}: {
  healthResults: DecoratedHealthResult[]
  bmr: number
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
          {knownDates[day] !== undefined && <Block bmr={bmr} result={knownDates[day]} date={date} />}
          {knownDates[day] === undefined && <EmptyBlock date={date} />}
        </React.Fragment>
      ))}
    </div>
  )
}

const Block = ({ result, bmr, date }: { result: DecoratedHealthResult; bmr: number; date: Date }) => {
  // const ateColor = bmr + 500 > result.ate ? '#009879' : '#c93402'
  const exerciseColor = result.steps > 10000 ? '#009879' : '#c93402'
  return (
    <div className="vertical-container">
      {/* <span className="block" style={{ backgroundColor: ateColor }}>
        &nbsp;
      </span> */}
      <span className="block" style={{ backgroundColor: exerciseColor }}>
        &nbsp;
      </span>
      <span>{DAY_NAMES[date.getDay()]}</span>
    </div>
  )
}

const EmptyBlock = ({ date }: { date: Date }) => {
  return (
    <div className="vertical-container">
      {/* <span className="block" style={{ backgroundColor: 'grey' }}>
        &nbsp;
      </span> */}
      <span className="block" style={{ backgroundColor: 'grey' }}>
        &nbsp;
      </span>
      <span>{DAY_NAMES[date.getDay()]}</span>
    </div>
  )
}
