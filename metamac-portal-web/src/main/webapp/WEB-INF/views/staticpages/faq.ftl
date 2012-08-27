[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]


<div id="faq">
    <div id="first-row-internal-page" class="row">
        <div class="internal-page-header span12">
            <div class="internal-page-title">
                <h2>[@spring.message 'page.faq.title' /]</h2>
            </div>
        </div>
    </div>

    <div class="row long-text">
        <div class="span12 page-content">[@s4yh.messageEscape 'page.faq.content' /]</div>
    </div>
</div>

    [@s4yh.js "js/stat4you/libs/uservoice.js"/]

<script>
    $('a.uservoice').click(function(){
        UserVoice.showPopupWidget();
        return false;
    });

    $('a.jira').click(function() {
        ATL_IssueDialog.show();
        return false;
    })
</script>

[/@template.base]