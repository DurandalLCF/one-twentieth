<?php	
	header("Content-Type:text/html;charset:utf8");//设置文件编码
	
	$name = $_GET["filename"];
	$bgnum = $_GET["bgnum"];
	
	$path = "/home/ubuntu/html/test/Uploads/".$name.".jpg";//设置路径,图片名称为IP.jpg;
	$savepath = "/home/ubuntu/html/test/Uploads/".$name."dealt.jpg";
	$com = 'python3.6 /home/ubuntu/py/face.py '.$bgnum.' '.$path.' '.$savepath.' 2>&1';
	exec($com,$out,$res);
	exec("sudo rm ".$path);
	
	$arr = array();
	$savepath = "./Uploads/".$name."dealt.jpg";
	if($res===0) {
		$arr['succ']=true;
		$arr['path']=$savepath;
	}	
	else{
		$arr['succ']=false;
		$arr['path']=null;
	}
	echo json_encode($arr);
?>
