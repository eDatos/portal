[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]


	
<div id="provider-content-left" class="left">
	
	<form id="providerForm" name="providerForm" class="form" action="" method="POST">
		[#-- Provider data --]	
		<h3 class="left">[@spring.message 'entity.provider.data' /]</h3>
		<div class="clearfix" ></div>
		<div class="sep-2">&nbsp;</div>		
		
		<fieldset>									
			[@fieldOutput label="entity.provider.name" value="form.provider.name" /]			
			[@fieldOutput label="entity.provider.acronym" value="form.provider.acronym" /]						
			
			[#-- Provider Url --]
			<div class="field" >
				<div class="label label-output">				
					<div><em>&nbsp;</em>[@spring.message 'entity.provider.url' /]</div>					
				</div>
				<div class="output">	
					<a href=[@spring.bind "form.provider.url" /] ${spring.stringStatusValue} target="_blank">
						[@spring.bind "form.provider.url" /] ${spring.stringStatusValue}
					</a>							
				</div>
				<div class="clearfix"></div>
			</div>	


			[@fieldOutput label="entity.provider.address" value="form.provider.address" /]
			
			[#-- License Url --]
			<div class="field" >
				<div class="label label-output">				
					<div><em>&nbsp;</em>[@spring.message 'entity.provider.license' /]</div>					
				</div>
				<div class="output">	
					<a href=[@spring.bind "form.provider.licenseUrl" /] ${spring.stringStatusValue} target="_blank">
						[@spring.bind "form.provider.license" /] ${spring.stringStatusValue}
					</a>							
				</div>
				<div class="clearfix"></div>
			</div>	
						
			[@fieldOutput label="entity.provider.language" value="form.provider.language" /]
			[@fieldOutput label="entity.provider.logo" value="form.provider.logo" /]
			
			<div class="clearfix"></div>						
		</fieldset>		
	</form>	
</div>

<div id="dataset-content-right" class="left form">
	<h3 class="left">[@spring.message 'entity.provider.lastUpdatedDatasets' /]</h3>
	<div class="clearfix" ></div>
	<div class="sep-2">&nbsp;</div>
	<fieldset>	
		[#if form.datasets??]
		    [#list form.datasets as dataset]
				<div class="search-result">				
					[#if (dataset.url)??]
						<span class="search-title">
							<a href="[@spring.url "/datasets/${dataset.uri}.html" /]">
								[@spring.bind "form.datasets[${dataset_index}].title" /] ${spring.stringStatusValue}
							</a>
						</span>
					[#else]
						<span class="search-title">${dataset.title}</span>
					[/#if]
				
					<ul>			
						<li><label class="search-type">[@spring.message 'page.search.result.type' /]:</label> 
							<span>[@spring.message 'page.search.result.type.ds' /]</span></li>
						[#if dataset.providerPublishingDate?has_content]
							<li><label>[@spring.message 'page.search.result.pubdate' /]:</label> 
							<span>
								[@spring.bind "form.datasets[${dataset_index}].providerPublishingDate" /] ${spring.stringStatusValue}
							</span>
							</li>
						[/#if]												
					</ul>
				</div>
			[/#list]
		[/#if]	
	</fieldset>	
	<div class="clearfix"></div>
</div>
<div class="clearfix" ></div>

[#-- Back to datasets --] 
<div class="container-center"> 
	<a class="button" href="[@spring.url '/' /]" >[@spring.message 'page.dataset.cancel' /]</a>
</div>

[/@template.base]