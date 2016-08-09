<?php

		if($estadore=="Recibido"){
			
			$id_estado=3;
			
			if($novedadr=="Recibe sin novedad"){
			$id_novedad=6;
			echo $novedadr;
			}

			if($novedadr=="En otro domicilio"){
			$id_novedad=8;
			echo $novedadr;
			}
			if($novedadr=="Tercero en domicilio"){
			$id_novedad=7;
			echo $novedadr;
			}

			if($novedadr=="Novedad en direccion"){
			$id_novedad=9;
			echo $novedadr;
			}

		}
		
		if($estadore=="No recibido"){
			$id_estado=4;
			echo $novedadr;
			
			if($novedadr=="Direccion Errada"){
				$id_novedad=1;
				echo $novedadr;
			}
			if($novedadr=="Referencia no coincide"){
				$id_novedad=2;
				echo $novedadr;
			}
			if($novedadr=="Diferencia en unidades"){
				$id_novedad=3;
				echo $novedadr;
			}		
			if($novedadr=="No hay quien entregue"){
				$id_novedad=4;
				echo $novedadr;
			}
			if($novedadr=="No visitado"){
				$id_novedad=5;
				echo $novedadr;
			}
			if($novedadr=="Mercancia averiada"){
				$id_novedad=10;
				echo $novedadr;
			}	
		}
	
	$sql="insert into movilrec(ctrint,id_generador,cedula,pedido,fecha,hora,nombre,ordencargue,concepto,id_estado,id_novedad,facturado,latitud,longitud,usuario)values ($ctrintrec,$id_generador,'$cedula','$pedido',CURDATE(),curtime(),'$nombre',$id_ocargue,'$novedadr',$id_estado,$id_novedad,0,'$latitud','$longitud','$placa')";
	echo $sql;
	mysqli_query($Link_CN,$sql);
?>