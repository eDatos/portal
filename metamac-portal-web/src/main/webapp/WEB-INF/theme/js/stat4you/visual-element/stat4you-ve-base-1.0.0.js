STAT4YOU.namespace("STAT4YOU.VisualElement.Base");


/*** PARENT ***/
/** Not instanciable **/
    
STAT4YOU.VisualElement.Base = (function() {
    /*-----------------------------*/
    /* -- Base abstract class -- */
    /*-----------------------------*/
    var Base = function () {
        var self = this;

        /* Constants */
        self._ALPHA_MAX_DIM1 = 7;
        self._ALPHA_MAX_DIM2 = 5;

        self.POS_LEFT_BEGIN = 0;
        self.POS_LEFT_END = 19;
        self.POS_TOP_BEGIN = 20;
        self.POS_TOP_END = 39;
        self.POS_FIXED_BEGIN = 40;
        self.POS_FIXED_END = 59;

        self._options = null;
        
        self.temporalOptionsForFilters = null;
    };
    
    
    //--------------------------------------------------------------
    //                      PUBLIC METHODS
    // --------------------------------------------------------------

    Base.prototype.getFixedPermutation = function () {
        var self = this;
        var fixedDimensions = this.filterOptions.getFixedDimensions();
        var fixedPermutation = {};

        _.each(fixedDimensions, function (dimension) {
            var selectedCategory = self.filterOptions.getSelectedCategories(dimension.number)[0];
            fixedPermutation[dimension.id] = selectedCategory.id;
        });
        return fixedPermutation;
    };

    Base.prototype.getTitle = function () {
        var self = this;
        var fixedLabels = [];
        var fixedDimensions = this.filterOptions.getFixedDimensions();
        _.each(fixedDimensions, function (dimension) {
            var selectedCategory = self.filterOptions.getSelectedCategories(dimension.number)[0];
            fixedLabels.push(selectedCategory.label);
        });
        var title = "";
        if(fixedLabels.length){
            title = I18n.t("filter.text.for")+ ": " + fixedLabels.join(", ");
        }
        return title;
    };

    Base.prototype.setOptions = function(optionsVe) {
        var self = this;
        self._options = optionsVe;
    };
    
    
    Base.prototype.launchFilter = function() {
        var self = this;
        // Saving options
        self._savingTemporalOptions();
        // Loading filter
        var optionsFilter = {container : self._options.container,
                             categoriesPerDim : self._options.categoriesPerDim,
                             dimensions : self._options.dimensions};
        self._filter.setOptions(optionsFilter);
        self._filter.launch();
    };
    
    
    Base.prototype.closeFilter = function() {
        var self = this;
        if (self._options.container.filter) {
            self._options.container.filter.parentNode.removeChild(self._options.container.filter);
            self._options.container.filter = null;
            self._filter.close();
        }
        // Restoring options
        self._restoringTemporalOptions();
    };
    
    
    Base.prototype.saveFilter = function() {
        var self = this;
        if (self._options.container.filter) {
            self._options.container.filter.parentNode.removeChild(self._options.container.filter);
            self._options.container.filter = null;
            self._filter.close();
        }
        // Updating
        self.update();
        // Deleting temporal options
        self.temporalOptionsForFilters = null;
    };
    
    Base.prototype.resizeFilter = function() {
        var self = this;
        /* Closing the filter */
        if (self._options.container.filter) {
            $(self._options.container.filter).remove();
            self._options.container.filter = null;
            self._filter.close();
        }
        /* Launching the filter again, without losing the changes */
        var optionsFilter = {container : self._options.container,
                             categoriesPerDim : self._options.categoriesPerDim,
                             dimensions : self._options.dimensions};
        self._filter.setOptions(optionsFilter);
        self._filter.launch();
    };
    
    
    Base.prototype.resizeFullScreen = function() {
        var self = this;
        self.destroy();
        self.load();
        //self._loadOldAndBackupTemporalFilters();
    };
    
    
    //--------------------------------------------------------------
    //                     PRIVATE METHODS
    // --------------------------------------------------------------
    Base.prototype._loadOldAndBackupTemporalFilters = function() {
        var self = this;
        // Saving the temporal filters
        var tempFilters = {};
        tempFilters.posToId = $.extend(true, {}, self._options.dimensions.posToId);
        tempFilters.idToPos = $.extend(true, {}, self._options.dimensions.idToPos);
        tempFilters.categoriesPerDim = [];
        for (var i=0; i<self._options.categoriesPerDim.length; i++) {
            tempFilters.categoriesPerDim[i] = $.extend({}, self._options.categoriesPerDim[i].state);
        }
        self._useTemporalOptions();
        self.load();
        // Restoring the temporal filters
        self._options.dimensions.posToId = tempFilters.posToId;
        self._options.dimensions.idToPos = tempFilters.idToPos;
        for (var i=0; i<self._options.categoriesPerDim.length; i++) {
            self._options.categoriesPerDim[i].state = tempFilters.categoriesPerDim[i];
        }
    };
    
    Base.prototype._savingTemporalOptions = function() {
        var self = this;
        // Saving current options just in case we cancel the filter
        self.temporalOptionsForFilters = {};
        self.temporalOptionsForFilters.posToId = $.extend(true, {}, self._options.dimensions.posToId);
        self.temporalOptionsForFilters.idToPos = $.extend(true, {}, self._options.dimensions.idToPos);
        self.temporalOptionsForFilters.categoriesPerDim = [];
        for (var i=0; i<self._options.categoriesPerDim.length; i++) {
            self.temporalOptionsForFilters.categoriesPerDim[i] = $.extend({}, self._options.categoriesPerDim[i].state);
        }
    };
    
    
    Base.prototype._useTemporalOptions = function() {
        var self = this;
        // Restoring the options
        if (self.temporalOptionsForFilters) {
            self._options.dimensions.posToId = self.temporalOptionsForFilters.posToId;
            self._options.dimensions.idToPos = self.temporalOptionsForFilters.idToPos;
            for (var i=0; i<self._options.categoriesPerDim.length; i++) {
                self._options.categoriesPerDim[i].state = self.temporalOptionsForFilters.categoriesPerDim[i];
            }
        }
    };
    
    
    Base.prototype._restoringTemporalOptions = function() {
        var self = this;
        // Restoring the options
        self._useTemporalOptions();
        self.temporalOptionsForFilters = null;
    };
    
    
    
    Base.prototype._createTitle = function(tempRequest) {
        var self = this;
        /*- Setting the title -*/
        var areFixedElements = false;
        var first = true;
        var fixedText = " "+I18n.t("filter.text.for")+": ";
        for (var i=0; i<tempRequest.length; i++) {
            if (tempRequest[i] != -1) {
                if (!first)
                    fixedText += ", "+self._options.categoriesPerDim[i].label[tempRequest[i]];
                else {
                    fixedText += self._options.categoriesPerDim[i].label[tempRequest[i]];
                    first = false;
                }
                areFixedElements = true;
            }
        }
        // If fixed dimensions, the fixed value is shown in the title
        if (areFixedElements) {
            return fixedText + ".";
        } else {
            return "";
        }

    };
    
    
    Base.prototype._changeStatesToFixed = function(dim) {
        var self = this;
        // Disabling all the states excluding the first one
        for (var i=0; i<_.size(self._options.categoriesPerDim[dim].state); i++)
            if (i == 0)
                self._options.categoriesPerDim[dim].state[i] = 1;
            else
                self._options.categoriesPerDim[dim].state[i] = 0;
    };
    
    
    Base.prototype._decFixedPos= function() {
        var self = this;
        var mustContinue = true;
        var pos = 41;
        var dim;
        while (pos<59 && mustContinue) {
            if (self._options.dimensions.posToId[pos] != undefined) {
                /* Moving the pos fixed element to the pos-1 */
                dim = self._options.dimensions.posToId[pos];
                self._options.dimensions.posToId[pos-1] = dim;
                self._options.dimensions.idToPos[dim] = pos-1;
                delete self._options.dimensions.posToId[pos];
            }
            else
                mustContinue = false;
            pos++;
        }
    };
    
    
    Base.prototype._findFirstFreeFixedPos= function() {
        var self = this;
        /* Locating the last fixed */
        var firstFreeFixed = -1;
        mustContinue = true;
        i = 40;
        while (i<59 && mustContinue) {
            if (self._options.dimensions.posToId[i] == undefined) {
                firstFreeFixed = i;
                mustContinue = false;
            }
            i++;
        }
        
        return firstFreeFixed;
    };
    
    
    return Base;
    
})();