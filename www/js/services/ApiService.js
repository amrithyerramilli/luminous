function ApiService($http, $q, $timeout) {
    var API_URL = "http://192.168.0.147:8000/l";
    
    var URLs = {
        isMine : API_URL + "/isMine",
        markHomeT: API_URL + "/markHomeT",
        takeSquare: API_URL + "/takeSquare",
        getAllLoc: API_URL + "/getAllLoc",
    }
    var mock = false;
    var apiService = {};

    apiService.markHomeT = function (queryParams) {
        if (mock) {
            var def = $q.defer();
            var leftTop = { lat: 12.97, lng: 77.60 }

            $timeout(function () {
                def.resolve(leftTop);
            }, 1000);
            return def.promise;
        }
        else {
            return $http.get(URLs.markHomeT, { params: queryParams });
        }

    }
    apiService.getAllLoc = function (queryParams) {
        return $http.get(URLs.getAllLoc, { params: queryParams });
    }
    apiService.isMine = function(queryParams){
        if(true){
            var def = $q.defer();
            $timeout(function () {
                def.resolve(true);
            }, 1000);
            return def.promise;
        }
        else {
            return $http.get(URLs.isMine, { params : queryParams });
        }
    }

    return apiService;
}