[#ftl]
[#include "/inc/includes.ftl"]

[@template.base]

<div id="content"></div>

[@s4yh.js "js/stat4you/libs/smartscroll.js" /]
[@s4yh.js "js/stat4you/modules/search/search.js" /]
<script>
    var search = STAT4YOU.modules.Search.Main({el : "#content"});
    Backbone.history.start();
</script>

[/@template.base]