STAT4YOU.namespace("STAT4YOU.Filters.Filter");


/*** PARENT ***/
/** Not instanciable **/
    
STAT4YOU.Filters.Filter = (function($) {
    /*-----------------------------*/
    /* -- Filter abstract class -- */
    /*-----------------------------*/
    var Filter = function () {
        var self = this;
        self._options = null;
        self._filterContainerId = "filter-container";
        self._div_options_container = null;
        self._options = null;
        /* Constants */
        self._ALPHA_MAX_DIM1 = 7;
        self._ALPHA_MAX_DIM2 = 5;
        /* Restrictions */
        self.restriction1Stack = null;
        self.restriction2Stack = null;
    };
    
    /*------------------------------------------------------------------------
     * PUBLIC METHODS
     ---------------------------------------------------------------------- */
    Filter.prototype.close = function(dimension, newParent) {
        var self = this;
        delete self.restriction1Stack;
        delete self.restriction2Stack;
    };
    
    
    /* LAUNCHES the filters BOX */
    Filter.prototype.launch = function() {
        var self = this;
        /* Creating the restriction stacks */
        self.restriction1Stack = [];
        self.restriction2Stack = [];
        // Creating the options div
        self._createFilterDiv();
        // Setting Listeners
        self._addDragDropListeners();
        // Scrolling to get to the bottom of the "filter-container" div
        var offsetScrollTop = $(self._options.container.external).offset().top;
        var containerHeight = $(self._options.container.external).height();
        var windowHeight = $(window).height();
        $('html,body').animate({
            scrollTop: offsetScrollTop + containerHeight - windowHeight + 15
        }, 2000);
    };
    
    Filter.prototype.setOptions = function(optionsFilter) {
        var self = this;
        self._options = optionsFilter;
    };
    
    
    /*------------------------------------------------------------------------
     * PRIVATE ABSTRACT METHODS
     ---------------------------------------------------------------------- */
    
    Filter.prototype._mustBeAFixedDimension = function(id) {
        // Abstract Method in this Parent class
        return false;
    };
    
    
    /* DRAWING options in a certain div */
    Filter.prototype._drawOptions = function () {
        
        /* THIS MUST BE AN EMPTY FUNCTION IN THIS ABSTRACT PARENT CLASS */
        
    };
    
    
    /*------------------------------------------------------------------------
     * PRIVATE METHODS
     ---------------------------------------------------------------------- */
    Filter.prototype._checkIfTriangleIsNeeded = function(dimension, newParent) {
        var self = this;
        /* CHECKING IF THE TRIANGLE IS NEEDED */
        divTriangle = $('.triangle-right', $(dimension)).get(0);
        divCategories = $('.div-categories', $(dimension)).get(0);
        if (newParent.id == "div-fixed-dimensions") {
            divTriangle.style.visibility = "visible";
        }
        else {
            if (self._checkOverflow(divCategories)) {
                divTriangle.style.visibility = "visible";
            }
            else {
                divTriangle.style.visibility = "hidden";
            }
        }
    };
    
    
    Filter.prototype._closeCategoriesBigDiv = function(triangle) {
        var self = this;
        // Making visible again
        var dimensionShortDiv = $('.'+self._CSS_DIMENIONS_SHORT_CLASS).get();
        for (var i=0; i<dimensionShortDiv.length; i++) {
            var $parent = $(dimensionShortDiv[i]).parents('.div-dimension-long-hidden');
            if ($parent.length > 0) {
                $parent.removeClass(self._CSS_DIMENIONS_LONG_CLASS_HIDDEN);
                $parent.addClass(self._CSS_DIMENIONS_LONG_CLASS);
            }
        }
        // Scroll
        if (scrollBar) {
            var api = scrollBar.data('jsp');
            api.scrollToY(0);
            api.destroy();
            scrollBar = null;
        }
        
        // Closing the categories big
        var $currentParent = $(triangle).parents('.div-dimension-short');
        if ($currentParent.length == 0)
            $currentParent = $(triangle).parents('.div-dimension-short-table');
        //var categoriesDiv = self._options.container.filter.querySelector('#'+self._options.container.filter.id+' #'+triangle.parentNode.id+'>.div-categories-big');
        var $categoriesDiv = $('.div-categories-big', $currentParent);
        $categoriesDiv.removeClass('div-categories-big');
        $categoriesDiv.addClass('div-categories');
        
        var $categoriesDivAdvContainer = $('.div-categories-advanced-container-big', $currentParent);
        var tempWidth = $categoriesDivAdvContainer.width(); // Reloading proper width
        $categoriesDivAdvContainer.width(tempWidth - 20);
        $categoriesDivAdvContainer.removeClass('div-categories-advanced-container-big');
        $categoriesDivAdvContainer.addClass('div-categories-advanced-container');
        
        // Changing the triangle
        $(triangle).removeClass('triangle-top');
        $(triangle).addClass('triangle-right');
        // Removing highlights
        self._removeHighlights($categoriesDiv.get(0), true);
        
        // Options available only in full screen
        $('.categories-options', $(triangle).parents('.div-dimension-short-table, .div-dimension-short')).css("visibility", "hidden");
        
        var $leftDiv = $categoriesDiv.parents('#div-left-dimensions');
        if ($leftDiv.length > 0) {
            $categoriesDiv.attr("style", "");
        }
        $categoriesDivAdvContainer.attr("style", "");
//        if (categoriesDiv.parentNode.parentNode.id == 'div-left-dimensions') {
//            categoriesDiv.setAttribute("style", "");
//        }
    };
    

    Filter.prototype._openCategoriesBigDiv = function(categoriesDiv, triangle) {
        var self = this;
        // If there is any dimension with the big categories box opened -> close
        // We have to increase the categories DIV's height
        var $categoriesDiv = $(categoriesDiv);
        $categoriesDiv.removeClass('div-categories');
        $categoriesDiv.addClass('div-categories-big');
        
        var $categoriesDivAdvContainer = $categoriesDiv.parents('.div-categories-advanced-container');
        $categoriesDivAdvContainer.removeClass('div-categories-advanced-container');
        $categoriesDivAdvContainer.addClass('div-categories-advanced-container-big');
        
        
        /* CASE TABLE (LEFT DIV) */
        var $leftDiv = $categoriesDiv.parents('#div-left-dimensions');
        if ($leftDiv.length > 0) {
            var height = Math.round($categoriesDivAdvContainer.parents('.div-dimension-short-table').width()*0.60 + 5);
            $categoriesDivAdvContainer.css("height", height /*former: 65 and padding +20*/);
            var $categoriesOptions = $('.categories-options', $categoriesDivAdvContainer);
            //$categoriesOptions.width(height);
            $categoriesDiv.height(height - $categoriesOptions.outerHeight());
            /* Right= height/2 - width/2*/
            var newRight = $categoriesDivAdvContainer.height() / 2 - $categoriesDivAdvContainer.width() / 2; // Once we rotate this pixels must be added to the margin
            newRight = Math.round(newRight) -1;
            $categoriesDivAdvContainer.css("right", newRight);
            var offsetScrollTop = $categoriesDivAdvContainer.parents('.div-dimension-short-table').offset().left;
            var offsetTopThis = $categoriesDivAdvContainer.offset().left;
            var newTop = Math.round(offsetScrollTop - offsetTopThis);
            $categoriesDivAdvContainer.css("top", Math.round(newTop));
            /* Enabling the scroll */
            scrollBar = $('.div-categories-big').jScrollPane({
                                                          showArrows: false
                                                      });
        }
        else {
            /* Enabling the scroll */
            scrollBar = $('.div-categories-big').jScrollPane({
                                                          showArrows: false
                                                      });
            
            // Not a fixed dimension
            var $fixedDiv = $categoriesDiv.parents('#div-fixed-dimensions');
            if ($fixedDiv.length == 0) {
                /* Adding some padding because of the scrollbar */
                var tempWidth = $categoriesDivAdvContainer.width();
                $categoriesDivAdvContainer.width(tempWidth + 20);
            }
        }
        
        
        // Changing the triangle
        $(triangle).removeClass('triangle-right');
        $(triangle).addClass('triangle-top');
        
        // Options available only in full screen (Accept button)
        $('.categories-options', $categoriesDiv.parents('.div-dimension-short-table, .div-dimension-short')).css("visibility", "visible");
        
        /*-------------------------------------------------------------------*/
        /* Chcecking if there is enough space to open the options DIV        */
        /*-------------------------------------------------------------------*/
        if (self._CSS_DIMENIONS_LONG_CLASS_HIDDEN == 'div-dimension-long-hidden') {
            var categoriesBigTop = $categoriesDiv.offset().top;
            var buttonTop = $('#'+self._options.container.filter.id+'>button').offset().top;
            var categoriesBigHeight = $categoriesDiv.css("height");
            var filtersContainerHeight = $('#'+self._options.container.filter.id).css("height");
            categoriesBigHeight = parseInt(categoriesBigHeight.substring(0, categoriesBigHeight.length - 2));
            filtersContainerHeight = parseInt(filtersContainerHeight.substring(0, filtersContainerHeight.length - 2));
            var categoriesBottom = categoriesBigTop + categoriesBigHeight; 
            var filtersBottom = buttonTop;
            var surplusSpace = filtersBottom - categoriesBottom;            
            //var dimensionsLongDivs = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .'+self._CSS_DIMENIONS_LONG_CLASS);
            var dimensionsLongDivs = $('.'+self._CSS_DIMENIONS_LONG_CLASS).get();
            var i = 0;
            /* I'm assuming that dimensionsLongDivs is ordered */
            var reached = 0;
            while ((surplusSpace < 0) && (i < dimensionsLongDivs.length - 1) && (!reached)) {
                /* I've reached the selected DIV: so I must stop */
                var me = self._options.container.filter.querySelector('#'+dimensionsLongDivs[i].id+' .div-categories-big');
                if (me)
                    reached = 1;
                else {
                    $(dimensionsLongDivs[i]).removeClass(self._CSS_DIMENIONS_LONG_CLASS);
                    $(dimensionsLongDivs[i]).addClass(self._CSS_DIMENIONS_LONG_CLASS_HIDDEN);
                    surplusSpace += $('#'+dimensionsLongDivs[i].id).outerHeight();
                    i++;
                }
            }
        }
    };
    
    
    
    /* removing the CSS highlighting styles. We only save the styles considered important */
    Filter.prototype._removeHighlights = function(elem) {
        //this.setAttribute("style","top: "+this.style.top+"; left: "+this.style.left+"; width: "+this.style.width);
        $(elem).removeClass("highlight-long");
        $(elem).removeClass("highlight-short");
    };
    
    
    
    /* CREATING OPTIONS div */
    Filter.prototype._createFilterDiv = function () {
        var self = this;
        // Creating FILTER CONTAINER div
        if ($(self._options.container.ve).hasClass("full-screen-no-support"))
            $(self._options.container.vecontainer).append('<div id='+self._filterContainerId+' class="'+self._filterContainerId+' full-screen-no-support"></div>');
        else
            $(self._options.container.vecontainer).append('<div id='+self._filterContainerId+' class='+self._filterContainerId+'></div>');
        self._options.container.filter = $('#'+self._filterContainerId).get(0);
        // P
        //$(self._options.container.filter).append('<span id="title-options">'+self._getTitleFilter()+'</span>');
        // Span
        $(self._options.container.filter).append('<span id="close" onclick="$(document).trigger(\'closeFilter\')"></span>');
        // Div options container
        $(self._options.container.filter).append('<div class=filter-subcontainer></div>');
        self._div_options_container = $('.filter-subcontainer').get(0);
        // Button
        $(self._options.container.filter).append('<button id="button-options" class="btn" onclick="$(document).trigger(\'saveFilter\')">'+I18n.t("filter.button.accept")+'</button>');
        $(self._options.container.filter).append('<span class="button-cancel" onclick="$(document).trigger(\'closeFilter\')">'+I18n.t("filter.button.cancel")+'</span>');
        // Here we must load all the dimensions and their categories in DIVs
        /* Specific code for a chart or the table */
        self._drawOptions();    
    };
    
    
    /* Checking the arrows */
    Filter.prototype._checkArrowsNecessary = function() {
        var self = this;
        //var dimensions = self._options.container.filter.querySelectorAll('#'+self._filterContainerId+' .div-categories');
        var dimensions = $('.div-categories').get();
        for (var i=0; i<dimensions.length; i++) {
            //var categories = self._options.container.filter.querySelectorAll('#'+self._filterContainerId+' #'+dimensions[i].id+'>.div-category, #'+dimensions[i].id+'>.div-category-clicked');
            var categories = $('.div-category, .div-category-clicked', $(dimensions[i])).get();
            var dimensionSize = $('#'+dimensions[i].id).width();
            var sumCategoriesSize = 0;
            for (var j=0; j<categories.length; j++)
                sumCategoriesSize += $('#'+categories[j].id).outerWidth(true);
            /* For this particular dimension */
            if (dimensionSize > sumCategoriesSize) {
                var $arrow = $('.triangle-right', $(dimensions[i]));
                //var arrow = self._options.container.filter.querySelector('#'+self._filterContainerId+' #'+dimensions[i].parentNode.id+'>.triangle-right');
                $arrow.css("visibility", "hidden");    
            }
        }
    };
    
    
    /* Determines if the passed element is overflowing its bounds,
     * either vertically or horizontally.
     * Will temporarily modify the "overflow" style to detect this
     * if necessary. */
    Filter.prototype._checkOverflow = function(el) {
       var curOverflow = el.style.overflow;
       if ( !curOverflow || curOverflow === "visible" )
          el.style.overflow = "hidden";

       var isOverflowing = el.clientWidth < el.scrollWidth 
          || el.clientHeight < el.scrollHeight;

       el.style.overflow = curOverflow;

       return isOverflowing;
    };
    
    
    /*-------------------------------------------------------------------------
     * EVENT HELPERS
     ------------------------------------------------------------------------*/
    /* Adding the listeners */
    Filter.prototype._addDragDropListeners = function() {
        var self = this;
        //var dimensions = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .'+self._CSS_DIMENIONS_SHORT_CLASS);
        var dimensions = $('.'+self._CSS_DIMENIONS_SHORT_CLASS).get();
        //var dimensionContainers = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .'+self._CSS_DIMENIONS_LONG_CLASS);
        var dimensionContainers = $('.'+self._CSS_DIMENIONS_LONG_CLASS).get();
        
        // Dimensions (Drag&Drop)
        $.each(dimensions, function(idx, elem) {
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragstart', {self: self}, self._handleDragDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('selectstart', {self: self}, function(){this.dragDrop();});

            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragover', {self: self}, self._handleDragOverDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragleave', {self: self}, self._handleDragLeaveDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragend', {self: self}, self._handleDragEndDimensions);
        });

        $.each(dimensionContainers, function(idx, elem) {
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragenter', {self: self}, self._handleDragEnterDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragover', {self: self}, self._handleDragOverDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragleave', {self: self}, self._handleDragLeaveDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('dragend', {self: self}, self._handleDragEndDimensions);
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('drop', {self: self}, self._handleDropDimensions);
        });
        
        // Categories (Click)
        //var categories = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .div-category, .div-category-clicked');
        var categories = $('.div-category, .div-category-clicked').get();
        
        $.each(categories, function(idx, elem){
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('click', {self: self}, self._handleClickCategory);
        });
        
        // Categories Triangles (Click)
        //var triangles = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .triangle-right');
        var triangles = $('.triangle-right').get();
        $.each(triangles, function(idx, elem){
            $('#'+self._options.container.filter.id+' #'+elem.id).bind('click', {self: self}, self._handleClickCategoriesTriangles);
        });
        
        // Categories button
        var buttonCategories = $('.button-categories-big').get();
        $.each(buttonCategories, function(idx, elem){
            $(elem).bind('click', {self: self}, self._handleClickCategoriesButton);
        });
        
        // Categories search
        var categoriesSearch = $('.categories-filter').get();
        $.each(categoriesSearch, function(idx, elem){
            $(elem).bind('click', {self: self}, self._handleClickCategoriesSearch);
            $(elem).bind('keyup', {self: self}, self._handleKeyPressCategoriesSearch);
        });
        
        // Select / unselect all
        //var selectable = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .select-categories');
        var selectable = $('.select-categories').get();
        
        $.each(selectable, function(idx, elem){
            $(elem).bind('click', {self: self}, self._handleClickSelectCategories);
        });        
    };
    
    
    Filter.prototype._isNotPossibleToMove = function(newParent) {
        var self = this;
        
        if (newParent.children) {
            return (newParent.id == "div-left-dimensions" && newParent.children.length >= 4) ||
                   (newParent.id == "div-top-dimensions" && newParent.children.length >= 4) ||
                   (newParent.id == "div-fixed-dimensions" && newParent.children.length >= 5);
        }
        else {
            return (newParent.id == "div-left-dimensions" && newParent.childNodes.length >= 4) ||
                   (newParent.id == "div-top-dimensions" && newParent.childNodes.length >= 4) ||
                   (newParent.id == "div-fixed-dimensions" && newParent.childNodes.length >= 5);
        }
    };
    
    Filter.prototype._appendDimension = function(newParent, dimension) {
        var self = this;
        
        var inserted = true;
        
        /* Restriction of 4 elements in DIV LEFT
         * The user cannot locate more than 4 dimensions in the left DIV */
        if (self._isNotPossibleToMove(newParent)) {
            inserted = false;
        }
        /* Restriction: Not dropping in the same DIV */
        else {
            /* MOVING THE DIMENSIONS STRUCTURE */
            // Moving if not the same element
            var dim = dimension.id.substring(dimension.id.length -1) - 1;
            var oldPos = self._options.dimensions.idToPos[dim];
            var newPos = null;
            var tempLastDim = newParent.lastElementChild;
            /* There are dimensions in the DIV */
            if (tempLastDim && tempLastDim.tagName == "DIV") {
                /* This is the last element */
                var lastDimId = tempLastDim.id.substring(tempLastDim.id.length -1) -1;
                /* the new pos is the pos of the last element + 1 */
                newPos = self._options.dimensions.idToPos[lastDimId] +1;
            }
            /* No elements in DIV: only could happen in the table */
            else {
                switch (newParent.id) {
                    case "div-left-dimensions":
                        newPos = 0;
                    break;
                    case "div-top-dimensions":
                        newPos = 20;
                    break;
                    case "div-fixed-dimensions":
                        newPos = 40;
                    break;
                }
            }
            /* Applying */
            self._options.dimensions.posToId[newPos] = dim;
            /* Updating the old dimension */
            self._options.dimensions.idToPos[dim] = newPos;
            /* Deleting only the old position */
            delete self._options.dimensions.posToId[oldPos];
            /* All the elements that were located after the element before,
             * must be moved one position */
            var sibling = dimension.nextSibling;
            while (sibling) {
                var dim = sibling.id.substring(sibling.id.length -1) - 1;
                oldPos = self._options.dimensions.idToPos[dim]; 
                self._options.dimensions.posToId[oldPos -1] = dim;
                self._options.dimensions.idToPos[dim] = oldPos -1;
                delete self._options.dimensions.posToId[oldPos];
                sibling = sibling.nextSibling;
            }
            
            /*** MOVING ***/
            // Moving the selected one to the new DIV if it is a new DIV
            newParent.appendChild(dimension);
            /* ARE TRIANGLES NECCESSARY? */
            self._checkIfTriangleIsNeeded(dimension, newParent);
        }
        
        return inserted;
    };
    
    
    Filter.prototype._swapDimensions = function(newParent, dimension, oldParent, targetDimension) {
        var self = this;
        
        /* MOVING THE DIMENSIONS STRUCTURE */
        // Moving if not the same element
        var dim = dimension.id.substring(dimension.id.length -1) - 1;
        var oldPos = self._options.dimensions.idToPos[dim];
        /* This is the last element */
        var targetDimId = targetDimension.id.substring(targetDimension.id.length -1) -1;
        var targetPos = self._options.dimensions.idToPos[targetDimId];
        
        
        /* Applying */
        // The selected to the target pos
        self._options.dimensions.posToId[targetPos] = dim;
        self._options.dimensions.idToPos[dim] = targetPos;
        // The target to the old pos
        self._options.dimensions.posToId[oldPos] = targetDimId;
        self._options.dimensions.idToPos[targetDimId] = oldPos;
        
        /* MOVING THE DIV */
        /* Within the same DIV */
        if (oldParent == newParent) {
            var next = dimension.nextSibling;
            if (next == targetDimension)
                oldParent.appendChild(dimension);
            else if (next == null) {
                oldParent.insertBefore(dimension, targetDimension);
                oldParent.appendChild(targetDimension);
            }                    
            else {
                oldParent.insertBefore(dimension, targetDimension);
                oldParent.insertBefore(targetDimension, next);
            }
        }
        /* Different Divs */
        else {
            oldParent.appendChild(targetDimension);
            newParent.appendChild(dimension);
        }
        /* ARE TRIANGLES NECCESSARY? */
        self._checkIfTriangleIsNeeded(targetDimension, oldParent);
        self._checkIfTriangleIsNeeded(dimension, newParent);
        
        
        /* Regenerating the stack of restrictions if it is a chart */
        if (self._div_options_container.id != 'tablefilterContainer') {
            if (targetPos < 3)
                self._generateStack(targetPos, dim + 1);
            if (oldPos < 3)
                self._generateStack(oldPos, targetDimId + 1);
        }
        
        return true;
    };
    
    
    Filter.prototype._applyFixedDimensionRestrictions = function(parent, dimension) {
        var self = this;
        var categoriesDiv = $('.div-categories', $(dimension)).get(0);
        //var categoriesDiv = self._options.container.filter.querySelector('#'+self._options.container.filter.id+' #'+parent.id+'>#'+dimension.id+'>.div-categories');
        if (self._mustBeAFixedDimension(parent.id) && categoriesDiv) {
            /* Locating the dimension */
            var dim = dimension.id.substring(dimension.id.length -1) -1;
            // All the categories are unckecked
            var categories = $(categoriesDiv).children();
            var atLeastOneUnMarked = false;
            for (var i=0; i<categories.length; i++)
                if (($(categories[i]).hasClass("div-category")) || ($(categories[i]).hasClass("div-category-clicked")))
                    if (i == 0) {
                        $(categories[i]).addClass("div-category");
                        $(categories[i]).removeClass("div-category-clicked");
                        self._options.categoriesPerDim[dim].state[i] = 1;
                    }
                    else {
                        $(categories[i]).addClass("div-category-clicked");
                        $(categories[i]).removeClass("div-category");
                        self._options.categoriesPerDim[dim].state[i] = 0;
                        atLeastOneUnMarked = true;
                    }
            if (atLeastOneUnMarked) {
                $('.select-categories', $(dimension)).addClass("unselectall");
                $('.select-categories', $(dimension)).removeClass("selectall");
            }
                
        }
    };
    
    
    // Returns 0 if Append, 1 if swap
    Filter.prototype._detectMovementAndElementsToMove = function(elem) {
        var self = this;
        var swapFlag = 1;

        // Calculating the new Parent and the targe dimension
        var newParent = $(elem).parents('.'+self._CSS_DIMENIONS_LONG_CLASS).get(0);
        var targetDimension = $(elem).parents('.'+self._CSS_DIMENIONS_SHORT_CLASS).get(0);

        // SPECIAL CASES
        // This case is an APPEND (but if it is a chart could be a swap) -> In the zone itself
        if ($(elem).hasClass(self._CSS_DIMENIONS_LONG_CLASS)) {
            newParent = elem;
            if (self._div_options_container.id == 'tablefilterContainer') {
                swapFlag = 0;
                targetDimension = null;
            }
            else {
                targetDimension = newParent.children[1];
            }
        }
        // This case is an APPEND (but if it is a chart could be a swap) -> In the text of the zone
        else if ($(elem).hasClass('options')) {
            if (self._div_options_container.id == 'tablefilterContainer') {
                swapFlag = 0;
                targetDimension = null;
            }
            else {
                targetDimension = ($(newParent).children())[1];
                //targetDimension = newParent.children[1];
            }
        }
        
        var toret = {};
        toret.swapFlag = swapFlag;
        toret.newParent = newParent;
        toret.targetDimension = targetDimension;
        
        return toret;
    };

    Filter.prototype._maxCategoriesZone = function(zone) {
        var self = this;
        if (zone == 0)
            return self.restrictionDim1;
        else if (zone == 1)
            return self.restrictionDim2;
        else
            return 99999;
    };
    
    Filter.prototype._isARestrictedZone = function(zone) {
        var self = this;
        
        if (isNaN(zone))
            return false;
        else {
            if (self.restrictionDim1 && zone == 0)
                return true;
            else if (self.restrictionDim2 && zone == 1)
                return true;
            else
                return false;
        }
    };
    
    Filter.prototype._applyClickCategory = function(categoryDiv, dim, zone, pos, siblings) {
        var self = this;
        var toret = true;
        if ($(categoryDiv).hasClass("div-category-clicked")) {
            $(categoryDiv).removeClass("div-category-clicked");
            $(categoryDiv).addClass("div-category");
            self._options.categoriesPerDim[dim].state[pos] = 1;
        }
        // Always must be at least one element marked
        else {
            $(categoryDiv).removeClass("div-category");
            $(categoryDiv).addClass("div-category-clicked");
            self._options.categoriesPerDim[dim].state[pos] = 0;
            /* Removing the element from the stack ***********************************/
            dim++;
            pos++;
            var temp = 'div-category'+dim+'-'+pos;
            dim--;
            pos--;
            
            var flag = 0;
            for (var i=0; i<siblings.length; i++)
                if ($(siblings[i]).hasClass("div-category"))
                    flag = 1;
            if (!flag) {
                $(categoryDiv).removeClass("div-category-clicked");
                $(categoryDiv).addClass("div-category");
                self._options.categoriesPerDim[dim].state[pos] = 1;
                toret = false;
            }
            else {
                if (zone == 1) {
                    self.restriction1Stack.splice(self.restriction1Stack.indexOf(temp), 1);
                }
                else if (zone == 2) {
                    self.restriction2Stack.splice(self.restriction2Stack.indexOf(temp), 1);
                }
            }
        }
        
        return toret;
    };
    
    
    Filter.prototype._disableFirstActiveAndEnableCurrent = function(siblingId, categoryDiv, dim, pos) {
        var self = this;
        var $activeSibling = $('#'+siblingId);
        var splitted = siblingId.split('-');
        var siblingPos = splitted[2] - 1;
        // Disabling the first one
        $activeSibling.removeClass('div-category');
        $activeSibling.addClass('div-category-clicked');
        self._options.categoriesPerDim[dim].state[siblingPos] = 0;
        // Enabling the new one
        $(categoryDiv).removeClass("div-category-clicked");
        $(categoryDiv).addClass("div-category");
        self._options.categoriesPerDim[dim].state[pos] = 1;
    };
    
    
    Filter.prototype._changeMarkedCategoryForFixedDimension = function(category, siblings, dim, pos){
        var self = this;
        for (var i=0; i<siblings.length; i++) {
            if ($(siblings[i]).hasClass("div-category")) {
                $(siblings[i]).removeClass("div-category");
                $(siblings[i]).addClass("div-category-clicked");
                self._options.categoriesPerDim[dim].state[i] = 0;
            }
        }
        $(category).removeClass("div-category-clicked");
        $(category).addClass("div-category");
        self._options.categoriesPerDim[dim].state[pos] = 1;
    };
    
    
    Filter.prototype._restrictedZoneClickControl = function(category, zone, dim, dimId, pos, siblings){
        var self = this;
        /* Zone */
        switch(zone) {
            case 1:
                restrictionStack = self.restriction1Stack;
                currentRestriction = self.restrictionDim1;
            break;
            case 2:
                restrictionStack = self.restriction2Stack;
                currentRestriction = self.restrictionDim2;
            break;
        }
        /* Disabling a category to enable another one */
        if ((restrictionStack.length == currentRestriction) && ($(category).hasClass("div-category-clicked"))) {
            self._disableFirstActiveAndEnableCurrent(restrictionStack.shift(), category, dim, pos);
            restrictionStack.push(category.id);
        }
        /* Restriction not reached yet */
        else {
            var enable = $(category).hasClass("div-category-clicked"); 
            var applied = self._applyClickCategory(category, dim, zone, pos, siblings);
            if (enable)
                restrictionStack.push(category.id);
            
            /* Enabling / disabling the selectall check*/
            var $dim = $('#'+dimId);
            var $selectCategories = $('.select-categories', $dim);
            if (enable && ((restrictionStack.length == currentRestriction) || (restrictionStack.length == siblings.length))) {
                if ($selectCategories.hasClass("unselectall")) {
                    $selectCategories.removeClass("unselectall");
                    $selectCategories.addClass("selectall");
                }
            }
            else {
                if ($selectCategories.hasClass("selectall")) {
                    $selectCategories.removeClass("selectall");
                    $selectCategories.addClass("unselectall");
                }
            }
            
        }
    };
    
    
    Filter.prototype._performCorrespondingAction = function(category, zone, zoneId, dim, dimId, pos, siblings) {
        var self = this;
        /* Checking if the dimension should be Fixed */
        if (self._mustBeAFixedDimension(zoneId)) {
            if ($(category).hasClass("div-category-clicked")) {
                self._changeMarkedCategoryForFixedDimension(category, siblings, dim, pos);
            }
        }
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        /* Restrictions enabled: Dim 1 */
        else if (self.restrictionDim1 && zone === 1) {
            self._restrictedZoneClickControl(category, zone, dim, dimId, pos, siblings);
        }
        /* Restrictions enabled: Dim 2 */
        else if (self.restrictionDim2 && zone === 2) {
            self._restrictedZoneClickControl(category, zone, dim, dimId, pos, siblings);
        }
        /* We can enable all the categories we want */
        else {
            self._applyClickCategory(category, dim, zone, pos, siblings);
            var $dim = $('#'+dimId);
            if ($('.div-category-clicked', $dim).length === 0) {
                $('.select-categories', $dim).addClass("selectall");
                $('.select-categories', $dim).removeClass("unselectall");
            }
            else {
                $('.select-categories', $dim).addClass("unselectall");
                $('.select-categories', $dim).removeClass("selectall");
            }
        }
    };
    
    
    Filter.prototype._performClickSelectCategories = function(selectCategoriesDiv) {
        var self = this;
        
        if ($(selectCategoriesDiv).hasClass("selectall")) {
            $(selectCategoriesDiv).removeClass("selectall");
            $(selectCategoriesDiv).addClass("unselectall");
            // Unselecting all
            var categories = $(selectCategoriesDiv).siblings('.div-categories-advanced-container, .div-categories-advanced-container-big').get(0);
            //var categories = selectCategoriesDiv.nextSibling;
            var toChange = $(".div-category", categories);
            //toChange.removeClass("div-category");
            //toChange.addClass("div-category-clicked");
            toChange.each(function(idx, elem){
                $elem = $(elem);
                $elem.trigger('click');
            });
            /* In category case we only want to have the first element enabled */
            var first = $(toChange.get(0));
            var last = $(toChange.get(toChange.length - 1));
            //first.trigger('click');
            $(".div-category-clicked:first-child", categories).trigger('click');
            last.trigger('click');
        }
        else {
            $(selectCategoriesDiv).removeClass("unselectall");
            $(selectCategoriesDiv).addClass("selectall");
            // Selecting all
            var categories = $(selectCategoriesDiv).siblings('.div-categories-advanced-container, .div-categories-advanced-container-big').get(0);
            //var categories = selectCategoriesDiv.nextSibling;
            //toChange.removeClass("div-category-clicked");
            //toChange.addClass("div-category");
            //var zoneId = selectCategoriesDiv.parentNode.parentNode.id;
            zoneId = $(selectCategoriesDiv).parents('.'+self._CSS_DIMENIONS_LONG_CLASS).attr("id");
            var zone = zoneId.substring(zoneId.length -1) - 1; 
            if (self._isARestrictedZone(zone)) {

                var maxNumber = self._maxCategoriesZone(zone);
                var toChange = $(".div-category-clicked, .div-category", categories);
//                var toChange = $(categories).children();
//                if (toChange.length == 1)
//                    toChange = $('.jspPane').children();
                
                for (var i=0; i<maxNumber; i++)
                    if ($(toChange.get(i)).hasClass("div-category-clicked"))
                        $(toChange.get(i)).trigger('click');
            }
            else {
                var toChange = $(".div-category-clicked", categories);
                toChange.each(function(idx, elem){
                    $elem = $(elem);
                    $elem.trigger('click');
                });
            }
        }
    };
    
    
    /*------------------------------------------------------------------------
     * EVENT LISTENERS
     ---------------------------------------------------------------------- */
    Filter.prototype._handleDragDimensions = function(e) {
        $(this).addClass("shaded");
             
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('Text', this.id);
            
        return true;
    };
    
    
    
    // Handler
    Filter.prototype._handleDropDimensions = function(e) {
        var self = e.data.self;
        var eleid = e.originalEvent.dataTransfer.getData("Text");
        //var dimension = self._options.container.filter.querySelector('#'+self._options.container.filter.id+' #'+eleid); /*****************************************************************/
        var dimension = $('#'+eleid).get(0);
        //var oldParent = dimension.parentNode;
        var oldParent = $(dimension).parents('.'+self._CSS_DIMENIONS_LONG_CLASS).get(0);
        var newParent = null;
        var targetDimension = undefined;
        
        // Checking if the dimension that is moving must have its categories closed
        var categoriesBig = $('.div-categories-big', dimension);
        if (categoriesBig.length > 0)
            self._closeCategoriesBigDiv($('.triangle-top').get(0));
        
        /* Moving */
        var movementOptions = self._detectMovementAndElementsToMove(e.target);
        var swapFlag = movementOptions.swapFlag;
        var newParent = movementOptions.newParent;
        var targetDimension = movementOptions.targetDimension;
        
        /* Append */
        if (!swapFlag) {
            if (newParent != oldParent) {
                var inserted = self._appendDimension(newParent, dimension);
                if (!inserted) {
                    // Restoring the parent
                    newParent = oldParent;
                }
                else {
                    self._applyFixedDimensionRestrictions(newParent, dimension);
                }
            }
        }
        /* Swap */
        if (swapFlag) {
            var swapped = self._swapDimensions(newParent, dimension, oldParent, targetDimension);
            if (swapped) {
                self._applyFixedDimensionRestrictions(newParent, dimension);
                self._applyFixedDimensionRestrictions(oldParent, targetDimension);
            }
        }
        e.preventDefault();
        
        /* Removing the highlights */
        self._removeHighlights(this);
        
        return true;
    };
    
    
    // Handler
    Filter.prototype._handleDragEndDimensions = function(e) {
        var self = e.data.self;
        //var dimensions = self._options.container.filter.querySelectorAll('#'+self._options.container.filter.id+' .'+self._CSS_DIMENIONS_SHORT_CLASS);
        var dimensions = $('.'+self._CSS_DIMENIONS_SHORT_CLASS).get();

        $.each(dimensions, function(idx, elem){
            $(elem).removeClass("shaded");
            self._removeHighlights(elem);
        });

    };
    
    
    // Handler
    Filter.prototype._handleDragOverDimensions = function(e) {
        var self = e.data.self;
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        
        if ($(this).hasClass(self._CSS_DIMENIONS_SHORT_CLASS))
            $(this).addClass("highlight-short");
        else
            $(this).addClass("highlight-long");
        
        e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    
        return false;
    };
    
    
    // Handler
    Filter.prototype._handleDragEnterDimensions = function(e) {
        var self = e.data.self;
    
        return true;
    };
    
    
    // Handler
    Filter.prototype._handleDragLeaveDimensions = function(e) {
        var self = e.data.self;
        
        self._removeHighlights(this);
        
        return true;
    };
    
    
    // Handler
    Filter.prototype._handleClickCategoriesTriangles = function(e) {
        var self = e.data.self;
        // We have to hide the other dimensions
        //var categoriesDiv = self._options.container.filter.querySelector('#'+self._options.container.filter.id+' #'+this.parentNode.id+'>.div-categories');
        var $dimension = $(this).parents('.'+self._CSS_DIMENIONS_SHORT_CLASS);
        var categoriesDiv = $('.div-categories', $dimension).get(0);
        /* If categories DIV is small bucause when big it has another class */
        if (categoriesDiv) {
            // If there is any dimension with the big categories box opened -> close
            var openedCategories = $('.div-categories-big');
            //openedCategories.removeClass('div-categories-big');
            //openedCategories.addClass('div-categories');
            for (var i=0; i<openedCategories.length; i++)
                self._closeCategoriesBigDiv($('.triangle-top').get(0));
            // Opening the current category
            self._openCategoriesBigDiv(categoriesDiv, this);
        }
        /*** IF CATEGORIES_BIG ***/
        // We have to make visible the other dimensions and reduce the big one
        else {
            self._closeCategoriesBigDiv(this);
        }
    };
    
    
    // Handler
    Filter.prototype._handleClickCategoriesButton = function(e) {
        var self = e.data.self;
        
        //self._closeCategoriesBigDiv(e);
        var $dim = $(this).parents('.'+self._CSS_DIMENIONS_SHORT_CLASS);
        var $triangle = $('.triangle-top', $dim);
        
        $triangle.trigger('click');
    };
    
    // Handler
    Filter.prototype._handleClickCategory = function(e) {
        var self = e.data.self;

        var $dim = $(this).parents('.'+self._CSS_DIMENIONS_SHORT_CLASS);
        siblings = $('.div-category, .div-category-clicked', $dim).get();
        /* Locating the dimension */
        dimId = $dim.attr("id");
        dim = dimId.substring(dimId.length -1) - 1;
        /* Locating the zone */
        var $zoneDiv = $(this).parents('.'+self._CSS_DIMENIONS_LONG_CLASS);
        var zoneId = $zoneDiv.attr("id");
        var zone = parseInt(zoneId.substring(zoneId.length -1));
        
        /* Locating the category */
        var pos = 0;
        for (var i=0; i<siblings.length; i++)
            if (this.id == siblings[i].id)
                pos = i;
        /* Performing corresponding action*/
        self._performCorrespondingAction(this, zone, zoneId, dim, dimId, pos, siblings);        
        
        return true;
    };
    
    
    // Handler
    Filter.prototype._handleClickSelectCategories = function(e) {
        var self = e.data.self;
        
        self._performClickSelectCategories(this);
    };


    // Handler
    Filter.prototype._handleClickCategoriesSearch = function(e) {
        var self = e.data.self;
    };
    

    // Handler
    Filter.prototype._handleKeyPressCategoriesSearch = function(e) {
        var self = e.data.self;
        
        var $dim = $(this).parents('.'+self._CSS_DIMENIONS_SHORT_CLASS);
        var text = $(this).val();
        //TODO lowercase, uppercase, capitalize
        //e.keyCode
        if (text) {
            $('.div-category, .div-category-clicked', $dim).css("display", "none");
            $('[title*="'+text+'"]', $dim).css("display", "inline");
        }
        else {
            $('.div-category, .div-category-clicked', $dim).css("display", "inline");
        }
    };
    
    return Filter;
    
})(jQuery);
