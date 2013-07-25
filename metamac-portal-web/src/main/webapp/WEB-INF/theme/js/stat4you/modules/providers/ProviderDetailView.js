(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.providers.ProviderDetailView");

    var DatasetsView = STAT4YOU.modules.datasets.DatasetsView;

    STAT4YOU.modules.providers.ProviderDetailView = Backbone.View.extend({

        templatePage : STAT4YOU.templateManager.get('providers/provider-page'),
        templateError : STAT4YOU.templateManager.get('alerts/error'),

        initialize : function (options) {
            this.provider = options.provider;
            this.acronym = options.acronym;
        },

        render : function () {
            if (this.provider) {
                if (STAT4YOU.user) {
                    STAT4YOU.user.favourites.fetch();
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
            var template = STAT4YOU.templateManager.get('providers/provider-active-provider'),
                context = this.provider.toJSON();

            $('.search-active-provider', this.el).html(template(context));
        },

        _renderProviderMetadata : function () {
            var template = STAT4YOU.templateManager.get('providers/provider'),
                context = this.provider.toJSON();

            $('.provider', this.el).html(template(context));
        },

        _renderDatasets : function () {
            var $datasetsEl = $('.datasets-list', this.el);
            var acronym = this.provider.get("acronym");
            var datasets = new STAT4YOU.modules.datasets.Datasets.datasetsFromProvider(acronym);
            this.datasetView = new DatasetsView({el : $datasetsEl, collection : datasets, showViewMore : true });
            this.datasetView.render();
            datasets.fetchCurrentPage();
        }

    });
}());