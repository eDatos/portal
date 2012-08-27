[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content-right">
	<h3 class="left">[@spring.message 'page.dataset-list.title' /]</h3>

	<div class="clearfix" ></div>
    <form method="post" action="upload" enctype="multipart/form-data">
        <input type="file" name="file" />
        <input type="submit" />
    </form>
</div>
 
[/@template.base]