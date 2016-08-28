function ApiService($http, $q, $timeout) {
    var API_URL = "";
    var URLs = {
        markHomeT: API_URL + "/markHomeT"
    }
    var mock = true;

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
    apiService.isMine = function(queryParams){
        if(mock){
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