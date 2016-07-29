angular.module('logimovil.controllers', [])
  .controller('loginCtrl', function($scope, $http, $rootScope, $window) {
    $scope.loginData = {};

    $scope.logearse = function() {
      var request = {
        method: 'POST',
        url: "http://movilweb.net/logistica/Movil/access_movil.php",
        headers: {
          'Content-Type': undefined
        },
        data: {
          usuario: $scope.loginData.usuario,
          password: $scope.loginData.password
        },
        timeout: 15000
      }

      $http(request)
        .then(function success(response) {
          if (response.data.exito == true) {
            localStorage.setItem('placa', $scope.loginData.usuario);
            $window.location = "#/lista";
          }
        }, function error(response) {
          console.log("Error:" + response.status);
          alert("No se pudo conectar " + response.status);
        });
    }

  })
  .controller('listaCtrl', function($scope, $http, $rootScope, $window) {
    $scope.$on('$ionicView.enter', function(event, data) {
      $scope.pedidos = [];
      $scope.placa = localStorage.getItem('placa');
      var request = {
        method: 'POST',
        url: "http://movilweb.net/logistica/Movil/listarpedidos.php",
        headers: {
          'Content-Type': undefined
        },
        data: {
          placa: localStorage.getItem('placa')
        },
        dataType: 'jsonp'
      }
      $http(request)
        .then(function success(response) {
          if (response.data != "null") {
            $scope.pedidos = response.data;
          }
        }, function error(response) {
          console.log("Error:" + response.status);
          alert("No se conecto");
        })

    });
    $scope.logout = function() {
      localStorage.removeItem('placa');
      $window.location = "#/home";
    };
  })
  .controller('pedidoCtrl', function($scope, $http, $window, $stateParams) {
    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      $scope.latitud = 0;
      $scope.longitud = 0;
      $scope.precision = 0;

      navigator.geolocation.getCurrentPosition(
        function(position) {
          $scope.latitud = position.coords.latitude;
          $scope.longitud = position.coords.longitude;
          $scope.precision = position.coords.accuracy;
        },
        function(error) {

        }, {
          enableHighAccuracy: true
        }
      );
      console.log("State Params: ", data.stateParams);
    });

    $scope.$on('$ionicView.enter', function(event, data) {
      $scope.id = $stateParams.consecutivo;

      var request = {
        method: 'POST',
        url: "http://movilweb.net/logistica/Movil/trae_pedido.php",
        headers: {
          "Content-Type": undefined
        },
        data: {
          consecutivo: $scope.id
        },
        dataType: 'jsonp'
      }
      $http(request)
        .then(function success(response) {
          if (response.data != "null") {
            console.log(response.data[0].id);
            $scope.pedido = response.data[0];
            $scope.tipo = response.data[0].tipodoc;
          }
        }, function error(response) {
          console.log("Error:" + response.status);
          alert("No se conecto");
        });
      $scope.estado = "";
      $scope.novedad = "";

      $scope.pedidos = [];
      //Lista para los select estados de pedido
      $scope.estadopedido = [{
        text: "Entregado",
        value: 3
      }, {
        text: "No entregado",
        value: 4
      }];
      //Lsta para los select estados de recojo
      $scope.estadorecojo = [{
        text: "Recibido",
        value: 3
      }, {
        text: "No recibido",
        value: 4
      }];
      //Novedades de pedido entregado
      $scope.entregado = [{
        text: "Recibió titular",
        value: 10
      }, {
        text: "Recibió tercero en domicilio",
        value: 8
      }, {
        text: "Entregó en otro domicilio",
        value: 9
      }];
      //Novedades de pedido no entregado
      $scope.noentregado = [{
        text: "Dirección errada",
        value: 1
      }, {
        text: "No hay quien reciba",
        value: 2
      }, {
        text: "No acepta pedido",
        value: 3
      }, {
        text: "Fuera de zona",
        value: 4
      }, {
        text: "Siniestro",
        value: 5
      }, {
        text: "Ya no vive en dirección",
        value: 6
      }, {
        text: "Anulado",
        value: 7
      }, {
        text: "No visitado",
        value: 18
      }, ];
      //novedades recojo recibido
      $scope.recibido = [{
        text: "Recibe sin novedad",
        value: 6
      }, {
        text: "Tercero en domicilio",
        value: 7
      }, {
        text: "En otro domicilio",
        value: 8
      }, {
        text: "Novedad en dirección",
        value: 9
      }];
      //Novedades recojo no recibido
      $scope.norecibido = [{
        text: "Dirección Errada",
        value: 1
      }, {
        text: "Referencia no coincide",
        value: 2
      }, {
        text: "Diferencia en unidades",
        value: 3
      }, {
        text: "No hay quien entregue",
        value: 4
      }, {
        text: "No visitado",
        value: 5
      }, {
        text: "Mercancia averiada",
        value: 10
      }];

    })
    $scope.enviar = function() {
      var enviar = confirm("¿Enviar?");
      if (enviar == true) {
        alert("enviar");
      } else {
        alert("No enviar");
      }
    };
  });
