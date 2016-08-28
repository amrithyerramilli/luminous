function HomeCtrl($scope, $ionicModal, $timeout, $ionicPlatform, $cordovaGeolocation, $q, apiService) {
    $scope.geolocation = {};
    $scope.user = { id: 1, name: "AY", availableResources: 10500 };
    $scope.apiParams = { userid: $scope.user.id, lat : $scope.geolocation.lat, lng : $scope.geolocation.lng };
    function errorHandler(response) {
        console.error(response);
        alert("Oops, an error occurred.");
    }
    $scope.$on('$ionicView.enter', onViewEnter);
    $scope.markHomeTerritory = markHomeTerritory;
    $scope.buildArmy = buildArmy;

    apiService.getAllLoc($scope.apiParams).then(function(resp) {
      console.log(1111, resp.data)
      setTimeout(function() {
        for (var i = 0; i < resp.data.length; i++ ) {
          console.log(222, resp.data[i].lat, resp.data[i].lng)
          var corners = getCorners(resp.data[i].lat, resp.data[i].lng);
          drawBoundingRect(corners, $scope);
        }

      }, 5000)
    })

    function markHomeTerritory() {
        console.log("Marking home territory for current location");
        apiService.markHomeT($scope.apiParams).then(function succ(resp) {
            console.log("Home territory is marked.. lefTop is")
            console.log(resp);
            resp = resp.data;
            var corners = getCorners(resp.lat, resp.lng);
            drawBoundingRect(corners, $scope);
            // /isMine - userId, geolocation : responds true/false - indicates that the T belongs to the user
            // if false, call desc_square : returns the "cost, resource, etc" for the place.
            // if enough resources, buy
            // /buy

        }, errorHandler)
            // .then(function () {
            //     apiService.isMine($scope.apiParams).then(function succ(resp) {
            //         if (!resp) {
            //             return apiService.descSquare($scope.apiParams);
            //         }

            //     }, errorHandler)
            // })
            // .then(function () {
            //     // popup with resource info
            //     alert("Click to buy");
            // }, errorHandler);
    }

    function buildArmy(){
        // WikitudeFactory.callARView(ind);
    }




    function onViewEnter(e) {

        var positionPromise = getCurrentPosition()
            .then(function (geo) {
                $scope.geolocation = geo;
            })
            .then(function () {
                $scope.apiParams.lat = $scope.geolocation.latitude
                $scope.apiParams.lng = $scope.geolocation.longitude
                var latLng = new google.maps.LatLng($scope.geolocation.latitude, $scope.geolocation.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $scope.map.setCenter(latLng);
                var infowindow = new google.maps.InfoWindow();
                var currentMarker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });
                google.maps.event.addListener(currentMarker, 'click', (function (map, marker, scop) {
                    return function () {
                        var markHomeT = "<span class='ion-ios-home'></span>";
                        infowindow.setContent(markHomeT);
                        infowindow.open(map, marker);
                    }
                })($scope.map, currentMarker, $scope));
            });
    }
    //  $ionicPlatform.ready(function() {
    //       var posOptions = {timeout: 10000, enableHighAccuracy: true}
    //      $cordovaGeolocation.getCurrentPosition(posOptions)
    //      .then(function (position) {
    //       var lat  = position.coords.latitude
    //       var long = position.coords.longitude
    //       $scope.currentLocation = {latitude : lat, longitude : long};
    //     }, function(err) {
    //       // error
    //     });

      var watchOptions = {
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };
      $scope.alerted = [];
      var watch = $cordovaGeolocation.watchPosition(watchOptions);
      watch.then(
        null,
        function(err) {
          // error
        },
        function(position) {
          var lat = position.coords.latitude
          var lng = position.coords.longitude
          $scope.apiParams.lat = lat
          $scope.apiParams.lng = lng
          // console.log(lat, long)
          console.log(111, String(lat)+String(lng))
          apiService.isMine($scope.apiParams).then(function(resp) {
            console.log('isMine: ', resp.data)
            resp = resp.data
            if (resp.status === 'yours' ) {
              // do nothing
            }
            else if (resp.status === 'occupied' && $scope.alerted.indexOf(String(lat)+String(lng)) === -1) {
              $scope.alerted.push(String(lat)+String(lng))
              alert('We\' let you attack later')
            }
            else if($scope.alerted.indexOf(String(lat)+String(lng)) === -1) {
              $scope.alerted.push(String(lat)+String(lng))
              var alert_resp = alert('Would you like to buy this?')
            }
          }, errorHandler)
          $scope.currentLocation = {latitude : lat, longitude : lng};
      });


    // //   watch.clearWatch();
    //   // OR
    // //   $cordovaGeolocation.clearWatch(watch)
    // //     .then(function(result) {
    // //       // success
    // //       }, function (error) {
    // //       // error
    // //     });
    //  });  

    function getCurrentPosition() {
        var positionDeferred = $q.defer();
        $ionicPlatform.ready(function () {
            $timeout(function () {
                // var posOptions = {timeout: 10000, enableHighAccuracy: true}
                // $cordovaGeolocation.getCurrentPosition(posOptions)
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geo = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    positionDeferred.resolve(geo);
                }, function (response) {
                    alert('geolocation error');
                    console.log(response);
                })
            }, 100);
        });

        return positionDeferred.promise;
    }

    function getCorners(lat, long) {
        var corners = [];
        lat = Math.round(lat * 100);
        long = Math.round(long * 100);
        var offset = 1;
        corners.push([lat / 100, long / 100]);
        corners.push([lat / 100, (long + offset) / 100]);
        corners.push([(lat + offset) / 100, long / 100]);
        corners.push([(lat + offset) / 100, (long + offset) / 100]);
        return corners;
    };

    function drawBoundingRect(corners, $scope) {
        var currentRectangle = new google.maps.Rectangle();
        currentRectangle.setOptions({
            strokeColor: '#FF0000',
            strokeOpacity: 0.35,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: $scope.map,
            bounds: {
                north: corners[0][0],
                south: corners[2][0],
                east: corners[1][1],
                west: corners[0][1]
            }
        });
    }

}