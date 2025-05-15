const apiKey = "85ad5b67de6d3a1d53c2796b38c68504";
const baseUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const checkWeatherBtn = document.getElementById("checkWeatherBtn");
const compareWeatherBtn = document.getElementById("compareWeatherBtn");
const checkWeatherSection = document.getElementById("checkWeatherSection");
const compareWeatherSection = document.getElementById("compareWeatherSection");
const getSingleWeather = document.getElementById("getSingleWeather");
const singleCitySelect = document.getElementById("singleCitySelect");
const compareBtn = document.getElementById("compareBtn");
const city1 = document.getElementById("city1");
const city2 = document.getElementById("city2");
const favIcon = document.querySelector(".fav-icon");

// Toggle sections
checkWeatherBtn.addEventListener("click", () => {
  checkWeatherSection.classList.remove("hidden");
  compareWeatherSection.classList.add("hidden");
});

compareWeatherBtn.addEventListener("click", () => {
  compareWeatherSection.classList.remove("hidden");
  checkWeatherSection.classList.add("hidden");
});

// API Call
async function getWeather(city) {
  const res = await fetch(`${baseUrl}${city}&appid=${apiKey}`);
  if (!res.ok) throw new Error("City not found");
  return await res.json();
}

// Display Weather

function renderWeather(data) {
  return `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" />
      <h2>${data.name}</h2>
      <p>🌡️ Temp: ${data.main.temp}°C</p>
      <p>💨 Wind: ${data.wind.speed} km/h</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
    `;
}

// Handle Single City
/*
getSingleWeather.addEventListener("click", async () => {
  const city = singleCitySelect.value;
  if (!city) return;
  try {
    const data = await getWeather(city);
    document.getElementById("singleWeatherDisplay").innerHTML = renderWeather(data);
    saveToFavourites(city);
  } catch (err) {
    alert("Failed to fetch weather");
  }
});


*/

//function used for favourites data save locally

function saveToFavourites(city) {
  let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
  }
}

document
  .getElementById("getSingleWeather")
  .addEventListener("click", async () => {
    const city = singleCitySelect.value;
    if (!city) return;
    try {
      const data = await getWeather(city);
      const temp = data.main.temp;

      let imagePath = "";
      if (temp > 30) {
        imagePath = "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Hot
      } else if (temp >= 20 && temp <= 30) {
        imagePath = "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Warm
      } else {
        imagePath = "https://cdn-icons-png.flaticon.com/512/642/642221.png"; // Cold
      }

      const imgEl = document.getElementById("weatherImage");
      imgEl.src = imagePath;
      imgEl.alt = `Temperature: ${temp}°C`;
      imgEl.style.display = "block";

      document.getElementById("weatherText").innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡️ Temp: ${temp}°C</p>
        <p>💨 Wind: ${data.wind.speed} km/h</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
      `;

      saveToFavourites(city);
    } catch (err) {
      alert("Failed to fetch weather");
    }
  });

/*
// Handle Compare
compareBtn.addEventListener("click", async () => {
    const cityOne = city1.value;
    const cityTwo = city2.value;
    if (!cityOne || !cityTwo) return;
  
    try {
      const data1 = await getWeather(cityOne);
      const data2 = await getWeather(cityTwo);
  
      document.getElementById("weather1").innerHTML = renderWeather(data1);
      document.getElementById("weather2").innerHTML = renderWeather(data2);
  
      saveToFavourites(cityOne);
      saveToFavourites(cityTwo);
    } catch (err) {
      alert("Failed to fetch weather");
    }
});

*/

compareBtn.addEventListener("click", async () => {
  const cityOne = city1.value;
  const cityTwo = city2.value;
  if (!cityOne || !cityTwo) return;

  try {
    const data1 = await getWeather(cityOne);
    const data2 = await getWeather(cityTwo);

    // Function to get image URL based on temp
    function getTempImage(temp) {
      if (temp > 30) {
        return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Hot
      } else if (temp >= 20 && temp <= 30) {
        return "https://cdn-icons-png.flaticon.com/512/1163/1163661.png"; // Warm
      } else {
        return "https://cdn-icons-png.flaticon.com/512/642/642221.png"; // Cold
      }
    }

    // Create inner HTML for each city's weather info + image
    const renderWithImage = (data) => {
      const temp = data.main.temp;
      const imagePath = getTempImage(temp);
      return `
          <img src="${imagePath}" alt="Temperature ${temp}°C" style="width: 100px; height: auto; margin-bottom: 10px;" />
          <h2>${data.name}</h2>
          <p>🌡️ Temp: ${temp}°C</p>
          <p>💨 Wind: ${data.wind.speed} km/h</p>
          <p>💧 Humidity: ${data.main.humidity}%</p>
        `;
    };

    document.getElementById("weather1").innerHTML = renderWithImage(data1);
    document.getElementById("weather2").innerHTML = renderWithImage(data2);

    saveToFavourites(cityOne);
    saveToFavourites(cityTwo);
  } catch (err) {
    alert("Failed to fetch weather");
  }
});

// LocalStorage Favorites
function saveToFavourites(city) {
  let favs = JSON.parse(localStorage.getItem("favourites")) || [];
  if (!favs.includes(city)) {
    favs.push(city);
    localStorage.setItem("favourites", JSON.stringify(favs));
  }
}

favIcon.addEventListener("click", () => {
  const favs = JSON.parse(localStorage.getItem("favourites")) || [];
  alert("Favourites: " + favs.join(", "));
});

const weatherImage = getWeatherImage(weatherMain);
const imgEl = document.getElementById("weatherImage");

imgEl.src = weatherImage; // set image source dynamically
imgEl.alt = weatherMain; // set alt text for accessibility
imgEl.style.display = "block"; // make image visible after setting src
