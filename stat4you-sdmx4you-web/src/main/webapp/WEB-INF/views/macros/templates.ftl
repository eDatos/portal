[#ftl]
[#macro base]
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es" dir="ltr">
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />		
		<meta http-equiv="Content-language" content="es" />	

		<title>[@spring.message "app.title" /]</title>
		
		<link rel="stylesheet" href="[@spring.url "/theme/css/reset.css"                   /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/clearfix.css"                /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/grid.css"                    /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/screen.css"                  /]" type="text/css" media="screen, projection" />		
		<link rel="stylesheet" href="[@spring.url "/theme/css/jquery-ui-dataset-1.0.0.css" /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/charts.css"                  /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/jquery.jscrollpane.css"      /]" type="text/css" media="screen, projection" />
		<link rel="stylesheet" href="[@spring.url "/theme/css/tables.css"                  /]" type="text/css" media="screen, projection" />
		
		<script type="text/javascript">
			var context = "[@spring.url '' /]";
		</script>
		
		<script type="text/javascript" src="[@spring.url "/theme/js/css_browser_selector.js"                 /]" ></script>
		<script type="text/javascript" src="[@spring.url "/theme/js/jquery-1.7.1.js"                         /]" ></script>
		<script type="text/javascript" src="[@spring.url "/theme/js/jquery-ui-1.8.17.custom.js"              /]" ></script>
		<script type="text/javascript" src="[@spring.url "/theme/js/jquery.json-2.3.min.js"                  /]" ></script>
		<script type="text/javascript" src="[@spring.url "/theme/js/jquery-disable-text-selection-1.0.0.js"  /]" ></script>
		<script type="text/javascript" src="[@spring.url "/theme/js/jquery-dataset-1.0.js"                   /]" ></script>		
		<script type="text/javascript" src="[@spring.url "/theme/js/highcharts-2.1.9.js"                     /]" ></script>
	
		<script src="[@spring.url "/theme/js/uservoice.js" /]"></script>
	</head>
	<body>
		<div class="container">
			<div id="header" class="span-24">
				<div id="logo"><a href="[@spring.url "/index" /]">SDMX4YOU</a></div>
			</div>

			<div id="menu-top" class="span-24">
				<div id="menu">
					<div class="left">
						<ul>
							<li><a href="[@spring.url "/upload" /]">Upload sdmx</a></li>
							<li><a href="[@spring.url "/signout" /]">Salir</a></li>
						</ul>
					</div>
					<div class="clearfix">&nbsp:</div>
				</div>
			</div>
[#--
		  	<div id="column-left" class="span-5">					
				<div class="box">			
					<h3>[@spring.message "menu.left.title" /]</h3>
					<div class="box-container">
						<ul class="menu-left">
							<li><a href="[@spring.url "/datasets" /]">[@spring.message 'menu.left.datasets' /]</a></li>
							<li><a href="[@spring.url "/dsd/px/new" /]">[@spring.message 'menu.left.px' /]</a></li>
							<li><a href="[@spring.url "/search" /]">[@spring.message 'menu.left.search' /]</a></li>
							<li><a href="[@spring.url "/charts" /]">[@spring.message 'menu.left.charts' /]</a></li>
						</ul>
					</div>
				</div>
			</div>
--]  				
			<div id="column-body" class="span-24">
				[#nested]
			</div>
	
		  	<div id="footer" class="span-24">
		  		<p>[@s4yh.messageEscape 'app.copyrigth' /]</p>
			</div>
		</div>
	</body>
</html>
[/#macro]