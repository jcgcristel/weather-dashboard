var cityName = "Brampton";
var limit = 5;
var lat = 33.44;
var lon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;

var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIkey}`; //&exclude=${part}

var getWeather = function() {
    fetch(`${apiURL}`)
        .then(response => response.json())
        .then(data => {
           console.log(data);
        });
}

var getCityList = function() {
    var geoCode = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIkey}`;

    fetch(geoCode)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

getCityList();
getWeather();