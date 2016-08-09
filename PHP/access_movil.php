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
   if (isset($postData)) {
	   $request = json_decode($postData);
	   $user  = $request->usuario; 
	   $passw = $request->password;
	
	   $result = mysqli_query($Link_CN, "SELECT COUNT(*) FROM vehiculos WHERE placa='$user' AND password='$passw'"); 
	   $count  = mysqli_fetch_row($result);
	   $resultado = array();
	   /*como el usuario debe ser unico cuenta el numero de ocurrencias con esos datos*/
	
	
	if ($count[0]==0){
	$resultado["exito"]=false;
	//return true;
	
	}else{
	$resultado["exito"]=true;
	//return false;
	}
	
	mysqli_close($Link_CN); 
	echo json_encode($resultado);
	}  
	   
?>





 