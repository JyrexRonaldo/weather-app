import "./reset.css";
import "./style.css";

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=0ccde67d368a424faf4213636240401&q=${location}&days=3&aqi=no&alerts=no`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch {
    // alert("Unable to fetch data check internet connection")
    throw Error("Unable to fetch data check internet connection");
  }
}

function getLocationData(data) {
  // const data = await getWeatherData(location);
  const { name, country } = data.location;
  return { name, country };
}

function getCurrentData(data) {
  // const data = await getWeatherData(location);
  const {
    temp_c: tempC,
    temp_f: tempF,
    humidity,
    pressure_mb: pressureMb,
    vis_km: visKm,
    is_day: isDay,
  } = data.current;
  const { text: conditionText, icon: conditionIconURL } =
    data.current.condition;
  return {
    tempC,
    tempF,
    humidity,
    visKm,
    pressureMb,
    isDay,
    conditionText,
    conditionIconURL,
  };
}

function getForecastData(data, day) {
  // const data = await getWeatherData(location);
  const { date } = data.forecast.forecastday[day];
  const {
    avghumidity: avgHumidity,
    avgtemp_c: avgTempC,
    avgtemp_f: avgTempF,
    avgvis_km: avgVisKm,
    daily_chance_of_rain: dailyChanceOfRain,
    daily_will_it_rain: dailyWillItRain,
    maxtemp_c: maxTempC,
    maxtemp_f: maxTempF,
    mintemp_c: minTempC,
    mintemp_f: minTempF,
  } = data.forecast.forecastday[day].day;
  const { text: conditionText, icon: conditionIconURL } =
    data.forecast.forecastday[day].day.condition;
   const {sunrise, sunset} = data.forecast.forecastday[day].astro;
  return {
    date,
    avgHumidity,
    avgTempC,
    avgTempF,
    avgVisKm,
    dailyChanceOfRain,
    dailyWillItRain,
    conditionText,
    conditionIconURL,
    maxTempC,
    maxTempF,
    minTempC,
    minTempF,
    sunrise,
    sunset,
  };
}

// const screenController = (async function(location) {
//     const data = getWeatherData(location)
// })()

async function updateDisplay(location) {
  // code 1 signals for temperature in celsius
  // and code 0 signals for temperature in fahrenheit
  let code = 1;

  const locationNameDiv = document.querySelector(".location p:first-child");
  const locationCountryNameDiv = document.querySelector(
    ".location p:nth-child(2)"
  );
  const currentTemperatureDiv = document.querySelector(".location p:nth-child(3)");
  const currentConditionTextDiv = document.querySelector(".location p:last-child");
  const currentChanceDiv = document.querySelector(".current > div:nth-child(1) > p")
  const currentPressureDiv = document.querySelector(".current > div:nth-child(2) > p")
  const currentVisibilityDiv = document.querySelector(".current > div:nth-child(3) > p")
  const currentSunriseDiv = document.querySelector(".current > div:nth-child(4) > p")
  const currentSunsetDiv = document.querySelector(".current > div:nth-child(5) > p")
  const currentHumidityDiv = document.querySelector(".current > div:nth-child(6) > p")
  const data = await getWeatherData(location);
    console.log(data)
  const currentWeatherData = getCurrentData(data);
  const locationData = getLocationData(data);
  const currentDayData = getForecastData(data, 0)
  const nextDayData = getForecastData(data, 1)    
  const subsequentDayData = getForecastData(data, 2)    
  // console.log(getForecastData(data));

  locationNameDiv.textContent = locationData.name;
  locationCountryNameDiv.textContent = locationData.country;
  currentTemperatureDiv.textContent = code
    ? `${currentWeatherData.tempC}°C`
    : `${currentWeatherData.tempF}°F`;
    currentConditionTextDiv.textContent = currentWeatherData.conditionText;
    currentPressureDiv.textContent = `${currentWeatherData.pressureMb}hPa`
    currentVisibilityDiv.textContent = `${currentWeatherData.visKm}km`
    currentHumidityDiv.textContent = `${currentWeatherData.humidity}%`
    currentChanceDiv.textContent = `${currentDayData.dailyChanceOfRain}%`
    currentSunriseDiv.textContent = `${currentDayData.sunrise}`
    currentSunsetDiv.textContent = `${currentDayData.sunset}`
}

updateDisplay("barbados");
