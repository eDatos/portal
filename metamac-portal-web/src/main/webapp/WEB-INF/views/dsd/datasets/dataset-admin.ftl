[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content-right">
	
	<form id="datasetForm" name="datasetForm" class="form" action="" method="POST">
		
		[#-- Dataset --]	
		<h3 class="left">[@spring.message 'entity.dataset' /]</h3>
		<div class="clearfix" ></div>
		<div class="sep-2">&nbsp;</div>
		<fieldset>
			[@fieldOutput label="entity.dataset.uri" value="form.dataset.uri" /]
			[@fieldOutput label="entity.dataset.providerUri" value="form.dataset.providerUri" /]
			[@fieldOutput label="entity.dataset.url" value="form.dataset.url" /]
			[@fieldOutput label="entity.dataset.publishingDate" value="form.dataset.publishingDate" /]
			[@fieldOutput label="entity.dataset.unpublishingDate" value="form.dataset.unpublishingDate" /]
			[@fieldOutput label="entity.dataset.draftUri" value="form.dataset.draftUri" /]
			[@fieldOutput label="entity.dataset.publishedUri" value="form.dataset.publishedUri" /]
			[@fieldOutput label="entity.dataset.source" value="form.dataset.source" /]
			[@fieldOutput label="entity.dataset.state" value="form.dataset.state" /]
						
			<div class="clearfix"></div>
		</fieldset>
		
		[#-- Measure --]
		<h3 class="left">[@spring.message 'entity.dataset.primaryMeasure' /]</h3>
		<div class="clearfix" ></div>
		<div class="sep-2">&nbsp;</div>
		<fieldset>
    		[@fieldOutput label="entity.primaryMeasure.uri" value="form.primaryMeasure.uri" /]
    		[@fieldOutput label="entity.primaryMeasure.name" value="form.primaryMeasure.title" /]
			<div class="clearfix"></div>
		</fieldset>
			
		[#-- Dimensions --]
		<h3 class="left">[@spring.message 'entity.dataset.dimensions' /]</h3>
		<div class="clearfix" ></div>
		<div class="sep-2">&nbsp;</div>
		<fieldset>
				[#list form.dimensions as dimension]
					[@fieldOutput label="entity.dimension.uri" value="form.dimensions[${dimension_index}].uri" /]
					
					[@fieldOutput label="entity.dimension.name" value="form.dimensions[${dimension_index}].title" /]
					[@fieldOutput label="entity.dimension.type" value="form.dimensions[${dimension_index}].type" /]
					
					[#-- Codes --]
					<h5 class="left">[@spring.message 'entity.dimension.codes' /]</h5>
					[#list dimension.codes as code]					
						[@fieldOutput label="entity.dimension.code.code" value="form.dimensions[${dimension_index}].codes[${code_index}].code" /]
						[@fieldOutput label="entity.dimension.code.title" value="form.dimensions[${dimension_index}].codes[${code_index}].title" /]
					[/#list]
     			[/#list]
				
			<div class="clearfix"></div>
		</fieldset>

		[#-- Back to datasets --]
		<div class="container-center"> 
			<a class="button" href="[@spring.url '/datasets' /]" >[@spring.message 'page.dataset.cancel' /]</a>
		</div>

	</form>
	
	
</div>
<div class="clearfix" ></div>


[/@template.base]

