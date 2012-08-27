[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content-right">
	<h3 class="left">[@spring.message 'page.dataset-list.title' /]</h3>
	
	<ul class="toolbar right">
		<li class="first last"><a href="[@spring.url "/datasets/new.html" /]" ><img src="[@spring.url "/theme/img-2/blank_1x1.png" /]" alt="[@spring.message 'page.dataset-list.add' /]" title="[@spring.message 'page.dataset-list.add' /]" class="img-dataset-add"/>[@spring.message 'page.dataset-list.add' /]</a></li>
	</ul>	
	
	<div class="clearfix" ></div>
	<div class="sep-2">&nbsp;</div>
	
	<div class="data-table">
		<div class="data-table-body">
			<table cellpadding="0" cellspacing="0">
				<colgroup>
					<col class="col-20" />
				</colgroup>
				<thead>
					<tr>
						<th class="data-table-col-15">[@spring.message 'entity.dataset.uri' /]</th>
					</tr>
				</thead>
				<tbody>
					[#list datasets as dataset]
						<tr>
							<td><a href="[@spring.url "/datasets/${dataset.uri}.html" /]">${dataset.uri}</a></td>
						</tr>
					[/#list]
				</tbody>
			</table>
		</div>
	</div>
</div>
<div class="clearfix" ></div>


[/@template.base]