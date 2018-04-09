function initMap(){        
        //initializing the map
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: new google.maps.LatLng(29.9695, 76.8783),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true,
          mapTypeControl: false,
          streetViewControl: false

        });
         
       
       var image = {
          meterOn:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-circle.png'
          },
          meterOff:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
          },
          meterCritical:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png'
          },
          nodeOn:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png'
          },
          nodeOff:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-blank-lv.png'
          },
          nodeCritical:{
            icon: 'http://maps.google.com/mapfiles/kml/paddle/red-blank-lv.png'
          }
       }; 





        // //The marker image that would be used in this case (meters) 
        // var image = {
        //    url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        //   // This marker is 20 pixels wide by 32 pixels high.
        //   size: new google.maps.Size(20, 32),
        //   // The origin for this image is (0, 0).
        //   origin: new google.maps.Point(0, 0),
        //   // The anchor for this image is the base of the flagpole at (0, 32).
        //   anchor: new google.maps.Point(0, 32)
        // };
       
        // var shape = {
        //   coords: [1, 1, 1, 20, 18, 20, 18, 1],
        //   type: 'poly'
        // };  

        
        

        var firebaseCoords = firebase.database().ref("/meters");
        
        firebaseCoords.on('value', function(snapshot){
        
        var j = 0;
        
        //getting values from the firebase database and plotting simultaneously
        snapshot.forEach(function(data){
          var CoordTitle = data.child("meterID").val();
          var CoordLat = data.child("GPS_lat").val();
          var CoordLon = data.child("GPS_lon").val();
          var CoordCon = data.child("con").val();
          if(CoordCon === 1){
            var CoordIcon = image['meterOn'].icon;
          }
          else if(CoordCon === 2){
            var CoordIcon = image['meterOff'].icon;
          }
          else{
            var CoordIcon = image['meterCritical'].icon;
          }

          var marker = new google.maps.Marker({
            position: {lat: CoordLat, lng: CoordLon},
            map: map,
            icon: CoordIcon,
            title: CoordTitle,
            zIndex: j+1
          });
        if(CoordCon === 2){
            marker.setAnimation(google.maps.Animation.BOUNCE);
          } 
        j++;});
      });     
}
