(function () {
    "use strict";

    App.namespace("App.modules.providers.ProviderDetailView");

    var DatasetsView = App.modules.datasets.DatasetsView;

    App.modules.providers.ProviderDetailView = Backbone.View.extend({

        templatePage : App.templateManager.get('providers/provider-page'),
        templateError : App.templateManager.get('alerts/error'),

        initialize : function (options) {
            this.provider = options.provider;
            this.acronym = options.acronym;
        },

        render : function () {
            if (this.provider) {
                if (App.user) {
                    App.user.favourites.fetch();
                }
                this._renderProviderInfo();
            } else {
                this._renderError();
            }
        },

        _renderProviderInfo : function () {
            var context = {
                provider : this.provider.toJSON()
            };
            $(this.el).html(this.templatePage(context));

            this._renderProviderLogo();
            this._renderProviderMetadata();
            this._renderDatasets();
        },

        _renderError : function () {
            var context = {
                msg : I18n.t('page.providers.notFound', {acronym : this.acronym})
            };
            $(this.el).html(this.templateError(context));
        },

        _renderProviderLogo : function () {
            var template = App.templateManager.get('providers/provider-active-provider'),
                context = this.provider.toJSON();

            $('.search-active-provider', this.el).html(template(context));
        },

        _renderProviderMetadata : function () {
            var template = App.templateManager.get('providers/provider'),
                context = this.provider.toJSON();

            $('.provider', this.el).html(template(context));
        },

        _renderDatasets : function () {
            var $datasetsEl = $('.datasets-list', this.el);
            var acronym = this.provider.get("acronym");
            var datasets = new App.modules.datasets.Datasets.datasetsFromProvider(acronym);
            this.datasetView = new DatasetsView({el : $datasetsEl, collection : datasets, showViewMore : true });
            this.datasetView.render();
            datasets.fetchCurrentPage();
        }

    });
}());