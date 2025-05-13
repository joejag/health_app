export const MonthSwitcher = ({ onChange, firstDayOfTheMonth }: { onChange: Function; firstDayOfTheMonth: Date }) => {
  const goBackAMonth = () => {
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() - 1, 1))
  }

  const goForwardAMonth = () => {
    onChange(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1))
  }

  const currentMonth = firstDayOfTheMonth.toLocaleString('default', { month: 'long' })

  return (
    <div className="navigation-buttons">
      <button className="nav-button" onClick={goBackAMonth}>
        ←
      </button>

      <strong style={{ fontSize: '1.4em' }}>{currentMonth}</strong>

      {(new Date(firstDayOfTheMonth.getFullYear(), firstDayOfTheMonth.getMonth() + 1, 1) < new Date() && (
        <button className="nav-button" onClick={goForwardAMonth}>
          →
        </button>
      )) || <span style={{ minWidth: '56px', visibility: 'hidden' }}>→</span>}
    </div>
  )
}
