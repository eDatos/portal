STAT4YOU.namespace("STAT4YOU.Filters.Filter");
STAT4YOU.namespace("STAT4YOU.Filters.CharFilter");
STAT4YOU.namespace("STAT4YOU.Filters.BarCharFilter");
STAT4YOU.namespace("STAT4YOU.Filters.PieCharFilter");

/*** PARENT ***/
/** Not instanciable **/
	
STAT4YOU.Filters.Filter = (function() {
	/*-----------------------------*/
	/* -- Filter abstract class -- */
	/*-----------------------------*/
	var Filter = function () {
	//	this._externalContainerId = undefined;
	//	this._externalContainer = undefined;
	//	this._filterContainerId = undefined;
	//	this._filtersContainer = undefined;
	//	this._dimensions = undefined;
	//	this._object = undefined;
		this._div_options_container = undefined;
		this._CSS_DIMENIONS_LONG_CLASS = '.div-dimension-long';	
	};
	
	
	//--------------------------------------------------------------
	//                   EVENT LISTENERS
	// --------------------------------------------------------------
	Filter.prototype._handleDragDimensions = function(e) {
		var self = e.data.self;
	    this.style.opacity = '0.4';  /* this / e.target is the source node. */
	         
	    e.originalEvent.dataTransfer.effectAllowed = 'move';
	    e.originalEvent.dataTransfer.setData('Text', this.id);
	        
	    return true;
	};
	
	// Handler
	Filter.prototype._handleDropDimensions = function(e) {
		var self = e.data.self;
	    var eleid = e.originalEvent.dataTransfer.getData("Text");
	    var dimension = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+eleid); /*****************************************************************/
	    var oldParent = dimension.parentNode;
	    var newParent;
	    
	    /* Moving*/
	    if (e.target.className == "options_category")
	        newParent = e.target.parentNode.parentNode.parentNode.parentNode;
	    else if ((e.target.className == "div-category") || (e.target.className == "div-category-clicked") || (e.target.className == "dimension-label"))
	        newParent = e.target.parentNode.parentNode.parentNode;
	    else if (e.target.className == "div-categories")
	        newParent = e.target.parentNode.parentNode;
	    else if (e.target.className == "div-dimension-short")
	        newParent = e.target.parentNode;
	    else if (e.target.className == "div-dimension-long")
	        newParent = e.target;
	    // Moving the selected one
	    newParent.appendChild(dimension);
	    // Swapping the other one
	    var movingDimShort = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+newParent.id+'>.div-dimension-short');
	    oldParent.appendChild(movingDimShort);
	    
	    e.preventDefault();
	    
	    /* Controlling that we must set only one category for more than 2 dimensions */
	    if (self._mustBeAFixedDimension(newParent.id)) {
	        // All the categories are unckecked
	        var categoriesDiv = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+newParent.id+'>div>.div-categories');
	        var categories = categoriesDiv.children;
	        for (var i=0; i<categories.length; i++)
	            if ((categories[i].className == "div-category") || (categories[i].className == "div-category-clicked"))
	                if (i == 0)
	                    categories[i].className = "div-category";
	                else
	                    categories[i].className = "div-category-clicked";
	    }
	    
	    /* Controlling that we must set only one category for more than 2 dimensions */
	    if (self._mustBeAFixedDimension(oldParent.id)) {
	        // All the categories are unckecked
	        var categoriesDiv = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+oldParent.id+'>div>.div-categories');
	        var categories = categoriesDiv.children;
	        for (var i=0; i<categories.length; i++)
	            if ((categories[i].className == "div-category") || (categories[i].className == "div-category-clicked"))
	                if (i == 0)
	                    categories[i].className = "div-category";
	                else
	                    categories[i].className = "div-category-clicked";
	    }
	    
	    return true;
	};
	
	
	// Handler
	Filter.prototype._handleDragEndDimensions = function(e) {
		var self = e.data.self;
	    var dimensions = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-short');
	    
	    [].forEach.call(dimensions, function(elem) {
	        elem.style.opacity = "1";
	    });
	};
	
	
	// Handler
	Filter.prototype._handleDragOverDimensions = function(e) {
		var self = e.data.self;
	    if (e.preventDefault) {
	        e.preventDefault(); // Necessary. Allows us to drop.
	    }
	
	    e.originalEvent.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	
	    return false;
	};
	
	
	// Handler
	Filter.prototype._handleDragEnterDimensions = function(e) {
		var self = e.data.self;
	    // this / e.target is the current hover target.
	
	    return true;
	};
	
	
	// Handler
	Filter.prototype._handleDragLeaveDimensions = function(e) {
		var self = e.data.self;
	    // this / e.target is previous target element.
	    
	    return true;
	};
	
	
	// Handler
	Filter.prototype._handleClickCategoriesTriangles = function(e) {
		var self = e.data.self;
	    // We have to hide the other dimensions
	    var categoriesDiv = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+this.parentNode.id+'>.div-categories');
	    /* If categories DIV is small bucause when big it has another class */
	    if (categoriesDiv) {
	        var dimensionShortDiv = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-short');
	//        for (var i=0; i<dimensionShortDiv.length; i++)
	//            if (dimensionShortDiv[i] != this.parentNode)
	//                dimensionShortDiv[i].parentNode.className = "div-dimension-long-hidden";
	
	        // We have to increase the categories DIV's height
	        var categoriesDiv = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+this.parentNode.id+'>.div-categories');
	        categoriesDiv.className = 'div-categories-big';
	        /* Enabling the scroll */
	        scrollBar = jQuery('.div-categories-big').jScrollPane({
	                                                      showArrows: false,
	                                                  });
	        this.className = 'triangle-top';

	        
	        
	        /*-------------------------------------------------------------------*/
	        /* Chcecking if there is enough space to open the options DIV        */
	        /*-------------------------------------------------------------------*/
	        //var filtersContainerHeight = jQuery('#'+self._filterContainerId).css("height", "230px");
	        
	        var categoriesBigTop = jQuery('#'+categoriesDiv.id).offset().top;
	        //var filtersContainerTop = jQuery('#'+self._filterContainerId).offset().top;
	        var buttonTop = jQuery('#'+self._filterContainerId+'>button').offset().top;
	        var categoriesBigHeight = jQuery('#'+categoriesDiv.id).css("height");
	        var filtersContainerHeight = jQuery('#'+self._filterContainerId).css("height");
	        
	        categoriesBigHeight = parseInt(categoriesBigHeight.substring(0, categoriesBigHeight.length - 2));
	        filtersContainerHeight = parseInt(filtersContainerHeight.substring(0, filtersContainerHeight.length - 2));
	        
	        var categoriesBottom = categoriesBigTop + categoriesBigHeight; 
	        var filtersBottom = buttonTop;//filtersContainerTop + filtersContainerHeight;
	        var surplusSpace = filtersBottom - categoriesBottom;
	        
	        
	        var dimensionsLongDivs = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-long');
	        var i = 0;
	        /* I'm assuming that dimensionsLongDivs is ordered */
	        var reached = 0;
	        while ((surplusSpace < 0) && (i < dimensionsLongDivs.length - 1) && (!reached)) {
	        	/* I've reached the selected DIV: so I must stop */
	        	var me = self._filtersContainer.querySelector('#'+dimensionsLongDivs[i].id+' .div-categories-big');
	        	if (me)
	        		reached = 1;
	        	else {
	        		dimensionsLongDivs[i].className = "div-dimension-long-hidden";
	        		//jQuery('#'+dimensionsLongDivs[i].id).css("display", "none");
		        	surplusSpace += jQuery('#'+dimensionsLongDivs[i].id).outerHeight();
		        	i++;
	        	}
	        }
	        
	    }
	    // We have to make visible the other dimensions and reduce the big one
	    else {
	    	// Making visible again
	        var dimensionShortDiv = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-short');
	        for (var i=0; i<dimensionShortDiv.length; i++)
	            if (dimensionShortDiv[i] != this.parentNode)
	                dimensionShortDiv[i].parentNode.className = "div-dimension-long";
	        
	        if (scrollBar) {
	            var api = scrollBar.data('jsp');
	            api.scrollToY(0);
	            api.destroy();
	            scrollBar = null;
	        }
	        
	        var categoriesDiv = self._filtersContainer.querySelector('#'+self._filterContainerId+' #'+this.parentNode.id+'>.div-categories-big');
	        categoriesDiv.className = 'div-categories';            
	        this.className = 'triangle-right';
	    }
	};
	
	
	// Handler
	Filter.prototype._handleClickCategory = function(e) {
		var self = e.data.self;
	    /* Controlling that we must set only one category for more than 2 dimensions */
	    if (self._mustBeAFixedDimension(this.parentNode.parentNode.parentNode.id) &&
	    	self._mustBeAFixedDimension(this.parentNode.parentNode.parentNode.parentNode.parentNode.id)) {
	    	if (this.className == "div-category-clicked") {
	            var hermanos = this.parentNode.children;
	            for (var i=0; i<hermanos.length; i++)
	                if (hermanos[i].className == "div-category")
	                    hermanos[i].className = "div-category-clicked";
	            this.className = "div-category";
	        }
	    }
	    /* We can enable all the categories that we want */
	    else {
	    	if (this.className == "div-category-clicked")
	            this.className = "div-category";
	        // Always must be at least one element marked
	        else {
	            this.className = "div-category-clicked";
	            var flag = 0;
	            var hermanos = this.parentNode.children;
	            for (var i=0; i<hermanos.length; i++)
	                if (hermanos[i].className == "div-category")
	                    flag = 1;
	            if (!flag)
	                this.className = "div-category";
	        }
	    }
	    
	    return true;
	};
	
	
	/* Adding the listeners */
	Filter.prototype._addDragDropListeners = function() {
		var self = this;
	    var dimensions = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-short');
	    var dimensionContainers = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-long');
	    
	    // Dimensions (Drag&Drop)
	    [].forEach.call(dimensions, function(elem) {
	        //elem.addEventListener('dragstart', self._handleDragDimensions, false);
	    	//var categories = document.querySelectorAll('#'+elem.id+'>.div-categories>div');
	        /* MS IE9 */
	        //elem.addEventListener('selectstart', function(){this.dragDrop(); return false;});
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('dragstart', {self: self}, self._handleDragDimensions);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('selectstart', {self: self}, function(){this.dragDrop();});
	    });
	    
	    [].forEach.call(dimensionContainers, function(elem) {
	//        elem.addEventListener('dragenter', self._handleDragEnterDimensions, false);
	//        elem.addEventListener('dragover', self._handleDragOverDimensions, false);
	//        elem.addEventListener('dragleave', self._handleDragLeaveDimensions, false);
	//        elem.addEventListener('dragend', self._handleDragEndDimensions, false);	        
	//        elem.addEventListener('drop', self._handleDropDimensions, false);
	        
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('dragenter', {self: self}, self._handleDragEnterDimensions);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('dragover', {self: self}, self._handleDragOverDimensions);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('dragleave', {self: self}, self._handleDragLeaveDimensions);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('dragend', {self: self}, self._handleDragEndDimensions);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('drop', {self: self}, self._handleDropDimensions);
	    });
	    
	    // Categories (Click)
	    var categories = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-category, .div-category-clicked');
	    [].forEach.call(categories, function(elem) {
	        //elem.addEventListener('click', self._handleClickCategory, false);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('click', {self: self}, self._handleClickCategory);
	    });
	    
	    // Categories Triangles (Click)
	    var triangles = self._filtersContainer.querySelectorAll('#'+self._filterContainerId+' .div-dimension-short>.triangle-right');
	    [].forEach.call(triangles, function(elem) {
	        //elem.addEventListener('click', self._handleClickCategoriesTriangles, false);
	        jQuery('#'+self._filterContainerId+' #'+elem.id).bind('click', {self: self}, self._handleClickCategoriesTriangles);
	    });
	};
	
	
	
	
	/*------------------------------------------------------------------------
	 * REST OF METHODS
	 ---------------------------------------------------------------------- */
	/* LAUNCHES the filters BOX */
	Filter.prototype.launch = function() {
		// Creating the options div
		this._createOptionsDiv();
		
	    // Adapting webkit height visualization
	    if (jQuery.browser.webkit)
	        jQuery(this._CSS_DIMENIONS_LONG_CLASS).css("height", "30px");
	    
	    // Setting Listeners
	    this._addDragDropListeners();
	
	    // Scrolling to get to the bottom of the "chart-options" div
	    var offsetScrollTop = jQuery("#"+this._externalContainerId).offset().top;
	    var containerHeight = jQuery("#"+this._externalContainerId).height();
	    var windowHeight = jQuery(window).height();
	
	    jQuery('html,body').animate({
	        scrollTop: offsetScrollTop + containerHeight - windowHeight + 15
	    }, 2000);
	};
	
	
	/* Action when pressing the CLOSE BUTTON */
	Filter.prototype.close = function() {
	    // Removing the optins DIV
		this._externalContainer.removeChild(this._filtersContainer);
	};
	
	
	/* Action when pressing the SAVE BUTTON */
	Filter.prototype.saveOptions = function() {
	    // Removing the options DIV
		this._externalContainer.removeChild(this._filtersContainer);
	    // Applying the changes
	        // Here must go a request to the server via AJAX
	        
		/* EXTERNAL CALLS ................. */
	    // Removing the existing charts to avoid memory compsumtion
	    chart6.destroy();
	    chart7.destroy();
	    chart9.destroy();
	    
	    transformingToHighCharts();
	    transformingToHighChartsPie();
	};
	
	
	/* CREATING OPTIONS div */
	Filter.prototype._createOptionsDiv = function () {
	    // Creating FILTER CONTAINER div
	    this._filtersContainer = document.createElement('div');
	    this._filtersContainer.setAttribute('id', this._filterContainerId);
	    this._filtersContainer.className = "chart-options";
	    this._externalContainer.appendChild(this._filtersContainer);
	
	    // P
	    var text_options = document.createElement('span');
	    text_options.setAttribute('id','title-options');
	    text = document.createTextNode("Opciones del gráfico");
	    text_options.appendChild(text);
	    this._filtersContainer.appendChild(text_options);
	    
	
	    // Span
	    var close_options = document.createElement('span');
	    close_options.setAttribute('id','close');
	    close_options.setAttribute('onclick',this._object+'.close()');
	    this._filtersContainer.appendChild(close_options);
	    
	    
	    // Div options container
	    this._div_options_container = document.createElement('div');
	    this._div_options_container.className = "chart-options-container";
	    
	    this._filtersContainer.appendChild(this._div_options_container);
	    
	
	    // BUTTON
	    var button_options = document.createElement('button');
	    button_options.setAttribute('id','button-options');
	    button_options.setAttribute('onclick',this._object+'.saveOptions()');
	                                                            
	    text = document.createTextNode("Aplicar cambios");
	    button_options.appendChild(text);
	    this._filtersContainer.appendChild(button_options);
	
	    this._filtersContainer.appendChild(button_options);
	
	
	    
	    
	    // Here we must load all the dimensions and their categories in DIVs
	    
	   
	    // -- ELEMENTS ---------------------------------------
	    
	    /* We could have received more than one dataset so
	     * we have to take only the first one */
	    
		/* EXTERNAL CALLS ................. */
	    var datasetsIds = datasetManager.getDatasets();
	    var datasetId = datasetsIds[0];
	    var selectedLanguages = datasetManager.getSelectedLanguages();
	    var language = selectedLanguages[0];
	    this._dimensions = datasetManager.getDimensions(datasetId, language);
	    
	    
	    /* Specific code for a chart or the table */
	    this._drawOptions();    
	};
	
	
	/* Checking the arrows */
	Filter.prototype._checkArrowsNecessary = function() {
	    var dimensions = this._filtersContainer.querySelectorAll('#'+this._filterContainerId+' .div-categories');
	    for (var i=0; i<dimensions.length; i++) {
	        var categories = this._filtersContainer.querySelectorAll('#'+this._filterContainerId+' #'+dimensions[i].id+'>.div-category, #'+dimensions[i].id+'>.div-category-clicked');
	        var dimensionSize = jQuery('#'+dimensions[i].id).width();
	        var sumCategoriesSize = 0;
	        for (var j=0; j<categories.length; j++)
	            sumCategoriesSize += jQuery('#'+categories[j].id).outerWidth(true);
	        /* For this particular dimension */
	        if (dimensionSize > sumCategoriesSize) {
	            var arrow = this._filtersContainer.querySelector('#'+this._filterContainerId+' #'+dimensions[i].parentNode.id+'>.triangle-right');
	            jQuery('#'+arrow.id).css("visibility", "hidden");    
	        }
	    }
	};
	
	
	
	
	/*------------------------------------------------------------------------
	 * ABSTRACT METHODS
	 ---------------------------------------------------------------------- */
	
	Filter.prototype._mustBeAFixedDimension = function(id) {
		// Abstract Method in this Parent class
	};
	
	
	/* DRAWING options in a certain div */
	Filter.prototype._drawOptions = function () {
		
		/* THIS MUST BE AN EMPTY FUNCTION IN THIS ABSTRACT PARENT CLASS */
		
	};
	
	return Filter;
	
})();
	
	
		
		
		
		
		
		
		
		
		
		
		
		
		
