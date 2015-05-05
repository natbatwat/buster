##Hello Digitas! 

### Sudo Code
```html
# think of cool name for bus app
# try getting some data from API
# integrate GoogleMaps API 
# add Places autocomplete searchbar 
# bus departures dialog box
```


### Things I've Learned Along The Way!/ Issues 
- Had problems creating a click event listener to toggle info window on marker click within a closure loop:
```javascript
function addBusMarkers() {
    for (var i = 0; i < busData.length; i++) {
      var busLatLng = new google.maps.LatLng(busData[i].lat,busData[i].lng);
      var newBusMarker = new google.maps.Marker({
        position: busLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: busData[i].id
      });
      busMarkers.push(newBusMarker);
      var busInfoWindow = new google.maps.InfoWindow({maxWidth: 100});
      busInfoWindow.setContent('To: ' + busData[i].towards);
      (function(z){
        google.maps.event.addListener(newBusMarker, 'click', function(){
          busInfoWindow.open(map,newBusMarker);
        })
      })(i);
    }
  }
``` 
