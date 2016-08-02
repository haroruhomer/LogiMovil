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
          usuario: $scope.loginData.usuario.trim(),
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
            localStorage.setItem('pedidos', JSON.stringify(response.data));
            console.log(JSON.stringify(localStorage.getItem('pedidos')));
          }
        }, function error(response) {
          console.log("Error:" + response.status);
          $scope.pedidos = JSON.parse(localStorage.getItem('pedidos'));
          alert("No se conecto");
        })

    });
    $scope.logout = function() {
      localStorage.removeItem('placa');
      $window.location = "#/home";
    };
    $scope.sincronizar = function(){
      var pendiente = angular.isDefined(localStorage.getItem('pendientes'));
    };
  })
  .controller('pedidoCtrl', function($scope, $http, $window, $stateParams, $filter) {
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
    });

    $scope.$on('$ionicView.enter', function(event, data) {
      $scope.id = $stateParams.consecutivo;
      var pedidos = JSON.parse(localStorage.getItem('pedidos'));
      //console.log(JSON.parse(localStorage.getItem('pedidos')));
      var mipedido = $filter('filter')(pedidos, function(d) {
        return d.consecutivo === $scope.id;
      })[0];
      //console.log("pedido " + mipedido.tipodoc);
      $scope.pedido = mipedido;
      $scope.tipo = mipedido.tipodoc;
      $scope.color = "#FFFFFF";
      if (mipedido.tipodoc == "P" || mipedido.tipodoc == "A") {
        $scope.color = "#55ff55";
      }
      if (mipedido.tipodoc == "R") {
        $scope.color = "#FFFF55";
      }
      // var request = {
      //   method: 'POST',
      //   url: "http://movilweb.net/logistica/Movil/trae_pedido.php",
      //   headers: {
      //     "Content-Type": undefined
      //   },
      //   data: {
      //     consecutivo: $scope.id
      //   },
      //   dataType: 'jsonp'
      // }
      // $http(request)
      //   .then(function success(response) {
      //     if (response.data != "null") {
      //       //console.log(response.data[0].id);
      //       $scope.pedido = response.data[0];
      //       $scope.tipo = response.data[0].tipodoc;
      //       $scope.color = "#000000";
      //       if (response.data[0].tipodoc == "P") {
      //         $scope.color = "#55ff55";
      //       }
      //       if (response.data[0].tipodoc == "R") {
      //         $scope.color = "#FFFF55";
      //       }
      //     }
      //   }, function error(response) {
      //     console.log("Error:" + response.status);
      //     alert("No se conecto");
      //   });
      $scope.estadop = {value:""}; //Estado pedido
      $scope.novedadp = {value:""}; //Novedad pedido


      $scope.estador = {value:""}; //Estado Recojo
      $scope.novedadr = {value:""}; //Novedad Recojo

      $scope.inventariado={value:""};


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
        text: "Novedad en direccion",
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
        $scope.placa = localStorage.getItem('placa');
        var request = {
          method: 'POST',
          url: "http://movilweb.net/logistica/Movil/enviar.php",
          headers: {
            "Content-Type": undefined
          },
          data: {
            consecutivo: $scope.id,
            placa : localStorage.getItem('placa'),
            inventariado:$scope.inventariado.value,
            estadop: $scope.estadop.value,
            novedadp: $scope.novedadp.value,
            estador: $scope.estador.value,
            novedadr: $scope.novedadr.value,
            latitud: $scope.latitud,
            longitud: $scope.longitud

          },
          dataType: 'jsonp'
        }
        $http(request)
          .then(function success(response) {
            alert("Enviado");
            $window.location = "#/lista";
          }, function error(response) {

            alert("No se conecto");
            var pendiente = angular.isDefined(localStorage.getItem('pendientes'));
            console.log(pendiente);
            if (pendiente) {
              var pendientes=JSON.parse(localStorage.getItem('pendientes'));
              console.log(JSON.stringify(localStorage.getItem('pendientes')));
              pendientes.concat(request.data);
              var pedidos = JSON.parse(localStorage.getItem('pendientes'));
              //console.log(JSON.parse(localStorage.getItem('pedidos')));
              var mipedido = $filter('filter')(pedidos, function(d) {
                return d.consecutivo === $scope.id;
              })[0];
              console.log(mipedido);
            }else {
              localStorage.setItem(JSON.stringify(request.data));
            }
            console.log("Error:" + response.status);
          });
      } else {
        alert("No enviar");
      }
    };
    $scope.tomarFoto = function() {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        saveToPhotoAlbum: true,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {
          alert(imagedata);
          $scope.imagen1 = imageData;
        },
        function() {
          alert("error");
        },
        options)
    };
    $scope.tomarFoto2 = function() {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        saveToPhotoAlbum: true,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {
          alert(imagedata);
          $scope.imagen1 = imageData;
        },
        function() {
          alert("error");
        },
        options)
    };
    $scope.tomarFoto3 = function() {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        saveToPhotoAlbum: true,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {
          alert(imagedata);
          $scope.imagen2 = imageData;
        },
        function() {
          alert("error");
        },
        options)
    };
  });
