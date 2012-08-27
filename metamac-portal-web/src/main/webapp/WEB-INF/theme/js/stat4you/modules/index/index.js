STAT4YOU.namespace("STAT4YOU.index");

STAT4YOU.index.DatasetsView = Backbone.View.extend({
    template : STAT4YOU.templateManager.get('index/index-datasets'),
    render : function(){
        var context = {datasets : this.collection.toJSON()};
        this.$el.html(this.template(context));

        $('.dataset-list-el-title').dotdotdot({
            watch: window
        });

        return this;
    }
});

STAT4YOU.index.ProvidersView = Backbone.View.extend({
    template : STAT4YOU.templateManager.get('index/index-providers'),
    render : function(){
        var context = {providers : this.collection.toJSON()};
        this.$el.html(this.template(context));

        return this;
    }
});

STAT4YOU.index.Main = function(options){
    var datasetView = new STAT4YOU.index.DatasetsView({el : '#datasets', collection : options.datasets}),
        providersView = new STAT4YOU.index.ProvidersView({el : '#providers', collection : options.providers});

    datasetView.render();
    providersView.render();

    $('#home-search-input').focus();
};

