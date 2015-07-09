angular.module("explorer", [
        'angular-growl',
        'ui.ace',
        'ngClipboard'
])

    .config(['growlProvider', function(growlProvider) {
        growlProvider.onlyUniqueMessages(false);
        growlProvider.globalTimeToLive(3000);
    }])

    .config(['ngClipProvider', function(ngClipProvider) {
        ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
    }])
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
    .controller('AppCtrl', function AppCtrl($scope, apiService, growl) {

        $scope.disableButton = false;

        $scope.hasPostData = true;
        $scope.hasResponseData = false;

        $scope.toggleMethod = function () {
            $scope.hasPostData = $scope.request.method==='GET' ? false : true;
        };

        var exampleData = {FileName: "%"};

        $scope.request = {
            baseUrl: 'https://con-kblazina2.vertafore.com/ImageRight.Web.Client/',
            restPath: 'api/files/find',
            method: 'POST',
            username: '',
            password: '',
            data: JSON.stringify(exampleData),
            response: ''
        };

        $scope.fireRequest = function () {
            if($scope.request.username === '' || $scope.request.password === ''){
            }else{
                growl.warning('Request sent to API...');
                $scope.disableButton = true;
                $scope.request.response = '';
                apiService.makeRequest($scope.request).then(function(result){
                    $scope.disableButton = false;
                    $scope.hasResponseData = true;
                    $scope.request.response = angular.toJson(result.json, true);
                    growl.success('Request is successful!');
                }),function(error){
                    alert(error);
                };
            }
        };

        $scope.clearResponseData = function () {
            $scope.request.response = '';
            growl.success('Response data has been cleared!');
        };

        $scope.clearRequestData = function () {
            $scope.request.data = '';
            growl.success('Request data has been cleared!');
        };

        $scope.copyRequestData = function () {
            growl.success('Request data copied!');
        };

        $scope.copyResponseData = function () {
            growl.success('Response data copied!');
        };

    });