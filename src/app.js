let now = new Date();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thuesday", "Friday", "Saturday"];
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
    "December"
  ];

  let tempCelsium = null;
  let tempFahrenheit;

  let apiKey = "a43564c91a6c605aeb564c9ed02e3858";

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }

  function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastDay, index) {
      if (index < 6) {
        forecastHTML = forecastHTML + 
        `
          <div class="col-2">
            <div class="day card-shadow">
                <h5 class="title">${formatDay(forecastDay.dt)}</h5>
                <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="">
                <h5>${Math.round(forecastDay.temp.max)}°C</h5>
                <h6>${Math.round(forecastDay.temp.min)}°C</h6>
            </div>
          </div>
        `;
      }
    });

    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }

  function formatDate() {
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let number = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();

    if(minutes < 10) {
      minutes = `0${minutes}`;
    }

    let currentDate = `${day}, ${month} ${number}, ${hour}:${minutes}`;
    let date = document.querySelector("#currentDate");
    date.innerHTML = currentDate;
  }

  formatDate();

  function displayCity(event) {
    event.preventDefault()
    let cityInput = document.querySelector("#cityInput").value;
    let city = document.querySelector("#city");
    let result = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);

    getWeatherByCity(result);

    city.innerHTML = result;
  }

  let searching = document.querySelector("#addon-wrapping");
  searching.addEventListener("click", displayCity);
  document.addEventListener('keypress', (event)=>{
    let keyCode = event.keyCode ? event.keyCode : event.which;

    if(keyCode === 13) {
      searching.click();
    }
  });

  let myLocation = document.querySelector("#location");
  myLocation.addEventListener("click", getLocationInfo);

  function getLocationInfo() {
    navigator.geolocation.getCurrentPosition(getWeatherByGeolocation);
  }

  // function convertToFahrenheit(event) {
  //   event.preventDefault()
  //   convertingToCel.classList.remove("active");
  //   convertingToFar.classList.add("active");
  //   tempFahrenheit = Math.round((tempCelsium * 9) / 5 + 32);
  //   let temp = document.querySelector("#temperature");
  //   temp.innerHTML = tempFahrenheit;
  // }

  // let convertingToFar = document.querySelector("#fahrenheit");
  // convertingToFar.addEventListener("click", convertToFahrenheit);

  // function convertToCelsius(event) {
  //   event.preventDefault()
  //   convertingToFar.classList.remove("active");
  //   convertingToCel.classList.add("active");
  //   let temp = document.querySelector("#temperature");
  //   temp.innerHTML = tempCelsium;
  // }

  // let convertingToCel = document.querySelector("#celsius");
  // convertingToCel.addEventListener("click", convertToCelsius);

  function getForecast(coordinates) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayForecast);
  }


  function showWeatherInfo(response) {
    
    console.log(response);
    let cityInput = response.data.name;
    let city = document.querySelector("#city");
    let result = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    let windElemant = document.querySelector("#wind");
    windElemant.innerHTML = Math.round(response.data.wind.speed);
    city.innerHTML = result;
    tempCelsium = Math.round(response.data.main.temp);
    let temp = document.querySelector("#temperature");
    temp.innerHTML = tempCelsium;
    let weatherDescription = document.querySelector("#weather-description");
    weatherDescription.innerHTML = response.data.weather[0].description;
    
    let sunRise = document.querySelector("#sunrise");
    sunRiseTime = new Date(response.data.sys.sunrise * 1000);
    let time = sunRiseTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    sunRise.innerHTML = time;

    let sunSet = document.querySelector("#sunset");
    sunSetTime = new Date(response.data.sys.sunset * 1000);
    let timeset = sunSetTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    sunSet.innerHTML = timeset;

    getForecast(response.data.coord);
  }

  function getWeatherByGeolocation(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    axios.get(url).then(showWeatherInfo);
  }

  navigator.geolocation.getCurrentPosition(getWeatherByGeolocation);

  function getWeatherByCity(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(url).then(showWeatherInfo);
  }
