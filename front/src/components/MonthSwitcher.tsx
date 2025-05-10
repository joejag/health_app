import React from 'react'

export const MonthSwitcher = ({ onChange }: { onChange: Function }) => {
  const [firstDayOfTheMonth, setFirstDayOfTheMonth] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))

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
        {new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1).toLocaleString('default', {
          month: 'long',
        })}
      </button>
      {new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1) < new Date() && (
        <button className="nav-button next" onClick={goForwardAMonth}>
          {new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1).toLocaleString('default', {
            month: 'long',
          })}
        </button>
      )}
    </div>
  )
}
