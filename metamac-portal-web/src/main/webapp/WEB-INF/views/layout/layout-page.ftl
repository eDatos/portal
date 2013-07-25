[#ftl]
[#import "./layout-base.ftl" as layoutBase]

[#macro page]
    [@layoutBase.base]

    <div id="page-container" class="container">
        <div id="content">
            [#nested]
        </div>
    </div>

    <!--[if IE]>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>
    <script>
        window.attachEvent("onload", function() {
            CFInstall.check({
                mode: "overlay",
                destination: STAT4YOU.context
            });
        });
    </script>
    <![endif]-->

    [/@layoutBase.base]
[/#macro]