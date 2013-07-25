(function () {
    "use strict";

    App.namespace("STAT4YOU.modules.index.IndexView");

    App.modules.index.IndexView = Backbone.View.extend({

        template : App.templateManager.get("index/index-page"),

        initialize : function (options) {
            this.ineDatasets = options.ineDatasets;
            this.istacDatasets = options.istacDatasets;
        },

        render : function () {
            this.$el.html(this.template());

            var ineDatasetsView = new STAT4YOU.modules.datasets.DatasetsView({el : this.$('#ineDatasets'), collection : this.ineDatasets, showViewMore : true});
            var istacDatasetsView = new STAT4YOU.modules.datasets.DatasetsView({el : this.$('#istacDatasets'), collection : this.istacDatasets, showViewMore : true});

            ineDatasetsView.render();
            istacDatasetsView.render();

            if (STAT4YOU.user) {
                STAT4YOU.user.favourites.fetch();
            }

            var $videoModal = this.$('#videoModal');
            $videoModal.on('show', function () {
                $videoModal.html('<iframe width="853" height="480" src="http://www.youtube.com/embed/ewtYk6VNQjY?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>');
            });
            $videoModal.on('hide', function () {
                $videoModal.html('');
            });
        }

    });


}());