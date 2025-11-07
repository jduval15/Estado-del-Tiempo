import { useEffect } from 'react'
import './App.css'
import WeatherCard2 from './components/WeatherCard2'
import Loading from './components/Loading'
import useWeatherData from './hooks/useWeatherData'

function App() {
  const { weather, temp, isDay, isLoading, error, searchCityWeather, clearError } = useWeatherData()

  // Manejar el envío del formulario de búsqueda
  const handleSubmit = async (e) => {
    e.preventDefault()
    const cityName = e.target.inputValue.value.trim()

    if (cityName) {
      await searchCityWeather(cityName)
      e.target.inputValue.value = ''
      e.target.inputValue.blur()
    }
  }

  // Limpiar error después de 1.5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const appClassName = `app ${isDay ? 'day' : 'night'}`

  return (
    <div className={appClassName}>
      {
        weather
        ? <WeatherCard2
            weather={weather}
            temp={temp}
            handleSubmit={handleSubmit}
            hasError={!!error}
            errorMessage={error}
            isLoading={isLoading}
          />
        : <Loading />
      }
    </div>
  )
}

export default App

