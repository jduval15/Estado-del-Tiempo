import { useState, useEffect } from 'react'
import axios from 'axios'
import getApiKey from '../utils/getApikey'
import { convertToCelsius, convertToFahrenheit } from '../utils/converTemperature'

const useWeatherData = () => {
  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temp, setTemp] = useState()
  const [isDay, setIsDay] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Función para procesar los datos del clima
  const processWeatherData = (data) => {
    const { main, sys } = data

    const objTemp = {
      celsius: convertToCelsius(main.temp),
      celsiusMin: convertToCelsius(main.temp_min),
      celsiusMax: convertToCelsius(main.temp_max),
      farenheit: convertToFahrenheit(main.temp),
      farenheitMin: convertToFahrenheit(main.temp_min),
      farenheitMax: convertToFahrenheit(main.temp_max),
    }

    const sunriseTime = sys.sunrise * 1000
    const sunsetTime = sys.sunset * 1000
    const currentTime = new Date().getTime()
    const isDayTime = currentTime > sunriseTime && currentTime < sunsetTime

    return { objTemp, isDayTime }
  }

  // Obtener las coordenadas del usuario
  useEffect(() => {
    const success = ({ coords }) => {
      const obj = {
        lat: coords.latitude,
        lon: coords.longitude
      }
      setCoords(obj)
    }

    const handleError = (error) => {
      console.error('Geolocation error:', error)
      setError('No se pudo obtener la ubicación. Por favor, habilita los permisos de ubicación.')
    }

    navigator.geolocation.getCurrentPosition(success, handleError)
  }, [])

  // Obtener datos del clima por coordenadas
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!coords) return

      setIsLoading(true)
      setError(null)

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${getApiKey()}`
        const response = await axios.get(url)
        const weatherData = response.data

        const { objTemp, isDayTime } = processWeatherData(weatherData)

        setWeather(weatherData)
        setTemp(objTemp)
        setIsDay(isDayTime)
      } catch (error) {
        console.error('Error fetching weather data:', error)
        setError('No se pudieron obtener los datos del clima.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [coords])

  // Buscar clima por nombre de ciudad
  const searchCityWeather = async (cityName) => {
    if (!cityName || !cityName.trim()) {
      setError('Por favor, ingresa un nombre de ciudad válido.')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.trim()}&appid=${getApiKey()}`
      const response = await axios.get(url)
      const weatherData = response.data

      const { objTemp, isDayTime } = processWeatherData(weatherData)

      setWeather(weatherData)
      setTemp(objTemp)
      setIsDay(isDayTime)

      return true
    } catch (error) {
      console.error('Error searching city:', error)
      setError('Ciudad no encontrada. Por favor, verifica el nombre e intenta de nuevo.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    weather,
    temp,
    isDay,
    isLoading,
    error,
    searchCityWeather,
    clearError: () => setError(null)
  }
}

export default useWeatherData
