var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;


<<<<<<< HEAD
// variables
=======
// Variables
var suggestedCities = [];
>>>>>>> 9b0f6ae81472e51b576e13c51ac4c9322b83bec5
var weather;

// convert kelvin to celsius
var kelvinToCelsius = function(kelvin) {
    return (Math.round(kelvin - 273.15));
}

// display current weather
var displayCurrentWeather = function() {
    var current = weather.current;
    var iconUrl = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

    console.log(current.weather[0].main);

    console.log(current.temp);
    console.log(current.humidity);
    console.log(current.wind_speed);
    console.log(current.uvi);
    
    $(`#current-icon`).attr("src", iconUrl);
    $(`#current-description`).text(`${current.weather[0].main}`)
    
    $(`#temp`).text(`${current.temp}\u00B0`);
    $(`#humidity`).text(`Humidity: ${current.humidity}%`)
    $(`#wind_speed`).text(`Wind: ${current.wind_speed} m/s`);
    $(`#uvi`).text(`${current.uvi}`)
}

// gets the weather
// lat : latitude of city
// lon : longtitude of city
var getWeather = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
<<<<<<< HEAD
        .then(response => response.json())
        .then(data => {
           weather = data;
           displayWeather(data);
        });
}

// {city name},{state code},{country code}
var getCityList = function() {
    var cityName = $("#city").val();
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            cityList = data;
            displaySuggestedCityList();
        });
}


var getCityLonLan = function(location) {
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;
    
    fetch(geoCode)
    .then(response => response.json())
    .then(data => {
        getWeather(data[0].lat, data[0].lon);
    });
}

var parseSubmission = function() {
    var submittedCity = $("#city").val();
    submittedCity = submittedCity.replace(" ", "");
    getCityLonLan(submittedCity);
}

var displaySuggestedCityList = function() {
    var cityListEl = $("#city-options");

    // clear options list
    cityListEl.empty();
        
    for (var i = 0; i < cityList.length; i++) {
        var cityEl = $(`<option>`);
        
        // checks if state is undefined
        if (cityList[i].state) {
            // if all values are present, show state
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].state}, ${cityList[i].country}`);    
        }
        else {
            // if state is undefined shows only name, country
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].country}`);         
        }

        cityListEl.append(cityEl);
    }
}

var displayWeather = function(data) {
    // weather conditions (data.current.weather[0].descriptions)
    console.log("Description " + data.current.weather[0].description);
    // temperature
    console.log("Temp " + data.current.temp);
    // humidity
    console.log("Humidity " + data.current.humidity);
    // wind speed
    console.log("Wind " + data.current.wind_speed);
    // uv index
    console.log("UV " + data.current.uvi);
=======
    .then(response => response.json())
    .then(data => {
            weather = data;
            weather.current.temp = kelvinToCelsius(data.current.temp);
            displayCurrentWeather();
        });
    }
    
// gets the longitude and latitude of the city
var getCity = function() {
    var location = $("#city").val();
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            getWeather(data[0].lat, data[0].lon);
            savePrevCity(data[0].name, data[0].state, data[0].country);
            
            // clears input
            $("#city").val("");

            // clear options list
            $("#city-options").empty();          
        });
}

// returns string depending if state is undefined or not
var locationString = function(city, state, country) {
    // if state exists display [City, State, Country]
    if (state) {
        return `${city}, ${state}, ${country}`;
    }
    // else display [City, Country]
    else {
        return `${city}, ${country}`;
    }
>>>>>>> 9b0f6ae81472e51b576e13c51ac4c9322b83bec5
}

// displays a list of suggested cities depending on what is being inputed
var displaySuggestedCityList = function() {
    var suggestedCityListEl = $("#city-options");

    // clear options list
    suggestedCityListEl.empty();
        
    for (var i = 0; i < suggestedCities.length; i++) {
        // create suggestedCityEl
        var suggestedCityEl = $(`<option>`)
            .attr('value', locationString(suggestedCities[i].name,suggestedCities[i].state,suggestedCities[i].country));    

        suggestedCityListEl.append(suggestedCityEl);
    }
}

// pulls a list of cities depending on what is written in the input
var getCityList = function() {
var cityName = $("#city").val();
var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            suggestedCities = data;
            displaySuggestedCityList();
        });
}

// update previously searched cities
var savePrevCity = function(city, state, country) {  
    // generates proper string of [City, Country] or [City, State, Country]
    var prevCity = locationString(city, state, country);

    // create list item with city name
    var prevCityEl = $(`<li>`)
        .text(prevCity)
        .addClass(`prev-city`);
    
    // add created list item to previous searched cities
    var prevCityListEl = $(`.prev-cities`);
    prevCityListEl.append(prevCityEl);
}

// event listeners
$("#city").on(`keyup change`, getCityList);
$("#submit").on(`click`, getCity);

// getCityList();