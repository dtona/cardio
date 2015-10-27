var app = angular.module('Subitus_APP', ['ngMaterial', 'ngRoute', 'ngAnimate' ,'chart.js']);

/* Controladores ==============================================================*/

// Controlador principal
app.controller('AppCtrl', function($scope, $mdBottomSheet, $mdSidenav, $mdDialog, $window, $location, datosUsuario, cursosUsuario, userData, system){

  //Path
  $scope.$location = $location;
  $scope.system = system;
    
  console.log(userData.isLogged);

  //Calcular los puntos
  aux = 0;
  for(i=0; i<cursosUsuario.cursos.length; i++){
    aux += Number(cursosUsuario.cursos[i].puntosObtenidos);
  }
  $scope.puntosUsuario = aux;
  $scope.usuario = datosUsuario;
    
  $scope.userData = userData;


  //Slide navegación
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.close = function(index) {
      $mdSidenav('left').close();
    };

  $scope.sincronizar = function() {
    $mdSidenav('left').close();
    $window.location.reload();
  };

  $scope.menu = [
    {
      link : 'inicio',
      title: 'Inicio',
      icon: 'home'
    },
    {
      link : 'cursos',
      title: 'Cursos',
      icon: 'folder'
    },
      {
        link: 'tutorial',
        title: 'Tutorial',
        icon: 'school'
      },
    {
      link : 'top10',
      title: 'Top 10',
      icon: 'trophy-award'
    }
  ];

 //Navegación
  $scope.textoNav = 'Inicio';

  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'views/opciones.html',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      //$scope.alert = clickedItem.name + ' clicked!';
    });
  };

});

// Controlador opciones
app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet, $mdDialog, $location, userData) {
  
  $scope.items = [
    { name: 'Configuración', icon: 'settings', link: 'configuracion' },
    { name: 'Cerrar sesión', icon: 'lock', link: 'inicio' }
  ];
  
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
    
  $scope.userData = userData;

  $scope.showConfirm = function(ev, $index) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title('¿Estas seguro de cerrar sesión?')
      .content('No podrás acceder a tus cursos.')
      .ariaLabel('Pop up')
      .ok('Aceptar')
      .cancel('Cancelar')
      .targetEvent(ev);

    $mdDialog.show(confirm).then(function() {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
      $scope.userData.isLogged = false;
      $location.path("/login");

    }, function() {
      //Si decides no irte...
    });
  };

});

//Controlador pantalla: configuración
app.controller('configuracion', function($scope, $mdToast, $animate, datosUsuario){
    $scope.usuario = datosUsuario;
    $scope.passUsuario = datosUsuario.pass;
    $scope.nuevoPass = "";

    $scope.toastPosition = {
        bottom: true,
        top: false,
        left: false,
        right: true
      };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
          .filter(function(pos) { return $scope.toastPosition[pos]; })
          .join(' ');
      };

    $scope.cambiarPass = function () {
      return ($scope.passUsuario != $scope.usuario.pass) && ($scope.passUsuario.length > 4);
    }

    $scope.sonIguales = function  () {
      if(($scope.passUsuario != $scope.usuario.pass) && ($scope.passUsuario.length > 4) && ($scope.passUsuario === $scope.nuevoPass)){
      return true;
    }else{
      return false;
    }
    }

    $scope.guardarPass = function  () {
      datosUsuario.pass = $scope.nuevoPass;
      $scope.nuevoPass = "";
      $scope.passUsuario = datosUsuario.pass;
      $mdToast.show(
          $mdToast.simple()
            .content('La contraseña se a actualizado')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
    }

});

//Controlador pantalla: inicio
app.controller('inicio', function($scope, cursosUsuario){
  nombreCursos = [];
  numDatos = [];
  aux = [];

  for (i = 0; i < cursosUsuario.cursos.length; i++){
    nombreCursos.push(
                      String(cursosUsuario.cursos[i].nombre)
                      );
  }

  for (i = 0; i < cursosUsuario.cursos.length; i++){
    aux.push(
              (
                Number(cursosUsuario.cursos[i].puntosObtenidos) /
                Number(cursosUsuario.cursos[i].puntosTotales)
              ) *100
            );
  }

  numDatos.push(aux);


  $scope.nombres = nombreCursos;

  $scope.datos = numDatos;

  $scope.progressData = cursosUsuario.cursos;


  });

// **************** Tutorial **************

