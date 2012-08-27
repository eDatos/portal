[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]


<div id="first-row-internal-page" class="row">
    <div class="internal-page-header span12">
        <div class="internal-page-title">
            <h2>[@spring.message 'page.roadmap.title' /]</h2>
        </div>
    </div>
</div>

<div class="row">
    <div class="span12 long-text page-content"></div>
</div>

[@s4yh.js "js/stat4you/libs/uservoice.js"/]

<script>
    $('.page-content').html(I18n.t("page.roadmap.content"));
    $('a.uservoice').click(function(){
        UserVoice.showPopupWidget();
        return false;
    });
</script>


[/@template.base]