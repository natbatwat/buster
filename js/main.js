$(document).ready(function(){
  // GMaps Styles
  var styles = [
    {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#f35c19"},{"weight":"0.01"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#f7e5d9"},{"lightness":"0"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"weight":"0.64"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"on"},{"weight":"1"},{"lightness":"63"},{"color":"#fff5f0"}]},{"featureType":"poi","elementType":"labels","stylers":[{"color":"#ffad00"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#ffc3a0"},{"lightness":"1"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#fd7539"},{"weight":"0.62"},{"lightness":"53"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#4e5757"},{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"weight":"0.01"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"},{"weight":"0.01"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#c6e3ec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#cde1f0"},{"lightness":"-3"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"weight":"0.25"},{"color":"#888d8d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"weight":"0.80"}]
    }
  ]
  // Geocoder
  function codeAddress() {
    console.log('codeAddress function executed')
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      console.log(results)
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Goshdarnit! We could not find your coordinates because: ' + status);
      }
    });
  }
  
  // GMaps Initializer 
  function initialize() {
    console.log('map is initialized');
    var geocoder = new google.maps.Geocoder();
    var centerLocation = new google.maps.LatLng(51.5008, 0.1247) /*London*/
    var mapOptions = {
      center: centerLocation,
      zoom: 11,
      styles: styles,
      backgroundColor: "#FFD000",
      disableDefaultUI: true,
      streetViewControl: true
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var input = (document.getElementById('search-input'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      anchorPoint: new google.maps.Point(0, -29)
    });
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
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
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
      codeAddress();
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);

})