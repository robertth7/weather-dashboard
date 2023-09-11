var cityContainerEl = document.querySelector("#city-container")
var citySearchText = document.querySelector("#city-search");
var listContainerEl = document.querySelector("#list-container");
var forecastText = document.querySelector("#forecast");
// no use for forecastText atm

var getWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=a301cc194d0eca9535e67379322a796f&units=imperial";
    // console.log(apiUrl);
    
    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            // the data in response is converted to JSON, it will be sent from getWeather() to displayCurrentWeather() with the code below. 
            displayCurrentWeather(data, city);
            forecast(data, city);
            console.log(data);
        });
    })
    .catch(function(error){
        alert("Unable to connect to openweather API");
    });
};

var cityFormEl = document.querySelector("#city-form");
var nameInputEl = document.querySelector("#city");

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    // get value from input element and storing into a variable
    var cityName = nameInputEl.value.trim();

    // setting searched city into localStorage
    localStorage.setItem("city", cityName);
    console.log(localStorage);
    
    // if there is a value to cityName, we pass that data to getWeather() as an argument. then we clear out the <input> element's value.
    if (cityName) {
        getWeather(cityName);
        nameInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};

// create new function. this function will accept both the array of data and the term we searched for as parameters. 
var displayCurrentWeather = function(data, citySearch) {
    console.log(data.weather[0].icon);
    // console.log(citySearch);

    // make dt readable/understandable
    var date = new Date(data.dt * 1000).toLocaleDateString("en-US");
    console.log(date);
    
    // clear old content
    cityContainerEl.textContent = "";
    citySearchText.textContent = citySearch + " (" + date + ")";

    // making the data into an array
    var currentData = {
        Temp : data.main.temp,
        Feels: data.main.feels_like,
        Wind: data.wind.speed,
        Humidity: data.main.humidity,
        Lon: data.coord.lon,
        Lat: data.coord.lat
    };
    console.log(currentData);

    // loop over data array from currentData
    for (var key in currentData) {
        console.log(key, currentData[key]);

        // create a container for each list item
        var listEl = document.createElement("div");
        listEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold name and value of each item
        var nameEl = document.createElement("span");
        nameEl.textContent = key + ": " + currentData[key];

        // append to container listEl
        listEl.appendChild(nameEl);

        // append container to the dom
        cityContainerEl.appendChild(listEl);
    }
};

// creating a 5 day forecast function. the data in function(data) are values from getWeather to use coordinates
var forecast = function(data) {
    // console.log(data.coord.lon);
    var lat = data.coord.lat
    var lon = data.coord.lon

    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&cnt=5&appid=a301cc194d0eca9535e67379322a796f&units=imperial";
    // console.log(apiUrl);
    fetch(apiUrl).then(function(response){
        response.json().then(function(list){
            // we are going to send list function to displayForecast
            displayForecast(list);
            console.log(list.cnt);
        });
        // console.log(data);
    })
    .catch(function(error){
        alert("Unable to connect to openweather api.");
    });
};

var displayForecast = function(list) {

    // this will clear out the previously searched card. doing so will prevent the previous from staying
    listContainerEl.textContent = "";

    // loop over data
    for (var i = 0; i < list.list.length; i++) {
        // console below lets me know which array we are on
        console.log(i);

        // create a variable that will make date understandable/readable, and at the same time iterating through the array
        var listName = list.list[i].dt;
        listName = new Date(listName * 1000).toLocaleDateString("en-US");
        console.log(listName);

        var forecastData = {
            Date: listName,
            Temp: list.list[i].main.temp,
            Wind: list.list[i].wind.speed,
            Humidity: list.list[i].main.humidity
        };
        console.log(forecastData);

        // create a div with classes
        var listEl = document.createElement("div");
        listEl.classList = "card text-white bg-primary mb-2";

        for (var key in forecastData) {
            console.log(key, forecastData[key]);
            
            // create a div with classes
            // var listEl = document.createElement("div");
            // listEl.classList = "list-item flex-row justify-space-between";
            
            // create a span element and add values to display on page
            var nameEl = document.createElement("span");
            // nameEl.classList = "list-item flex-row justify-space-between align-center";
            nameEl.textContent = key + ": " + forecastData[key] + " ";

            // append nameEl to div listEl
            listEl.appendChild(nameEl);
            
            // append listEl to listContainerEl 
            listContainerEl.appendChild(listEl);
        }
    }
};


cityFormEl.addEventListener("submit", formSubmitHandler);