var map;

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
      subs[3] = '' + data.child("ID").val(); 
            subMarker[data.key] = new google.maps.Marker({
        position: {lat: subs[1], lng: subs[2]},
        icon: 'http://maps.google.com/mapfiles/kml/paddle/S.png',
        zIndex: 2,
        Title: subs[3],
                    name: subs[3],
        map: map
      });
      var listener = subMarker[data.key].addListener('click', function(){
        map.setZoom(16);
        map.setCenter(subMarker[data.key].getPosition());
        loadSingleLineDiagram(data.key, subMarker[data.key].name);  
      });
              
  });
  });
}

function loadSingleLineDiagram(ref_value, subID){ 
   var infoWindow = new google.maps.InfoWindow();
console.log(subID);
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

        var staff = firebase.database().ref("/staff");
        
        var staffData = {}; 
        var staffKeys = [];
        
        staff.once('value', function(snapshot){
                snapshot.forEach(function(data){
                        if(('' + data.child("SID").val()) === subID){
                                var ID = '' + data.child("ID").val();
                                staffData[ID] = {}
                                staffData[ID].boss = data.child("BossID").val();
                                staffData[ID].tID = data.child("TID").val();
                                staffData[ID].name = data.child("Name").val();
                                staffData[ID].sID = data.child("SID").val();
                                staffKeys.push(ID);
                        }
                });
        });
        
        var uploadvals = {};
        var sub10Data = firebase.database().ref("/10");
                sub10Data.on('value', function(snapshot){
                snapshot.forEach(function(data){
                        uploadvals[data.key] = '' + data.val();
                  });
             });   
       
        
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
          
          var conditionText = CoordCon == 0? 'Disabled' : 'OK';
          if (CoordCon == 2){
            conditionText = 'Stealing';
          }
          var typeText;
          if(CoordType == 'T'){
            typeText = 'Transformer';
          }
          else if (CoordType == 'C'){
            typeText = 'Customer';
          }
          else if(CoordType == 'S'){
            typeText = 'Substation';
          }
          
          if(CoordTitle != '10'){      
          var infoContent = '<h2>Info</h2> <hr/> ID: ' + CoordTitle + '<br />Type: ' + typeText + '<br />Status: ' + conditionText;}
                
          else{
                  var infoContent = '<h2>Info</h2> <hr/> ID: ' + CoordTitle + '<br />Type: ' + typeText + '<br />Status: ' + conditionText + '<table style = "width: 50%">' + '<tr><th></th>' + '<th></th><th></th><th></th><th></th><th></th><th></th></tr><tr><td></td><td></td><td></td><td>Freq:</td><td>' + uploadvals['f'] + '</td><td></td><td></td><td></td></tr><tr><td></td><td>V<sub>a</sub>:</td><td>'+ uploadvals['Va'] + '</td><td>V<sub>b</sub>:</td><td>' + uploadvals['Vb'] + '</td><td>V<sub>c</sub>:</td><td>' + uploadvals['Vc'] + '</td><td></td></tr><tr><td>I<sub>a</sub>:</td><td>' + uploadvals['Ia'] + '</td><td>I<sub>b</sub>:</td><td>' + uploadvals['Ib'] + '</td><td>I<sub>c</sub>:</td><td>' + uploadvals['Ic'] + '</td><td>I<sub>n</sub>:</td><td>' + uploadvals['In'] + '</td></tr><tr><td></td><td>P<sub>a</sub>:</td><td>' + uploadvals['Pa'] + '</td><td>P<sub>b</sub>:</td><td>' +uploadvals['Pb'] + '</td><td>P<sub>c</sub>:</td><td>' +uploadvals['Pc'] + '</td><td></td></tr><tr><td></td><td>Q<sub>a</sub>:</td><td>' + uploadvals['Qa'] + '</td><td>Q<sub>b</sub>:</td><td>'+ uploadvals['Qb'] + '</td><td>Q<sub>c</sub>:</td><td>'+uploadvals['Qc'] +'</td><td></td></tr><tr><td></td><td>S<sub></sub>:</td><td>'+uploadvals['Sa']+'</td><td>S<sub>b</sub>:</td><td>'+ uploadvals['Sb']+'</td><td>S<sub>c</sub>:</td><td>'+ uploadvals['Sc']+'</td><td></td></tr><tr><td>pf<sub>a</sub>:</td><td>'+ uploadvals['pfa']+'</td><td>pf<sub>b</sub>:</td><td>'+ uploadvals['pfb']+'</td><td>pf<sub>c</sub>:</td><td>' + uploadvals['pfc'] + '</td><td>pf<sub>t</sub>:</td><td>'+ uploadvals['pft'] +'</td></tr><tr><td></td><td></td><td>Ph.Di.<sub>AB</sub>:</td><td>' + uploadvals['phab'] + '</td><td>Ph.Di.<sub>AC</sub>:</td><td>'+uploadvals['phac']+'</td><td></td><td></td></tr></table>';}
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
            marker[CoordTitle].setAnimation(null);
          }

          google.maps.event.addListener(marker[CoordTitle], 'click', function(){
            infoWindow.close(); // Close previously opened infowindow
            infoWindow.setContent(infoContent);
            infoWindow.open(map, marker[CoordTitle]);
          });

        if(CoordCon === 2){
            marker[CoordTitle].setAnimation(google.maps.Animation.BOUNCE);
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
        //safely assuming that all the line diagram elements have been loaded onto the map as the user would only click on the buttons after it has.
        $("#AAC").click(function(){
                var promptText = "Choose staff who adds the Customer: \n";
                for (var i = 0; i<staffKeys.length; i++){
                        promptText += staffData[staffKeys[i]].name + ' (ID = ' + staffKeys[i] + ')\n';
                }
                var ID = prompt(promptText, 0);
                if(ID!=null){
                       var IDtext = '' + ID;
                       var CID, parentID1, GPS_lat1, GPS_lon1, con1 = 1, type1= "C";
                        if(staffData[IDtext]!= undefined){
                                        if(staffData[IDtext].tID === 0){
                                                parentID1 = staffData[IDtext].sID;
                                        }
                                        else{
                                                parentID1 = staffData[IDtext].tID;
                                        }
                        }
                        CID = parentID1 + markerKeys.length + 1;
                        google.maps.event.addListener(map, 'dblclick', function(event){
                                GPS_lat1 = event.latLng.lat();
                                GPS_lon1 = event.latLng.lng();
                                var post = {
                                ID: CID,
                                parentID: parentID1,
                                GPS_lat: GPS_lat1,
                                GPS_lon: GPS_lon1,
                                type: type1,
                                con: con1                        
                        };
                                
                                firebaseUpdate = firebase.database().ref().child(ref_link);
                                firebaseUpdate.push().set(post);
                        
                        });
                                window.alert("Please double-click on the location you want to add the Customer at.");
                        
                        }
                        else{
                                window.alert("Invalid Staff ID");
                        }
        });
      
}
