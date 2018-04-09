
function initMap(){        
        //initializing the map
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: new google.maps.LatLng(29.9695, 76.8783),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true
        });
         
       
        //The marker image that would be used in this case (meters) 
        var image = {
           url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
       
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };  

        
        

        var firebaseCoords = firebase.database().ref("/meters");
        
        firebaseCoords.on('value', function(snapshot){
        
        var j = 0;
        
        //getting values from the firebase database and plotting simultaneously
        snapshot.forEach(function(data){
          var CoordTitle = '' + data.child("meterID").val();
          var CoordLat = data.child("GPS_lat").val();
          var CoordLon = data.child("GPS_lon").val();
          var marker = new google.maps.Marker({
            position: {lat: CoordLat, lng: CoordLon},
            map: map,
            icon: image,
            shape: shape,
            title: CoordTitle,
            zIndex: j+1
          });  
        j++;});
      });     
}
