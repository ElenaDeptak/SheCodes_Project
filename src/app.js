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

  let apiKey = "a98cf904e4273ceac14ee7e5c042eda8";

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

  function convertToFahrenheit(event) {
    event.preventDefault()
    convertingToCel.classList.remove("active");
    convertingToFar.classList.add("active");
    tempFahrenheit = Math.round((tempCelsium * 9) / 5 + 32);
    let temp = document.querySelector("#temperature");
    temp.innerHTML = tempFahrenheit;
  }

  let convertingToFar = document.querySelector("#fahrenheit");
  convertingToFar.addEventListener("click", convertToFahrenheit);

  function convertToCelsius(event) {
    event.preventDefault()
    convertingToFar.classList.remove("active");
    convertingToCel.classList.add("active");
    let temp = document.querySelector("#temperature");
    temp.innerHTML = tempCelsium;
  }

  let convertingToCel = document.querySelector("#celsius");
  convertingToCel.addEventListener("click", convertToCelsius);

  function showWeatherInfo(response) {
    console.log(response.data);
    let cityInput = response.data.name;
    let city = document.querySelector("#city");
    let result = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    let windElemant = document.querySelector("#wind");
    windElemant.innerHTML=response.data.wind.speed;
    city.innerHTML = result;
    tempCelsium = Math.round(response.data.main.temp);
    let temp = document.querySelector("#temperature");
    temp.innerHTML = tempCelsium;
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
