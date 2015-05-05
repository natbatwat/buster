$(document).ready(function(){
  // Declaring variables
  var map;
  var mainMarker; /*marker that centers the map*/
  var mainCoordinates = {}; /*coords of mainMarker*/
  var searchedMarkers = []; /*a log of all previously & currently searched markers*/
  var busData;

  // Sets All Markers in Array on Map
  // function setAllMap(map) {
  //   console.log('set map')
  //   for (var i = 0; i < markers.length; i++) {
  //     markers[i].setMap(map);
  //   }
  // }

  // Show Markers 
  // function showMarkers() {
  //   console.log('markers shown');
  //   setAllMap(map);
  // }
  // Clear Markers
  // function clearMarkers(){
  //   console.log('markers cleared')
  //   setAllMap(null);
  // }


  // var clearInput = function(){
  //   $('#search-input').click(function(){
  //     $('#search-input').val('');
  //   })
  // }

  // GET Request for Bus Stops within range
  var getBusStops = function(lat, long){
    console.log('getBusStops()')
    console.log(lat)
    console.log(long)
    var southWestCoord = String(lat + 0.003) + ',' + String(long + 0.003)
    var northEastCoord = String(lat - 0.003) + ',' + String(long - 0.003)
    console.log(northEastCoord)
    console.log(southWestCoord)
    $.ajax({
      url: 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=' + northEastCoord + '&southWest=' + southWestCoord,
      data: {format: 'json'},
      dataType: 'jsonp',
      type: 'GET',
      success: function(data){
        busData = data.markers;
        console.log(data);
        // $.each(busData, function(index, value){
        //   busStopMarkers[value.id] = {
        //     lat: value.lat,
        //     lng: value.lng
        //   }
        // })
      }
    })
  }

  // GMaps Styles
  var styles = [
    {"featureType":"administrative.country", "elementType":"labels.text.fill", "stylers":[{"color":"#ff5a5f"}]},
    {"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},
    {"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},
    {"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"on"},{"saturation":"0"},{"lightness":"0"}]},
    {"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"lightness":"-15"},{"color":"#ff5a5f"}]},
    {"featureType":"administrative.locality","elementType":"labels.text.stroke","stylers":[{"lightness":"55"},{"gamma":"0.33"},{"weight":"5.50"},{"color":"#ffffff"},{"saturation":"-13"},{"visibility":"on"}]},
    {"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"on"}]},
    {"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#ff5a5f"}]},
    {"featureType":"administrative.neighborhood","elementType":"labels.text.stroke","stylers":[{"weight":"4.70"},{"lightness":"40"},{"color":"#ffffff"}]},
    {"featureType":"landscape","elementType":"geometry.fill","stylers":[{"lightness":"38"},{"color":"#f5f6f5"}]},
    {"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"lightness":"-2"},{"color":"#ecedec"}]},
    {"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#ff5a5f"}]},
    {"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"weight":"5.12"},{"gamma":"1.52"},{"lightness":"100"},{"color":"#ffffff"}]},
    {"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},
    {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bce4c1"}]},
    {"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"on"}]},
    {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"27"}]},
    {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"0"},{"weight":"0.26"}]},
    {"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"on"},{"saturation":"20"}]},
    {"featureType":"road.highway","elementType":"labels.icon","stylers":[{"gamma":"1.42"}]},
    {"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"lightness":"-16"},{"saturation":"67"}]},
    {"featureType":"road.highway.controlled_access","elementType":"labels.icon","stylers":[{"visibility":"on"}]},
    {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"20"}]},
    {"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"lightness":"28"}]},
    {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
    {"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"lightness":"28"}]},
    {"featureType":"transit.station.airport","elementType":"labels.text.fill","stylers":[{"color":"#7b0051"}]},
    {"featureType":"transit.station.bus","elementType":"labels.text.fill","stylers":[{"color":"#7b0051"}]},
    {"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#7b0051"}]},
    {"featureType":"water","elementType":"geometry.fill","stylers":[{"saturation":"-30"},{"lightness":"18"},{"color":"#b2f1ec"}]}
  ]

  // GMaps Initializer 
  function initialize() {
    console.log('initialize()');

    var geocoder = new google.maps.Geocoder();
    var centerLocation = new google.maps.LatLng(51.5008, -0.1090) /*London*/
    var mapOptions = {
      center: centerLocation,
      zoom: 12,
      styles: styles,
      backgroundColor: "#FFFC78",
      disableDefaultUI: true,
      streetViewControl: true
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var input = (document.getElementById('search-input'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    var mainInfowindow = new google.maps.InfoWindow();
  
    google.maps.event.addListener(autocomplete, 'place_changed', function(){
      // Resetting mainMarker
      if (mainMarker) { mainMarker.setVisible(false); }
      mainInfowindow.close();
      mainCoordinates = {};
      mainMarker = '';

      var place = autocomplete.getPlace();
      console.log(place)
      // Saving coordinates of mainMarker in mainCoordinates 
      mainCoordinates["latCoord"] = place.geometry.location.A
      mainCoordinates["longCoord"] = place.geometry.location.F

      getBusStops(mainCoordinates.latCoord, mainCoordinates.longCoord);

      // Creation/ Reassignment of mainMarker
      mainMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        title: place.geometry.formatted_address
      });


      if (!place.geometry) {
        window.alert("Oopsie dasiy! Please make sure you typed something!");
        return;
      }
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      mainMarker.setPosition(place.geometry.location);
      mainMarker.setVisible(true);
      searchedMarkers.push(mainMarker);
      console.log(searchedMarkers);
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      mainInfowindow.setContent('<div><strong>' + place.name + '</strong><br>' + '<i>' + place.formatted_address + '</i><br>' + address);
      mainInfowindow.open(map, mainMarker);
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
  
})