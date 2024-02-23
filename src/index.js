import "./reset.css";
import "./style.css";

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=0ccde67d368a424faf4213636240401&q=${location}&days=3&aqi=no&alerts=no`,
      { mode: "cors" }
    );
    const weatherData = await response.json();
    return weatherData;
  } catch {
    // alert("Unable to fetch data check internet connection")
    throw Error("Unable to fetch data check internet connection");
    
  }
}

getWeatherData("ahinsan")

