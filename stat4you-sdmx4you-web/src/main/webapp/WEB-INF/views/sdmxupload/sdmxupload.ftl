[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<h1>Sube un fichero sdmx</h1>

<form method="post" action="[@spring.url "/upload" /]" enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" />
</form>

[/@template.base]