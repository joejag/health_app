import { nextBigEventDates } from '../biz/logic'

export const NextBigEvent = () => {
  const { daysToNextBigEvent, weeksToNextBigEvent, nextBigEvent } = nextBigEventDates()
  const weekText = weeksToNextBigEvent > 1 ? `${weeksToNextBigEvent} weeks` : '1 week'
  const dayText = daysToNextBigEvent > 1 ? `${daysToNextBigEvent} days` : '1 day'

  return (
    <>
      <p className="target-date">
        ⏳
        <em>
          {weeksToNextBigEvent > 0 && <>{weekText}</>}
          {weeksToNextBigEvent > 0 && daysToNextBigEvent > 0 && <> and </>}
          {daysToNextBigEvent > 0 && <>{dayText}</>} until {nextBigEvent}
        </em>
        &nbsp;&nbsp;📅
      </p>
    </>
  )
}
