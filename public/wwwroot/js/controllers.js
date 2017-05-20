/**
 * Controller for draw in GoogleMapApi
 *
 * @author Nelson D. Padilla
 * @since 17-dic-2016
 *
 */

(function() {
  "use strict";

  angular.module("AdsbApp")
    .controller("RowlotController", RowlotController)
    .controller("TaskController", TaskController);

  RowlotController.$inject = ['$scope', '$timeout', 'RowlotService', "CurrentUserService", "toastr"];

  function RowlotController($scope, $timeout, RowlotService, CurrentUserService, toastr) {

    $scope.users = [];
    $scope.profile = [];
    $scope.unidades = [];
    $scope.lecturas = [];
    $scope.countMoneyUser = 0;

    var loadCurrentUser = function() {
      return RowlotService.getCurrentUser().then(function(response) {
        //console.log("user",response)
        $scope.profile = response;
        var typeStudent = showStudent($scope.profile.Tipo);
        $scope.showStudent = typeStudent;
        var typeTeacher = showTeacher($scope.profile.Tipo);
        $scope.showTeacher = typeTeacher;
        //console.log("SHOW", type);
      }, function(error) {
        toastr.error("Error al cargar usuario");
        console.log(error);
      });
    }

    var loadUsers = function() {
      return RowlotService.getUsers().then(function(response) {
        //    console.log("Users", response);

        for (var i in response) {
          if (response[i].data.Tipo == "Estudiante") {
            $scope.countMoneyUser += response[i].data.Moneda;
            $scope.users.push(response[i]);
          }
        }
        //$scope.users = response;
        //console.log("ENTRO ACTIVIDAD",$scope.users);
        // console.log("SCOPE USERS",$scope.users);
      }, function(error) {
        toastr.error("Error al cargar usuarios");
        console.log(error);
      });
    }



    var loadCurrentUnidad = function() {
      return RowlotService.getCurrentUnidad().then(function(response) {
        // console.log("aaaaaa",response)
        $scope.unidades = response;
        console.log("VISIBLE", $scope.unidades.Visible);
        var visibleSi = showActivity($scope.unidades.Visible);
        $scope.showActivity = visibleSi;
        var visibleNo = NoShowActivity($scope.unidades.Visible);
        $scope.NoShowActivity = visibleNo;
        console.log("SHOW", visible);
      }, function(error) {
        toastr.error("Error al cargar usuario");
        console.log(error);
      });
    }

    var loadUnidades = function() {
      return RowlotService.getUnidades().then(function(response) {
        // console.log("Actividades", response);
        for (var i in response) {
          let copy = angular.copy(response[i]);
          if (typeof response[i].data.task != "undefined") {
            copy.data.task = [];
            angular.forEach(response[i].data.task, function(value, key) {
              copy.data.task.push(value);
            });
          }
          $scope.unidades.push(copy);
        }
        //$scope.unidades = response;
        //console.log("ENTRO ACTIVIDAD",$scope.unidades);
      }, function(error) {
        toastr.error("Error al cargar las unidades");
        console.log(error);

      });
    }

    var loadLecturas = function() {
      return RowlotService.getLecturas().then(function(response) {
        //    console.log("Users", response);
        $scope.lecturas = response;
        console.log("ENTRO LECTURA", $scope.lecturas);
        // console.log("SCOPE USERS",$scope.users);
      }, function(error) {
        toastr.error("Error al cargar lecturas");
        console.log(error);
      });
    }

    var getMisc = function() {
      return RowlotService.getMisc().then(function(response) {
        $scope.misc = response;
      }).catch(function(response) {
        console.error("catch", response);
      });
    }
    /*
    $scope.addTitleActividad = function(tareaId, title){
        console.log("Actividades");
        var val = angular.element('#'+tareaId).val();
        var newTitle = parseInt(coins)+parseInt(val);
        RowlotService.updateTitleActividad(tareaId, newTitle);
        angular.element('#'+tareaId).val();
        $scope.unidades = [];
        loadUsers();
        loadCurrentUser();
    }
    */




    $scope.addCoins = function(userId, coins) {
      var val = angular.element('#' + userId).val();
      var newCoins = parseInt(coins) + parseInt(val);
      RowlotService.updateCoins(userId, newCoins);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }

    $scope.substratCoins = function(userId, coins) {
      var val = angular.element('#' + userId).val();
      var newCoins = parseInt(coins) - parseInt(val);
      RowlotService.updateCoins(userId, newCoins);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }

    $scope.addMedalla = function(userId, metal) {
      var val = angular.element('#metal-' + userId).val();
      var newMedalla = parseInt(metal) + parseInt(val);
      RowlotService.updateMedalla(userId, newMedalla);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }

    $scope.substratMedalla = function(userId, coins) {
      var val = angular.element('#metal-' + userId).val();
      var newMedalla = parseInt(coins) - parseInt(val);
      RowlotService.updateMedalla(userId, newMedalla);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }


    $scope.addVida = function(userId, life) {
      var val = angular.element('#life-' + userId).val();
      var newVida = parseInt(life) + parseInt(val);
      RowlotService.updateVida(userId, newVida);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }

    $scope.substratVida = function(userId, life) {
      var val = angular.element('#life-' + userId).val();
      var newVida = parseInt(life) - parseInt(val);
      RowlotService.updateVida(userId, newVida);
      angular.element('#' + userId).val();
      $scope.users = [];
      loadUsers();
      loadCurrentUser();
    }

    $scope.showEditMoney = function() {
      if ($scope.showMoney) {
        $scope.showMoney = false;
      } else {
        $scope.showMoney = true;
      }
    }

    $scope.setMaxMoney = function() {

      RowlotService.setMaxMoney($scope.misc.newMaxMoney).then(function(data) {
        $scope.misc.maxMoney = angular.copy($scope.misc.newMaxMoney);
        $scope.showEditMoney();
      }).catch(function(err) {
        console.error(err)
      })
    }

    $scope.addUnidad = function() {

      RowlotService.addUnidad($scope.unidad)
        .then(function(response) {
          $scope.unidad = {};
          $scope.unidades.push(response);
          $("#miUnidad").modal("hide");
        })
        .catch(function(err) {
          console.error(err);
        });
    }

    $scope.showTaskModel = function(idUnidad) {
      $scope.unidadSelected = idUnidad;
      $("#miTask").modal("show");
    }

    $scope.addTask = function() {
      RowlotService.addTask($scope.unidadSelected, $scope.task)
        .then(function(response) {
          $scope.task = {};
          $scope.unidadSelected = "";
          $scope.unidades.push(response);
          $("#miTask").modal("hide");
        })
        .catch(function(err) {
          console.error(err);
        });
    }



    /* var showActivity = function(visible){
        return visible=="si";
    }


    var NoShowActivity = function(visible){
        return visible=="no";
    }
    */

    var showStudent = function(type) {
      return type == "Estudiante";
    }

    var showTeacher = function(type) {
      return type == "Profesor";
    }

    var init = function() {
      $scope.showMoney = true;
      loadUsers();
      loadCurrentUser();
      loadCurrentUnidad();
      loadUnidades();
      loadLecturas();
      getMisc();
    }();

  }

  TaskController.$inject = ['$scope', '$timeout', 'RowlotService', "CurrentUserService", "toastr", '$stateParams', '$state'];

  function TaskController($scope, $timeout, RowlotService, CurrentUserService, toastr, $stateParams, $state) {

    if (typeof $stateParams.idTask === "undefined" || $stateParams.idTask === "") {
      $state.go('auth.rowlot-listtask');
    }

    $scope.idUnidad = $stateParams.idUnidad;
    $scope.idTask = $stateParams.idTask;

    $scope.func = {
      init: function() {
        RowlotService.getCurrentUser().then(function(response) {
          $scope.profile = response;

          if ($scope.profile.Tipo == "Estudiante") {
            $scope.showStudent = true;
          } else {
            $scope.showTeacher = true;
          }
          $scope.func.getTask();
        }, function(error) {
          console.log(error);
        });
      },
      getTask: function() {
        RowlotService.getTask($scope.idUnidad)
          .then(function(response) {
            if (angular.isDefined(response.task)) {
              angular.forEach(response.task, function(value, key) {
                if ($scope.idTask == key) {
                  $scope.task = value;
                }
              });
            } else {
              $state.go('auth.rowlot-listtask');
            }
            $scope.unidad = response;
          })
          .catch(function(err) {
            console.error(err);
          });
      },
      sendFile: function() {
        var element = document.getElementById("file");
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('images/' + element.files[0].name).put(element.files[0]);

        uploadTask.on('state_changed', function(snapshot) {
          console.log(snapshot);
        }, function(error) {
          console.error(error);
        }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
          ];
          var date = new Date();
          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();

          var fecha = day + ' ' + monthNames[monthIndex] + ' ' + year;

          $scope.profile.uid = firebase.auth().currentUser.uid;

          var profile = {
            nombre = $scope.profile.nombre,
            apellido = $scope.profile.apellido,
            correo = $scope.profile.correo,
          }
          
          var data = {
            downloadurl: downloadURL,
            entregado: "Si",
            fecha: fecha,
            profile : profile
          };

          RowlotService.putTask($scope.idUnidad, $scope.idTask,data)
            .then(function(data) {
              console.log(data);
            }).catch(function(error) {
              console.error(error);
            });
        });
      }
    }

  }
}());

