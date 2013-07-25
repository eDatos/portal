(function () {

    App.namespace("App.modules.dataset");

    var DatasetPermalink = App.modules.dataset.DatasetPermalink;

    App.modules.dataset.PermalinkBuilder = function (options) {
        this.filterOptions = options.filterOptions;
        this.optionsModel = options.optionsModel;
    };

    App.modules.dataset.PermalinkBuilder.prototype = {

        _url : function (permalink) {
            var url = window.location.protocol + "//" +
                window.location.host +
                App.context +
                this._relativeUrl(permalink);
            return url;
        },

        _relativeUrl : function (permalink) {
            var provider = this.filterOptions.metadata.getProvider();
            var identifier = this.filterOptions.metadata.getIdentifier();
            var type = this.optionsModel.get('type');
            var selection = permalink.get('identifier');

            var url = "/providers/" + provider +
                "/datasets/" + identifier +
                "/#" +
                "type/" + type +
                "/selection/" + selection;
            return url;
        },

        _createPermalinkModel : function () {
            var selection = JSON.stringify(this.filterOptions.exportSelection());
            return new DatasetPermalink({content : selection});
        },

        createPermalink : function (options) {
            options || (options = {});

            var self = this;

            var result = $.Deferred();
            var permalink = this._createPermalinkModel();
            permalink.save()
                .done(function () {
                    var url = options.relative ? self._relativeUrl(permalink) : self._url(permalink);
                    result.resolveWith(null, [url]);
                })
                .fail(function () {
                    result.reject();
                });
            return result.promise();
        }

    };


}());