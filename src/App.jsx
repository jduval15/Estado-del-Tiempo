import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import getApiKey from './utils/getApikey'
import WeatherCard2 from './components/WeatherCard2'
import Loading from './components/Loading'
import { convertToCelsius, convertToFahrenheit } from './utils/converTemperature'

function App() {
  const [coords, setCoors] = useState() // coordenadas del usuario
  const [weather, setWeather] = useState() // mostrar interfaz con los datos
  const [temp, setTemp] = useState() // enviar obj con los datos convertidos Celsius y farenheit
  const [inputValue, setInputValue] = useState() // cambiar de zona elegida por el usuario
  const [hasError, setHasError] = useState(false) // error si el pais o ciudad no se encuentra
  const [isDay, setIsDay] = useState(true)
  // obtener las cordenadas
  useEffect(() => {
    const success = ({coords}) => {
      const obj = {
        lat: coords.latitude,
        lon: coords.longitude
      }
      setCoors(obj)
    }
    navigator.geolocation.getCurrentPosition(success) // api navegador ubicacion
  }, [])
  
  // si el usuario envia sus cordenadas se muestra la interfaz
  useEffect(()=> {
    const fetchWeatherData = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${getApiKey()}`;
        const response = await axios.get(url);
        const weatherData = response.data;
        const { main, sys } = weatherData;

        const objTemp = {
          celsius: convertToCelsius(main.temp),
          celsiusMin: convertToCelsius(main.temp_min - 1),
          celsiusMax: convertToCelsius(main.temp_max + 1),
          farenheit: convertToFahrenheit(main.temp),
          farenheitMin: convertToFahrenheit(main.temp_min),
          farenheitMax: convertToFahrenheit(main.temp_max),
        }
        setWeather(weatherData);
        setTemp(objTemp);
  
        const sunriseTime = sys.sunrise * 1000;
        const sunsetTime = sys.sunset * 1000;
        const currentTime = new Date().getTime();
  
        setIsDay(currentTime > sunriseTime && currentTime < sunsetTime);
      } catch (error) {
        console.log(error);
      }
    };

    if (coords) {
      fetchWeatherData();
    }

  }, [coords])

  // Input datos enviados por el user
  const handleSubmit = (e) => {
    e.preventDefault();
    setInputValue(e.target.inputValue.value.trim());
    e.target.inputValue.value = '';
    e.target.inputValue.blur();
}
  // buscar ciudad elegida por el usuario
  useEffect(() => {
    if (weather && inputValue) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${getApiKey()}`
      axios.get(url)
        .then(res => {
          setWeather(res.data)
          const {main, sys} = res.data
          const objTemp = {
            celsius: convertToCelsius(main.temp),
            celsiusMin: convertToCelsius(main.temp - 1),
            celsiusMax: convertToCelsius(main.temp + 1),
            farenheit: convertToFahrenheit(main.temp),
            farenheitMin: convertToFahrenheit(main.temp - 1),
            farenheitMax: convertToFahrenheit(main.temp + 1),
          }
          setTemp(objTemp)
          setHasError(false)

          // Validacion si es de dia o de noche
          const sunriseTime = sys.sunrise * 1000;
          const sunsetTime = sys.sunset * 1000;
          const currentTime = new Date().getTime();
    
          setIsDay(currentTime > sunriseTime && currentTime < sunsetTime);
        })
        .catch(err => {
          console.log(err)
          setHasError(true)
        })
    }
  },[inputValue, weather])

  // animar search si el pais no fue encontrado
  useEffect(()=> {
    if (hasError) {
      const timer = setTimeout(() => {
        setHasError(false)
      }, 1500);
      return () => clearTimeout(timer)
    }
  },[hasError])

  const appClassName = `app ${isDay ? 'day': 'night'}`; // verificamos si es de dia o de noche

  return (
    <div className={appClassName}>
      {
        weather 
        ? <WeatherCard2 weather = {weather} temp = {temp} handleSubmit = {handleSubmit} hasError = {hasError}/> 
        : <Loading/>
      }
    </div>
  )
}

export default App

