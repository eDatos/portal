(function () {
    "use strict";

    App.namespace("App.DataSourceDataset");

    App.DataSourceDataset = function (options) {
        this.dataset = options.dataset;
        this.filterDimensions = options.filterDimensions;

        if (this.dataset) {
            this.listenTo(this.dataset.data, "hasNewData", this.updateHeaderAttributes ); 
        }
    };

    App.DataSourceDataset.prototype = {

        leftHeaderColumns : function () {
            return 1;
        },

        leftHeaderValues : function () {
            return this.filterDimensions.getTableInfo().leftHeaderValues;
        },
        
        leftHeaderDimensionsLengths: function () {
        	return this.filterDimensions.getTableInfo().left.representationsLengths;
        },
                
        
        leftHeaderDimensionsElements: function(dimension) {
        	return this.filterDimensions.getTableInfo().elementsByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },
        
        leftHeaderDimensionsBlanks: function(dimension) {
        	return this.filterDimensions.getTableInfo().blanksByLeftDimension(this.leftHeaderDimensionsLengths(), dimension);
        },

        topHeaderRows : function () {
            return this.filterDimensions.getTableInfo().top.representationsValues.length;
        },

        topHeaderValues : function () {
            return this.filterDimensions.getTableInfo().top.representationsValues;
        },

        updateHeaderAttributes : function() {
            this.topHeaderAttributes = this.dataset.data.getDimensionAttributesById(this.filterDimensions.getTableInfo().top.ids);
            //this.leftHeaderAttributes = this.dataset.data.getDimensionAttributesById(this.filterDimensions.getTableInfo().top.ids);
        },
        
        cellAtIndex : function (cell) {
            return this.dataset.data.getStringData({cell : cell});
        },

        cellExists : function (cell) {
            var tableSize = this.filterDimensions.getTableInfo().getTableSize();
            return (cell.y >= 0 && cell.x >= 0) &&
                (tableSize.rows > cell.y && tableSize.columns > cell.x);
        },
        
        cellHasAttributes : function (cell) {        	
            var cellAttributes = this.dataset.data.getAttributes({cell : cell});
        	return !_.isUndefined(cellAttributes) && _.compact(cellAttributes).length > 0;
        },
        
        cellAttributesAtIndex : function (cell) {
        	return this.dataset.data.getAttributes({cell : cell});
        },

        datasetAttributes : function () {
            return this.dataset.data.getDatasetAttributes();
        },

        rows : function () {
            return this.filterDimensions.getTableInfo().getTableSize().rows;
        },

        columns : function () {
            return this.filterDimensions.getTableInfo().getTableSize().columns;
        },
        
        isBlankRow : function(row) {
        	var dimensionElements = 0;
        	var pos = row; 
        	// Starts on one because the first one is not nested on another dimension
        	for (var dimension = 1; dimension < this.leftHeaderDimensionsLengths().length; dimension++) {

        		dimensionElements = this.leftHeaderDimensionsElements(dimension);
        		
        		// Check if the current row is the first of this dimension; if not, 'enter' the next nested dimension
        		pos = pos % dimensionElements;        		
        		if (pos == dimension - 1)
        			return true;        		
        	}
        	return false;
        },
        
        blankRowsOffset : function (row) {
        	var dimensionElements = 0;
        	var pos = row; 
        	var blanks = 0;
        	
        	// Starts on one because the first one is not nested on another dimension
        	var blanksElementsForDimension = 0;
        	for (var dimension = 1; dimension < this.leftHeaderDimensionsLengths().length; dimension++) {

        		dimensionElements = this.leftHeaderDimensionsElements(dimension);
        		blanksElementsForDimension = this.leftHeaderDimensionsBlanks(dimension);
        		
        		blanks += Math.floor(pos / dimensionElements) * blanksElementsForDimension;
        		     
        		pos = pos % dimensionElements;
        		if (pos == 0) { // Blank row
        			return blanks;        			 
        		} else { // "Enter" next dimension level
        			pos--;
        			blanks++;
        		}        		
        	}
        	return blanks;
        },

        /**
         * Return top header tooltip values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        topHeaderTooltipValues : function () {
            this.updateHeaderAttributes();
            return this._generateTooltipValues(this.topHeaderValues(),  this.topHeaderAttributes);
            //return _.map(topHeaderTooltipValues, function(tooltipValue) { return ; } )
        },

        /**
         * Return left header tooltips values
         * {dimension.label} : {category.label}
         * @returns {Array}
         */
        leftHeaderTooltipValues : function () {
            return this.leftHeaderValues();
        },


        _generateTooltipValues : function (titles, attributes) {            
            var result = [];
            var attribute;

            _.each(titles, function(element, index) { 
                attribute = attributes ? attributes[index] : [];                 
                result.push({ title : titles[index], attributes : _.zip.apply(_, attribute)}); 
            });
            return result;
        }

    };

    _.extend(App.DataSourceDataset.prototype, Backbone.Events);

}());
