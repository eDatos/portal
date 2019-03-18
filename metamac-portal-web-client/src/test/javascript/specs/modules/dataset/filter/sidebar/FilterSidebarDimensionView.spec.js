describe("FilterSidebarDimensionView", function () {

    var filterDimension;
    var filterSidebarDimensionView;

    beforeEach(function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        var optionsModel = new App.modules.dataset.OptionsModel();

        filterDimension = filterDimensions.at(0);
        filterSidebarDimensionView = new App.widget.filter.sidebar.FilterSidebarDimensionView({
            filterDimension : filterDimension,
            optionsModel : optionsModel
        });
        filterSidebarDimensionView.setMaxHeight(200);
        filterSidebarDimensionView.render();
    });

    afterEach(function () {
        filterSidebarDimensionView.destroy();
    });

    describe("collapse", function () {

        it("should change filterDimension:open when click title", function () {
            expect(filterDimension.get('open')).to.be.true;
            filterSidebarDimensionView.$el.find('.filter-sidebar-dimension-title').click();
            expect(filterDimension.get('open')).to.be.false;
        });

        it("should toggle class when filterDimension:open change", function () {
            var collapseContainer = filterSidebarDimensionView.$el.find(".collapse");
            expect(collapseContainer.hasClass('in')).to.be.true;

            filterDimension.set('open', false);
            expect(collapseContainer.hasClass('in')).to.be.false;
            filterDimension.set('open', true);
            expect(collapseContainer.hasClass('in')).to.be.true;
        });

    });

    describe("maxHeight", function () {

        it("should return collapsed height", function () {
            var expectedCollapsedHeight = filterSidebarDimensionView.$(".filter-sidebar-dimension-title").height();
            var collapsedHeight = filterSidebarDimensionView.getCollapsedHeight();
            expect(collapsedHeight).to.equal(expectedCollapsedHeight);
        });

        it("on change stateModel:maxHeight should update the css", function () {
            filterSidebarDimensionView.setMaxHeight(300);
            expect(filterSidebarDimensionView.$(".collapse").css('maxHeight')).to.equal("300px");
        });

        it("on render it should set the maxHeight based on stateModel", function () {
            var currentMaxHeight = filterSidebarDimensionView.maxHeight;
            expect(filterSidebarDimensionView.$(".collapse").css('maxHeight')).to.equal(currentMaxHeight + "px");
        });

    });

});