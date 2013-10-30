(function () {
    "use strict";

    App.namespace('App.modules.dataset.Permalink');

    App.modules.dataset.DatasetPermalink = {

        baseUrl : function () {
            return App.endpoints["portal"];
        },

        retrievePermalink : function (permalinkId) {
            var url = this.baseUrl() + "/" + permalinkId;
            return $.getJSON(url);
        },

        savePermalinkShowingCaptchaInElement : function (content, el) {
            return metamac.authentication.ajax({
                url : this.baseUrl(),
                method : "POST",
                dataType : "json",
                contentType : "application/json; charset=utf-8",
                data : JSON.stringify({content : content})
            }, {
                captchaEl : el
            });
        }

    }

}());

