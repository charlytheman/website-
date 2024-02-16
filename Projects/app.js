// function initMap(){

//     // Map option

//     var options = {
//         center: {lat: 38.3460 , lng:-0.4907 },
//         zoom: 10
//     }

//     //New Map
//     map = new google.maps.Map(document.getElementById("map"),options)

//     //listen for click on map location

//     google.maps.event.addListener(map, "click", (event) => {
//         //add Marker
//         addMarker({location:event.latLng});
//     })



//     //Marker
// /*
//     const marker = new google.maps.Marker({
//     position:{lat: 37.9922, lng: -1.1307},
//     map:map,
//     icon:"https://img.icons8.com/nolan/2x/marker.png"
//     });
//     //InfoWindow
//     const detailWindow = new google.maps.InfoWindow({
//         content: `<h2>Murcia City</h2>`
//     });
//     marker.addListener("mouseover", () =>{
//         detailWindow.open(map, marker);
//     })
//     */

//     //Add Markers to Array

//     let MarkerArray = [ {location:{lat: 37.9922, lng: -1.1307}, 
//         imageIcon: "https://img.icons8.com/nolan/2x/marker.png", 
//         content: `<h2>Murcia City</h2>`},

//         {location:{lat: 39.4699, lng: -0.3763}},

//         {location:{lat: 38.5411, lng: -0.1225},content: `<h2>Benidorm City</h2>` }



//     ]

//     // loop through marker
//     for (let i = 0; i < MarkerArray.length; i++){
//         addMarker(MarkerArray[i]);

//     }

//     // Add Marker

//     function addMarker(property){

//         const marker = new google.maps.Marker({
//             position:property.location,
//             map:map,
//             //icon: property.imageIcon
//             });

//             // Check for custom Icon

//             if(property.imageIcon){
//                 // set image icon
//                 marker.setIcon(property.imageIcon)
//             }

//             if(property.content){

//             const detailWindow = new google.maps.InfoWindow({
//             content: property.content
//     });
    
//     marker.addListener("mouseover", () =>{
//         detailWindow.open(map, marker);
//     })
// }

         



//     }

    



// }//



// Weather api 
const app = {
  init: () => {
    document
      .getElementById('btnGet')
      .addEventListener('click', app.fetchWeather);
    document
      .getElementById('btnCurrent')
      .addEventListener('click', app.getLocation);
  },
  fetchWeather: (ev) => {
    //use the values from latitude and longitude to fetch the weather
    let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let key = '880a9d76d7401c387c31c512a5594bcc';
    let lang = 'en';
    let units = 'metric';
    let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
    //fetch the weather
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        app.showWeather(data);
      })
      .catch(console.err);
  },
  getLocation: (ev) => {
    let opts = {
      enableHighAccuracy: true,
      timeout: 1000 * 10, //10 seconds
      maximumAge: 1000 * 60 * 5, //5 minutes
    };
    navigator.geolocation.getCurrentPosition(app.ftw, app.wtf, opts);
  },
  ftw: (position) => {
    //got position
    document.getElementById('latitude').value =
      position.coords.latitude.toFixed(2);
    document.getElementById('longitude').value =
      position.coords.longitude.toFixed(2);
  },
  wtf: (err) => {
    //geolocation failed
    console.error(err);
  },
  showWeather: (resp) => {
    console.log(resp);
    let row = document.querySelector('.weather.row');
    //clear out the old weather and add the new
    // row.innerHTML = '';
    row.innerHTML = resp.daily
      .map((day, idx) => {
        if (idx <= 2) {
          let dt = new Date(day.dt * 1000); //timestamp * 1000
          let sr = new Date(day.sunrise * 1000).toTimeString();
          let ss = new Date(day.sunset * 1000).toTimeString();
          return `<div class="col">
              <div class="card">
              <h5 class="card-title p-2">${dt.toDateString()}</h5>
                <img
                  src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }@4x.png"
                  class="card-img-top"
                  alt="${day.weather[0].description}"
                />
                <div class="card-body">
                  <h3 class="card-title">${day.weather[0].main}</h3>
                  <p class="card-text">High ${day.temp.max}&deg;C Low ${
            day.temp.min
          }&deg;C</p>
                  <p class="card-text">High Feels like ${
                    day.feels_like.day
                  }&deg;C</p>
                  <p class="card-text">Pressure ${day.pressure}mb</p>
                  <p class="card-text">Humidity ${day.humidity}%</p>
                  <p class="card-text">UV Index ${day.uvi}</p>
                  <p class="card-text">Precipitation ${day.pop * 100}%</p>
                  <p class="card-text">Dewpoint ${day.dew_point}</p>
                  <p class="card-text">Wind ${day.wind_speed}m/s, ${
            day.wind_deg
          }&deg;</p>
                  <p class="card-text">Sunrise ${sr}</p>
                  <p class="card-text">Sunset ${ss}</p>
                </div>
              </div>
            </div>
          </div>`;
        }
      })
      .join(' ');
  },
};

app.init();