[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]



<div id="content-right">
	<form method="get" action="[@spring.url '/search'/]">		
		<input id="search-box" type="text" name="q" value="${query}" />
	    <input id="search-button" type="submit" />	    
	</form>
	
	<div class="sep-20">&nbsp;</div>
	
	[#if form.datasets??]
		<h1>[@spring.message 'page.main.lastPublishedDataset.title' /]</h1>
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
										
					[#if dataset.providerUri?has_content]
						<li>
							<label>[@spring.message 'page.search.result.prov' /]:</label>
							<a href="[@spring.url "/providers/${dataset.providerUri}.html" /]">
								 <span>${providers[dataset_index].name}</span>
							</a>
						</li>
					[/#if]						
				</ul>
			</div>
		[/#list]
	[/#if]	
</div>

[/@template.base]