describe("FilterSidebarDimensionView", function () {

    var filterOptions;
    var optionsModel;
    var dimension;
    var filterSidebarDimensionView;

    beforeEach(function () {
        filterOptions = App.test.factories.filterOptionsFactory();
        optionsModel = new App.modules.dataset.OptionsModel();
        dimension = filterOptions.getDimensions()[0];

        filterSidebarDimensionView = new App.widget.filter.sidebar.FilterSidebarDimensionView({
            dimension : dimension,
            filterOptions : filterOptions,
            optionsModel : optionsModel
        });

        filterSidebarDimensionView.render();
    });

    afterEach(function () {
        filterSidebarDimensionView.destroy();
    });


    describe("collapse", function () {

        it("should change stateModel:collapsed when click title", function () {
            expect(filterSidebarDimensionView.stateModel.get('collapsed')).to.be.true;
            filterSidebarDimensionView.$el.find('.filter-sidebar-dimension-title').click();
            expect(filterSidebarDimensionView.stateModel.get('collapsed')).to.be.false;
        });

        it("should toggle class when stateModel:collapsed change", function () {
            var collapseContainer = filterSidebarDimensionView.$el.find(".collapse");
            expect(collapseContainer.hasClass('in')).to.be.false;

            filterSidebarDimensionView.stateModel.set('collapsed', false);
            expect(collapseContainer.hasClass('in')).to.be.true;
            filterSidebarDimensionView.stateModel.set('collapsed', true);
            expect(collapseContainer.hasClass('in')).to.be.false;
        });

    });

    describe("maxHeight", function () {

        it("should return collapsed height", function () {
            var expectedCollapsedHeight = filterSidebarDimensionView.$(".filter-sidebar-dimension-title").height();
            var collapsedHeight = filterSidebarDimensionView.getCollapsedHeight();
            expect(collapsedHeight).to.equal(expectedCollapsedHeight);
        });

        it("on change stateModel:maxHeight should update the css", function () {
            filterSidebarDimensionView.stateModel.set('maxHeight', 300);
            expect(filterSidebarDimensionView.$(".collapse").css('maxHeight')).to.equal("300px");
        });

        it("on render it should set the maxHeight based on stateModel", function () {
            var currentMaxHeight = filterSidebarDimensionView.stateModel.get('maxHeight');
            expect(filterSidebarDimensionView.$(".collapse").css('maxHeight')).to.equal(currentMaxHeight + "px");
        });

    });

});