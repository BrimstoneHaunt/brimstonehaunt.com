<?php
	$code_version = "1.0.0";
	
	$base_url = "http://" . $_SERVER['SERVER_NAME'];
	$paths = explode('/', $_GET["q"]);
	
	$pageTitles = [
		'404'		=> "404 Page Not Found",
		'home'		=> "Home",
		'team' 		=> "The Team",
		'photos'	=> "Photos",
		'sponsors'	=> "Our Sponsors",
		'news'		=> "News"
	];
	
	$page = '404';
	$pathsCount = count($paths);
	
	if($pathsCount == 0)
	{
		$page = 'home';
	}
	elseif($pathsCount == 1)
	{
		if($paths[0] == "")
		{
			$page = 'home';
		}
		else
		{
			$page = $paths[0];
		}
	}
	else
	{
		$path = '';
		foreach($paths as $p)
		{
			$path = $path . "/" . $p;
		}
		$page = $path;
	}
	
	if(!array_key_exists($page, $pageTitles))
	{
		$page = "404";
	}
	
	if($page == "404")
	{
		http_response_code(404);
	}
	
	require_once("view/" . $page . ".phtml");
	die();
?>