app.controller('TutorialController', function($scope, $mdSidenav) {
    console.log("Entro a Tutorial");
    
    var slides = [
        'tutorial/slide-1.html',
        'tutorial/slide-2.html',
        'tutorial/slide-3.html',
        'tutorial/slide-4.html',
        'tutorial/slide-5.html',
        'tutorial/slide-6.html'
    ];
    
    $scope.slides = slides;
    
    
    $scope.currentSlider = 0;
    $scope.lastSlider = slides.length-1;
    $scope.slideFile = slides[$scope.currentSlider];
    
    $scope.next = function() {
        if($scope.currentSlider < $scope.lastSlider) {
            $scope.currentSlider++;
            console.log("Va al siguiente: " + $scope.currentSlider);
            $scope.slideFile = slides[$scope.currentSlider]
        }
    }
    
    $scope.onSwipeLeft = function() {
        if($scope.currentSlider < $scope.lastSlider) {
            $scope.currentSlider++;
            console.log("Va al siguiente: " + $scope.currentSlider);
            $scope.slideFile = slides[$scope.currentSlider]
        }
    }
    
    $scope.prev = function() {
        if($scope.currentSlider > 0) {
            $scope.currentSlider--
            console.log("Va al anterior: " + $scope.currentSlider);
            $scope.slideFile = slides[$scope.currentSlider]
        }
    }
    
    $scope.onSwipeRight = function() {
        if($scope.currentSlider > 0) {
            $scope.currentSlider--
            console.log("Va al anterior: " + $scope.currentSlider);
            $scope.slideFile = slides[$scope.currentSlider]
        }
    }
});

// **************** Termina Tutorial **************


//Controlador pantalla: cursos
app.controller('cursos', function($scope, cursosUsuario, userData){
  $scope.collecionCursos = cursosUsuario.cursos;
  $scope.opciones = [];
  $scope.opcPDFs = [];
  $scope.opcMovies = [];
  $scope.opcAudios = [];

    console.log("== Cursos del Usuario ==");
    console.log(userData.courses);

  for(i=0; i<cursosUsuario.cursos.length; i++){
    $scope.opciones.push(false);
    $scope.opcPDFs.push(false);
    $scope.opcMovies.push(false);
    $scope.opcAudios.push(false);
  }

  //Primer menu
  $scope.cambiaValorTrue = function  (index) {
    $scope.opciones[index] = true;
  }

  $scope.cambiaValorFalse = function  (index) {
    $scope.opciones[index] = false;
  }


  //Existen Archivos 
  $scope.existeArchivoPDF = function  (index) {
    return cursosUsuario.cursos[index].pdf != 0;

  }

  $scope.existeArchivoMovie = function  (index) {
    return cursosUsuario.cursos[index].movies != 0;
  }

  $scope.existeArchivoAudio = function  (index) {
    return cursosUsuario.cursos[index].audio != 0;
  }


  $scope.noExistenArchivos = function  (index) {
    return $scope.existeArchivoAudio(index) == false  &&
           $scope.existeArchivoMovie(index) == false &&
           $scope.existeArchivoPDF(index) == false;
  }

  $scope.abrirPDFs = function  (index) {
    $scope.opcMovies[index] = false;
    $scope.opcAudios[index] = false;
    $scope.opcPDFs[index] = true;
  }

  $scope.abrirMovies = function  (index) {
    $scope.opcMovies[index] = true;
    $scope.opcAudios[index] = false;
    $scope.opcPDFs[index] = false;
  }

  $scope.abrirAudios = function  (index) {
    $scope.opcMovies[index] = false;
    $scope.opcAudios[index] = true;
    $scope.opcPDFs[index] = false;
  }


});

//Controlador pantalla: top 10
app.controller('top10', function($scope, topTenUsuarios){
$scope.posicion = 0;
 $scope.topTen = topTenUsuarios.usuarios;

});

/* Fabricas ====================================================================*/

//Datos del usuario
app.factory('datosUsuario', function(){
    return {

      nombre : "Mario Omar",
      apellido: "Serrano Mendoza",
      correo: "marioserrano@subitus.com",
      pass: "12345"

    }
});

