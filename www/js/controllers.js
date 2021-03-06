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
    $scope.sincronizar = function() {

      $scope.placa = localStorage.getItem('placa');
      var pendientes = JSON.parse(localStorage.getItem('pendientes'));
      for (var i = 0; i < pendientes.length; i++) {
        var request = {
          method: 'POST',
          url: "http://movilweb.net/logistica/Movil/enviar.php",
          headers: {
            "Content-Type": undefined
          },
          data: pendientes[i],
          dataType: 'jsonp'
        }
        $http(request)
          .then(function success(response) {}, function error(response) {});
      }
      localStorage.removeItem('pendientes');
      var fotos = JSON.parse(localStorage.getItem('pendientes'));
      for (var i = 0; i < fotos.length; i++) {
        var requestfotos = {
          method: 'POST',
          url: "http://movilweb.net/logistica/Movil/entrar_foto.php",
          headers: {
            "Content-Type": undefined
          },
          data: fotos[i],
          dataType: 'jsonp'
        }
        $http(request)
          .then(function success(response) {}, function error(response) {});
      }
      localStorage.removeItem('fotos');
    };
  })
  .controller('pedidoCtrl', function($scope, $http, $window, $stateParams, $filter, $ionicScrollDelegate) {
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
      var mipedido = $filter('filter')(pedidos, function(d) {
        return d.consecutivo === $scope.id;
      })[0];
      $scope.pedido = mipedido;
      $scope.tipo = mipedido.tipodoc;
      $scope.color = "#FFFFFF";
      if (mipedido.tipodoc == "P" || mipedido.tipodoc == "A") {
        $scope.color = "#55ff55";
      }
      if (mipedido.tipodoc == "R") {
        $scope.color = "#FFFF55";
      }

      $scope.imagen = "";
      $scope.imagen1 = "";
      $scope.imagen2 = "";

      $scope.estadop = {
        value: ""
      }; //Estado pedido
      $scope.novedadp = {
        value: ""
      }; //Novedad pedido


      $scope.estador = {
        value: ""
      }; //Estado Recojo
      $scope.novedadr = {
        value: ""
      }; //Novedad Recojo

      $scope.inventariado = {
        value: ""
      };


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
    $scope.borrar = function() {
      localStorage.removeItem('pendientes');
      console.log("BORRADO");
    };
    $scope.resize = function() {
      $ionicScrollDelegate.resize();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.enviar = function() {
      var enviar = confirm("¿Envia?");

      if ($scope.pedido.invent == 's' && $scope.inventariado.value == "") {
        alert("Este pedido debe ir inventariado");
        return;
      }
      if (($scope.pedido.tipodoc == "P" || $scope.pedido.tipodoc == "A") && ($scope.estadop.value == "" || $scope.novedadp.value == "")) {
        alert("Seleccione novedad o estado");
        return
      }
      if (($scope.pedido.tipodoc == "R" || $scope.pedido.tipodoc == "A") && ($scope.estador.value == "" || $scope.novedadr.value == "")) {
        alert("Seleccione novedad o estado");
        return
      }
      if (($scope.pedido.tipodoc == "P" || $scope.pedido.tipodoc == "A") && ($scope.imagen == "" && $scope.imagen1 == "" && $scope.imagen2 == "")) {
        alert("Debe enviar mínimo una foto");
        return;
      }
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
            placa: localStorage.getItem('placa'),
            inventariado: $scope.inventariado.value,
            estadop: $scope.estadop.value,
            novedadp: $scope.novedadp.value,
            estador: $scope.estador.value,
            novedadr: $scope.novedadr.value,
            latitud: $scope.latitud,
            longitud: $scope.longitud

          },
          dataType: 'jsonp'
        }
        $http(request).then(function success(response) {

        }, function error(response) {
          var pendientes = JSON.parse(localStorage.getItem('pendientes'));
          if (pendientes != null) {
            pendientes[pendientes.length] = request.data;
            localStorage.setItem('pendientes', JSON.stringify(pendientes));
            console.log(JSON.parse(localStorage.getItem('pedidos')));
            var pedidos = JSON.parse(localStorage.getItem('pedidos'));
            var mipedido = pedidos.filter(function(i) {
              return i.consecutivo != $scope.id;
            });
            console.log(mipedido);
          } else {
            var guardar = [];
            guardar[0] = request.data;
            localStorage.setItem('pendientes', JSON.stringify(guardar));
            console.log(JSON.parse(localStorage.getItem('pedidos')));
            var pedidos = JSON.parse(localStorage.getItem('pedidos'));
            var mipedido = pedidos.filter(function(i) {
              return i.consecutivo != $scope.id;
            });
            console.log(mipedido);
          }
          alert("No se conecto");
        });
        if ($scope.imagen != "") {
          var timeNow = $filter('date')(new Date(), 'yyyyMMddHHmmss');
          var name = timeNow + "_" + $scope.pedido.pedido + "_" + 1;
          var requestfoto = {
            method: 'POST',
            url: "http://movilweb.net/logistica/Movil/entrar_foto.php",
            headers: {
              "Content-Type": undefined
            },
            data: {
              pedido: $scope.pedido.pedido,
              name: name,
              imagen: $scope.imagen
            },
            dataType: 'jsonp'
          }
          $http(requestfoto).then(function success(response) {

          }, function error(response) {
            alert(response.status);
            var fotos = JSON.parse(localStorage.getItem('fotos'));
            if (fotos != null) {
              fotos[fotos.length] = requestfoto.data;
              localStorage.setItem('fotos', JSON.stringify(fotos));
            } else {
              var guardar = [];
              guardar[0] = requestfoto.data;
              localStorage.setItem('fotos', JSON.stringify(guardar));
            }
          });
        }
        if ($scope.imagen1 != "") {
          var timeNow = $filter('date')(new Date(), 'yyyyMMddHHmmss');
          var name = timeNow + "_" + $scope.pedido.pedido + "_" + 2;
          var requestfoto1 = {
            method: 'POST',
            url: "http://movilweb.net/logistica/Movil/entrar_foto.php",
            headers: {
              "Content-Type": undefined
            },
            data: {
              pedido: $scope.pedido.pedido,
              name: name,
              imagen: $scope.imagen1
            },
            dataType: 'jsonp'
          }
          $http(requestfoto1).then(function success(response) {

          }, function error(response) {
            var fotos = JSON.parse(localStorage.getItem('fotos'));
            if (fotos != null) {
              fotos[fotos.length] = requestfoto1.data;
              localStorage.setItem('fotos', JSON.stringify(fotos));
            } else {
              var guardar = [];
              guardar[0] = requestfoto1.data;
              localStorage.setItem('fotos', JSON.stringify(guardar));
            }
            alert("No se conecto");
          });
        }
        if ($scope.imagen2 != "") {
          var timeNow = $filter('date')(new Date(), 'yyyyMMddHHmmss');
          var name = timeNow + "_" + $scope.pedido.pedido + "_" + 3;
          var requestfoto2 = {
            method: 'POST',
            url: "http://movilweb.net/logistica/Movil/entrar_foto.php",
            headers: {
              "Content-Type": undefined
            },
            data: {
              pedido: $scope.pedido.pedido,
              name: name,
              imagen: $scope.imagen2
            },
            dataType: 'jsonp'
          }
          $http(requestfoto2).then(function success(response) {

          }, function error(response) {
            var fotos = JSON.parse(localStorage.getItem('fotos'));
            if (fotos != null) {
              fotos[fotos.length] = requestfoto2.data;
              localStorage.setItem('fotos', JSON.stringify(fotos));
            } else {
              var guardar = [];
              guardar[0] = requestfoto2.data;
              localStorage.setItem('fotos', JSON.stringify(guardar));
            }
            alert("No se conecto");
          });
        }
        $window.location = "#/lista";
      } else {
        alert("No enviar");
      }
    };
    $scope.tomarFoto = function() {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 20,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {

          $scope.imagen = imageData;
        },
        function() {
          alert("error");
        },
        options)
    };
    $scope.tomarFoto2 = function() {
      var options = {
        // Some common settings are 20, 50, and 100
        quality: 20,
        destinationType: Camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {

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
        quality: 20,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true //Corrects Android orientation quirks
      };
      navigator.camera.getPicture(function(imageData) {

          $scope.imagen2 = imageData;

        },
        function() {
          alert("error");
        },
        options)
    };
  });
