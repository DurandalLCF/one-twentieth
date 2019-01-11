<?php
       $ip = $_GET["userip"];                
       $filejpg = "../Uploads/"+ $ip + ".jpg";
       $filejepg = "../Uploads/" + $ip + ".jepg";
       $filepng = "../Uploads/" + $ip + ".png";
       $arr=array();
       if(!is_file($filejpg)&&!is_file($filejepg)&&!is_file($filepng)){
           $arr['succ']=false;
       }
       else{
           $arr['succ']=true;
       }
       echo json_encode($arr);


?>