/**
 * Controller de la página de autenticación (Login)
 *
 * @author demorales13@gmail.com
 * @since 3-dic-2016
 *
 */

(function() {
  "use strict";

  angular.module("AdsbApp")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["$scope", "$rootScope", "LoginService", "CurrentUserService", "LoginRedirectService", "toastr"];

  function LoginController($scope, $rootScope, LoginService, CurrentUserService, LoginRedirectService, toastr) {

    $scope.credentials = {
      username: "",
      password: ""
    }

    // Instancia del usuario actual
    $scope.user = CurrentUserService.profile;

    // Inicio de sesión
    $scope.login = function(form) {
      if (form.$valid) {
        LoginService.login($scope.credentials)
          .then(function(response) {

            LoginRedirectService.redirectPostLogin();

          }, function(error) {

            toastr.error("No se pudo ejecutar la operación");
            console.log(error);

          });

        $scope.credentials.password = "";
        form.$setUntouched();
      }
    }
    //Registro
    $scope.signup = function(form) {
      if (form.$valid) {
        console.log($scope.credentials);
        LoginService.signup($scope.credentials).then(function(response) {
          LoginRedirectService.redirectPostLogin();
        }, function(error) {
          toastr.error("No se pudo ejecutar la operación");
          console.log(error);
        });
        $scope.credentials.password = "";
        form.$setUntouched();
      }
    }
    // Cierre de sesión - Se eliminan datos del usuario y se redirecciona a la página de login
    $scope.logout = function() {
      firebase.auth().signOut().then(function() {
        LoginService.logout();
        LoginRedirectService.redirectPostLogout();
      }, function(error) {
        // An error happened.
      });
    }

    var init = function() {
      // Row Toggler
      // -----------------------------------------------------------------
      $('#demo-foo-row-toggler').footable();

      // Accordion
      // -----------------------------------------------------------------
      $('#demo-foo-accordion').footable().on('footable_row_expanded', function(e) {
        $('#demo-foo-accordion tbody tr.footable-detail-show').not(e.row).each(function() {
          $('#demo-foo-accordion').data('footable').toggleDetail(this);
        });
      });

      // Pagination
      // -----------------------------------------------------------------
      $('#demo-foo-pagination').footable();
      $('#demo-show-entries').change(function(e) {
        e.preventDefault();
        var pageSize = $(this).val();
        $('#demo-foo-pagination').data('page-size', pageSize);
        $('#demo-foo-pagination').trigger('footable_initialized');
      });

      // Filtering
      // -----------------------------------------------------------------
      var filtering = $('#demo-foo-filtering');
      filtering.footable().on('footable_filtering', function(e) {
        var selected = $('#demo-foo-filter-status').find(':selected').val();
        e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
        e.clear = !e.filter;
      });

      // Filter status
      $('#demo-foo-filter-status').change(function(e) {
        e.preventDefault();
        filtering.trigger('footable_filter', {
          filter: $(this).val()
        });
      });

      // Search input
      $('#demo-foo-search').on('input', function(e) {
        e.preventDefault();
        filtering.trigger('footable_filter', {
          filter: $(this).val()
        });
      });


      // Search input
      $('#demo-input-search2').on('input', function(e) {
        e.preventDefault();
        addrow.trigger('footable_filter', {
          filter: $(this).val()
        });
      });

      // Add & Remove Row
      var addrow = $('#demo-foo-addrow');
      addrow.footable().on('click', '.delete-row-btn', function() {

        //get the footable object
        var footable = addrow.data('footable');

        //get the row we are wanting to delete
        var row = $(this).parents('tr:first');

        //delete the row
        footable.removeRow(row);
      });
      // Add Row Button
      $('#demo-btn-addrow').click(function() {

        //get the footable object
        var footable = addrow.data('footable');

        //build up the row we are wanting to add
        var newRow = '<tr><td>thome</td><td>Woldt</td><td>Airline Transport Pilot</td><td>3 Oct 2016</td><td><span class="label label-table label-success">Active</span></td><td><button type="button" class="btn btn-sm btn-icon btn-pure btn-outline delete-row-btn" data-toggle="tooltip" data-original-title="Delete"><i class="ti-close" aria-hidden="true"></i></button></td></tr>';

        //add it
        footable.appendRow(newRow);
      });


    }();
  }

}());


