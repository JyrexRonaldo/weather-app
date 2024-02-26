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
    throw Error("Unable to fetch data check internet connection");
  }
}

function getLocationData(data) {
  const { name, country } = data.location;
  return { name, country };
}

function getCurrentData(data) {
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
  const { sunrise, sunset } = data.forecast.forecastday[day].astro;
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

(function () {
  const loadingDialog = document.querySelector("dialog");
  const locationNameDiv = document.querySelector(".location p:first-child");
  const locationCountryNameDiv = document.querySelector(
    ".location p:nth-child(2)"
  );
  const currentTemperatureDiv = document.querySelector(
    ".location p:nth-child(3)"
  );
  const currentConditionTextDiv = document.querySelector(
    ".location p:last-child"
  );
  const currentChanceDiv = document.querySelector(
    ".current > div:nth-child(1) > p"
  );
  const currentPressureDiv = document.querySelector(
    ".current > div:nth-child(2) > p"
  );
  const currentVisibilityDiv = document.querySelector(
    ".current > div:nth-child(3) > p"
  );
  const currentSunriseDiv = document.querySelector(
    ".current > div:nth-child(4) > p"
  );
  const currentSunsetDiv = document.querySelector(
    ".current > div:nth-child(5) > p"
  );
  const currentHumidityDiv = document.querySelector(
    ".current > div:nth-child(6) > p"
  );

  const forecasts = document.querySelectorAll("tbody tr");

  const searchBar = document.querySelector("[type=search");

  const dropDownList = document.querySelector(".drop-down");

  async function getLocation(location) {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=0ccde67d368a424faf4213636240401&q=${location}`,
        { mode: "cors" }
      );
      const searchData = await response.json();
      

      if ("error" in searchData) {
        return ["Please enter a search query"];
      }

      if (Object.keys(searchData).length === 0) {
        return ["No location has been found"];
      }

      return searchData;
    } catch {
      throw Error("Unable to fetch data check internet connection");
    }
  }

  function createLocationList(locations) {
    dropDownList.innerHTML = "";

    locations.forEach((item) => {
      const list = document.createElement("li");
      if (typeof item === "string") {
        list.textContent = item;
      }

      if (typeof item === "object") {
        const { name, country, id } = item;
        
        list.textContent = `${name}, ${country}`;
        list.setAttribute("id", `id:${id}`);
      }

      dropDownList.append(list);
    });
  }

  async function searchQueryHandler(query) {
    const location = await getLocation(query);
    createLocationList(location);
    
  }

  searchBar.addEventListener("input", (e) => {
    searchQueryHandler(e.target.value);
    
    if (e.target.value === "") {
      setTimeout(() => {
        dropDownList.innerHTML = "";
      }, 1000);
    }
  });

  async function updateDisplay(location, code) {
    // code 1 signals for temperature in celsius
    // and code 0 signals for temperature in fahrenheit
    loadingDialog.showModal();
    const data = await getWeatherData(location);
    loadingDialog.close();
    const currentWeatherData = getCurrentData(data);
    const locationData = getLocationData(data);
    const currentDayData = getForecastData(data, 1);

    locationNameDiv.textContent = locationData.name;
    locationCountryNameDiv.textContent = locationData.country;
    currentTemperatureDiv.textContent = code
      ? `${currentWeatherData.tempC}°C`
      : `${currentWeatherData.tempF}°F`;
    currentConditionTextDiv.textContent = currentWeatherData.conditionText;
    currentPressureDiv.textContent = `${currentWeatherData.pressureMb}hPa`;
    currentVisibilityDiv.textContent = `${currentWeatherData.visKm}km`;
    currentHumidityDiv.textContent = `${currentWeatherData.humidity}%`;
    currentChanceDiv.textContent = `${currentDayData.dailyChanceOfRain}%`;
    currentSunriseDiv.textContent = `${currentDayData.sunrise}`;
    currentSunsetDiv.textContent = `${currentDayData.sunset}`;

    forecasts.forEach((tr, index) => {
      const day = getForecastData(data, index);
      const conditionImg = document.createElement("img");
      conditionImg.alt = "condition-icon";
      conditionImg.src = day.conditionIconURL;

      const conditionTxt = document.createElement("p");
      conditionTxt.textContent = day.conditionText;

      const lowTemp = document.createElement("p");
      lowTemp.textContent = code ? `${day.minTempC}°C` : `${day.minTempF}°F`;

      const avgTemp = document.createElement("p");
      avgTemp.textContent = code ? `${day.avgTempC}°C` : `${day.avgTempF}°F`;

      const highTemp = document.createElement("p");
      highTemp.textContent = code ? `${day.maxTempC}°C` : `${day.maxTempF}°F`;

      const cells = [...tr.querySelectorAll("td")];
      const information = [
        conditionImg,
        conditionTxt,
        lowTemp,
        avgTemp,
        highTemp,
      ];
      let i = 0;
      cells.forEach((cell, pos) => {
        if (pos !== 0) {
          const td = cell;
          td.innerHTML = "";
          td.append(information[i]);
          i += 1;
        }
      });
    });
  }

  dropDownList.addEventListener("click", (e) => {
    updateDisplay(e.target.id, 1);
  });

  updateDisplay("id:2107568", 1);
})();
