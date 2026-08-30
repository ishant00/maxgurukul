<?php $a=$_GET['action']??$_POST['action']??'list';if($a==='insert'||$a==='update')$_POST['action']='save';require_once __DIR__.'/api.php';
