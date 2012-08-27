[#ftl strip_whitespace=true]
[#--
 * fieldOutput
 --]
 [#macro fieldOutput value label attributes="" class="" hint="" rendered=true]
	[#if rendered]
		[@spring.bind value /]
		
		<div class="field" >
            <span class="metadata-title">[@spring.messageText label label /]</span>
            <span class="metadata-value">${spring.stringStatusValue}<span>
		</div>
	[/#if]
[/#macro]
