import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

function Weather(props) {
  const currentDate = new Date();
  let options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  let now = currentDate.toLocaleString('en-US', options);
  const [weatherData, setWeatherData] = useState({ response: false });
  const [city, setCity] = useState(props.city);
  const [temperature, setTemperature] = useState('');
  const [windDescr, setWindDescr] = useState('km/h');
  const [celsBtn, setCelsBtn] = useState(true);
  const [fahrBtn, setFahrBtn] = useState(false);
  

  function handleResponse(response) {
    console.log(response.data);
    setWeatherData({
      response: true,
      city: response.data.name,
      date: now,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: Math.round(response.data.wind.speed),
      temp: Math.round(response.data.main.temp),
      img: `/images/${response.data.weather[0].icon}.png`,
    });
    setTemperature(Math.round(response.data.main.temp));
  }

  function handleSubmit(e) {
    e.preventDefault();
    search('units=metric');
    let searchInput = document.getElementById('search-text-input');
    searchInput.value = '';
  }
  function handleCityChange(e) {
    setCity(e.target.value);
    console.log(e.target.value);
  }
  function search(m) {
    const apiKey = '&appid=6a48a550fc04f170639e60d52b8a6bc5';
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&${m}${apiKey}`;
    axios.get(currentUrl).then(handleResponse);
  }

  function intoFahrenheit(e) {
    e.preventDefault();
    search('units=imperial');
    setWindDescr('mph');
    setCelsBtn(false);
    setFahrBtn(true);
  }
  function intoCelsius(e) {
    e.preventDefault();
    search('units=metric');
    setWindDescr('km/h');
    setCelsBtn(true);
    setFahrBtn(false);
  }

  function getCurrentPosition(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log(showPosition);
  }
  
  function showPosition(position) {
    console.log(position)
    let apiKey = '6a48a550fc04f170639e60d52b8a6bc5';
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(handleResponse);
  }
  if (weatherData.response) {
    return (
      <div className='wrapper'>
        <header className='header'>
          <div className='container'>
            <div className='header__content'>
              <h1 className='header__title'>weather forecast</h1>
              <form
                className='header__search-form'
                id='search-form'
                onSubmit={handleSubmit}
              >
                <input
                  type='text'
                  className='button-input'
                  placeholder='Edit location'
                  aria-label="Recipient's username"
                  aria-describedby='button-addon2'
                  autoComplete='off'
                  autoFocus='on'
                  id='search-text-input'
                  required
                  onChange={handleCityChange}
                />
                <button
                  className='button-search'
                  type='submit'
                  id='button-addon2'
                >
                  Search
                </button>

                <button
                  className='button-current-location'
                  id='current-location'
                  type='button'
                  onClick={getCurrentPosition}
                >
                  Current
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className='main'>
          <div className='container'>
            <div className='main__content'>
              <h2 className='main__city' id='city'>
                {weatherData.city}
              </h2>
              <div className='main__current-city'>
                <div className='main__current-forecast'>
                  <div className='main__current-left-box'>
                    <img
                      className='main__current-img'
                      src={weatherData.img}
                      alt=''
                    />
                    <h3
                      className='main__current-title'
                      id='current-description'
                    >
                      {weatherData.description}
                    </h3>
                    <div className='main__temp-box'>
                      <div className='main__current-temp-box'>
                        <h3 className='main__current-temp' id='current-temp'>
                          {temperature}
                        </h3>
                        <span>˚</span>
                      </div>
                      <a
                        href='/'
                        className={`celsius-link ${celsBtn ? 'active' : ''}`}
                        id='celsius'
                        onClick={intoCelsius}
                      >
                        C
                      </a>
                      <a
                        href='/'
                        className={`celsius-link ${fahrBtn ? 'active' : ''}`}
                        id='fahrenheit'
                        onClick={intoFahrenheit}
                      >
                        F
                      </a>
                    </div>
                  </div>
                </div>
                <div className='main__box'>
                  <div className='main__current-right-box'>
                    <p className='main__current-date' id='current-date'>
                      {now}
                    </p>
                    <p className='main__current-humidity'>
                      Humidity:{' '}
                      <span id='humidity'>{weatherData.humidity}</span>%
                    </p>
                    <p className='main__current-wind'>
                      Wind:
                      <span id='wind'> {weatherData.wind}</span>
                      <span id='wind-indicator'>{windDescr}</span>
                    </p>
                  </div>
                  <div className='main__day-forecast'>
                    <ul className='main__day-box' id='hourly-forecast'></ul>
                  </div>
                </div>
              </div>
              <div className='main__week-forecast'>
                <ul className='main__week-items' id='week-forecast'></ul>
              </div>
            </div>
          </div>
        </main>
        <div className='footer'>
          <div className='footer__repository'>
            <a
              href='https://github.com/Okkssana/weather-app-react.git'
              className='footer__link'
              target='_blank'
              rel='noreferrer'
            >
              GitHub repository
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    search('units=metric');
    return (
      <div className='wrapper'>
        <header className='header'>
          <div className='container'>
            <div className='header__content'>
              <h1 className='header__title'>weather forecast</h1>
              <form
                className='header__search-form'
                id='search-form'
                onSubmit={handleSubmit}
              >
                <input
                  type='text'
                  className='button-input'
                  placeholder='Edit location'
                  aria-label="Recipient's username"
                  aria-describedby='button-addon2'
                  autoComplete='off'
                  autoFocus='on'
                  id='search-text-input'
                  required
                  onChange={handleCityChange}
                />
                <button
                  className='button-search'
                  type='submit'
                  id='button-addon2'
                >
                  Search
                </button>

                <button
                  className='button-current-location'
                  id='current-location'
                  type='button'
                >
                  Current
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className='main'>
          <div className='container'>
            <div className='main__content'>
              <h2 className='main__city' id='city'>
                {city}
              </h2>
              <div className='main__current-city'>
                <div className='main__current-forecast'>
                  <div className='main__current-left-box'>
                    <img
                      className='main__current-img'
                      src={weatherData.img}
                      alt='current-img'
                    />
                    <h3
                      className='main__current-title'
                      id='current-description'
                    >
                      {weatherData.description}
                    </h3>
                    <div className='main__temp-box'>
                      <div className='main__current-temp-box'>
                        <h3 className='main__current-temp' id='current-temp'>
                          {temperature}
                        </h3>
                        <span>˚</span>
                      </div>
                      <a href='/' className='celsius-link active' id='celsius'>
                        C
                      </a>
                      <a href='/' className='fahrenheit-link' id='fahrenheit'>
                        F
                      </a>
                    </div>
                  </div>
                </div>
                <div className='main__box'>
                  <div className='main__current-right-box'>
                    <p className='main__current-date' id='current-date'>
                      {now}
                    </p>
                    <p className='main__current-humidity'>
                      Humidity:{' '}
                      <span id='humidity'>{weatherData.humidity}</span>%
                    </p>
                    <p className='main__current-wind'>
                      Wind:
                      <span id='wind'> {weatherData.wind}</span>
                      <span id='wind-indicator'>{windDescr}</span>
                    </p>
                  </div>
                  <div className='main__day-forecast'>
                    <ul className='main__day-box' id='hourly-forecast'></ul>
                  </div>
                </div>
              </div>
              <div className='main__week-forecast'>
                <ul className='main__week-items' id='week-forecast'></ul>
              </div>
            </div>
          </div>
        </main>
        <div className='footer'>
          <div className='footer__repository'>
            <a
              href='https://github.com/Okkssana/weather-app-react.git'
              className='footer__link'
              target='_blank'
              rel='noreferrer'
            >
              GitHub repository
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
