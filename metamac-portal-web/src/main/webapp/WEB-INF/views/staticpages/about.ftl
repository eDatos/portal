[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content">
    <div id="first-row-internal-page" class="row">
        <div class="internal-page-header span12">
            <div class="internal-page-title">
                <h2>[@spring.message 'page.about.title' /]</h2>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="span12 long-text page-content"></div>
    </div>

</div>

<script type="text/javascript">
    $('.page-content').html(I18n.t('page.about.content'));
    $('.link-providers').attr('href', STAT4YOU.context + '/providers');
    $('.link-roadmap').attr('href', STAT4YOU.context + '/roadmap');
    $('.link-request').attr('href', STAT4YOU.context + '/datasetrequest');
    $('.link-bug').click(function(){
        if(window.ATL_IssueDialog){
            window.ATL_IssueDialog.show();
        }
        return false;
    });
    $(document).ready(function() {
        $('#footer').append("<p>"+I18n.t('app.funded')+"</p>");
        $('#footer').append("<p class='paginated-center'><img src='"+STAT4YOU.resourceContext+"/images/logos/funded.png' width='404' height='66'></p>");
    });
</script>

[/@template.base]