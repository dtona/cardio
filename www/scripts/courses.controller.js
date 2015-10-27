(function() {
    'use strict';
    
    angular.module('Subitus_APP')
        .controller('CoursesController', CoursesController);
    
    CoursesController.$inject = ['$scope', '$rootScope', '$location', 'userData', 'system', '$http', '$mdToast'];
    
    function CoursesController($scope, $rootScope, $location, userData, system, $http, $mdToast) {
        
        var vm = this;
        var fileCompleteUrl;
        
        $scope.system = system;
        $scope.system.pageTitle = "Cursos";
        
    
        console.log("== Entró a cursos ==");
        console.log(system.data);
        
        
        
        function getCoursesFromStorage() {
            console.log("Entro a cursos");
        }
        
        vm.courseDownloadInfo = courseDownloadInfo;
        function courseDownloadInfo(course_id, callback) {
            console.log("*** Descarga la info del curso " + course_id + " ***");
            $http.get( system.mobileWebService.host + '/webservice/rest/server.php', {
                params: {
                    courseid: course_id,
                    wstoken: system.mobileWebService.token,
                    wsfunction: 'core_course_get_contents',
                    moodlewsrestformat: 'json'
                }
            })
                .success(function(response) {
                    console.log("Exito al descargar info de cursos");
                    
                    if(response != 'error') {    
                        localStorage.setItem('subitus-data-course-' + course_id, JSON.stringify(response));
                        $scope.system.courses[course_id] = response;
                        
                        console.log(response);
                    }
                
                    // Iteración por cada objeto recibido
                    angular.forEach(response, function(value, key){
                        console.log("Iterando " + key + " primer nivel");
                        //console.log(value);
                        
                        // Iterando por los diferentes módulos
                        angular.forEach(value, function(course_modules, key) {
                            console.log("--Iterando " + key + " segundo nivel");
                            //console.log(course_modules);
                            if(key == 'modules') {
                                // Iterando dentro de los módulos en búsqueda de recursos
                                angular.forEach(course_modules, function(course_module, key) {
                                    console.log("----Iterando " + key + " tercer nivel");
                                    //console.log("----" + course_module.modname);
                                    if(course_module.modname == 'resource') {
                                        console.log("------Iterando " + key + " cuarto nivel");
                                        //console.log(course_module.contents);
                                        angular.forEach(course_module.contents, function(course_file, key) {
                                            console.log("--------Iterando " + key + " quinto nivel ** ARCHIVO **");
                                            fileCompleteUrl = course_file.fileurl + "&token=" + system.mobileWebService.token;
                                            if(fileCompleteUrl != '') {
                                                var fileFolder = "/mnt/sdcard/Subitus";
                                                var fileURL = fileFolder + "/" + course_id + "/" + course_module.id + "/" + course_file.filename;
                                                /*
                                                var fileTransfer = new FileTransfer();
                                                
                                                fileTransfer.download (fileCompleteUrl, fileURL, function(entry) {
                                                        console.log("============ Descargado ============");
                                                        $mdToast.show(
                                                          $mdToast.simple()
                                                            .content('¡Descarga exitosa!')
                                                            .hideDelay(3000)
                                                        );
                                                    },
                                                    function(error) {
                                                        console.log("============ Descargado ============");
                                                        $mdToast.show(
                                                          $mdToast.simple()
                                                            .content('¡Error! ' + error)
                                                            .hideDelay(3000)
                                                    },
                                                    false,
                                                    {
                                                        headers: {
                                                            //"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                                        }
                                                    }
                                                );
                                                */
                                                
                                                console.log(fileURL);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                
                    
                
                    
                    //callback(response);
                });
        
        }
        
        vm.coursePreviewImage = function(course_id, course) {
            console.log("=* BUSCANDO PREVIEW DEL CURSO: " + course_id + " *=");
            console.log(system.courses[course_id]);
            console.log(system);
            var fileExtension, previewFileName, courseStorage;
            var previewStorage = [];
            
            angular.forEach(system.courses[course_id], function(value, key) {
                angular.forEach(value.modules, function(moduleValue, moduleKey) {
                    if(moduleValue.modname == 'resource') {
                        fileExtension = moduleValue.contents[0].filename.split('.').pop().toLowerCase();
                        if(fileExtension == 'jpg' || fileExtension == 'png') {
                            previewFileName = moduleValue.contents[0].fileurl.replace('forcedownload=1', '') + 'token=' + system.mobileWebService.token;
                            console.log(previewFileName);
                            //$scope.system.courses[course_id].preview = previewFileName;
                            
                            courseStorage = localStorage.getItem('subitus-data-course-' + course_id);
                            courseStorage = JSON.parse(courseStorage);
                            courseStorage[0].preview = previewFileName;
                            courseStorage = JSON.stringify(courseStorage);
                            //console.log(courseStorage);
                            localStorage.setItem('subitus-data-course-' + course_id, courseStorage);
                            
                            previewStorage = JSON.parse(localStorage.getItem('subitus-data-courses-previews'));
                            previewStorage = { course_id: course_id, preview_url: previewFileName };
                            previewStorage = JSON.stringify(previewStorage);
                            localStorage.setItem('subitus-data-courses-previews', previewStorage);
                        }
                    }
                    
                });
                
            });
            
            return false;
            
        }
        
        $scope.$watch(function() { return localStorage.getItem('subitus-data-courses-previews') }, function(newVal, oldVal) {
            console.log("New Val: " + newVal);
            console.log("Old Val: " + oldVal);
        });

    }
})();