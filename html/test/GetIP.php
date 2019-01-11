<?php
	$realip = false;
	if(isset($_SERVER)){
		if(isset($_SERVER['HTTP_X_FORWARDED_FOR'])){
			$realip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }else if(isset($_SERVER['HTTP_CLIENT_IP'])){
			$realip=$_SERVER['HTTP_CLIENT_IP'];
		}else{
			$realip=$_SERVER['REMOTE_ADDR'];
		}
	}else{
        if(getenv('HTTP_X_FORWARDED_FOR')){
            $realip=getenv('HTTP_X_FORWARDED_FOR');
        }else if(getenv('HTTP_CLIENT_IP')){
            $realip=getenv('HTTP_CLIENT_IP');
        }else{
            $realip=getenv('REMOTE_ADDR');
		}
	}
	
	$sqlname = "localhost";
	$user = "root";
	$pass = "123456";
	$dbname = "message";
	$conn = new mysqli($sqlname,$user,$pass,$dbname);
	
	if ($conn->connect_error) {
        die("连接失败：".$conn->connect_error);
	}
	
	$sql = "insert into ipaddr values('$realip');";
	$conn->query($sql);
	$sql = "select count(*) from ipaddr;";
	$result = $conn->query($sql);
	$ranking = $result->fetch_assoc()["count(*)"];

	$realip = str_replace(".","_",$realip);
	
	$arr = array();
	$arr["ip"] = $realip;
	$arr["rank"] = $ranking;
	echo json_encode($arr);

	$result->free();
	$conn->close();
?>
