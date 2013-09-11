App.namespace("App.VisualElement.Table");

App.VisualElement.Table = (function () {
    /*-----------------------------*/
    /* -- Table class -- */
    /*-----------------------------*/
    var Table = function (options) {
        this.el = options.el;
        this.dataset = options.dataset;
        this.filterOptions = options.filterOptions;

        var self = this;
        // OPTIONS TABLE
        self._chartOptions = {
            width : 700,
            height : 450,
            title : {
                text : '',
                style : {

                }
            },
            columnTop : {
                width : 100,
                height : 20,
                dimensions : []
            },
            columnLeft : {
                width : 100,
                height : 20,
                dimensions : []
            },
            data : [
                //{id:"", value:"" }
            ],
            fixedDimensions : {

            },
            datasource : function (idElements) {
                _.extend(idElements, self.getFixedPermutation());
                return self.dataset.data.getDataById(idElements);
            }
        };

        self._type = 'table';
        self._element = null;
        self.backupWidth = null;
        self.backupHeight = null;

        //Title aux var
        self.fixedIndexesForTitle = [];
    };

    Table.prototype = new App.VisualElement.Base();

    /*---------------------------------------------------------------
     *                      PUBLIC METHODS
     * ----------------------------------------------------------- */
    Table.prototype.destroy = function () {
        $(this.el).datasetTable("destroy");
        this._chartOptions.fixedDimensions = {};
        this.dataset.data.off("allDataLoaded", this.load, this);
    };

    Table.prototype.updatingDimensionPositions = function () {
        this.filterOptions.setSelectedCategoriesRestriction({left : -1, top : -1});
    };

    Table.prototype.transformDimensions = function (dimensions) {
        _.each(dimensions, function (dimension) {
            dimension.categories = _.filter(dimension.categories, function (category) {
                return category.state === 1;
            });
            _.each(dimension.categories, function (category){
                category.name = category.label;
            });
            dimension.representations = dimension.categories;
        });
    };

    Table.prototype.updateChartOptions = function () {
        var leftDimensions = this.filterOptions.getLeftDimensions();
        var topDimensions = this.filterOptions.getTopDimensions();

        this.transformDimensions(leftDimensions);
        this.transformDimensions(topDimensions);

        this._chartOptions.columnLeft.dimensions = leftDimensions;
        this._chartOptions.columnTop.dimensions = topDimensions;

        this._chartOptions.title.text = this.getTitle();
    };

    Table.prototype.load = function () {
        if(this.dataset.data.isAllSelectedDataLoaded()){
//            $(this.el).empty();
//            this.updateChartOptions();
//            this.loadStructure();
//            $(this.el).datasetTable("setData");
//
//
            loadCallback();
        }else{
            //TODO: Improve
//            this.dataset.data.on("allDataLoaded", this.load, this);
//            this.dataset.data.loadAllSelectedData();



            //TODO: get shapes
            this.dataset.data.on("allDataLoaded", this.loadCallback, this);
            this.dataset.data.loadAllSelectedData();
        }
    };

    Table.prototype.loadCallback = function () {
        if(this.dataset.data.isAllSelectedDataLoaded() /*TODO: shapes condition*/){
            $(this.el).empty();
            this.updateChartOptions();
            this.loadStructure();
            $(this.el).datasetTable("setData");
        }
    }

    Table.prototype.update = function () {
        var self = this;
        self.destroy();
        self.load();
    };

    /* FullScreen */

    Table.prototype.loadFullScreen = function (browserSupportsFS) {
        var self = this;
        var temp = jQuery('#visual-element').css('padding-left');
        temp = temp.substr(0, 2);
        temp = parseInt(temp);
        self.backupWidth = self._chartOptions.width;
        self.backupHeight = self._chartOptions.height;
        self._chartOptions.width = jQuery(window).width() - temp * 2;
        self._chartOptions.height = jQuery(window).height() - 10;

        if (browserSupportsFS) {
            self._chartOptions.height = jQuery(window).height() - 10;
        } else {
            self._chartOptions.height = jQuery(window).height() - 150;
        }

        $(this.el).datasetTable("resize", self._chartOptions.width, self._chartOptions.height);
    };

    Table.prototype.exitFullScreen = function () {
        var self = this;
        self._chartOptions.width = self.backupWidth;
        self._chartOptions.height = self.backupHeight;
    };

    /* Load methods */
    Table.prototype.loadStructure = function () {
        /* Loading the table */
        $(this.el).datasetTable(this._chartOptions);
    };

    Table.prototype.resize = function (e) {
        var self = e.data.self;
        grayOut(true, true);
        setTimeout(function () {
            self._resizeWhenSpinnerLoaded();
        }, 500);
    };

    /*---------------------------------------------------------------
     *                      PRIVATE METHODS
     * ----------------------------------------------------------- */
    Table.prototype._resizeWhenSpinnerLoaded = function () {
        var self = this;
        var tempWidth = $(self._options.container.external).width() - 10 /*Padding*/;
        $(self._options.container.vecontainer).datasetTable("resize", tempWidth, self._chartOptions.height);
        grayOut(false, false);
    };

    return Table;

}());
