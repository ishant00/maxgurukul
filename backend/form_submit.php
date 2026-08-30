<?php
header('Content-Type: application/json; charset=utf-8');
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['error'=>'POST required']);exit;}
$name=trim($_POST['name']??'');$phone=trim($_POST['phone']??'');$email=trim($_POST['email']??'');$interest=trim($_POST['interest']??'General');$message=trim($_POST['message']??'');
if($name===''||$phone===''||$message===''){http_response_code(422);echo json_encode(['error'=>'Name, phone and message are required.']);exit;}
$file=__DIR__.'/enquiries.json';$rows=file_exists($file)?json_decode((string)file_get_contents($file),true):[];if(!is_array($rows))$rows=[];
array_unshift($rows,['id'=>time().random_int(10,99),'created_at'=>gmdate('c'),'name'=>substr($name,0,120),'phone'=>substr($phone,0,30),'email'=>substr($email,0,160),'interest'=>substr($interest,0,80),'message'=>substr($message,0,2000),'is_read'=>false]);$rows=array_slice($rows,0,2000);
$dir=dirname($file);if(!is_dir($dir))mkdir($dir,0755,true);$tmp=$file.'.tmp';if(file_put_contents($tmp,json_encode($rows,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE),LOCK_EX)===false||!rename($tmp,$file)){@unlink($tmp);http_response_code(500);echo json_encode(['error'=>'Could not save enquiry']);exit;}echo json_encode(['ok'=>true]);
