
/**
 * Servicio para el manejo de la lógica de negocio del módulo de autenticación
 *
 * @author Nelson David Padilla
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular.module("AdsbApp")
        .service("LoginService", LoginService);

    LoginService.$inject = ['RestService', 'CurrentUserService', '$q', "$firebaseAuth"];

    function LoginService(RestService, CurrentUserService, $q, $firebaseAuth) {

        // Servicio de inicio de sesión
        var login = function(credentials) {

            var defered = $q.defer();
            var promise = defered.promise;

            const auth = firebase.auth();

            //Sign In
            auth.signInWithEmailAndPassword(credentials.username, credentials.password).catch(function(error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });

            // Add a realtime listener
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    CurrentUserService.setProfile(credentials.username, user.uid);
                    defered.resolve();
                } else {
                    console.error("Authentication failed:", error);
                    defered.reject("Usuario no existe...")
                }
            });
            return promise;
        }
        var signup = function(credentials) {
                var defered = $q.defer();
                var promise = defered.promise;

                const auth = firebase.auth();

                auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(function(user) {
                    if (user) {
                        console.log('uid', user.uid);
                        writeUserData(user.uid, credentials.email, credentials.password, 'https://firebasestorage.googleapis.com/v0/b/rowlot-c9891.appspot.com/o/DefaultProfilePicture.jpg?alt=media&token=3ccf226a-5a68-4076-acc5-1fd4be342d0f', credentials.name, credentials.lastName, credentials.type);
                        defered.resolve();
                    } else {
                        console.error("Authentication failed:", error);
                        defered.reject("Usuario no existe...")
                    }
                });
                return promise;
            }
            //Funcion donde agrego los datos del usuario creado
            //a la base de datos, con el UID <3
        var writeUserData = function(userId, email, pass, imageUrl, nombre, apellido, type) {
                console.log('basededatos');
                firebase.database().ref('Usuarios/' + userId).set({
                    Nombre: nombre,
                    Apellido: apellido,
                    email: email,
                    Contrasena: pass,
                    profile_picture: imageUrl,
                    experiencia: 0,
                    Moneda: 300,
                    Medalla: 0,
                    Tipo: type,
                    Vida: 5

                });
            }
            // Servicio de fin de sesión
        var logout = function() {
            // Elimina el perfil almacenado
            CurrentUserService.removeProfile();
        }

        return {
            login: login,
            logout: logout,
            signup: signup
        };
    };

})();


/**
 *
 *
 */