(function() {
  "use strict";

  angular.module("AdsbApp")
    .controller("SideMenuController", SideMenuController);


  SideMenuController.$inject = ["$rootScope", "$scope", "$state", "$stateParams", "$timeout"];

  function SideMenuController($rootScope, $scope, $state, $stateParams, $timeout) {

    $scope.sections = [{
        id: 0,
        title: "Dashboard",
        icon: "mdi mdi-table fa-fw",
        link: "auth.rowlot-dasboarh"
      }, {
        id: 1,
        title: "Ranking",
        icon: "mdi mdi-table fa-fw",
        link: "auth.rowlow-listtask"
      }, {
        id: 2,
        title: "Tareas",
        icon: "mdi mdi-table fa-fw",
        submenu: [{
          title: "KRDU",
          link: "auth.aircraft-livetraffic-01"
        }, {
          title: "KLZU",
          link: "auth.aircraft-livetraffic-02"
        }]
      }, {
        id: 3,
        title: "NMACs",
        icon: "fa fa-paper-plane-o first_level_icon",
        link: "auth.aircraft-nmacs"
      },

    ];

    // accordion menu
    $(document).off("click", ".side_menu_expanded #main_menu .has_submenu > a").on("click", ".side_menu_expanded #main_menu .has_submenu > a", function() {
      if ($(this).parent(".has_submenu").hasClass("first_level")) {
        var $this_parent = $(this).parent(".has_submenu"),
          panel_active = $this_parent.hasClass("section_active");

        if (!panel_active) {
          $this_parent.siblings().removeClass("section_active").children("ul").slideUp("200");
          $this_parent.addClass("section_active").children("ul").slideDown("200");
        } else {
          $this_parent.removeClass("section_active").children("ul").slideUp("200");
        }
      } else {
        var $submenu_parent = $(this).parent(".has_submenu"),
          submenu_active = $submenu_parent.hasClass("submenu_active");

        if (!submenu_active) {
          $submenu_parent.siblings().removeClass("submenu_active").children("ul").slideUp("200");
          $submenu_parent.addClass("submenu_active").children("ul").slideDown("200");
        } else {
          $submenu_parent.removeClass("submenu_active").children("ul").slideUp("200");
        }
      }
    });

    $rootScope.createScrollbar = function() {
      $("#main_menu .menu_wrapper").mCustomScrollbar({
        theme: "minimal-dark",
        scrollbarPosition: "outside"
      });
    };

    $rootScope.destroyScrollbar = function() {
      $("#main_menu .menu_wrapper").mCustomScrollbar("destroy");
    };

    $timeout(function() {
      if (!$rootScope.sideNavCollapsed && !$rootScope.topMenuAct) {
        if (!$("#main_menu .has_submenu").hasClass("section_active")) {
          $("#main_menu .has_submenu .act_nav").closest(".has_submenu").children("a").click();
        } else {
          $("#main_menu .has_submenu.section_active").children("ul").show();
        }
        // init scrollbar
        $rootScope.createScrollbar();
      }
    });


  }
})();


(function() {
  'use strict';
  angular
    .module('AdsbApp')
    // .service('RestService', RestService);

    .controller('AppCtrl', function($scope) {
      $scope.users = ['Teoria de la Autodeterminación', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];
    });


})();
