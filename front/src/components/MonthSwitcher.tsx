export const MonthSwitcher = ({ onChange, firstDayOfTheMonth }: { onChange: Function; firstDayOfTheMonth: Date }) => {
  const previousMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1).toLocaleString('default', {
    month: 'long',
  })
  const nextMonth = new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1).toLocaleString('default', {
    month: 'long',
  })

  const goBackAMonth = () => {
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
  }

  const goForwardAMonth = () => {
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