(function() {
    'use strict';

    angular
        .module('AdsbApp')
        .service('RowlotService', RowlotService);

    RowlotService.$inject = ['RestService', '$q'];

    function RowlotService(RestService, $q) {

        //USUARIOS
        var getCurrentUser = function() {
            var defered = $q.defer();
            var promise = defered.promise;
            let user = firebase.auth().currentUser;
            if (user != null) {
                firebase.database().ref('/Usuarios/' + user.uid).once('value').then(function(snapshot) {
                    //var username = snapshot.val().username;
                    defered.resolve(snapshot.val());
                    // ...
                })
            }
            return promise;
        }

        var getUsers = function() {
            var defered = $q.defer();
            var promise = defered.promise;
            let users = [];
            //acceso al servicio bd
            let database = firebase.database();
            //Mi nodo de Usuarios
            let ref = database.ref('Usuarios');
            ref.on('value', function(ss) {
                //let nombre = ss.val();
                let nombres = ss.val();
                //tengo las keys de los usuarios en un array
                let keys = Object.keys(nombres);
                for (let i = 0; i < keys.length; i++) {
                    let k = keys[i];
                    users.push({
                        "data": nombres[k],
                        "uid": k
                    });
                }
                defered.resolve(users);
            })

            return promise;
        }


        //UNIDADES
        var getCurrentUnidad = function() {

            var defered = $q.defer();
            var promise = defered.promise;
            let activity = firebase.auth().currentActivity;
            if (activity != null) {
                firebase.database().ref('/Unidad/' + activity.uid).once('value').then(function(snapshot) {
                    //var username = snapshot.val().username;
                    defered.resolve(snapshot.val());
                    // ...
                })
            }
            return promise;
        }

        var getUnidades = function() {

            var defered = $q.defer();
            var promise = defered.promise;
            let unidades = [];
            //acceso al servicio bd
            let database = firebase.database();

            //Mi nodo de Unidades
            let ref = database.ref('Unidad');
            ref.on('value', function(ss) {
                //let nombre = ss.val();
                let tareas = ss.val();
                //tengo las keys de las Unidades en un array
                let keys = Object.keys(tareas);
                for (let i = 0; i < keys.length; i++) {
                    let k = keys[i];
                    unidades.push({
                        "data": tareas[k],
                        "uid": k
                    });
                }
                defered.resolve(unidades);
            })

            return promise;
        }


        /*
        var updateTitleActividad = function(tareaId, title){

            var tareaRef = firebase.database().ref('/Actividad/' + tareaId);
            tareaRef.update({
                Titulo: title
                //log.console(title);
            });
        }

*/

        //LECTURAS

        var getLecturas = function() {

            var defered = $q.defer();
            var promise = defered.promise;
            let lecturas = [];
            //acceso al servicio bd
            let database = firebase.database();

            //Mi nodo de Lecturas
            let ref = database.ref('Lectura');
            ref.on('value', function(ss) {
                //let nombre = ss.val();
                let nombres = ss.val();
                //tengo las keys de las Lecturas en un array
                let keys = Object.keys(nombres);
                for (let i = 0; i < keys.length; i++) {
                    let k = keys[i];
                    lecturas.push({
                        "data": nombres[k],
                        "uid": k
                    });
                }
                defered.resolve(lecturas);
            })

            return promise;
        }


        var updateCoins = function(userId, coins) {
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Moneda: coins
            });
        }


        var updateMedalla = function(userId, metal) {
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Medalla: metal
            });
        }

        var updateVida = function(userId, life) {
            var userRef = firebase.database().ref('/Usuarios/' + userId);
            userRef.update({
                Vida: life
            });
        }

        var getMisc = function() {
            var defer = $q.defer();
            var promise = defer.promise;

            let database = firebase.database();
            let ref = database.ref('Misc');
            ref.on('value', function(data) {
                defer.resolve(data.val());
            })
            return promise;
        }

        var setMaxMoney = function(newValue) {
            var defer = $q.defer();
            var promise = defer.promise;
            try {
                let database = firebase.database();
                let ref = database.ref('Misc');
                ref.update({
                    maxMoney: newValue
                });
                defer.resolve(true);
            } catch (err) {
                defer.reject(err);
            }

            return promise;
        }

        var getTask = function(idUnidad){
            var defer = $q.defer();
            var promise = defer.promise;

            let database = firebase.database();
            let ref = database.ref('/Unidad/'+idUnidad);

            ref.on('value', function(data) {
                defer.resolve(data.val());
            })
            return promise;
        }

        var addUnidad = function(newUnidad){
            var defer = $q.defer();
            var promise = defer.promise;
            try{
                let database = firebase.database();
                let ref = database.ref('Unidad');
                let newChildUnidad = ref.child(newUnidad.title);
                newChildUnidad.set(newUnidad);
                defer.resolve(true);
            }catch(err){
                defer.reject(err);
            }

            return promise;
        }

        var addTask = function(idUnidad,newTask){
            var defer = $q.defer();
            var promise = defer.promise;
            try{
                let database = firebase.database();
                let ref = database.ref('/Unidad/'+idUnidad+'/task');
                let newChildTask = ref.child(newTask.title);
                newChildTask.set(newTask);
                defer.resolve(true);
            }catch(err){
                defer.reject(err);
            }

            return promise;
        }
        var putTask = function(unidad,task,idUser,data){
            var defer = $q.defer();
            var promise = defer.promise;
            try{
                let database = firebase.database();
                let ref = database.ref('/Unidad/'+unidad+'/task');
                let childTask = ref.child(task);
                let childTaskStudents = childTask.child('/students/'+idUser);
                childTaskStudents.set(data);
                defer.resolve(true);
            }catch(err){
                defer.reject(err);
            }

            return promise;
        }

        var putTaskStudent = function(datainfo,data){
            var defer = $q.defer();
            var promise = defer.promise;
            try{
                let database = firebase.database();
                let ref = database.ref('/Unidad/'+datainfo.unidad+'/task');
                let childTask = ref.child(datainfo.task);
                let childTaskStudents = childTask.child('/students/'+datainfo.user);
                childTaskStudents.update(data);
                defer.resolve(true);
            }catch(err){
                defer.reject(err);
            }

            return promise;
        }

        var addLectura = function (data){
            var defer = $q.defer();
            var promise = defer.promise;
            try{
                let database = firebase.database();
                let ref = database.ref('/Lectura/'+data.Titulo);
                ref.set(data);
                defer.resolve(true);
            }catch(err){
                defer.reject(err);
            }

            return promise;
        }

        return {
            getUsers: getUsers,
            getCurrentUser: getCurrentUser,

            getCurrentUnidad: getCurrentUnidad,
            getUnidades: getUnidades,

            getLecturas: getLecturas,

            updateCoins: updateCoins,
            updateMedalla: updateMedalla,
            updateVida: updateVida,
            getMisc: getMisc,
            setMaxMoney:setMaxMoney,
            getTask:getTask,
            addUnidad:addUnidad,
            addTask:addTask,
            putTask:putTask,
            putTaskStudent:putTaskStudent,
            addLectura:addLectura,
            // updateTitleActividad: updateTitleActividad
        }
    }
}());

