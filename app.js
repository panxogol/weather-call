const { response } = require("express");
const express = require("express");
const https = require("https");

const app = express();
const port = 3000;

const apiKey = "310f09b0615ade57a16a692cfc7dc490"

var cityName = "Santiago de Chile";
var city = cityName.replace(/\s+/g, "-").toLowerCase();

var geocodingApiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`


// pages
app.get("/", (req, res) => {
    https.get(geocodingApiCall, (response) => {
        console.log(response.statusCode);
        response.on("data", (data) => {
            const cityData = JSON.parse(data);
            var lat = cityData[0].lat;
            var lon = cityData[0].lon;
            console.log(cityData[0]);
            console.log(`lat: ${lat} lon: ${lon}`);
            var weatherUrl = weatherApiCall(lat, lon, apiKey);
            setTimeout(() => {
                https.get(weatherUrl, (response2) => {
                    console.log(response2.statusCode);
                    response2.on("data", (data2) => {
                        const weatherData = JSON.parse(data2);
                        console.log(weatherData.weather[0].description);
                    });
                });
            }, 1000);
            res.send("Server up and running.");
        });
    });
});


app.listen(port, () => {
    console.log(`Server is runing on http://localhost:${port}`);
});


//  FUNCTIONS
function weatherApiCall(lat, lon, key) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
};
