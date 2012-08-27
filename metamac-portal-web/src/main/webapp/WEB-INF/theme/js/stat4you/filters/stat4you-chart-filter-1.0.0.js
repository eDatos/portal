STAT4YOU.namespace("STAT4YOU.Filters.ChartFilter");


/*** CHILDREN LEVEL 1 ***/

STAT4YOU.Filters.ChartFilter = (function() {
        
        
    /**********************************************************************************/
    /**                             ChartFilter                                      **/
    /** Not instanciable                                                             **/
    /**********************************************************************************/
    var ChartFilter = function(externalContainerId, filterContainerId, objectName) {
        var self = this;
        self._CSS_DIMENIONS_LONG_CLASS = 'div-dimension-long';
        self._CSS_DIMENIONS_LONG_CLASS_HIDDEN = 'div-dimension-long-hidden';
        self._CSS_DIMENIONS_SHORT_CLASS = 'div-dimension-short';
    };
    
    
    ChartFilter.prototype = new STAT4YOU.Filters.Filter();
    
    
    ChartFilter.prototype._getTitleFilter = function () {
        return "Opciones del gráfico";
    };
    
    
    ChartFilter.prototype._drawOptions = function () {
        var self = this;
        // Chart
        self._div_options_container.id = "chartfilterContainer";
        /* Walking over the dimensions (by position) */
        var keysPosToIdOrder = _.keys(self._options.dimensions.posToId);
        keysPosToIdOrder = _.sortBy(keysPosToIdOrder, function(n) { return n});
        for (var k=0; k<keysPosToIdOrder.length; k++) {
            // Aux variables
            pos = parseInt(keysPosToIdOrder[k]);
            var iMoved = pos + 1;
            var i = self._options.dimensions.posToId[pos] + 1;
            
            //Zone
            var $divDimensionLong = $("<div id='div-dimension-long"+iMoved+"' class='"+self._CSS_DIMENIONS_LONG_CLASS+"'/>").appendTo($(self._div_options_container));
            if (iMoved > 40)
                $divDimensionLong.addClass('fixed');
            // Zone text
            $divDimensionLong.append("<span class='options'>"+self._getTextDimensionPosition(iMoved)+"</span>");
            // Dimension
            var $divDimensionShort = $("<div id='"+self._CSS_DIMENIONS_SHORT_CLASS+i+"' class='"+self._CSS_DIMENIONS_SHORT_CLASS+"' draggable='true'/>").appendTo($divDimensionLong);
            // Dimension text
            $divDimensionShort.append("<div class='div-dimension-text'><span class='dimension-label'>"+self._options.dimensions.label[i-1]+"</span></div>");
            // Checkbox
            $divDimensionShort.append("<div class='select-categories unselectall'/>");
            // Categories advanced container
            var $divCategoriesAdvancedContainer = $("<div id='div-categories-advanced-container"+i+"' class='div-categories-advanced-container'/>").appendTo($divDimensionShort);
            // Categories
            var $divCategories = $("<div id='div-categories"+i+"' class='div-categories'/>").appendTo($divCategoriesAdvancedContainer);
            // Categories options div and categories accept button
            $divCategoriesAdvancedContainer.append("<div class='categories-options' style='visibility: hidden'><input type='text' name='categories' class='categories-filter' placeholder='"+I18n.t("filter.search.categories")+"' /><button class='button-categories-big btn'>"+I18n.t("filter.button.accept")+"</button></div>");

            
            /* For each category */
            for (var j=1; j<=self._options.categoriesPerDim[i-1].id.length; j++) {
                if (self._options.categoriesPerDim[i-1].state[j-1] == 1)
                    $divCategories.append("<div id='div-category"+i+"-"+j+"' class='div-category' draggable='true' title='"+self._options.categoriesPerDim[i-1].label[j-1]+"'>" +
                    		              "<span class='options_category'>"+self._options.categoriesPerDim[i-1].label[j-1]+"</span>" +
                                          "</div>");
                else
                    $divCategories.append("<div id='div-category"+i+"-"+j+"' class='div-category-clicked' draggable='true' title='"+self._options.categoriesPerDim[i-1].label[j-1]+"'>" +
                                          "<span class='options_category'>"+self._options.categoriesPerDim[i-1].label[j-1]+"</span>" +
                                          "</div>");
            }
            
            /* For restrictions: Generatign the stack */
            self._generateStack(i-1, i);
            
            // RIGHT TRIANGLE
            // Checking if it is neccesary
            if (self._checkOverflow($divCategories.get(0))) {
                $divDimensionShort.append("<div id='triangle-right"+i+"' class='triangle-right' style='visibility: visible' />");
            }
            else {
                $divDimensionShort.append("<div id='triangle-right"+i+"' class='triangle-right' style='visibility: hidden' />");
            }
        }
    };
    
    
    ChartFilter.prototype._generateStack = function (zoneDivNum, dimNum) {
        var self = this;
        /* Deleting and restoring the corresponding stack */
        switch (zoneDivNum) {
            case 0:
                delete self.restriction1Stack;
                self.restriction1Stack = [];
            break;
            case 1:
                delete self.restriction2Stack;
                self.restriction2Stack = [];
            break;
        }
        var j=1;
        var restrictionReached = false;
        var restrictionCounter = 0;
        while (j<=self._options.categoriesPerDim[dimNum-1].id.length) {
            var divCategoryId = 'div-category'+dimNum+'-'+j;
            if (!restrictionReached) {
                switch (zoneDivNum) {
                    case 0:
                        if (self.restrictionDim1 && (restrictionCounter == self._ALPHA_MAX_DIM1)) {
                            restrictionReached = true;
                            j--;
                        }
                        else if (self.restrictionDim1 && (restrictionCounter < self._ALPHA_MAX_DIM1)) {
                            if (self._options.categoriesPerDim[dimNum-1].state[j-1] == 1) {
                                //push
                                self.restriction1Stack.push(divCategoryId);
                                restrictionCounter++;
                            }
                        }
                    break;
                    case 1:
                        if (self.restrictionDim2 && (restrictionCounter == self._ALPHA_MAX_DIM2)) {
                            restrictionReached = true;
                            j--;
                        }
                        else if (self.restrictionDim2 && (restrictionCounter < self._ALPHA_MAX_DIM2)) {
                            if (self._options.categoriesPerDim[dimNum-1].state[j-1] == 1) {
                                //push
                                self.restriction2Stack.push(divCategoryId);
                                restrictionCounter++;
                            }
                        }
                    break;    
                }
            }
            else {
                self._options.categoriesPerDim[dimNum-1].state[j-1] = 0;
                $('#'+divCategoryId).addClass("div-category-clicked");
                $('#'+divCategoryId).removeClass("div-category");
            }
            j++;
        }
        
        /* Enabling / disabling the "select-categories" */
        if (restrictionReached || (self._options.categoriesPerDim[dimNum-1].id.length == restrictionCounter)) {
            $('.select-categories', $('#div-dimension-short'+dimNum)).addClass("selectall");
            $('.select-categories', $('#div-dimension-short'+dimNum)).removeClass("unselectall");
        }
        else {
            $('.select-categories', $('#div-dimension-short'+dimNum)).addClass("unselectall");
            $('.select-categories', $('#div-dimension-short'+dimNum)).removeClass("selectall");
        }
        
    };
    
    
    
    return ChartFilter;
    
})();