/*UNIDADES*/



/**
 * Servicio para el manejo del token de seguridad en las peticiones http
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular.module("AdsbApp")
        .service("AddTokenService", AddTokenService);

    AddTokenService.$inject = ['$q', 'CurrentUserService'];

    function AddTokenService($q, CurrentUserService) {

        // Intercepta la petición
        var request = function(config) {
            // Si el usuario está loggueado adiciono el token
            if (CurrentUserService.profile.loggedIn) {
                config.headers.Authorization = CurrentUserService.profile.token;
            }
            return $q.when(config);
        }

        return {
            request: request
        }
    }
})();
/**
 * Servicio para el manejo de los datos del usuario autenticado
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular.module("AdsbApp")
        .factory("CurrentUserService", CurrentUserService);

    CurrentUserService.$inject = ['LocalStorageService'];

    function CurrentUserService(LocalStorageService) {

        var USERKEY = "utoken";

        // Persiste los datos del perfil del usuario
        var setProfile = function(username, token) {
            profile.username = username;
            profile.token = token;
            // Almacena la información del token
            LocalStorageService.add(USERKEY, profile);
        };

        // Remueve los permisos del perfil del usuario
        var removeProfile = function() {
            profile.username = "";
            profile.token = "";
            // Elimina la información del token
            LocalStorageService.remove(USERKEY);
        };

        // Inicializa los datos del perfil del usuario
        var initialize = function() {

            var user = {
                    username: "",
                    token: "",
                    get loggedIn() {
                        return this.token != "";
                    }
                }
                // Si existe un usuario almacenado se recupera
            var localUser = LocalStorageService.get(USERKEY);
            if (localUser) {
                user.username = localUser.username;
                user.token = localUser.token;
            }

            return user;
        };

        var profile = initialize();

        return {
            removeProfile: removeProfile,
            setProfile: setProfile,
            profile: profile
        }
    }

})();
/**
 * Servicio para el manejo de los redireccionamientos según el estado del token de autenticación del usuario
 *
 * @author Nelson David Padilla
 * @since 31-Mar-2017
 *
 */

