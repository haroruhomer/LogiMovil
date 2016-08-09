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
    $consecutivo=$request->consecutivo;
     
    $sql=mysqli_query($Link_CN,"select * from comodin where consecutivo='".trim($consecutivo)."'");
     
     while($result=mysqli_fetch_assoc($sql)){
        $output[]=$result;
     }
   
     echo json_encode($output);



}


?>