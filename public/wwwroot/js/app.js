/**
 * Creaci�n del m�dulo principal del aplicativo
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular.module("AdsbApp", ["ngTouch",
        "toastr",
        "firebase",
        "ui.router",
        "ngCookies",
        "ngAnimate",
        'oc.lazyLoad',
        "ui.bootstrap",
        "ngMessages",
        "ngMaterial",
        "ncy-angular-breadcrumb",
        "uiGmapgoogle-maps",
        "vAccordion",
        "angular-loading-bar"
    ]);
    angular.element(document).ready(function(){
        angular.bootstrap(document,['AdsbApp']);
    });
}());

/**
 * Configuración de las librerías utilizadas
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    "use strict";

    angular.module("AdsbApp")
        .config(configInterceptors)
        .config(configLoader);

    configInterceptors.$inject = ["$httpProvider"];

    // Interceptors
    function configInterceptors($httpProvider) {
        // configuramos los interceptors
        $httpProvider.interceptors.push("AddTokenService");
        $httpProvider.interceptors.push("LoginRedirectService");
    }


    configLoader.$inject = ['cfpLoadingBarProvider'];

    function configLoader(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.parentSelector = "#loading-bar-spinner-container";
    }

})();

/**
 * Definición de enrutamientos
 *
 * @author Nelson David Padilla H.
 * @since 3-dic-2016
 *
 */

(function() {
    "use strict";

    angular.module("AdsbApp")
        .config(registerRoutes);

    registerRoutes.$inject = ["$stateProvider", "$urlRouterProvider"];

    function registerRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .when("/", "dashboard")
            .otherwise("dashboard");

        $stateProvider

        // Login
            .state("login", {
                page_title: "Rowlot - Iniciar Sesión",
                url: "/login",
                templateUrl: "views/login.html",
                controller: "LoginController"
            })
            // Signup
            .state("signup", {
                page_title: "Rowlot - Registro",
                url: "/signup",
                templateUrl: "views/signup.html",
                controller: "LoginController"
            })

        // Authenticated
        .state("auth", {
            abstract: true,
            // this state url
            url: "",
            templateUrl: "views/common/authenticated.html"
        })

        .state("auth.rowlot", {
                page_title: "Rowlot - Dashboard",
                url: "/dashboard",
                templateUrl: "views/rowlot/dashboard.html",
                controller: "RowlotController"
            })
            .state("auth.calendar", {
                page_title: "Rowlot - Calendario",
                url: "/calendar",
                templateUrl: "views/rowlot/calendar.html",
                controller: "RowlotController"
            })
            .state("auth.rowlot-listtask", {
                page_title: "Rowlot - Dashboard",
                url: "/taskList",
                templateUrl: "views/rowlot/listtask.html",
                controller: "RowlotController"
            })

        .state("auth.rowlot-profile", {
            page_title: "Rowlot - Profile",
            url: "/profile",
            templateUrl: "views/rowlot/profile.html",
            controller: "RowlotController"
        })


        .state("auth.task", {
            page_title: "Rowlot - Task",
            url: "/task/:idUnidad/:idTask",
            templateUrl: "views/rowlot/task.html",
            controller: "TaskController"
        })

        .state("auth.rowlot-biblioteca", {
            page_title: "Rowlot - Library",
            url: "/library",
            templateUrl: "views/rowlot/biblioteca.html",
            controller: "libraryController"
        })



    };
}());

/**
 * Configuración del run
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';


    angular.module('AdsbApp')
        .run(runBlock);

    runBlock.$inject = ['$log', '$stateParams', '$rootScope', '$cookieStore', '$location', '$state', 'CurrentUserService', "LoginRedirectService"];


    function runBlock($log, $stateParams, $rootScope, $cookieStore, $location, $state, CurrentUserService, LoginRedirectService) {

        $rootScope.location = $location;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function() {
            // scroll view to top
            $("html, body").animate({
                scrollTop: 0
            }, 200);
        });

        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            // Se adiciona la lógica para comprobar que puedo mostrar si no estoy logueado
            var user = CurrentUserService.profile;

            if (!user.loggedIn && toState.name != "login" && toState.name != "signup") {
                e.preventDefault();
                LoginRedirectService.redirectPostLogout();
            }

            if (user.loggedIn && toState.name == "login") {
                e.preventDefault();
                LoginRedirectService.redirectPostLogin();
            }
        })
    };
})();







/*
(function () {
    'use strict';
    angular
        .module('AdsbApp')
        .controller('AppCtrl', ['$scope', '$window', function ($scope, $window) {
            $scope.redirectToLecture = function () {
                $window.open('https://www.google.com', '_blank');
            };
        }]);


})();
*/
