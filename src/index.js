import "./reset.css";
import "./style.css";

//  document.querySelector("body").style.backgroundColor = "red"

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

async function getLocationData(location) {
  const data = await getWeatherData(location);
  const { name, country } = data.location;
  // console.log({name, country});
  return { name, country };
}

async function getCurrentData(location) {
  const data = await getWeatherData(location);
  const {
    temp_c: tempC,
    temp_f: tempF,
    feelslike_c: feelsLikeC,
    feelslike_f: feelsLikeF,
    humidity,
    is_day: isDay,
  } = data.current;
  //   console.log({  });
  const {text: conditionText, icon: conditionIconURL} = data.current.condition;
  return { tempC, tempF, feelsLikeC, feelsLikeF, humidity, isDay, conditionText, conditionIconURL };
}

async function getForecastData(location) {
  const data = await getWeatherData(location);
  const { date } = data.forecast.forecastday[0];
  const {
    avghumidity,
    avgtemp_c: avgTempC,
    avgtemp_f: avgTempF,
    avgvis_km: avgVisKm,
    daily_chance_of_rain: dailyChanceOfRain,
    daily_will_it_rain: dailyWillItRain,
  } = data.forecast.forecastday[0].day;
  const { text: conditionText, icon: conditionIconURL } =
    data.forecast.forecastday[0].day.condition;
  //   console.log();

  return {
    date,
    avghumidity,
    avgTempC,
    avgTempF,
    avgVisKm,
    dailyChanceOfRain,
    dailyWillItRain,
    conditionText,
    conditionIconURL,
  };
}

getCurrentData("ahinsan");
getLocationData("ahinsan");
getForecastData("ahinsan");