//Cursos del usuario
app.factory('cursosUsuario', function(){
    return {
        cursos: [{
                nombre : "Inducción del personal",
                descripcion : "Consiste en la orientación, ubicación y superisión que se efectúa a los trabajadores de reciente ingreso.",
                imagen: "http://www.subitus.com/assets/img/uploads/HRW_Module1_Tagline.jpg",
                puntosObtenidos : 0,
                puntosTotales : 1000,
                pdf: [
                {nombre: 'Herramientas de desarrollo', descripcion: 'Esto de un PDF', url: 'pdf/pdf_1.pdf'},
                {nombre: 'Calendario laboral', descripcion: 'Esto de un PDF', url: 'pdf/pdf_2.pdf'}
                ],
                movies: [
                {nombre: 'Movie_1', url: 'movie/movie_1.html'},
                {nombre: 'Movie_2', url: 'movie/movie_2.html'},
                {nombre: 'Movie_3', url: 'movie/movie_3.html'},
                {nombre: 'Movie_4', url: 'movie/movie_4.html'},
                {nombre: 'Movie_5', url: 'movie/movie_5.html'},
                {nombre: 'Movie_6', url: 'movie/movie_6.html'},
                {nombre: 'Movie_7', url: 'movie/movie_7.html'},
                {nombre: 'Movie_8', url: 'movie/movie_8.html'},
                {nombre: 'Movie_9', url: 'movie/movie_9.html'},
                {nombre: 'Movie_10', url: 'movie/movie_10.html'},
                {nombre: 'Movie_11', url: 'movie/movie_11.html'}
                ],
                audio: [
                {nombre: 'Audio_1', url: 'audio/audio_1'},
                {nombre: 'Audio_2', url: 'audio/audio_2'},
                {nombre: 'Audio_3', url: 'audio/audio_3'}

                ]
            },
            {
                nombre : "Moodle",
                descripcion : "Es una aplicación web de tipo Ambiente Educativo Virtual, un sistema de gestión de cursos, de distribución libre.",
                imagen: "http://www.coursebit.net/wp-content/uploads/2015/03/moodle-ladders.jpg",
                puntosObtenidos : 900,
                puntosTotales : 1000,
                pdf: [{
                  nombre: 'PDF_1', descripcion: 'Esto de un PDF', url: 'pdf/pdf_1.pdf'
                }],
                movies: [{
                  nombre: 'Movie_1', url: 'movie/movie_1.html'
                }],
                audio: [{
                  nombre: 'Audio_1', url: 'audio/audio_1'
                }]
            },
            {
                nombre : "E-learning",
                descripcion : "Educación a distancia virtualizada a través de canales electrónicos (las nuevas redes de comunicación, en especial Internet).",
                imagen: "http://www.e-learningstudios.com/images/cfy.png",
                puntosObtenidos : 200,
                puntosTotales : 1000,
                pdf: [{
                  nombre: 'PDF_1', descripcion: 'Esto de un PDF', url: 'pdf/pdf_1.pdf'
                }],
                movies: [{
                  nombre: 'Movie_1', url: 'movie/movie_1.html'
                }],
                audio: [{
                  nombre: 'Audio_1', url: 'audio/audio_1'
                }]
            },
            {
                nombre : "HTML 5",
                descripcion : "HyperText Markup Language versión 5, es la quinta revisión importante del lenguaje básico de la World Wide Web.",
                imagen: "http://www.crearcrear.com/archivo/2013/12/Principios-b%C3%A1sicos-sobre-HTML5-2.jpg",
                puntosObtenidos : 900,
                puntosTotales : 1000,
                pdf: [],
                movies: [],
                audio: []
            },
            {
                nombre : "Edge Animate",
                descripcion : "Permite a los diseñadores web crear animaciones HTML para la Web, publicaciones digitales, sofisticados anuncios para medios de comunicación y mucho más.",
                imagen: "https://tctechcrunch2011.files.wordpress.com/2012/09/edge-animate-screenshot.jpeg",
                puntosObtenidos : 1000,
                puntosTotales : 1000,
                pdf: [
                  {nombre: 'PDF_1', descripcion: 'Esto de un PDF', url: 'pdf/pdf_1.pdf'},
                  {nombre: 'PDF_2', descripcion: 'Esto de un PDF', url: 'pdf/pdf_2.pdf'},
                  {nombre: 'PDF_3', descripcion: 'Esto de un PDF', url: 'pdf/pdf_3.pdf'},
                  {nombre: 'PDF_4', descripcion: 'Esto de un PDF', url: 'pdf/pdf_4.pdf'}
                ],
                movies: [
                  {nombre: 'Movie_1', url: 'movie/movie_1.html'},
                  {nombre: 'Movie_2', url: 'movie/movie_2.html'},
                  {nombre: 'Movie_3', url: 'movie/movie_3.html'},
                  {nombre: 'Movie_4', url: 'movie/movie_4.html'},
                  {nombre: 'Movie_5', url: 'movie/movie_5.html'},
                  {nombre: 'Movie_6', url: 'movie/movie_6.html'},
                  {nombre: 'Movie_7', url: 'movie/movie_7.html'},
                  {nombre: 'Movie_8', url: 'movie/movie_8.html'},
                  {nombre: 'Movie_9', url: 'movie/movie_9.html'},
                  {nombre: 'Movie_10', url: 'movie/movie_10.html'},
                  {nombre: 'Movie_11', url: 'movie/movie_11.html'}
                ],
                audio: [
                  {nombre: 'Audio_1', url: 'audio/audio_1'},
                  {nombre: 'Audio_2', url: 'audio/audio_2'},
                  {nombre: 'Audio_3', url: 'audio/audio_3'}

                ]
            }
        ]};
});


