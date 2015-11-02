//file downloaded from git: https://github.com/angular-ui/angular-google-maps.git and modified as required for the markers creation.

'use strict';
angular.module("angular-google-maps-example", ['uiGmapgoogle-maps','ngDraggable','lodashmodule'])

.value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1);
})

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    // v: '3.20',
    libraries: 'weather,geometry,visualization'
  });
}])

.controller('InfoController', function ($scope) {
  $scope.removeCurrentMarker = function(id){
  console.log($scope.model);
    $scope.model.removeCurrentMarker($scope.model.id);
   }
 
})

.controller("ExampleController",['$scope', '$timeout', 'uiGmapLogger', '$http', 'rndAddToLatLon','uiGmapGoogleMapApi'
    , function ($scope, $timeout, $log, $http, rndAddToLatLon,GoogleMapApi) {
    $log.currentLevel = $log.LEVELS.debug;
    GoogleMapApi.then(function(maps) {
      $scope.googleVersion = maps.version;
      maps.visualRefresh = true;
    });

//This is the function got fired while droping icon in to the Google map 
$scope.centerAnchor = true;
$scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}
$scope.draggableObjects = [
                            { id: 1,
                              name: 'one',
                              src: 'assets/images/plane.png',
                              showRemove: false
                            }, 
                            { id: 2,
                              name: 'two',
                              src: 'assets/images/blue_marker.png',
                              showRemove: false
                            }, 
                            { id: 3,
                              name: 'three',
                              src: 'assets/images/flag.png',
                              showRemove: false
                            }
                          ];

$scope.removeMarkerIfExist = function(id){
  removeMarker(id , true);
}

$scope.removeCurrentMarker = function(id){
  removeMarker(id , false);
}

var removeMarker = function (id , flag)  {
  for(var i = $scope.map.markers.length - 1; i >= 0; i--) {
    if($scope.map.markers[i].id === id) {
      if(flag === false){
        $scope.map.markers.splice(i, 1);
      }
      for(var j = $scope.draggableObjects.length - 1; j >= 0; j--){
        if($scope.draggableObjects[j].id == id){
          $scope.draggableObjects[j].showRemove = flag;
        }
      }
    }
  }
};
//Function got fire while dropping the icon on map
$scope.onDropComplete2=function(data,evt){
  var map = $scope.getMapInstance()
  var overlay = new google.maps.OverlayView();
  overlay.draw = function() {};
  overlay.setMap(map);
  var point=new google.maps.Point(evt.x,evt.y);
  var ll=overlay.getProjection().fromContainerPixelToLatLng(point);
  $scope.map.markersid +=1; 
  var flag = 0;
  for(var i = $scope.map.markers.length - 1; i >= 0; i--) {
    if($scope.map.markers[i].id === data.id) {
      flag = 1; 
      return;
    }
  }
  if(flag !== 1){
    $scope.map.markers.push({   
      id: data.id,
      icon: data.src,
      title: data.name,
      no: $scope.map.markers.length+1,
      options: {
        labelContent: 'ID'+data.id,
        labelClass: "marker-labels",
        labelAnchor:"26 0",
        draggable: true
      },
      latitude: ll.lat(),
      longitude: ll.lng(),
      removeCurrentMarker: $scope.removeCurrentMarker
    });
    //Here write the logic needed for updating the marker longitude and latitudes in server DB
    //data.id refers the element getting added in to as a marker
    console.log("Here write the logic needed for updating the marker longitude and latitudes in server DB");
  }
  $scope.$apply();
}
  var inArray = function(array, obj) {
    var index = array.indexOf(obj);
  }
  var onMarkerClicked = function (marker) {
  marker.showWindow = true;
    $scope.$apply();
    //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
  };
  var showRemove = false;
  var clusterTypes = ['standard','ugly','beer'];
  var selectedClusterTypes = {
    ugly:{
      title: 'Cluster: Click to open',
      gridSize: 60, 
      ignoreHidden: true,
      minimumClusterSize: 2,
      imageExtension: 'png',
      imagePath: 'assets/images/cluster', 
      imageSizes: [72]
    },
    beer:{
      title: 'Cluster: Click to open',
      gridSize: 60,
      ignoreHidden: true,
      minimumClusterSize: 2,
      enableRetinaIcons: true,
      styles: [{
        url: 'assets/images/beer.png',
        textColor: '#ddddd',
        textSize: 18,
        width: 33,
        height: 33,
      }]
    },
    standard:{
      title: 'Cluster: Click to open', 
      gridSize: 60, 
      ignoreHidden: true, 
      minimumClusterSize: 2
    }
  };

  angular.extend($scope, {
    map: {
      show: true,
      control: {},
      markersid: 0,
      version: "uknown",
      center: {
        latitude: 45,
        longitude: -73
      },
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3
      },
      zoom: 3,
      dragging: false,
      bounds: {},
      markers:[],
      randomMarkers:[],
      doClusterMarkers: true,
      doClusterRandomMarkers: true,
      currentClusterType: 'standard',
      clusterTypes: clusterTypes,
      selectedClusterTypes: selectedClusterTypes,
      clusterOptions: selectedClusterTypes['standard'],
      events: {
        tilesloaded: function (map, eventName, originalEventArgs) {
        },
        click: function (mapModel, eventName, originalEventArgs) {
        },
        dragend: function () {
        }
      },
      toggleColor: function (color) {
        return color == 'red' ? '#6060FB' : 'red';
      }
    }
  });
  $scope.map.markersEvents = {
    dragend: function (marker, eventName, model, args) {
      //text after dragend
    }
  };
  $scope.map.markers.forEach( function (marker) {
    marker.onClicked = function () {
      onMarkerClicked(marker);
    };
    marker.closeClick = function () {
      marker.showWindow = false;
      $scope.$evalAsync();
    };
  });
  $scope.removeMarkers = function () {
    $scope.map.markers = [];
    $scope.map.markersid = 0;
  };
  $scope.getMapInstance = function () {
    return $scope.map.control.getGMap();
  }
  $scope.map.clusterOptionsText = JSON.stringify($scope.map.clusterOptions);
  $scope.$watch('map.clusterOptionsText', function (newValue, oldValue) {
    if (newValue !== oldValue)
      $scope.map.clusterOptions = angular.fromJson($scope.map.clusterOptionsText);
  });
}]);