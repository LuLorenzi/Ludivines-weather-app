function updateWeather(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let windSpeedElement = document.querySelector("#current-wind");
  let humidityElement = document.querySelector("#humidity");
  let iconElement = document.querySelector("#emoji");

  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  temperatureElement.innerHTML = `${Math.round(temperature)}`;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  formatDate();
  changeBackground();
  getForecast(response.data.city);
}

function changeBackground() {
  let backgroundElement = document.querySelector("#weather-info-container");
  let time = new Date().getHours();

  let picture;
  if (time < 5) {
    picture = "Night";
  } else if (time < 10) {
    picture = "Sunrise";
  } else if (time < 17) {
    picture = "Day";
  } else if (time < 22) {
    picture = "Sunset";
  } else {
    picture = "Night";
  }

  let number;
  let weather = document.querySelector("#description");

  if (weather.includes("cloud")) {
    number = 2;
  } else if (weather.includes("rain")) {
    number = 3;
  } else {
    number = 1;
  }

  backgroundElement.style.backgroundImage = `url(src/img/${picture}${number}.jpg)`;
}

function formatDate(timestamp) {
  let now = new Date();
  let timeElement = document.querySelector("#current-time");

  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let year = now.getFullYear();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];

  timeElement.innerHTML = `${day} ${date} ${month} ${year}, ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "fb7f9ao5305aa93b380c3d2e8366342t";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = searchInput.value;
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "fb7f9ao5305aa93b380c3d2e8366342t";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      forecastHtml =
        forecastHtml +
        `
            <div class="weather-forecast-dates">
              <div class="weather-forecast-day">${formatDay(day.time)}</div>
              <div>
              <img src="${
                day.condition.icon_url
              }" class="weather-forecast-icon"/>
              </div>
              <div class="weather-forecast-temperatures">
                <span class="weather-forecast-temperatures-max">${Math.round(
                  day.temperature.maximum
                )}°C </span> 
                <span class="weather-forecast-temperatures-min">${Math.round(
                  day.temperature.minimum
                )}°C</span>
              </div>
            </div>
          </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Cardiff");