(function() {
    "use strict";

    angular.module("AdsbApp")
        .service("LoginRedirectService", LoginRedirectService);

    LoginRedirectService.$inject = ["$q", "$injector", "$location"];

    function LoginRedirectService($q, $injector, $location) {

        var main = "auth.rowlot";
        var lastPath = main;

        // Intercepta los errores por expiración de permisos y redirecciona a la página de logueo
        var responseError = function(response) {
            if (response.status == 401 || response.status == 403) {
                lastPath = $location.path();
                $injector.get("$state").go("login");
            }
            return $q.reject(response);
        }

        // Almacena la última dirección
        var redirectPostLogin = function() {
            // Redirije a la última dirección almacenada
            $injector.get("$state").go(lastPath);
            lastPath = main;
        }

        // Redirecciona a la página de login
        var redirectPostLogout = function() {
                $injector.get("$state").go("login");
                lastPath = main;
            }
            // Redirecciona a la página de login
        var redirectPostSignup = function() {
                $injector.get("$state").go("signup");
                lastPath = main;
            }
            // Determina si se está en la página de logueo
        var isLoginPath = function() {
            if ($injector.get("$state").is("login"))
                return true;
            return false;
        }

        return {
            responseError: responseError,
            redirectPostLogin: redirectPostLogin,
            redirectPostLogout: redirectPostLogout,
            isLoginPath: isLoginPath
        }
    }
})();

/**
 * Servicio para el manejo de las ventanas de dialogo
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular.module('AdsbApp')
        .service('DialogService', DialogService);

    DialogService.$inject = ['$mdDialog', '$http'];


    function DialogService($mdDialog, $http) {

        // Despliega un confirm popup
        var confirm = function(titulo, mensaje) {

            var confirm = $mdDialog.confirm()
                .title(titulo)
                .content(mensaje)
                .ariaLabel('Confirmación de usuario')
                .ok('Si')
                .cancel('No')
                .hasBackdrop(true);

            return $mdDialog.show(confirm);

        }

        // Despliega un alert popup
        var alert = function(mensaje) {
            $mdDialog.show($mdDialog.alert()
                .title('')
                .content(mensaje)
                .ok('Aceptar')
                .hasBackdrop(true)
            );
        }

        return {
            confirm: confirm,
            alert: alert
        }
    }
})();
/**
 * Servicio para interactual con los mapas de google
 *
 * @author Nelson D. Padilla and David E. Morales
 * @since 17-dic-2016
 *
 */

