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
	$name=$request->name;
	$pedido=$request->pedido;
	$imagedata=$request->imagen;
	//$name  =$_REQUEST['name'] ; 
	//$pedido  =$_REQUEST['pedido'] ; 
	//$imagedata = $_REQUEST['photo'];
	
	$string = chunk_split(base64_encode($imagedata), 64, "\n");
//	$string =  base64_decode($_REQUEST['photo']);

	$stmt = "INSERT INTO fotomovil(name,pedido,photo) values ('$name','$pedido','$string')";
	
	$sql = mysqli_query($Link_CN, $stmt);
	
	//mysqli_close();   	   
?>





 