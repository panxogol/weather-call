const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const apiKey = "310f09b0615ade57a16a692cfc7dc490"




// pages
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    var cityName = req.body.cityName;
    var city = cityName.replace(/\s+/g, "-").toLowerCase();
    var geocodingApiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
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
                        var temp = weatherData.main.temp;
                        var description = weatherData.weather[0].description
                        console.log(description);
                        console.log(weatherData);
                        var iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                        console.log(iconUrl);
                        var iconHtml = `<img src="${iconUrl}" style="width: 2.5rem;"></img>`;
                        res.set("charset", "utf-8");
                        res.write(`<h2>The weather is currently ${description}: ${iconHtml}.</h2>`);
                        res.write(`<h1>The temperature in ${cityData[0].name}, ${cityData[0].state}, ${cityData[0].country} is 
                        ${temp} degree celcius.</h1>`);
                        res.send();
                    });
                });
            }, 200);
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
