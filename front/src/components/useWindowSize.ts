import React from 'react'

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: document.documentElement.scrollHeight,
  })

  React.useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])
  const resizeHandler = () => {
    setWindowSize({ width: window.innerWidth, height: document.documentElement.scrollHeight })
  }
  return windowSize
}
