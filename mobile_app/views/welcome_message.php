<?php
	//header("HTTP/1.0 404 Not Found");
	header("Access-Control-Allow-Methods: GET, OPTIONS, POST, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
	header('Access-Control-Allow-Origin: *');
	echo json_encode($data);
?>