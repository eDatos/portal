App.namespace("App.index");

App.index.Main = function (options) {

    var ineDatasetsView = new App.modules.datasets.DatasetsView({el : '#ineDatasets', collection : options.ineDatasets, showViewMore : true});
    var istacDatasetsView = new App.modules.datasets.DatasetsView({el : '#istacDatasets', collection : options.istacDatasets, showViewMore : true});

    ineDatasetsView.render();
    istacDatasetsView.render();

    $('#home-search-input').focus();

    if (App.user) {
        App.user.favourites.fetch();
    }

};

