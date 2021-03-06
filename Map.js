function initMap(){        
        //initializing the map
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: new google.maps.LatLng(29.9473347, 76.8154516),
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
          },
          substation:{
            url: 'http://maps.google.com/mapfiles/kml/paddle/S.png'
          }
       }; 
        
       var consumerIcon = [image.meterOff,
                            image.meterOn, 
                            image.meterCritical];

        var transformerIcon = [image.nodeOff,
                               image.nodeOn, 
                               image.nodeCritical];

        var Coords = firebase.database().ref("/sub1");
        
        var enabledLine = "#18A865";
        var disabledLine = "#181852";
        var criticalLine = "#ED1818";

        var marker = {};
        var markerKeys = [];

        
        Coords.on('value', function(snapshot){
        
//         var j = 0;
        
        //getting values from the firebase database and plotting simultaneously
        snapshot.forEach(function(data){
          var CoordTitle = '' + data.child("ID").val();
          markerKeys.push(CoordTitle);
          var CoordLat = data.child("GPS_lat").val();
          var CoordLon = data.child("GPS_lon").val();
          var CoordCon = data.child("con").val();
          var CoordType = data.child("type").val();
          var CoordParent = '' + data.child("parentID").val();
          
          if(CoordType == "C"){
          var CoordIcon = consumerIcon[CoordCon];}
          else if(CoordType == "T"){
            var CoordIcon = transformerIcon[CoordCon];
          }
          else{
                  var CoordIcon = image.substation;}

          marker[CoordTitle] = new google.maps.Marker({
            position: {lat: CoordLat, lng: CoordLon},
            map: map,
            icon: CoordIcon,
            title: '' + CoordTitle,
            zIndex: 3,
            con: CoordCon,
            parent: CoordParent
          });
        if(CoordCon === 2){
            marker[CoordTitle].setAnimation(google.maps.Animation.BOUNCE);
          } 
        });
        for (var i = 0; i<markerKeys.length; i++){
          if(marker[markerKeys[i]].parent == 0){
                continue;}
          var set = marker[markerKeys[i]].con == 0 ? disabledLine : enabledLine;
          if(marker[markerKeys[i]].con == 2){
                  set = criticalLine;}
          var poly = new google.maps.Polyline({
            path: [marker[markerKeys[i]].getPosition(), marker[marker[markerKeys[i]].parent].getPosition()],
            strokeColor: set,
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          poly.setMap(map);
        }
      });
}
