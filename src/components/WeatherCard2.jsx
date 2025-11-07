import { useState } from "react"
import './styles/weatherCard2.css'
const WeatherCard = ({weather, temp, handleSubmit, hasError, errorMessage, isLoading}) => {
    const [isCelsius, setIsCelsius] = useState(true) // Cambiar de C a F
    const getFondoImg = () => {
        const clima = weather?.weather[0].main.toLowerCase();
        switch (clima) {
            case 'clear':
                return "url('/fondo_despejado.webp')";
            case 'clouds':
                return "url('/fondo_nublado.webp')";
            case 'rain':
                return "url('/fondo_lluvioso.webp')";
            case 'thunderstorm':
                return "url('/fondo_trueno.webp')";
            case 'snow':
                return "url('/fondo_nevado.webp')";
            case 'mist':
                return "url('/fondo_niebla.webp')";
            default:
                return "url('/fondo_despejado.webp')";
        }
    }
    // FONDO IMG
    const style = {
        backgroundImage: getFondoImg(),
        backgroundPosition: 'bottom left',
        backgroundSize: "cover"
    }
    return (
        <main className="weather">
            <header style={style} className="weather__header-content">
                <div className="weather__header">
                    <h2 className="weather__tittle">{weather?.name}</h2>
                    <h3 className="weather__subtittle">{weather?.weather[0].description}</h3>
                    <h1 className="weather__temp">
                        {isCelsius ? `${temp?.celsius}` : `${temp?.farenheit}`}
                        <span>{isCelsius ? '°C': '°F'}</span></h1>
                </div>
                <nav className="contenedor__btn">
                    <button className="btn btn3" onClick={() => setIsCelsius(!isCelsius)}>Change to
                        {isCelsius ? '°F' : '°C'}
                    </button>
                </nav>
                <form onSubmit={handleSubmit} className="weather__search">
                    <input
                        id='inputValue'
                        className="weather__search-input"
                        type="text"
                        placeholder="City name"
                        disabled={isLoading}
                        required
                        minLength={2}
                        maxLength={50}
                        pattern="[A-Za-zÀ-ÿ\s\-]+"
                        title="Por favor, ingresa solo letras y espacios"
                    />
                    <button className="weather__search-btn-icon" type="submit" disabled={isLoading}>
                        <i className={`bx bx-search-alt ${hasError && 'animationSearch'}`}></i>
                    </button>
                </form>
                {errorMessage && (
                    <div className="weather__error-message">
                        {errorMessage}
                    </div>
                )}
                {isLoading && (
                    <div className="weather__loading-indicator">
                        Buscando...
                    </div>
                )}
            </header>
            <section className="weather__body">
                <div className="weather__icon-Container">
                    <div className="weather__body-img">
                        <img src={
                            weather 
                            && `https://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`
                            } alt="" />  
                    </div>
                    <div className="weather__inf-Container">
                        <div className="weather__inf-temp-min">
                            <p className="temp-min">
                                {isCelsius ? `${temp?.celsiusMin}` : `${temp?.farenheitMin}`}
                            </p>
                            <span className="weather__decoration"></span>
                            <span className="weather__inf_text">Min temp</span> 
                        </div>
                        <div className="weather__inf-temp-max">
                            <p className="temp-max">
                                {isCelsius ? `${temp?.celsiusMax}` : `${temp?.farenheitMax}`}
                            </p>
                            <span className="weather__decoration"></span>
                            <span className="weather__inf_text">Max temp</span>
                        </div>
                    </div>
                </div>
                <article className="weather__inf" >
                    <div className="weather__inf-list">
                        <div className="weather__inf-header">
                            <i className='bx bx-wind icon'></i>
                            <p className="weather__list-label">W-Spd <span>(m/s)</span></p>
                        </div>
                        <h4 className="weather__list-value viento">{(weather?.wind.speed).toFixed(0)}</h4>
                    </div>
                    <div className="weather__inf-list">
                        <div className="weather__inf-header">
                            <i className='bx bx-landscape icon' ></i>
                            <p className="weather__list-label">Pressure <span>(hPa)</span></p>
                        </div>
                        <h4 className="weather__list-value pressure">{weather?.main.pressure}</h4>
                    </div>
                    <div className="weather__inf-list">
                        <div className="weather__inf-header">
                            <i className='bx bx-brightness-half icon'></i>
                            <p className="weather__list-label">Clouds <span>( % )</span></p>
                        </div>
                        <h4 className="weather__list-value clouds">{weather?.clouds.all}</h4>
                    </div>
                </article>
            </section>
            <footer>
                <div>
                <p>Contact me</p>
                <a href="https://www.linkedin.com/in/joseluisduval1505/" target="_blank" rel="noopener noreferrer"><i className='bx bxl-linkedin-square'></i></a>
                <a href="https://github.com/jduval15/ent.2" target="_blank" rel="noopener noreferrer"><i className='bx bxl-github' ></i></a>
                </div>
            </footer>
        </main>
    )
}
export default WeatherCard