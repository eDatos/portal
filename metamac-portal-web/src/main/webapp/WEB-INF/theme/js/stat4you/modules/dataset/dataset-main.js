(function() {
    STAT4YOU.namespace("STAT4YOU.modules.dataset");
    
    STAT4YOU.modules.dataset.initVeManager = function(dataset, filterOptions){
        /* Options */
        var options = {};

        options.dataset = dataset;
        options.filterOptions = filterOptions;

        // Containers
        options.container = {};
        options.container.external = document.getElementById("datasets-visualization");
        options.container.ve = document.getElementById("visual-element");
        options.container.vecontainer = document.getElementById("visual-element-container");
        options.container.options = document.getElementById("visual-element-options");
        options.container.change = document.getElementById("change-visual-element");

        //$(window).resize({self: options.ve.table}, options.ve.table.resize);
        return new STAT4YOU.VisualElementManager(options);
    };

    STAT4YOU.modules.dataset.Main = function(options){
        var self = this;

        self.attributes = options.attributes;

        self.metadata = new STAT4YOU.dataset.Metadata(options.dataset);
        self.filterOptions = new STAT4YOU.widget.FilterOptions({metadata : self.metadata});
        self.dataset = new STAT4YOU.dataset.Dataset({metadata : self.metadata, filterOptions : this.filterOptions});

        self.pageView = new STAT4YOU.modules.dataset.PageView({el : options.el, metadata : self.metadata, attributes : self.attributes});
        self.pageView.render();

        var optionsEl = self.pageView.$el.find('#options-bar');

        var veElementTable = Modernizr.canvas ?  "canvasTable" : "table";
        var veElements = [veElementTable, "column", "pie", "line"];

        self.optionsModel = new STAT4YOU.modules.dataset.OptionsModel();
        self.optionsView = new STAT4YOU.modules.dataset.OptionsView({ model : self.optionsModel, el : optionsEl, buttons : veElements });
        self.optionsView.render();


        self.router = new STAT4YOU.modules.dataset.Router({ defaultType : veElementTable });

        self.veManager = STAT4YOU.modules.dataset.initVeManager(self.dataset, self.filterOptions);
        
        //TODO: check
        self.filterView = new STAT4YOU.widget.filter.FilterView({filterOptions : self.filterOptions, el : '#visual-element-and-filter' });
        
        
        /*-------------------------------------------------
         * Events
         * --------------------------------------------- */
        self.router.on('selectType', function(type){
            self.optionsModel.set('type', type);
        });

        self.optionsModel.on('change', function () {
            self.optionsView.render();
        });
        
        self.optionsModel.on('change:type', function(model, type){
            //TODO: Avisar al otro view del filtro (si el filtro está abierto
            self.router.navigate("type/" + type);
            self.veManager.loadVisualElement(type);
            if (self.optionsView.isFilter()){
                self.filterView.render(type);
            }
        });

        self.optionsView.on("launchFullScreen", function () {
            self.veManager.enterFullScreen();
        });

        self.optionsView.on("exitFullScreen", function () {
            self.veManager.exitFullScreen();
        });

        self.optionsView.on('launchFilter', function () {
            self.optionsModel.set('filter', true);
            self.filterView.launch(self.optionsModel.get('type'));
        });

        //TODO: veManager no longer exists
        self.veManager.on('didEnterFullScreen', function () {
            self.optionsModel.set('fullScreen', true);
            if (self.optionsView.isFilter()){
                self.filterView.render();
            }
        });

        self.veManager.on('didExitFullScreen', function (){
            self.optionsModel.set('fullScreen', false);
            if (self.optionsView.isFilter()){
                self.filterView.render();
            }
        });

        self.filterView.on('closeFilter saveFilter', function () {
            self.optionsModel.set('filter', false);
        });

        self.filterOptions.on('reset', function () {
            self.veManager.load();
        });

        $(function(){
            Backbone.history.start();
        });

    };
}());