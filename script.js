const cityBox = document.querySelectorAll(".city-input")[0];
const form = document.querySelectorAll(".search-container")[0];
const title = document.querySelectorAll(".city")[0];
const temperatureBox = document.querySelectorAll(".temp")[0];
const humidityBox = document.querySelector("#humidity-box");
const windBox = document.querySelector("#wind-box");
const description = document.querySelectorAll(".description")[0];
const descriptionImg = document.querySelectorAll(".icon")[0];
const body = document.querySelectorAll("body")[0];

let cityValue = "Pune";
const geometryAPIKey = "bd25096ba75349238ce3619f3039686c";
const weatherAPIKey = "8f1d7c4cb6d7ec42e5dcf48fb6562c40";

form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    cityValue = cityBox.value.charAt(0).toUpperCase() + cityBox.value.slice(1);
    cityBox.value = "";

    let requestOptions = {
        method: "GET",
    };

    await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${cityValue}&apiKey=${geometryAPIKey}`,
        requestOptions
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then((data) => fetchWeatherDetails(data))
        .catch((error) => {
            console.error("Error:", error);
            title.innerText = "City not found";
            temperatureBox.innerText = "";
            humidityBox.innerText = "";
            windBox.innerText = "";
            description.innerText = "";
        });
});

const fetchWeatherDetails = async (data) => {
    const lat = data.features[0].geometry.coordinates[1];
    const lon = data.features[0].geometry.coordinates[0];
    await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`
    )
        .then((response) => response.json())
        .then((weatherData) => printData(weatherData));
};

const printData = (weatherData) => {
    const temperature = (weatherData.main.temp - 273.15).toFixed(2);
    const humidity = weatherData.main.humidity;
    const windSpeed = (weatherData.wind.speed * 3.6).toFixed(2);
    const weather = weatherData.weather[0].main;
    title.innerText = `Weather in ${cityValue}`;
    temperatureBox.innerText = `${temperature}°C`;
    humidityBox.innerText = `${humidity}%`;
    windBox.innerText = `${windSpeed} km/hour`;
    description.innerText = `${weather}`;
    changeIcon(weather);
};

window.addEventListener("load", async (evt) => {
    let requestOptions = {
        method: "GET",
    };

    await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${cityValue}&apiKey=${geometryAPIKey}`,
        requestOptions
    )
        .then((response) => response.json())
        .then((data) => fetchWeatherDetails(data))
        .catch((error) => console.log("error", error));
});

const changeIcon = (weather) => {
    descriptionImg.innerHTML = "";
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    if (weather === "Clear") {
        icon.classList.add("fa-sun");
        body.style.backgroundImage = "url('Clear_bg_img.jpg')";
    } else if (weather === "Clouds") {
        icon.classList.add("fa-cloud-sun");
        body.style.backgroundImage = "url('Cloudy_bg_img.jpg')";
    } else if (weather === "Rain") {
        icon.classList.add("fa-cloud-showers-heavy");
        body.style.backgroundImage = "url('Rainy_bg_img.jpg')";
    } else if (weather === "Snow") {
        icon.classList.add("fa-snowflake");
        body.style.backgroundImage = "url('Snowy_bg_img.jpg')";
    }
    descriptionImg.appendChild(icon);
};
