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
            url: 'https://maps.google.com/mapfiles/kml/paddle/grn-circle.png',
            scaledSize: new google.maps.Size(32,32)
          },
          meterOff:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle.png',
            scaledSize: new google.maps.Size(32,32)
            },
          meterCritical:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png',
            scaledSize: new google.maps.Size(32,32)
          },
          nodeOn:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/grn-blank-lv.png'      
          },
          nodeOff:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/blu-blank-lv.png'
          },
          nodeCritical:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/red-blank-lv.png'      
          }
       }; 
        
       
        var firebaseCoords = firebase.database().ref("/meters");
        
        firebaseCoords.on('value', function(snapshot){
        
//         var j = 0;
        
        //getting values from the firebase database and plotting simultaneously
        snapshot.forEach(function(data){
          var CoordTitle = data.child("meterID").val();
          var CoordLat = data.child("GPS_lat").val();
          var CoordLon = data.child("GPS_lon").val();
          var CoordCon = data.child("con").val();
          if(CoordCon === 1){
            var CoordIcon = image.meterOn;
          }
          else if(CoordCon === 0){
            var CoordIcon = image.meterOff;
          }
          else{
            var CoordIcon = image.meterCritical;
          }

          var marker = new google.maps.Marker({
            position: {lat: CoordLat, lng: CoordLon},
            map: map,
            icon: CoordIcon,
            title: '' + CoordTitle,
            zIndex: 1
          });
        if(CoordCon === 2){
            marker.setAnimation(google.maps.Animation.BOUNCE);
          } 
//         j++;
        });
      });     
}
