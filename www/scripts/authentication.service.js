(function (){
    'use strict';
    
    angular
        .module('Subitus_APP')
        .factory('AuthenticationService', AuthenticationService);
    
    AuthenticationService.$inject = ['$http', '$rootScope', '$timeout'];
    function AuthenticationService($http, $rootScope, $timeout) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        
        return service;
        
        function Login(username, password, callback) {
            console.log("Entró a login");
            $http.get('http://moodle.dtona.com.mx/webservice/rest/server.php', {
                params: {
                    username: username,
                    password: password,
                    wstoken: '412117ae95a85b91731a91e2b54fa0f4',
                    wsfunction: 'local_subitus_mobile_login',
                    moodlewsrestformat: 'json'
                }
            })
                .success(function(response) {
                    
                    if(response != 'error') {
                        localStorage.setItem('subitus-data', response);
                        
                        response = JSON.parse(response);
                    }
                    callback(response);
                });
        }
        
        function SetCredentials() {
        
        }
        
        function ClearCredentials() {
        
        }
    }
    
})();