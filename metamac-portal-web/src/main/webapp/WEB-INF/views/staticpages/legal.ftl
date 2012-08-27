[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content">
    <div id="first-row-internal-page" class="row">
        <div class="internal-page-header span12">
            <div class="internal-page-title">
                <h2>[@spring.message 'page.legal.title' /]</h2>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="span12 long-text page-content"></div>
    </div>

</div>

<script type="text/javascript">
    $('.page-content').html(I18n.t("page.legal.content"));
</script>

[/@template.base]