//Top 10
app.factory('topTenUsuarios', function(){
    return {
        usuarios: [{
              lugar : 1,
              nombre : "Top ten: uno",
              puntos : 100
            },
            {
              lugar : 2,
              nombre : "Top ten: dos",
              puntos : 99
            },
            {
              lugar : 3,
              nombre : "Top ten: tres",
              puntos : 98
            },
            {
              lugar : 4,
              nombre : "Top ten: cuatro",
              puntos : 97
            },
            {
              lugar : 5,
              nombre : "Top ten: cinco",
              puntos : 96
            },
            {
              lugar : 6,
              nombre : "Top ten: seis",
              puntos : 95
            },
            {
              lugar : 7,
              nombre : "Top ten: siete",
              puntos : 94
            },
            {
              lugar : 8,
              nombre : "Top ten: ocho",
              puntos : 93
            },
            {
              lugar : 9,
              nombre : "Top ten: nueve",
              puntos : 92
            },
            {
              lugar : 10,
              nombre : "Top ten: diez",
              puntos : 91
            }
        ]};
});

/* Configuración ===============================================================*/

//Colores
app.config(function($mdThemingProvider) {
  var customBlueMap =     $mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

//Estadisticas
 app.config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      colours: ['#009688', '#009688'],
      responsive: true
    });
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });
  }]);

//URL's
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/inicio', {
        templateUrl: 'views/inicio.html',
        controller: 'inicio'
      }).
      when('/cursos', {
        templateUrl: 'views/courses.html',
        controller: 'CoursesController',
        controllerAs: 'vm'
      }).
      when('/tutorial', {
        templateUrl: 'views/tutorial.html',
        controller: 'TutorialController',
      }).
      when('/top10', {
        templateUrl: 'views/top10.html',
        controller: 'top10'
      }).
      when('/configuracion', {
        templateUrl: 'views/configuracion.html',
        controller: 'configuracion'
      }).
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      }).
      otherwise({
        redirectTo: '/inicio'
      });
  }]);

/* Run ===============================================================*/



app.run(function ($rootScope, $location, $route, userData, system) {

    $rootScope.config = {};
    $rootScope.config.app_url = $location.url();
    $rootScope.config.app_path = $location.path();
    $rootScope.layout = {};
    $rootScope.layout.loading = false;
    
    $rootScope.userData = userData;

    $rootScope.$on('$routeChangeStart', function () {
        
        console.log($location.path());
        if(($location.path()) != '/login' && ($rootScope.userData.isLogged == false))
            $location.path('/login');
        else
            $rootScope.layout.loading = true;
        
    });
    $rootScope.$on('$routeChangeSuccess', function () {
      $rootScope.layout.loading = true;
      $rootScope.$on('$viewContentLoaded', function(){
            $rootScope.layout.loading = false;
      }); 
    });
    $rootScope.$on('$routeChangeError', function () {
        alert('error');
        $rootScope.layout.loading = false;
    });
    
    data = localStorage.getItem('subitus-data');
    
    if(data != null && data != '' && data != 'undefined' && data != 'error') {
        userData.isLogged = true;
        system.data = JSON.parse(data);
    }
});


app.factory('userData', function() {
    return {
        isLogged: false,
        firstname: 'FirstName',
        lastname: 'LastName',
        courses: {}
    };
});

app.factory('system', function() {
    return {
        mobileWebService: {
            host: 'http://moodle.dtona.com.mx/',
            token: 'e7b142fd620606e2d789ee3c18d3489d'
        },
        pageTitle: 'Título de la página',
        data: [],
        courses: [],
        courses_resources: []
    }
    
    
});