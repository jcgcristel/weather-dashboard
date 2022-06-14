var limit = 5;
var testlat = 33.44;
var testlon = -90.04;
var APIkey = `ec45c559fdda3ac235725be56933003e`;


var getWeather = function(lat, lon) {
    var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${testlat}&lon=${testlon}&appid=${APIkey}`; //&exclude=${part}
    
    fetch(`${apiURL}`)
        .then(response => response.json())
        .then(data => {
           console.log(data);
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
            getSuggestedCityList();
        });
}

var getSuggestedCityList = function() {
    var cityListEl = $("#city-options");

    // clear options list
    cityListEl.empty();
        
    for (var i = 0; i < cityList.length; i++) {
        var cityEl = $(`<option>`);
        
        // checks if state is undefined
        if (cityList[i].state) {
            // if all values are present, show state
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].country}, ${cityList[i].state}`);    
        }
        else {
            // if state is undefined shows only name, country
            cityEl.attr("value", `${cityList[i].name}, ${cityList[i].country}`);         
        }

        cityListEl.append(cityEl);
    }
}

var parseSubmission = function() {
    var submittedCity = $("#city").val();
    submittedCity = submittedCity.replace(" ", "");
    console.log(submittedCity);    
}

$("#city").on(`keyup change`, getCityList);
$("#submit").on(`click`, parseSubmission);

// getCityList();