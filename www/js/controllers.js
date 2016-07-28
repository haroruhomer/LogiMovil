angular.module('logimovil.controllers',[])
	.controller('loginCtrl',function($scope,$http, $rootScope,$window){
		$scope.loginData={};

		$scope.logearse=function(){
			var request={
				method:'POST',
				url:"http://movilweb.net/logistica/Movil/access_movil.php",
				headers:{
					'Content-Type': undefined
				},
				data:{usuario:$scope.loginData.usuario,password:$scope.loginData.password},
				timeout:15000
			}

			$http(request)
				.then(function success(response){
					if (response.data.exito==true) {
						localStorage.setItem('placa',$scope.loginData.usuario);
						$window.location="#/lista";
					}
				}, function error(response){
					console.log("Error:" +response.status);
					alert("No se pudo conectar "+ response.status);
				});
		}

	})
	.controller('listaCtrl', function($scope, $http, $rootScope, $window){
		$scope.$on('$ionicView.enter', function(event,data){
			$scope.pedidos=[];
			$scope.placa=localStorage.getItem('placa');
			var request={
				method:'POST',
				url:"http://movilweb.net/logistica/Movil/listarpedidos.php",
				headers:{
					'Content-Type':undefined
				},
				data:{placa:localStorage.getItem('placa')},
				dataType:'jsonp'
			}
			$http(request)
				.then(function success(response){
					if(response.data!="null"){
						$scope.pedidos=response.data;
					}
				}, function error(response){
					console.log("Error:" +response.status);
					alert("No se conecto");
				})

			});
			$scope.logout=function(){
				localStorage.removeItem('placa');
				$window.location="#/home";
			};
	})
	.controller('pedidoCtrl', function($scope,$http, $window, $stateParams)
		$scope.$on('$ionicView.enter',function(event,data){
			$scope.pedidos=[];
			$scope.id=$stateParams.consecutivo;
			var request={
				method:'POST',
				url:"http://movilweb.net/logistica/Movil/trae_phpver22.php",
			}
		});