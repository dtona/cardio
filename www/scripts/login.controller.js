(function() {
    'use strict';
    
    angular.module('Subitus_APP')
        .controller('LoginController', LoginController);
    
    LoginController.$inject = ['$scope', '$rootScope', '$location', 'AuthenticationService', '$mdToast', '$animate', '$mdSidenav', 'userData', 'system'];
    
    function LoginController($scope, $rootScope, $location, AuthenticationService, $mdToast, $animate, $mdSidenav, userData, system) {
        
        
        var vm = this;
        
        $scope.system = system;
        $scope.system.pageTitle = "Inicio de sesión";
        
        // Se asegura de borrar la información del localstorage
        localStorage.clear();
        
        vm.login = login;
        function login() {
            
            vm.dataLoading = true;

            if(!vm.username || !vm.password) {
                $mdToast.show(
                  $mdToast.simple()
                    .content('El campo de usuario y contraseña son obligatorios.')
                    .hideDelay(3000)
                );
                vm.dataLoading = false;
                return false;
            }
            
            AuthenticationService.Login(vm.username, vm.password, function(response) {
                console.log(response);
                if(response.username) {
                    console.log("Login succesful");
                    
                    $scope.system.data = response;
                    
                    console.log("userData data biding");
                    userData.firstname = response.firstname;
                    userData.lastname = response.lastname;
                    userData.courses = response.courses;
                    
                    $mdToast.show(
                          $mdToast.simple()
                            .content('¡Bienvenido ' + response.firstname + ' ' + response.lastname  + '!')
                            .hideDelay(3000)
                        );
                     userData.isLogged = true;
                     $location.path('/inicio');
                } else {
                    console.log("Login fail");
                      $mdToast.show(
                          $mdToast.simple()
                            .content('Error de inicio de sesión. Revisa tus credenciales e intenta nuevamente.')
                            .hideDelay(3000)
                        );
                    vm.dataLoading = false;
                }
            });
        }

    }
})();