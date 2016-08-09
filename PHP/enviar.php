<?php
 if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }

	 include("conexionmovil.php");	

	$postData = file_get_contents("php://input");
	$request = json_decode($postData);
	$consecutivo=$request->consecutivo;
	$placa=$request->placa;
	$inventariado=$request->inventariado;
	$estadop=$request->estadop;
	$novedadp=$request->novedadp;
	$estadore=$request->estador;
	$novedadr=$request->novedadr;
	$latitud=$request->latitud;
	$longitud=$request->longitud;
	$id_estado=0;
	$sql="select * from comodin where consecutivo='".trim($consecutivo)."'";
	$result=mysqli_query($Link_CN,$sql);

	while($dato=mysqli_fetch_assoc($result)){
		$ctrint=$dato['ctrint'];
		$ctrintrec=$dato['ctrintrec'];
		$id_generador=$dato['id_generador'];
		$id_ocargue=$dato['id_ocargue'];
		$id_ocarguerec=$dato['id_ocarguerec'];
		$cajas=$dato['cajas'];
		$cedula=$dato['cedula'];
		$nombre=$dato['nombre'];
		$pedido=$dato['pedido'];
		$tipo_doc=$dato['tipodoc'];
		$boleta=$dato['boleta'];
	}

	if($tipo_doc=="P"){
		include("enviar_pedido.php");
	}
					    	
	if($tipo_doc=="R"){
		include("enviarrecojo.php");
	}
	
	if($tipo_doc=="A"){
		include("enviar_pedido.php");
		include("enviarrecojo.php");
	}
	
	$sql="delete from comodin where consecutivo=$consecutivo";
	mysqli_query($Link_CN,$sql);
?>