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
  const [weatherResponse, setWeatherResponse] = useState(false);
  const [city, setCity] = useState(props.city);
  const [temperature, setTemperature] = useState('');
  const [windDescr, setWindDescr] = useState('m/s');
  const [units, setUnits] = useState(props.unit);
  const [celsBtn, setCelsBtn] = useState(true);
  const [fahrBtn, setFahrBtn] = useState(false);
  const [hourlyForecast, setHourlyForecast] = useState('');
  const [dailyForecast, setDailyForecast] = useState('');
  React.useEffect(() => {
    search();
    // eslint-disable-next-line
  }, [units]);
  function weekFormat(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let day = days[date.getDay()];
    return day;
  }

  function showHourlyDailyForecast(response) {
    setHourlyForecast(response.data.hourly);
    setDailyForecast(response.data.daily);
    setWeatherResponse(true);
  }

  function handleResponse(response) {
    setWeatherData({
      response: true,
      city: response.data.name,
      date: now,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: Math.round(response.data.wind.speed),
      img: `/images/${response.data.weather[0].icon}.png`,
      lon: response.data.coord.lon,
      lat: response.data.coord.lat,
    });
    setTemperature(Math.round(response.data.main.temp));
    setCity(response.data.name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    search('units=metric');
    let searchInput = document.getElementById('search-text-input');
    searchInput.value = '';
  }
  function handleCityChange(e) {
    setCity(e.target.value);
  }
  function search() {
    const apiKey = '&appid=a969311cfcbb4a83dfad2cf7478397f9';
    let currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&${units}${apiKey}`;
    axios.get(currentUrl).then(handleResponse);

    axios
      .get(currentUrl)
      .then((res) =>
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&${units}&appid=a969311cfcbb4a83dfad2cf7478397f9`
          )
          .then(showHourlyDailyForecast)
      );
  }

  function intoFahrenheit(e) {
    e.preventDefault();
    // search('units=imperial');
    setUnits('units=imperial');
    setWindDescr('mph');
    setCelsBtn(false);
    setFahrBtn(true);
  }
  function intoCelsius(e) {
    e.preventDefault();
    // search('units=metric');
    setUnits('units=metric');
    setWindDescr('m/s');
    setCelsBtn(true);
    setFahrBtn(false);
  }

  function getCurrentPosition(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition);
  }

  function showPosition(position) {
    let apiKey = 'a969311cfcbb4a83dfad2cf7478397f9';
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&${units}`;
    let oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&${units}&appid=a969311cfcbb4a83dfad2cf7478397f9`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(handleResponse);
    axios.get(`${oneCallUrl}&appid=${apiKey}`).then(showHourlyDailyForecast);
    // setCelsBtn(true);
    // setFahrBtn(false);
  }

  if (weatherResponse) {
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
                        <span className='main__current-icon'>˚</span>
                      </div>
                      <div className='celsius-link-box'>
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
                    <ul className='main__day-box' id='hourly-forecast'>
                      {hourlyForecast.map((item, index) => {
                        let src = `images/${item.weather[0].icon}.png`;
                        return index < 10 && index % 2 ? (
                          <li key={index}>
                            <div className='main__time-box'>
                              <p className='main__day-time' id='time-now'>
                                {new Date(item.dt * 1000).getHours()}
                              </p>
                              <p id='time-format'>00</p>
                            </div>
                            <img
                              className='main__day-img'
                              src={src}
                              alt='img'
                            />
                            <p className='main__day-temp' id='day-temp-now'>
                              {Math.round(item.temp)}
                            </p>
                            <span>˚</span>
                          </li>
                        ) : (
                          ''
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='main__week-forecast'>
                <ul className='main__week-items' id='week-forecast'>
                  {dailyForecast.map((item, index) => {
                    let src = `images/${item.weather[0].icon}.png`;
                    return index !== 0 && index < 7 ? (
                      <li className='main__week-item' key={index}>
                        <p className='main__week-day' id='day-1'>
                          {weekFormat(item.dt)}
                        </p>
                        <img className='main__week-img' src={src} alt='img' />
                        <div className='main__week-box'>
                          <div className='main__week-max-box'>
                            <span
                              className='main__week-max-temp'
                              id='max-temp1'
                            >
                              {Math.round(item.temp.max)}
                            </span>
                            <span className='main__week-max-deg'>˚</span>
                          </div>
                          <div className='main__week-min-box'>
                            <span
                              className='main__week-min-temp'
                              id='min-temp1'
                            >
                              {Math.round(item.temp.min)}
                            </span>
                            <span className='main__week-min-deg'>˚</span>
                          </div>
                        </div>
                      </li>
                    ) : (
                      ''
                    );
                  })}
                </ul>
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
    search();
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
