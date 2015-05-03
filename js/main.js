$(document).ready(function(){
  var northEastCoord = ''
  var southWestCoord = ''
  $.ajax({
    url: 'http://digitaslbi-id-test.herokuapp.com/bus-stops?northEast=' + northEastCoord + '&southWest=' + southWestCoord,
    data: { format: 'json' },
    dataType: 'jsonp',
    type: 'GET',
    success: function(data){
      console.log(data.markers)
    }
  })
  .done(function(data){
  })
})