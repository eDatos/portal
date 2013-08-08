describe("OrderSidebarView", function () {

    var orderSidebarView;
    var filterDimensions;
    var optionsModel;

    beforeEach(function () {
        var metadata = new App.dataset.Metadata(App.test.response.metadata);
        filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        optionsModel = new App.modules.dataset.OptionsModel();
        orderSidebarView = new App.widget.filter.sidebar.OrderSidebarView({filterDimensions : filterDimensions, optionsModel : optionsModel});
    });

    describe("renderContext", function () {
        it("fixed dimension should include selected category", function () {
            var dim = filterDimensions.get('INDICADORES');
            var selectedRepresentation = dim.get('representations').findWhere({selected : true});

            filterDimensions.zones.setDimensionZone('fixed', dim);

            var context = orderSidebarView._renderContext();
            var fixedZone = _.find(context.zones, function (zone) {
                return zone.id === "fixed";
            });

            var contextRepresentation = fixedZone.dimensions[0].selectedCategory;
            expect(contextRepresentation.id).to.equal(selectedRepresentation.id);
            expect(contextRepresentation.label).to.equal(selectedRepresentation.get('label'));
        });
    });

    describe("dimensions for zone", function () {

        it("should allow drag all dimensions if not in map type", function () {
            var dimensions = orderSidebarView._dimensionsForZone("left");
            expect(_.chain(dimensions).pluck('draggable').every(_.identity).value()).to.be.true;
        });

        it("should allow drag only geographical dimension if map type", function () {
            optionsModel.set('type', "map");
            var dimensions = orderSidebarView._dimensionsForZone("left");

            expect(dimensions[0].draggable).to.be.false;
            expect(dimensions[1].draggable).to.be.true;
        });

    });


});