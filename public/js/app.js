angular.module("explorer", [])
    .service('apiService', function ($http) {

        this.makeRequest = function (request) {

            var requestData = {
                baseUrl: request.baseUrl,
                restPath: request.restPath,
                method: request.method,
                username: request.username,
                password: request.password,
                data: request.data
            };

            return $http({
                url: '/rest/explorer',
                method: 'POST',
                data: requestData
            }).then(function (result) {
                    var data = result.data;
                    return data;
                },
                function (result) {
                    return result;
                });
        }

    })
    .controller('AppCtrl', function AppCtrl($scope, apiService) {

        $scope.hasPostData = false;

        $scope.toggleMethod = function () {
            $scope.hasPostData = $scope.request.method==='GET' ? false : true;
        };

        var exampleData = { fileName: '4%25',
            attributes:'',
            drawer:'',
            fileMarks:'',
            fileNumber:'',
            fileType:'' };

        $scope.request = {
            baseUrl: 'https://con-kblazina2.vertafore.com/ImageRight.Web.Client/',
            restPath: 'Search/GetResults',
            method: 'GET',
            username: '',
            password: '',
            data: JSON.stringify(exampleData),
            response: ''
        };

        $scope.fireRequest = function () {
            apiService.makeRequest($scope.request).then(function(result){
                $scope.request.response = JSON.stringify(result.json);
            });
        };

    });