STAT4YOU.namespace("STAT4YOU.Filters.TableFilter");


/*** CHILDREN LEVEL 1 ***/
STAT4YOU.Filters.TableFilter = (function() {
        
        
    /**********************************************************************************/
    /**                             TableFilter                                      **/
    /** Not instanciable                                                             **/
    /**********************************************************************************/
    var TableFilter = function(externalContainerId, filterContainerId, objectName, transformations) {
        // Table's special attributes
        this._divFixedDimensions = undefined;
        this._divLeftDimensions = undefined;
        this._divTopDimensions = undefined;
        this._divCenter = undefined;
        this._CSS_DIMENIONS_LONG_CLASS = 'div-dimension-container';
        this._CSS_DIMENIONS_LONG_CLASS_HIDDEN = 'div-dimension-container-hidden';
        this._CSS_DIMENIONS_SHORT_CLASS = 'div-dimension-short-table';
    };
    
    
    TableFilter.prototype = new STAT4YOU.Filters.Filter();
    
    
    TableFilter.prototype._getTitleFilter = function () {
        return "Opciones de la tabla";
    };
    
    
    TableFilter.prototype._mustBeAFixedDimension = function(id) {
        return (id != "div-left-dimensions" && id != "div-top-dimensions");
    };
    
    
    /* Adjusting the Css to display the DIVs correctly */
    TableFilter.prototype.adjustingCss = function() {
        var self = this;
        var offsetScrollTop = jQuery("#"+self._filterContainerId).offset().top;
        var offsetTopTable = jQuery("#div-top-dimensions").offset().top;

        /* Adjunting the height */
        var buttonTop = jQuery('#'+self._filterContainerId+'>button').offset().top;
        var leftHeight = buttonTop - offsetTopTable;
        jQuery("#div-left-dimensions").css("width", leftHeight);

        /* Adjusting the Top */
        var halfLeftWidth = jQuery("#div-left-dimensions").width() / 2 - jQuery("#div-left-dimensions").height() / 2; // Once we rotate this pixels must be added to the margin
        var pixelsToAdd = offsetTopTable - offsetScrollTop + halfLeftWidth;
        jQuery("#div-left-dimensions").css("top", pixelsToAdd);
        
        /* Adjusting the Height */
        var halfLeftWidth = jQuery("#div-left-dimensions").width() / 2 - jQuery("#div-left-dimensions").height() / 2; // Once we rotate this pixels must be added to the margin
        jQuery("#div-left-dimensions").css("left", -(halfLeftWidth) + 15);
    };
    
    
    /* Extending the structure with the table DIVs */
    TableFilter.prototype._extendDivStructure = function() {
        var self = this;
        self._divFixedDimensions = document.createElement('div');
        self._divFixedDimensions.setAttribute('id','div-fixed-dimensions');
        self._divFixedDimensions.setAttribute('class',self._CSS_DIMENIONS_LONG_CLASS);
        
        var span = document.createElement('span');
        span.setAttribute('class','options');
        text = document.createTextNode(I18n.t("filter.text.fixedDimensions"));
        span.appendChild(text);
        self._divFixedDimensions.appendChild(span);

        self._div_options_container.appendChild(self._divFixedDimensions);
        
        self._divLeftDimensions = document.createElement('div');
        self._divLeftDimensions.setAttribute('id','div-left-dimensions');
        self._divLeftDimensions.setAttribute('class',self._CSS_DIMENIONS_LONG_CLASS);
        
    

        self._div_options_container.appendChild(self._divLeftDimensions);
        
        self._divTopDimensions = document.createElement('div');
        self._divTopDimensions.setAttribute('id','div-top-dimensions');
        self._divTopDimensions.setAttribute('class',self._CSS_DIMENIONS_LONG_CLASS);
        
        
        self._div_options_container.appendChild(self._divTopDimensions);

        self._divCenter = document.createElement('div');
        self._divCenter.setAttribute('id','div-center');
        self._divCenter.setAttribute('class','div-center');

        self._div_options_container.appendChild(self._divCenter);

        /** Adding CSS changes **/
        self.adjustingCss();
        
    };
    
    
    /* Drawing the filter */
    TableFilter.prototype._drawOptions = function () {
        var self = this;
        //Table
        self._div_options_container.id = "tablefilterContainer";
        // In this case we have to extend the DIV structure
        self._extendDivStructure();
        // For each dimension (By position)
        for (var pos in self._options.dimensions.posToId) {
            pos = parseInt(pos);
            var i = self._options.dimensions.posToId[pos] + 1;
            
            var divDimensionShort = document.createElement('div');
            divDimensionShort.setAttribute('id', self._CSS_DIMENIONS_SHORT_CLASS+i);
            divDimensionShort.setAttribute('class', self._CSS_DIMENIONS_SHORT_CLASS);
            divDimensionShort.setAttribute('draggable','true');
            
            var dimensionText = document.createElement('div');
            dimensionText.setAttribute('class','div-dimension-text');
            
            var span = document.createElement('span');
            span.setAttribute('class','dimension-label');
            text = document.createTextNode(self._options.dimensions.label[i-1]);
            span.appendChild(text);
            
            dimensionText.appendChild(span);
            divDimensionShort.appendChild(dimensionText);
            
            var selectCategories = document.createElement('div');
            selectCategories.setAttribute('class','select-categories unselectall');
            divDimensionShort.appendChild(selectCategories);
            
            var range = parseInt(pos / 10);
            switch(range) {
                case 0:
                    self._divLeftDimensions.appendChild(divDimensionShort);
                break;
                case 2:
                    self._divTopDimensions.appendChild(divDimensionShort);
                break;
                case 4:
                    self._divFixedDimensions.appendChild(divDimensionShort);
                break;
            }
            

            // Categories advanced container
            var $divDimensionShort = $(divDimensionShort);
            var $divCategoriesAdvancedContainer = $("<div id='div-categories-advanced-container"+i+"' class='div-categories-advanced-container'/>").appendTo($divDimensionShort);
            // Categories
            var $divCategories = $("<div id='div-categories"+i+"' class='div-categories'/>").appendTo($divCategoriesAdvancedContainer);

            // Categories options div and categories accept button
            $divCategoriesAdvancedContainer.append("<div class='categories-options' style='visibility: hidden'><input type='text' name='categories' class='categories-filter' placeholder='"+I18n.t("filter.search.categories")+"' /><button class='button-categories-big btn' >"+I18n.t("filter.button.accept")+"</button></div>");
            
            // Categories accept button
            //$divCategoriesAdvancedContainer.append("<button id='button-categories-big' class='btn' style='visibility: hidden'/>");

            
            var divCategories = $divCategories.get(0);
            /*
            var divCategories = document.createElement('div');
            divCategories.setAttribute('id','div-categories'+i);
            divCategories.setAttribute('class','div-categories');
            divDimensionShort.appendChild(divCategories);
            */

            
            /* EXTERNAL CALLS ................. */
                        
            for (var j=1; j<=self._options.categoriesPerDim[i-1].id.length; j++) {
                var divCategory = document.createElement('div');
                divCategory.setAttribute('id','div-category'+i+'-'+j);
                /* The first 2 dimensions are variable */
                if (self._options.categoriesPerDim[i-1].state[j-1] == 1)
                    divCategory.setAttribute('class','div-category');
                else
                    divCategory.setAttribute('class','div-category-clicked');
                
                divCategory.setAttribute('draggable','true');
                
                var span = document.createElement('span');
                span.setAttribute('class','options_category');
                text = document.createTextNode(self._options.categoriesPerDim[i-1].label[j-1]);
                span.appendChild(text);
                divCategory.appendChild(span);
                // Title
                divCategory.setAttribute('title',self._options.categoriesPerDim[i-1].label[j-1]);                
                
                divCategories.appendChild(divCategory);
            }
            
            
            /* Enabling / disabling the "select-categories" */
            if ($('.div-category-clicked', $(divCategories)).length == 0) {
                $('.select-categories', $(divDimensionShort)).addClass("selectall");
                $('.select-categories', $(divDimensionShort)).removeClass("unselectall");
            }
            else {
                $('.select-categories', $(divDimensionShort)).addClass("unselectall");
                $('.select-categories', $(divDimensionShort)).removeClass("selectall");
            }
            
            // RIGHT TRIANGLE
            // Checking if it is neccesary
            var divTriangle = document.createElement('div');
            divTriangle.setAttribute('id','triangle-right'+i);
            divTriangle.setAttribute('class','triangle-right');
            divDimensionShort.appendChild(divTriangle);            
            // Hide the triangle or not
            //var isInFixedDim = divCategories.parentNode.parentNode.id == "div-fixed-dimensions";
            var isInFixedDim = $(divCategories).parents("#div-fixed-dimensions").length > 0;
            if (self._checkOverflow(divCategories) || (isInFixedDim)) {
                divTriangle.style.visibility = "visible";
            }
            else {
                divTriangle.style.visibility = "hidden";
            }
        }
        
    };
    
    
    
    return TableFilter;
    
})();