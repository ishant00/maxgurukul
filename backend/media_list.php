<?php header('Content-Type: application/json');$f=__DIR__.'/media_map.json';echo file_exists($f)?file_get_contents($f):'{}';
