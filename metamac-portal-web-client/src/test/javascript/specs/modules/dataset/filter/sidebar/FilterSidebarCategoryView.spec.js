describe("FilterSidebarCategoryView", function () {

    var filterRepresentation;
    var filterSidebarCategoryView;

    beforeEach(function () {
        var datasourceIdentificer = new App.datasource.DatasourceIdentifier(App.test.metadata.identifier);
        var datasetHelper = new App.datasource.helper.DatasetHelper();
        var metadata = new App.datasource.model.MetadataResponse({ datasourceIdentifier: datasourceIdentificer, datasourceHelper: datasetHelper, response: App.test.response.metadata});
        var filterDimensions = App.modules.dataset.filter.models.FilterDimensions.initializeWithMetadata(metadata);
        filterRepresentation = filterDimensions.at(0).get('representations').at(0);

        filterSidebarCategoryView = new App.widget.filter.sidebar.FilterSidebarCategoryView({
            filterRepresentation : filterRepresentation
        });

    });

    it("should show big titles in one line", function () {
        var veryBigLabel = "This is a very big label to check if it show in multiple lines This is a very big label to check if it show in multiple lines This is a very big label to check if it show in multiple lines";
        filterRepresentation.set('label', veryBigLabel);

        var $container = $('<div></div>').addClass('filter-sidebar-category').width(100).appendTo('body');
        filterSidebarCategoryView.setElement($container);
        filterSidebarCategoryView.render();

        var $label = filterSidebarCategoryView.$(".filter-sidebar-category-label");
        expect($label.css('height')).to.equal($label.css('line-height'));

        $container.remove();
    });

    it("title should have tooltip", function () {
        filterSidebarCategoryView.render();
        var $label = filterSidebarCategoryView.$(".filter-sidebar-category-label");
        expect($label.attr('title')).to.equal(filterRepresentation.get('label'));
    });

});