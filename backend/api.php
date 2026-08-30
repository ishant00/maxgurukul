<?php
require_once __DIR__ . '/../admin/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
function out($data,$code=200){http_response_code($code);echo json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);exit;}
function store($file,$fallback=[]){if(!file_exists($file))return $fallback;$x=json_decode((string)file_get_contents($file),true);return is_array($x)?$x:$fallback;}
function save_store($file,$data){$dir=dirname($file);if(!is_dir($dir))mkdir($dir,0755,true);$tmp=$file.'.tmp';if(file_put_contents($tmp,json_encode($data,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE),LOCK_EX)===false||!rename($tmp,$file)){@unlink($tmp);out(['error'=>'Storage write failed'],500);} }
$action=$_GET['action']??$_POST['action']??'';
if($action==='session'){out(['authenticated'=>is_logged_in(),'user'=>$_SESSION['admin']??null]);}
if($action==='login'){if($_SERVER['REQUEST_METHOD']!=='POST')out(['error'=>'POST required'],405);$u=trim($_POST['username']??'');$p=(string)($_POST['password']??'');if(hash_equals(ADMIN_USER,$u)&&ADMIN_PASS_HASH!==''&&password_verify($p,ADMIN_PASS_HASH)){session_regenerate_id(true);$_SESSION['admin']=ADMIN_USER;$_SESSION['last_seen']=time();out(['ok'=>true]);}out(['error'=>'Invalid credentials'],401);}
if($action==='logout'){admin_logout();out(['ok'=>true]);}
if(!is_logged_in())out(['error'=>'Authentication required'],401);
$cms=__DIR__.'/cms_storage.json';$enq=__DIR__.'/enquiries.json';$module=$_GET['module']??$_POST['module']??'';
if($action==='list'){if($module==='enquiries'){out(store($enq,[]));}$rows=store($cms,[]);out(array_values(array_filter($rows,fn($r)=>($r['module']??'')===$module&&($r['is_published']??true))));}
if($action==='save'){ $rows=store($cms,[]);$id=(int)($_POST['id']??0);$row=['id'=>$id?:time(),'module'=>$module,'title'=>trim($_POST['title']??''),'body'=>trim($_POST['body']??''),'image_url'=>trim($_POST['image_url']??''),'sort_order'=>(int)($_POST['sort_order']??0),'is_published'=>!empty($_POST['is_published'])];$found=false;foreach($rows as $i=>$old){if((int)($old['id']??0)===$id&&$id){$rows[$i]=$row;$found=true;}}if(!$found)$rows[]=$row;save_store($cms,$rows);out(['ok'=>true,'item'=>$row]);}
if($action==='delete'){ $rows=array_values(array_filter(store($cms,[]),fn($r)=>(int)($r['id']??0)!==(int)($_POST['id']??0)));save_store($cms,$rows);out(['ok'=>true]);}
if($action==='enquiry_status'){ $rows=store($enq,[]);foreach($rows as &$r)if((int)$r['id']===(int)($_POST['id']??0))$r['is_read']=($_POST['status']??'')==='read';save_store($enq,$rows);out(['ok'=>true]);}
out(['error'=>'Unknown action'],400);
