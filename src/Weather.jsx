import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Loader } from 'lucide-react';

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "3f2987d41aa045ec0ce9000695188865";

const Weather = () => {
    const [city, setCity] = useState('Accra');           // Current city
    const [weatherData, setWeatherData] = useState(null); // Weather data
    const [loading, setLoading] = useState(false);        // Loading state
    const [error, setError] = useState(null);             // Error state
    const [temp, setTemp] = useState('celsius');          // Temperature unit

    const convertTemp = (unit) => {
        if (temp === 'fahrenheit') {
            return ((unit * 9 / 5) + 32).toFixed(1);
        }
        return unit.toFixed(1);
    }

    function handleInput(e) {
        const value = e.target.value;
        setCity(value);

    }

    function handleSubmit(e) {
        e.preventDefault(); // Prevents the default form submission behavior
        if (city.trim()) {
            fetchWeather(city); // Trigger fetching the weather data
            setCity(""); // Clear the input field
        }
    }

    const fetchWeather = async (city) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);

            if (!response.ok) throw new Error("Cannot find city...try again");
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const WeatherIcon = ({ condition }) => {
        switch (condition?.toLowerCase()) {
            case 'clear':
                return <Sun className="weather-icon sun" />;
            case 'rain':
                return <CloudRain className="weather-icon rain" />;
            case 'clouds':
                return <Cloud className="weather-icon cloud" />;
            default:
                return <Sun className="weather-icon sun" />;
        }
    };

    return (
        <section>
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit} action="">
                <input
                    type="text"
                    placeholder="Enter a city name..."
                    value={city}
                    onChange={handleInput}
                />
                <button className='search-button' type="submit">Search</button>
            </form>

            {/* TEMPERATURE TOGGLE B/W FAHRENHEIT AND DEGREES */}
            <div>
                <button className='temp-button' onClick={() => setTemp("celsius")}>°C</button>
                <button className='temp-button' onClick={() => setTemp("fahrenheit")}>°F</button>
            </div>

            {/* Loading State */}
            {loading && (
                <div><Loader size={300} color='blue' /></div>
            )}

            {/* Error State */}
            {error && (
                <div >
                    {error}
                </div>
            )}

            {/* WEATHER DATA */}
            {weatherData && !loading && !error && (
                <div className='container'>
                    <h2 className="city-name">{weatherData.name}, {weatherData.sys.country}</h2>
                    <div className="temperature">
                        <WeatherIcon condition={weatherData.weather[0].main} size={300} />
                        {convertTemp(weatherData.main.temp)}°
                        {temp === 'celsius' ? 'C' : 'F'}                        
                    </div>
                    <div className='weather-description'>{weatherData.weather[0].description}</div>
                    <div className="weather">
                        <div className='weather-card'>
                            <Thermometer className='weather-icon' size={100} />
                            <p className='weather-label'>Feels Like</p>
                            <p className='weather-value'>{weatherData.main.feels_like}°C</p>
                        </div>
                        <div className='weather-card'>
                            <Wind className='weather-icon' />
                            <p className='weather-label'>Wind Speed</p>
                            <p className='weather-value'>{weatherData.wind.speed} m/s</p>
                        </div>
                        <div className='weather-card'>
                            <Cloud className='weather-icon' />
                            <p className='weather-label'>Cloudiness</p>
                            <p className='weather-value'>25%</p>
                        </div>
                        <div className='weather-card'>
                            <Droplets className='weather-icon' />
                            <p className='weather-label'>Humidity</p>
                            <p className='weather-value'>{weatherData.main.humidity}%</p>
                        </div>
                    </div>
                </div>

            )}
        </section>
    )
}

export default Weather;