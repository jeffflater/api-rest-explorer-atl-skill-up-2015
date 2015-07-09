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
                function (error) {
                    return error;
                });
        }

    })
    .controller('AppCtrl', function AppCtrl($scope, apiService) {

        $scope.disableButton = false;

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
            if($scope.request.username === '' || $scope.request.password === ''){
            }else{
                $scope.disableButton = true;
                apiService.makeRequest($scope.request).then(function(result){
                    $scope.disableButton = false;
                    $scope.request.response = JSON.stringify(result.json);
                }),function(error){
                    alert(error);
                };
            }
        };

        $scope.clearResponse = function () {
            $scope.request.response = '';
        }

    });