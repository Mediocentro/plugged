var map;


function NodeControl(controlDiv, map, markers, fb_link) {
        
        var enableUI = document.createElement('div');
        enableUI.id = 'enableUI';
        enableUI.title = 'Click to enable a Node';
        controlDiv.appendChild(enableUI);

        var enableText = document.createElement('div');
        enableText.id = 'enableText';
        enableText.innerHTML = 'Enable Node';
        enableUI.appendChild(enableText);

        var disableUI = document.createElement('div');
        disableUI.id = 'disableUI';
        disableUI.title = 'Click to disable a Node';
        controlDiv.appendChild(disableUI);

        var disableText = document.createElement('div');
        disableText.id = 'disableText';
        disableText.innerHTML = 'Disable Node';
        disableUI.appendChild(disableText);

        enableUI.addEventListener('click', function() {
          var x = new google.maps.LatLng(29.95196888, 76.83568624);
          map.setCenter(x);
        });

        disableUI.addEventListener('click', function() {
          disableNode(map, ref_link, markers, childMarkers);
        });
      }

function initMap(){        
        //initializing the map
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: new google.maps.LatLng(29.95196888, 76.83568624),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true,
          mapTypeControl: false,
          streetViewControl: false

        });             

       var subs = []  

      var Substations = firebase.database().ref("/subs");
      var i = 0;
      var subMarker = {}
  
      Substations.once('value', function(snapshot){ 
      snapshot.forEach(function(data){
      subs[0] = data.key;
      subs[1] = data.child("GPS_lat").val();
      subs[2] = data.child("GPS_lon").val();
      subs[3] = data.child("ID").val(); 
            subMarker[data.key] = new google.maps.Marker({
        position: {lat: subs[1], lng: subs[2]},
        icon: 'http://maps.google.com/mapfiles/kml/paddle/S.png',
        map: map
      });
      subMarker[data.key].addListener('click', function(){
        map.setZoom(16);
        map.setCenter(subMarker[data.key].getPosition());
        loadSingleLineDiagram(data.key);
      });
  });
  });
        
        var infowindow = new google.maps.InfoWindow({
  content:"Hello World!"
  });

google.maps.event.addListener(subMarker, 'click', function() {
  infowindow.open(map,subMarker);
  });

}

function loadSingleLineDiagram(ref_value){

  ref_link = "/" + ref_value;

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
            url: 'https://maps.google.com/mapfiles/kml/paddle/grn-circle-lv.png'      
          },
          nodeOff:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle-lv.png'
          },
          nodeCritical:{
            url: 'https://maps.google.com/mapfiles/kml/paddle/red-circle-lv.png'      
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

        var Coords = firebase.database().ref(ref_link);
        
        var enabledLine = "#18A865";
        var disabledLine = "#181852";
        var criticalLine = "#ED1818";

        var marker = {};
        var markerKeys = [];
        var childMarkers = {};
        
        Coords.on('value', function(snapshot){

        
        //getting values from the firebase database and plotting simultaneously
        snapshot.forEach(function(data){
          var CoordTitle = '' + data.child("ID").val();
          markerKeys.push(CoordTitle);
          var CoordLat = data.child("GPS_lat").val();
          var CoordLon = data.child("GPS_lon").val();
          var CoordCon = data.child("con").val();
          var CoordType = data.child("type").val();
          var CoordParent = '' + data.child("parentID").val();
          
          if(childMarkers[CoordParent]!=undefined){
            childMarkers[CoordParent].push(CoordTitle);
          }
          else{
            childMarkers[CoordParent] = [];
            childMarkers[CoordParent].push(CoordTitle);
          }

          if(CoordType == "C"){
          var CoordIcon = consumerIcon[CoordCon];
          var z = 3;}
          else if(CoordType == "T"){
            var CoordIcon = transformerIcon[CoordCon];
            var z = 4;
          }
          else{
                  var CoordIcon = image.substation;
                  var z = 5;}

          if(marker[CoordTitle] === undefined){
          marker[CoordTitle] = new google.maps.Marker({
            position: {lat: CoordLat, lng: CoordLon},
            map: map,
            icon: CoordIcon,
            title: '' + CoordTitle,
            zIndex: z,
            con: CoordCon, //Tells us whether the condition is active,inactive or theft
            parent: CoordParent,
            flag: 0 // Flag for whether the marker has already been used for polylines
          });}

          else if(marker[CoordTitle].con != CoordCon){
            marker[CoordTitle].con = CoordCon;
            marker[CoordTitle].setIcon(CoordIcon);
            marker[CoordTitle].flag = 0;
          }

        if(CoordCon === 2){
            marker[CoordTitle].setAnimation(google.maps.Animation.BOUNCE);
          }
        else{
                marker[CoordTitle].setAnimation(null);
        }
        });

        for (var i = 0; i<markerKeys.length; i++){
          if(marker[markerKeys[i]].flag == 1){
            continue;
          }
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
          marker[markerKeys[i]].flag = 1;
          poly.setMap(map);
        }
      });

        console.log(childMarkers);
        var nodeControlDiv = document.createElement('div');
        var nodeControl = new NodeControl(nodeControlDiv, map, marker, ref_link);

        nodeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(nodeControlDiv);
}

function disableNode(map, fb_link, markers){
  window.alert("Please select the nodes to disable. \nAfter selecting press right click.");
  var quit = map.addListener('rightclick', exitDisable(markers));
  for (var i in markers) {
    markers[i].addListener('click', disable(markers[i].title, fb_link));
  } 
}

function exitDisable(markers){
    for (var i in markers) {
      google.maps.event.clearInstanceListener(markers[i]);
    }
    console.log("Event tracked successfuly");
    google.maps.event.removeListener(quit);
}

function disable(ID, link){
  disableCoords = firebase.database().ref(link);
  disableCoords.once('value', function(snapshot){
     snapshot.forEach(function(data){
      var tempID = data.child("ID").val();
      var l = link + '/' + data.key;
      if(tempID === ID){
        firebase.database.ref().child(l).update({con: 0});
      }
    });
  });
}
