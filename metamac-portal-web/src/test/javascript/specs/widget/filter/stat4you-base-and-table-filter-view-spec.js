describe("Base / Table filter view - ", function(){
//    
//    describe("Loading containers - ", function(){
//        var $external = null;
//        var veTable = null;
//
//        /* INIT: Load filter */
//        beforeEach(function() {
//            $external = $('<div id="datasets-visualization" class="datasets-visualization"/>').appendTo($('body'));
//            var $ve = $('<div id="visual-element"/>').appendTo($external);
//            var $veAndFilter = $('<div id="visual-element-and-filter"/>').appendTo($ve);
//            var $vecontainer = $('<div id="visual-element-container"/>').appendTo($veAndFilter);
//            
//            STAT4YOU.resourceContext = "file://D:/Proyectos/01-stat4you/02-workspace/TRUNK-stat4you/stat4you-web/src/main/webapp/WEB-INF/theme/";
//            
////            var options = {};
////            options.container = {"filter": null,
////                                 "external": $external.get(0),
////                                 "ve": $ve.get(0),
////                                 "vecontainer": $vecontainer.get(0)};
////            
////            options.dimensions = $.parseJSON(OptionsData.poblacion.filter.dimensions);
////            options.categoriesPerDim = $.parseJSON(OptionsData.poblacion.filter.categoriesPerDim);
////
////
////            // Creating the table
////            veTable = new STAT4YOU.VisualElement.Table();
////            veTable.setOptions(options);
////            
////            // Launching the filter
////            veTable.launchFilter();
//            
//            self.filterView = new STAT4YOU.widget.filter.FilterView({el : $veAndFilter.id/*, model : self.dataset*/});
//            
//            spyOn(STAT4YOU.widget.filter.FilterView.prototype, '_renderExternalContainer');
//            
//            self.filterView.launch('table');
//        });
//        
//        
//        /* DESTROY: Close filter */
//        afterEach(function() {
//            /* Removing */
//            if ($external.length > 0)
//                $external.remove();
//        });
//        
//
//        /* Listeners called */
//        it("The filter-external-container template was called", function() {
//            expect(STAT4YOU.widget.filter.FilterView.prototype._renderExternalContainer).toHaveBeenCalled();
//        });
//        
//        /* DOM changes */
//        it("The filter opens properly", function() {
//            var $filterContainer = $('#filter-container');
//            expect($filterContainer.length).toBe(1);
//        });
//
//    });
//    
//    
//    
//    describe("Filter already launched - ", function(){
//        
//        /* INIT: Load filter */
//        beforeEach(function() {
//            $external = $('<div id="datasets-visualization" class="datasets-visualization"/>').appendTo($('body'));
//            var $ve = $('<div id="visual-element"/>').appendTo($external);
//            var $vecontainer = $('<div id="visual-element-container"/>').appendTo($ve);
//            
//            STAT4YOU.resourceContext = "file://D:/Proyectos/01-stat4you/02-workspace/TRUNK-stat4you/stat4you-web/src/main/webapp/WEB-INF/theme/";
//            
//            self.filterView = new STAT4YOU.widget.filter.FilterView({el : $vecontainer.id/*, model : self.dataset*/});
//            
//            self.filterView.launch('table');
//        });
//        
//        
//        describe("Container event handlers - ", function(){
//            beforeEach(function() {
//                spyOn(STAT4YOU.widget.filter.FilterView.prototype, 'save');
//                spyOn(STAT4YOU.widget.filter.FilterView.prototype, 'close');
//            });
//
//            /* Listeners called */
//            it("When the X button is pressed the close event handler is called", function() {
//                $('#close').trigger('click');
//                expect(STAT4YOU.widget.filter.FilterView.prototype.close).toHaveBeenCalled();
//            });
//            
//            it("When the cancel button is pressed the close event handler is called", function() {
//                $('#button-cancel-filter').trigger('click');
//                expect(STAT4YOU.widget.filter.FilterView.prototype.close).toHaveBeenCalled();
//            });
//            
//            it("When the accept button is pressed the save event handler is called", function() {
//                $('#button-options').trigger('click');
//                expect(STAT4YOU.widget.filter.FilterView.prototype.save).toHaveBeenCalled();
//            });
//            
//            /* DOM changes */
//            it("The close method removes the filter DIV", function() {
//                self.filterView.close();
//                var $filterContainer = $('#filter-container');
//                expect($filterContainer.length).toBe(0);
//            });
//            
//            it("The close method removes the filter DIV", function() {
//                self.filterView.save();
//                var $filterContainer = $('#filter-container');
//                expect($filterContainer.length).toBe(0);
//            });
//            
//            /* Model has changed */
//            it("The close method restores the options", function() {
//                // TODO
//            });
//            it("The save methdod saves the options", function() {
//                // TODO
//            });
//        });
//        
//        
//        describe("Loading dimensions and controlling their events - ", function(){
//            beforeEach(function() {
//                //TODO: Loading the dimensions
//            });
//
//            /* Clicks */
//            it("The dimension are properly located in the diferent zones", function() {
//                //TODO
//            });
//
//            it("Clicking in the right-triangle expands the categories", function() {
//                //TODO
//            });
//
//            it("Select all checkbox marks all the categories of the dimension", function() {
//                //TODO
//            });
//            
//            it("Unselect all chackbox unmarks all the categories of the dimension but one", function() {
//                //TODO
//            });
//
//            it("Clicking a category disables it if was already marked", function() {
//                //TODO
//            });
//
//            it("Clicking a category enables it if was unmarked", function() {
//                //TODO
//            });
//            
//            /* Combining */
//            it("When all the categories are marked, clicking on one of them changes the checkbox", function() {
//                //TODO
//            });
//            
//            /* Drag and drop */
//            // TODO: We could try to reproduce the old test here
//        });
//
//    });
//    
});