[#ftl]
[#include "/inc/includes.ftl"]
[@template.base]

<div id="content"></div>

[@s4yh.js "js/libs/jquery.validate.js" /]
[@s4yh.js "js/stat4you/libs/jquery.validate.i18n.js" /]
[@s4yh.js "js/stat4you/modules/datasetrequest/datasetrequest.js" /]

<script>
    var error, success, formdata = {};

    [#if error??]
        error = "${error}";
        [#if email??]
            formdata.email = "${email}";
        [/#if]
        [#if comment??]
            formdata.comment = "${comment}";
         [/#if]
    [/#if]

    [#if success??]
        success = "${success}";
    [/#if]

    var view = new STAT4YOU.modules.datasetrequest.View({el : $('#content'), error : error, success : success, formdata : formdata});
    view.render();
</script>

[/@template.base]