(function() {
    "use strict";

    angular
        .module('AdsbApp')
        .service('GoogleMapService', GoogleMapService);

    GoogleMapService.$inject = [];

    function GoogleMapService() {

        var drawPath = function(path) {

            var collection = [];
            var coord1, coord2;
            for (var i = 1; i < path.length; i++) {
                if (path[i] != null && (path[i].msgtype == 3 || path[i].msgtype == 2)) {
                    coord1 = path[i];
                }
                if (path[i - 1] != null && (path[i - 1].msgtype == 3 || path[i - 1].msgtype == 2)) {
                    coord2 = path[i - 1];
                }
                var step = [coord2, coord1];
                var color = altitudeColor(path[i].altitude);
                var draw = drawStep(step, color, false);
                collection.push(draw);
            }

            var airplaneIcon = {
                icon: planeSymbol,
                offset: '100%'
            }
            collection[collection.length - 1].icons.push(airplaneIcon);

            return collection;
        }

        var drawStep = function(step, color, drawIcon) {
            return {
                path: step,
                stroke: {
                    color: color,
                    weight: 5
                },
                geodesic: true,
                visible: true,
                icons: []
            }
        }

        var planeSymbol = {
            path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
            scale: 0.0633,
            strokeOpacity: 1,
            color: 'black',
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 1
        }

        var drawMarkers = function(type, markers, time) {
            var collection = [];
            for (var i = 0; i < markers.length; i++) {
                if (markers.length > 1 && markers[i + 1] != null) {
                    var now = moment(markers[i + 1].gentime);
                    var end = moment(markers[i].gentime);
                    var duration = moment.duration(now.diff(end));
                    if (duration.asSeconds() >= time) {
                        collection.push(createMarker(i, type, markers[i]));
                    }
                } else {
                    collection.push(createMarker(i, type, markers[i]));
                }
            }
            return collection;
        }

        var createMarker = function(i, type, point) {
            var ret = {
                id: i,
                latitude: point.latitude,
                longitude: point.longitude,
                alert: point.alert,
                icon: iconType(type)
            };

            return ret;
        }

        var iconType = function(type) {

            if (type == "gndspd") {
                return 'content/images/speed.png';
            } else if (type == "vspd") {
                return 'content/images/caution.png';
            } else if (type == "emerg") {
                return 'content/images/flag.png';
            } else if (type == "sqwk") {
                return 'content/images/radiotower.png';
            }
        }

        var altitudeColor = function(altitude) {

            if (altitude >= 0 && altitude <= 499)
                return '#FF0000';
            else if (altitude >= 500 && altitude <= 999)
                return '#FF6600';
            else if (altitude >= 1000 && altitude <= 1999)
                return '#CC9900';
            else if (altitude >= 2000 && altitude <= 2999)
                return '#FFCC00';
            else if (altitude >= 3000 && altitude <= 4999)
                return '#00CC00';
            else if (altitude >= 5000 && altitude <= 7499)
                return '#0033FF';
            else if (altitude >= 7500 && altitude <= 10000)
                return '#9900CC';
            else
                return '#000';
        }

        var fitMap = function(map, polylines) {
            var bounds = new google.maps.LatLngBounds();
            var firtsStep = new google.maps.LatLng(findFirstPoint(polylines).latitude,
                findFirstPoint(polylines).longitude);
            var lastStep = new google.maps.LatLng(findLastPoint(polylines).latitude,
                findLastPoint(polylines).longitude);

            bounds.extend(firtsStep);
            bounds.extend(lastStep);
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        }

        var findFirstPoint = function(polylines) {
            for (var i = 0; i < polylines.length; i++) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        var findLastPoint = function(polylines) {
            for (var i = polylines.length - 1; i > 0; i--) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        return {
            drawPath: drawPath,
            drawMarkers: drawMarkers,
            fitMap: fitMap
        }
    }
}());

/**
 * Servicio para el manejo de las operaciones de almacenamiento en el storage
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    "use strict";

    angular.module("AdsbApp")
        .service("LocalStorageService", LocalStorageService);

    LocalStorageService.$inject = ["$window"];

    function LocalStorageService($window) {

        // Se selecciona el servicio de almacenamiento
        var store = $window.localStorage;
        var prefix = "AdsbApp_";

        // Adiciona una nueva variable
        var add = function(key, value) {
            value = angular.toJson(value);
            store.setItem(key, value);
        }

        // Obtiene una variable
        var get = function(key) {
            var value = store.getItem(key);

            if (value) {
                value = angular.fromJson(value);
            }

            return value;
        }

        // Elimina una variable
        var remove = function(key) {
            store.removeItem(key);
        }

        return {
            add: add,
            get: get,
            remove: remove
        }
    }

})();
/**
 * Servicio para el manejo de las operaciones REST
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
    'use strict';

    angular
        .module('AdsbApp')
        .service('RestService', RestService);

    RestService.$inject = ['$http', '$q', 'BaseUri'];

    function RestService($http, $q, BaseUri, LoginBaseUri) {

        // Servicio post
        var post = function(path, data) {
            return $q.resolve($http({
                method: 'POST',
                url: BaseUri.url + path,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            }));
        };

        // Servicio get
        var get = function(path) {
            return $q.resolve($http.get(BaseUri.url + path));
        };

        // Servicio login
        var login = function(path, body) {
            // todo: puede falta la adición de un config
            return $q.resolve($http.post(BaseUri.url + path, body));
        };

        return {
            post: post,
            get: get,
            login: login
        }
    }
})();
