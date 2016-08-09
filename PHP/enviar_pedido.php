<?php
	echo "Hola 0";
	if($estadop=="Entregado"){
		$id_estado=3;
		if($novedadp=="Recibió titular"){
		$id_novedad=10;
		}
		if($novedadp=="Recibió tercero en domicilio"){
		$id_novedad=8;
		}
		if($novedadp=="Entregó en otro domicilio"){
		$id_novedad=9;
		}
	}
	if($estadop=="No entregado"){
		$id_estado=4;
		
		if($novedadp=="Dirección errada"){
		$id_novedad=1;
		}
		if($novedadp=="No hay quien reciba"){
		$id_novedad=2;
		}
		if($novedadp=="No acepta pedido"){
		$id_novedad=3;
		}		
		if($novedadp=="Fuera de zona"){
		$id_novedad=4;
		}
		if($novedadp=="Siniestro"){
		$id_novedad=5;
		}
		if($novedadp=="Ya no vive en dirección"){
		$id_novedad=6;
		}
		if($novedadp=="Anulado"){
		$id_novedad=7;
		}
		if($novedadp=="No visitado"){
		$id_novedad=18;
		}
	}
	
	$sql="insert into movil(ctrint,id_generador,cedula,pedido,fecha,hora,nombre,ordencargue,concepto,id_estado,id_novedad,inventariado,parcial,facturado,latitud,longitud,usuario)values ($ctrint,$id_generador,'$cedula','$pedido',CURDATE(),curtime(),'$nombre',$id_ocargue,'$novedadp',$id_estado,$id_novedad,'$inventariado',0,0,'$latitud','$longitud','$placa')";
	mysqli_query($Link_CN,$sql);
	$sql2="insert into autopedido (ctrint,id_generador,cedula,pedido,fecha,hora,nombre,ordencargue,concepto,id_estado,id_novedad,inventariado,parcial,facturado,latitud,longitud)values ($ctrint,$id_generador,'$cedula','$pedido',CURDATE(),curtime(),'$nombre',$id_ocargue,'$novedadp',$id_estado,$id_novedad,'$inventariado',0,0,'$latitud','$longitud')";
	mysqli_query($Link_CN,$sql2);
	
?>