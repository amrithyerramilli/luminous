angular.module('starter.ar', [])
    .factory('WikitudeFactory', function($q, $ionicPlatform) {
        var worlds = [{
            "path": "www/world/scene1/index.html",
            "requiredFeatures": [
                "2d_tracking"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        }];

        return {
            isDeviceSupported: true,
            callARView: function(worldIndex) {
                $ionicPlatform.ready(function() {
                    var world = worlds[worldIndex];
                    app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
                    app.wikitudePlugin.isDeviceSupported(function() {

                        app.wikitudePlugin.loadARchitectWorld(function(loadedURL) {
                            console.log('load arch success')
                        }, function errorFn(error) {
                            console.log('Loading AR web view failed: ' + error);
                        }, world.path, world.requiredFeatures, world.startupConfiguration);


                        //Callback method
                        app.wikitudePlugin.setOnUrlInvokeCallback(function(url) {
                            console.log('url invoked')
                            $q.defer().resolve(url);
                            app.wikitudePlugin.close();
                        });
                    }, function errorFn(error) {
                        console.log('Loading AR web view failed: ' + error);
                    }, world.requiredFeatures);
                });
            }
        }
    })
