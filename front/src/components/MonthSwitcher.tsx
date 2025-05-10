import React from 'react'

export const MonthSwitcher = ({ onChange }: { onChange: Function }) => {
  const [firstDayOfTheMonth, setFirstDayOfTheMonth] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  const previousMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1).toLocaleString('default', {
    month: 'long',
  })
  const nextMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1).toLocaleString('default', {
    month: 'long',
  })

  const goBackAMonth = () => {
    setFirstDayOfTheMonth(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
  }

  const goForwardAMonth = () => {
    setFirstDayOfTheMonth(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1))
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1))
  }

  return (
    <div className="navigation-buttons">
      <button className="nav-button prev" onClick={goBackAMonth}>
        {previousMonth}
      </button>
      {new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1) < new Date() && (
        <button className="nav-button next" onClick={goForwardAMonth}>
          {nextMonth}
        </button>
      )}
    </div>
  )
}
