import React from 'react'

import { daysThisMonth, formatDateToYYYYMMDD } from '../biz/dateRange'
import { DecoratedHealthResult } from '../biz/logic'

export const Blocks = ({ healthResults, bmr }: { healthResults: DecoratedHealthResult[]; bmr: number }) => {
  type MyDictionary = Record<string, DecoratedHealthResult>

  const knownDates: MyDictionary = {}
  healthResults.forEach((hr) => {
    knownDates[hr.date] = hr
  })
  const days = daysThisMonth().map((d) => formatDateToYYYYMMDD(d))

  return (
    <div style={{ display: 'flex' }}>
      {days.map((day: string) => (
        <React.Fragment key={day}>
          {knownDates[day] !== undefined && <Block bmr={bmr} result={knownDates[day]} />}
          {knownDates[day] === undefined && <EmptyBlock />}
        </React.Fragment>
      ))}
    </div>
  )
}

const Block = ({ result, bmr }: { result: DecoratedHealthResult; bmr: number }) => {
  const ateColor = bmr > result.ate ? '#009879' : '#c93402'
  const exerciseColor = result.exercise > 1000 ? '#009879' : '#c93402'
  return (
    <div className="vertical-container">
      <span className="block" style={{ backgroundColor: ateColor }}>
        &nbsp;
      </span>
      <span className="block" style={{ backgroundColor: exerciseColor }}>
        &nbsp;
      </span>
    </div>
  )
}

const EmptyBlock = () => {
  return (
    <div className="vertical-container">
      <span className="block" style={{ backgroundColor: 'grey' }}>
        &nbsp;
      </span>
      <span className="block" style={{ backgroundColor: 'grey' }}>
        &nbsp;
      </span>
    </div>
  )
}
