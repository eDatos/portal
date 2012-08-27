[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div class="row">
    <div class="s4y-box">
        <div class="s4y-box-header">
            <h2>[@spring.message 'page.main.datasets.title' /]</h2>
        </div>
        <div class="s4y-box-container">
            <div class="index-datasets" id="datasets">
            </div>
        </div>
    </div>
</div>

[@s4yh.js "js/stat4you/modules/index/index.js" /]

<script>
    var options = {
        datasets : new Backbone.Collection(${datasets}),
        providers : new Backbone.Collection(${providers})
    };
    new STAT4YOU.index.Main(options);
    

</script>

[/@template.base]