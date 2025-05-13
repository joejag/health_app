export const MonthSwitcher = ({ onChange, firstDayOfTheMonth }: { onChange: Function; firstDayOfTheMonth: Date }) => {
  const previousMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1).toLocaleString('default', {
    month: 'short',
  })
  const nextMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1).toLocaleString('default', {
    month: 'short',
  })

  const goBackAMonth = () => {
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
  }

  const goForwardAMonth = () => {
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1))
  }

  const currentMonth = firstDayOfTheMonth.toLocaleString('default', { month: 'long' })

  return (
    <div className="navigation-buttons">
      <button className="nav-button prev" onClick={goBackAMonth}>
        {previousMonth}
      </button>
      <strong>{currentMonth}</strong>
      {(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1) < new Date() && (
        <button className="nav-button next" onClick={goForwardAMonth}>
          {nextMonth}
        </button>
      )) || <span style={{ minWidth: '71px' }}>&nbsp;</span>}
    </div>
  )
}
