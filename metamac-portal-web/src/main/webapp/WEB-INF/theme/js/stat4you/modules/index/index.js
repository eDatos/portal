STAT4YOU.namespace("STAT4YOU.index");

STAT4YOU.index.Main = function (options) {

    var ineDatasetsView = new STAT4YOU.modules.datasets.DatasetsView({el : '#ineDatasets', collection : options.ineDatasets, showViewMore : true});
    var istacDatasetsView = new STAT4YOU.modules.datasets.DatasetsView({el : '#istacDatasets', collection : options.istacDatasets, showViewMore : true});

    ineDatasetsView.render();
    istacDatasetsView.render();

    $('#home-search-input').focus();

    if (STAT4YOU.user) {
        STAT4YOU.user.favourites.fetch();
    }

};

