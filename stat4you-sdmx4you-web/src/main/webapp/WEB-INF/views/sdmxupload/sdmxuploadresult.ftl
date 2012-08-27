[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

[#if error ??]
	<h1>Ocurrió un error subiendo el fichero : ${error}</h1>
[#else]
	<h1>El fichero se subió correctamente</h1>
[/#if]

[/@template.base]