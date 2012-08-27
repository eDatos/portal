[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content"></div>


[@s4yh.js "js/stat4you/modules/providers/providers.js"/]

<script>
	$(function(){
		//I18n.locale = 'es';
		var collection = new STAT4YOU.modules.Providers.Collection(${providers});
		var router = new STAT4YOU.modules.Providers.Router({el :  $("#content"), collection : collection});
        Backbone.history.start({pushState : true, root : STAT4YOU.context + "/providers/"});
	});
</script>

[/@template.base]