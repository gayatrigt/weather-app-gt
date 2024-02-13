async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "609ec20121631977b37a3f64b2523a62";

    updateBackgroundImage(searchInput);

    if (searchInput == "") {
        weatherDataSection.innerHTML = `
        <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    async function getLonAndLat() {
        const countryCode = 1
        geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }
        const data = await response.json();

        if (data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
        <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
            return;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();
        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `
    }
    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);
}

async function updateBackgroundImage(cityName) {
    const pexelsApiKey = 'htUZ3uLYjRuK7S92ahCjdNR4vzWB2VEIAJ6VKkOx7zVZtJPV3eSFLXdy';
    const url = `https://api.pexels.com/v1/search?query=${cityName}&per_page=5`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: pexelsApiKey
            }
        });
        const data = await response.json();
        if (data.photos.length > 0) {
            const index = Math.floor(Math.random() * 5);
            const imageUrl = data.photos[index].src.original;
            document.body.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            // If no image found, use a default image
            document.body.style.backgroundImage = "url('./nyc-dumbo.jpg')";
        }
    } catch (error) {
        console.error('Failed to fetch image from Pexels:', error);
        // Optionally set a default background image in case of error
        document.body.style.backgroundImage = "url('./nyc-dumbo.jpg')";
    }
}