/*** CHILDREN LEVEL 1 ***/

STAT4YOU.Filters.ChartFilter = (function() {
		
		
	/**********************************************************************************/
	/**                             ChartFilter                                      **/
	/** Not instanciable                                                             **/
	/**********************************************************************************/
	var ChartFilter = function(externalContainerId, filterContainerId, objectName) {
	//	this._externalContainerId = externalContainerId;
	//	this._externalContainer = document.getElementById(externalContainerId);
	//	this._filterContainerId = filterContainerId;
	//	this._filtersContainer = undefined;
	//	this._dimensions = undefined;
	//	this._object = objectName;
	};
	
	
	ChartFilter.prototype = new STAT4YOU.Filters.Filter();
	
	
	
	ChartFilter.prototype._drawOptions = function () {
		for (var i=1; i<=this._dimensions.id.length; i++) {
		    var divDimensionLong = document.createElement('div');
		    divDimensionLong.setAttribute('id','div-dimension-long'+i);
		    divDimensionLong.setAttribute('class','div-dimension-long');
		    
		    var span = document.createElement('span');
		    span.setAttribute('class','options');
		    
		    span.appendChild(this._getTextDimensionPosition(i));
		    divDimensionLong.appendChild(span);
		    
		    this._div_options_container.appendChild(divDimensionLong);
		    
		    var divDimensionShort = document.createElement('div');
		    divDimensionShort.setAttribute('id','div-dimension-short'+i);
		    divDimensionShort.setAttribute('class','div-dimension-short');
		    divDimensionShort.setAttribute('draggable','true');
	
		    
		    var dimensionText = document.createElement('div');
		    dimensionText.setAttribute('class','div-dimension-text');
		    
		    var span = document.createElement('span');
		    span.setAttribute('class','dimension-label');
		    text = document.createTextNode(this._dimensions.label[i-1]);
		    span.appendChild(text);
		    
		    dimensionText.appendChild(span);
	
		    divDimensionShort.appendChild(dimensionText);
		    
		    divDimensionLong.appendChild(divDimensionShort);
		    
		    // Triangle
		    var divTriangle = document.createElement('div');
		    divTriangle.setAttribute('id','triangle-right'+i);
		    divTriangle.setAttribute('class','triangle-right');
	
		    divDimensionShort.appendChild(divTriangle);
		    
		    // Categories
	
		    var divCategories = document.createElement('div');
		    divCategories.setAttribute('id','div-categories'+i);
		    divCategories.setAttribute('class','div-categories');
		    divDimensionShort.appendChild(divCategories);
		    
			/* EXTERNAL CALLS ................. */
		    var datasetsIds = datasetManager.getDatasets();
		    var datasetId = datasetsIds[0];
		    var selectedLanguages = datasetManager.getSelectedLanguages();
		    var language = selectedLanguages[0];
		    
		    var categories = datasetManager.getRepresentations(datasetId, dimension.id[i-1], language);
		    
		    for (var j=1; j<=categories.id.length; j++) {
		        var divCategory = document.createElement('div');
		        divCategory.setAttribute('id','div-category'+i+'-'+j);
		        /* The first 2 dimensions are variable */
		        if (this._isAVarDimOrFirstElement(i,j))
		        	divCategory.setAttribute('class','div-category');
		        else
		        	divCategory.setAttribute('class','div-category-clicked');
		        
		        divCategory.setAttribute('draggable','true');
		        
		        var span = document.createElement('span');
		        span.setAttribute('class','options_category');
		        text = document.createTextNode(categories.label[j-1]);
		        span.appendChild(text);
		        divCategory.appendChild(span);
		        
		        
		        divCategories.appendChild(divCategory);
		    }
		    
		}
	};
	
	return ChartFilter;
	
})();
	
		
		
		
		
		
		
		
		
		
		
		
		
	/*** CHILDREN  LEVEL 2 ***/
		
	
	STAT4YOU.Filters.BarChartFilter = (function() {
		
		/**********************************************************************************/
		/**                             BarChartFilter                                   **/
		/**********************************************************************************/
		var BarChartFilter = function(externalContainerId, filterContainerId, objectName) {
			this._externalContainerId = externalContainerId;
			this._externalContainer = document.getElementById(externalContainerId);
			this._filterContainerId = filterContainerId;
			this._filtersContainer = undefined;
			this._dimensions = undefined;
			this._object = objectName;
		};
		
		
		BarChartFilter.prototype = new STAT4YOU.Filters.ChartFilter();
		
		
		BarChartFilter.prototype._mustBeAFixedDimension = function(id) {
			return (id != "div-dimension-long1" && id != "div-dimension-long2");
		};
		
		
		BarChartFilter.prototype._getTextDimensionPosition = function(i) {
		    switch(i) {
		    case 1:
		        text = document.createTextNode("Eje horizontal");            
		    break;
		    case 2:
		        text = document.createTextNode("Columnas");            
		    break;
		    default:
		        text = document.createTextNode("Dimension fijada "+(i-2));            
		    break;
		    }
			
			return text;
		};
		
		
		BarChartFilter.prototype._isAVarDimOrFirstElement = function(i, j) {
			return i == 1 || i == 2 || j == 1;
		};
		
		
		return BarChartFilter;
		
	})();
		
		
		
		
	
	
	
	
	STAT4YOU.Filters.PieChartFilter = (function() {
	
		/**********************************************************************************/
		/**                             PieChartFilter                                   **/
		/**********************************************************************************/
		var PieChartFilter = function(externalContainerId, filterContainerId, objectName) {
			this._externalContainerId = externalContainerId;
			this._externalContainer = document.getElementById(externalContainerId);
			this._filterContainerId = filterContainerId;
			this._filtersContainer = undefined;
			this._dimensions = undefined;
			this._object = objectName;
		};
		
		
		PieChartFilter.prototype = new STAT4YOU.Filters.ChartFilter();
		
		
		PieChartFilter.prototype._mustBeAFixedDimension = function(id) {
			return (id != "div-dimension-long1");
		};
		
		
		PieChartFilter.prototype._getTextDimensionPosition = function(i) {
		    switch(i) {
		    case 1:
		        text = document.createTextNode("Eje horizontal");            
		    break;
		    default:
		        text = document.createTextNode("Dimension fijada "+(i-1));            
		    break;
		    }
			
			return text;
		};
		
		
		PieChartFilter.prototype._isAVarDimOrFirstElement = function(i, j) {
			return i == 1 || j == 1;
		};
		
		
		
		return PieChartFilter;
	
	})();
