<?php
        header("Content-Type:text/html;charset:utf8");//设置文件编码

        $name = $_POST["filename"];
        $img = $_FILES["uploadImg"];//获取到表单过来的文件变量，uploadImg为表单id
	$arr = array();
	$arr['succ']=false;
		
        //检测变量是否获取到
        if(isset($img)){
        //上传成功$img中的属性error为0，当error>0时则上传失败有一下几种情况
                if($img['error']>0){
                        $error = '上传失败';
                        switch('error'){
                                case 1: $error.='大小超过了服务器设置的限制！';break;
                                case 2: $error.='文件大小超过了表单设置的限制！';break;
                                case 3: $error.='文件只有部分被上传';break;
                                case 4: $error.='没有文件被上传';break;
                                case 6: $error.='上传文件的临时目录不存在！';break;
                                case 7: $error.='写入失败';break;
                                default: $error.='未知错误';break;
                        }
                        exit($error);//在php页面输出错误
                }
                else{
                        $path = "./Uploads/".$name.".jpg";//设置路径,图片名称为IP.jpg;
                        move_uploaded_file($img['tmp_name'], $path);//将图片文件移到该目录下
			$arr['succ']=true;
                }
        }
	echo json_encode($arr);
?>

