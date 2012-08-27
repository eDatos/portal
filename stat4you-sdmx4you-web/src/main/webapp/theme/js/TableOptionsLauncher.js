function TableOptionsLauncher() {
	createTableOptionsDiv();
	if (jQuery.browser.webkit)
        jQuery('.div-dimension-long').css("height", "30px");
	addDragDropListeners();
    
    // Scrolling to get to the bottom of the "chart-options" div
    var offsetScrollTop = jQuery("#table-options").offset().top;
    var containerHeight = jQuery("#table-options").height();
    var windowHeight = jQuery(window).height();
    
    jQuery('html,body').animate({
        scrollTop: offsetScrollTop + containerHeight - windowHeight + 10
    }, 2000);
}






function closeOptions(idParentElem, id_box) {
    var el = document.getElementById(idParentElem);
    var box = document.getElementById(id_box);
    // Removing the optins DIV
    el.removeChild(box);
    // Enabling the options again 
    optionsChart1 = 0;
}


function saveOptions(idParentElem, id_box) {
    var el = document.getElementById(idParentElem);
    var box = document.getElementById(id_box);
    // Removing the optins DIV
    el.removeChild(box);
    // Enabling the options again 
    optionsChart1 = 0;
    
    // Applying the changes
    
//  var data = {"data": [100, 96, 30, 41, 203, 186],
//	  "dimension": {"id": ["CIU", "SEX"],
//	      "size": [3, 2],
//	      "CIU": {"categories": {"LL": 0, "CA": 1, "SC": 2}},
//	      "SEX": {"categories": {"MA": 0, "FE": 1}}
//	  }
//	 }
    
    // We must request the data to the service, it will return:
    
    // This example only removoes "Candelaria"
    //data = '{"data": [100, 96, 203, 186], "dimension": {"id": ["CIU", "SEX"], "size": [2, 2], "CIU": {"categories": {"LL": 0, "SC": 1}}, "SEX": {"categories": {"MA": 0, "FE": 1}} } }';
    // This example removes "Candelaria" and swaps the dimensions
    data = '{"data": [100, 203, 96, 186], "dimension": {"id": ["SEX", "CIU"], "size": [2, 2], "CIU": {"categories": {"LL": 0, "SC": 1}}, "SEX": {"categories": {"MA": 0, "FE": 1}} } }';
    
    data = eval('(' + data + ')');
    
    // Changing the categories
    optionsC6.xAxis.categories = ["Masculino", "Femenino"];
    optionsC7.xAxis.categories = ["Masculino", "Femenino"];
    optionsC9.xAxis.categories = ["Masculino", "Femenino"];
    
    transformingToHighCharts();
    transformingToHighChartsPie();
}


function createTableOptionsDiv() {
    //DIV
    var div_options = document.createElement('div');
    div_options.setAttribute('id','table-options');
    var tableDiv = document.getElementById("dataset-content-right");
    tableDiv.appendChild(div_options);

    // P
    var text_options = document.createElement('span');
    text_options.setAttribute('id','title-options');
    text = document.createTextNode("Opciones del gráfico");
    text_options.appendChild(text);
    div_options.appendChild(text_options);
    

    // Span
    var close_options = document.createElement('span');
    close_options.setAttribute('id','close');
    text = document.createTextNode("X");
    close_options.appendChild(text);
    close_options.setAttribute('onclick','closeOptions(\"'+tableDiv.id+'\", \"'+
                                                            div_options.id+'\")');
    div_options.appendChild(close_options);
    
    
    // Div options container
    var div_options_container = document.createElement('div');
    div_options_container.setAttribute('id','table-options-container');
  
    div_options.appendChild(div_options_container);
    

    // BUTTON
    var button_options = document.createElement('button');
    button_options.setAttribute('id','button-options');
    button_options.setAttribute('onclick','saveOptions(\"'+tableDiv.id+'\", \"'+
                                                            div_options.id+'\")');
                                                            
    text = document.createTextNode("Aplicar cambios");
    button_options.appendChild(text);
    div_options.appendChild(button_options);

    div_options.appendChild(button_options);

    // Actions
    optionsChart1 = 1;
    
    
    // Here we must load all the dimensions and their categories in DIVs
    
   
    // -- FIRST ELEMENT
    
    var divDimensionLong = document.createElement('div');
    divDimensionLong.setAttribute('id','div-dimension-long1');
    divDimensionLong.setAttribute('class','div-dimension-long');
    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Eje horizontal");
    span.appendChild(text);
    divDimensionLong.appendChild(span);
    
    div_options_container.appendChild(divDimensionLong);
    
    var divDimensionShort = document.createElement('div');
    divDimensionShort.setAttribute('id','div-dimension-short1');
    divDimensionShort.setAttribute('class','div-dimension-short');
    divDimensionShort.setAttribute('draggable','true');

    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Municipios");
    span.appendChild(text);
    divDimensionShort.appendChild(span);
    
    
    divDimensionLong.appendChild(divDimensionShort);
    
    // Triangle
    var divTriangle = document.createElement('div');
    divTriangle.setAttribute('id','triangle-right1');
    divTriangle.setAttribute('class','triangle-right');

    divDimensionShort.appendChild(divTriangle);
    
    
    // Categories

    var divCategories = document.createElement('div');
    divCategories.setAttribute('id','div-categories1');
    divCategories.setAttribute('class','div-categories');
    divDimensionShort.appendChild(divCategories);
    
    // GENERIC
    var categories = ['La Laguna', 'Candelaria', 'Santa Cruz', 'Güímar', 'Arafo', 'Los Cristianos'];
    
    for (var i=0; i<categories.length; i++) {
        
        var divCategory = document.createElement('div');
        divCategory.setAttribute('id','div-category1-'+i);
        divCategory.setAttribute('class','div-category');
        divCategory.setAttribute('draggable','true');
        
        
        var span = document.createElement('span');
        span.setAttribute('class','options_category');
        text = document.createTextNode(categories[i]);
        span.appendChild(text);
        divCategory.appendChild(span);
        
        
        divCategories.appendChild(divCategory);
    }
    
    
    
    // --- SECOND ELEMENT ---
    
    var divDimensionLong = document.createElement('div');
    divDimensionLong.setAttribute('id','div-dimension-long2');
    divDimensionLong.setAttribute('class','div-dimension-long');
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Columnas");
    span.appendChild(text);
    divDimensionLong.appendChild(span);
    
    
    div_options_container.appendChild(divDimensionLong);
    
    var divDimensionShort = document.createElement('div');
    divDimensionShort.setAttribute('id','div-dimension-short2');
    divDimensionShort.setAttribute('class','div-dimension-short');
    divDimensionShort.setAttribute('draggable','true');
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Sexos");
    span.appendChild(text);
    divDimensionShort.appendChild(span);
    
    
    divDimensionLong.appendChild(divDimensionShort);
    
    // Triangle
    var divTriangle = document.createElement('div');
    divTriangle.setAttribute('id','triangle-right2');
    divTriangle.setAttribute('class','triangle-right');

    divDimensionShort.appendChild(divTriangle);
    
    
    // Categories    
    var divCategories = document.createElement('div');
    divCategories.setAttribute('id','div-categories2');
    divCategories.setAttribute('class','div-categories');
    divDimensionShort.appendChild(divCategories);
    
    
    
    var divCategory = document.createElement('div');
    divCategory.setAttribute('id','div-category2-1');
    divCategory.setAttribute('class','div-category');
    divCategory.setAttribute('draggable','true');
    
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options_category');
    text = document.createTextNode("Masculino");
    span.appendChild(text);
    divCategory.appendChild(span);
    
    divCategories.appendChild(divCategory);
    
    
    var divCategory = document.createElement('div');
    divCategory.setAttribute('id','div-category2-2');
    divCategory.setAttribute('class','div-category');
    divCategory.setAttribute('draggable','true');
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options_category');
    text = document.createTextNode("Femenino");
    span.appendChild(text);
    divCategory.appendChild(span);

    divCategories.appendChild(divCategory);
    
    
    
    // --- THIRD ELEMENT ---
    
    var divDimensionLong = document.createElement('div');
    divDimensionLong.setAttribute('id','div-dimension-long3');
    divDimensionLong.setAttribute('class','div-dimension-long');
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Dimensión fijada 1");
    span.appendChild(text);
    divDimensionLong.appendChild(span);
    
    
    div_options_container.appendChild(divDimensionLong);
    
    var divDimensionShort = document.createElement('div');
    divDimensionShort.setAttribute('id','div-dimension-short3');
    divDimensionShort.setAttribute('class','div-dimension-short');
    divDimensionShort.setAttribute('draggable','true');
    
    
    var span = document.createElement('span');
    span.setAttribute('class','options');
    text = document.createTextNode("Edad");
    span.appendChild(text);
    divDimensionShort.appendChild(span);
    
    
    divDimensionLong.appendChild(divDimensionShort);
    
    
    // Triangle
    var divTriangle = document.createElement('div');
    divTriangle.setAttribute('id','triangle-right3');
    divTriangle.setAttribute('class','triangle-right');

    divDimensionShort.appendChild(divTriangle);
    
    
    // Categories 
    var divCategories = document.createElement('div');
    divCategories.setAttribute('id','div-categories3');
    divCategories.setAttribute('class','div-categories');
    divDimensionShort.appendChild(divCategories);
    
    
    
    // GENERIC
    var numCategories = 110;
    
    for (var i=0; i<numCategories; i++) {
        
        var divCategory = document.createElement('div');
        divCategory.setAttribute('id','div-category3-'+i);
        divCategory.setAttribute('class','div-category-clicked');
        divCategory.setAttribute('draggable','true');
        
        var span = document.createElement('span');
        span.setAttribute('class','options_category');
        text = document.createTextNode(i);
        span.appendChild(text);
        divCategory.appendChild(span);
        
        divCategories.appendChild(divCategory);
    }
    
    // Is the right arrow necessary?
    CheckArrowsNecessary();
    
}


/* Checking the arrows */
function CheckArrowsNecessary() {
	var dimensions = document.querySelectorAll('.div-categories');
	for (var i=0; i<dimensions.length; i++) {
		var categories = document.querySelectorAll('#'+dimensions[i].id+'>.div-category, #'+dimensions[i].id+'>.div-category-clicked');
		var dimensionSize = jQuery('#'+dimensions[i].id).width();
		var sumCategoriesSize = 0;
		for (var j=0; j<categories.length; j++)
			sumCategoriesSize += jQuery('#'+categories[j].id).outerWidth(true);
		/* For this particular dimension */
		if (dimensionSize > sumCategoriesSize) {
			var arrow = document.querySelector('#'+dimensions[i].parentNode.id+'>.triangle-right');
			jQuery('#'+arrow.id).css("visibility", "hidden");	
		}
	}
	
}

/* *** DRAG & DROP *** */

function handleDragDimensions(e) {
    this.style.opacity = '0.4';  /* this / e.target is the source node. */
         
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('Text', this.id);
        
    return true;
}


function handleDropDimensions(e) {
    var eleid = e.dataTransfer.getData("Text");
    var dimension = document.getElementById(eleid);
    var oldParent = dimension.parentNode;
    var newParent;
    
    /* Moving*/
    if (e.target.className == "options_category")
    	newParent = e.target.parentNode.parentNode.parentNode.parentNode;
    else if ((e.target.className == "div-category") || (e.target.className == "div-category-clicked"))
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
	var movingDimShort = document.querySelector('#'+newParent.id+'>.div-dimension-short');
	oldParent.appendChild(movingDimShort);
    
    e.preventDefault();
    
    
	/* Controlling that we must set only one category for more than 2 dimensions */
	if (newParent.id != "div-dimension-long1" && newParent.id != "div-dimension-long2") {
		// All the categories are unckecked
		var categoriesDiv = document.querySelector('#'+newParent.id+'>div>.div-categories');
		var categories = categoriesDiv.children;
		for (var i=0; i<categories.length; i++)
			if ((categories[i].className == "div-category") || (categories[i].className == "div-category-clicked"))
				if (i == 0)
					categories[i].className = "div-category";
				else
					categories[i].className = "div-category-clicked";
	}
	
	/* Controlling that we must set only one category for more than 2 dimensions */
	if (oldParent.id != "div-dimension-long1" && oldParent.id != "div-dimension-long2") {
		// All the categories are unckecked
		var categoriesDiv = document.querySelector('#'+oldParent.id+'>div>.div-categories');
		var categories = categoriesDiv.children;
		for (var i=0; i<categories.length; i++)
			if ((categories[i].className == "div-category") || (categories[i].className == "div-category-clicked"))
				if (i == 0)
					categories[i].className = "div-category";
				else
					categories[i].className = "div-category-clicked";
	}
    
    return true;
}


function handleDragEndDimensions(e) {
	var dimensions = document.querySelectorAll('.div-dimension-short');
    
    [].forEach.call(dimensions, function(elem) {
        elem.style.opacity = "1";
    });
}


function handleDragOverDimensions(e) {
    if (e.preventDefault) {
    	e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
}

function handleDragEnterDimensions(e) {
	// this / e.target is the current hover target.

	return true;
}

function handleDragLeaveDimensions(e) {
	// this / e.target is previous target element.
    
    return true;
}



function handleClickCategoriesTriangles(e) {
	// We have to hide the other dimensions
	var categoriesDiv = document.querySelector('#'+this.parentNode.id+'>.div-categories');
	/* If not categories DIV is small*/
	if (categoriesDiv) {
		var dimensionShortDiv = document.querySelectorAll('.div-dimension-short');
		for (var i=0; i<dimensionShortDiv.length; i++)
			if (dimensionShortDiv[i] != this.parentNode)
				dimensionShortDiv[i].parentNode.className = "div-dimension-long-hidden";

		// We have to increase the categories DIV's height
		var categoriesDiv = document.querySelector('#'+this.parentNode.id+'>.div-categories');
		categoriesDiv.className = 'div-categories-big';
		/* Enabling the scroll */
		scrollBar = jQuery('.div-categories-big').jScrollPane({
                                                      showArrows: false,
                                                  });
		this.className = 'triangle-top';
	}
	// We have to make visible the other dimensions and reduce the big one
	else {
		var dimensionShortDiv = document.querySelectorAll('.div-dimension-short');
		for (var i=0; i<dimensionShortDiv.length; i++)
			if (dimensionShortDiv[i] != this.parentNode)
				dimensionShortDiv[i].parentNode.className = "div-dimension-long";
		
		if (scrollBar) {
			var api = scrollBar.data('jsp');
			api.scrollToY(0);
		    api.destroy();
			scrollBar = null;
		}
		
		var categoriesDiv = document.querySelector('#'+this.parentNode.id+'>.div-categories-big');
		categoriesDiv.className = 'div-categories';			
		this.className = 'triangle-right';
	}
}


function handleClickCategory(e) {
	/* Taking into consideration 2 cases. The */
	if (this.parentNode.parentNode.parentNode.id == 'div-dimension-long1' ||
		this.parentNode.parentNode.parentNode.id == 'div-dimension-long2' ||
		this.parentNode.parentNode.parentNode.parentNode.parentNode.id == 'div-dimension-long1' ||
		this.parentNode.parentNode.parentNode.parentNode.parentNode.id == 'div-dimension-long2') {
		// We can enable all the categories that we want
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
	/* Controlling that we must set only one category for more than 2 dimensions */
	else {
		if (this.className == "div-category-clicked") {
			var hermanos = this.parentNode.children;
			for (var i=0; i<hermanos.length; i++)
				if (hermanos[i].className == "div-category")
					hermanos[i].className = "div-category-clicked";
			this.className = "div-category";
		}
	}
    
    return true;
}


function addDragDropListeners() {
    var dimensions = document.querySelectorAll('.div-dimension-short');
    var dimensionContainers = document.querySelectorAll('.div-dimension-long');
    
    // Dimensions (Drag&Drop)
    [].forEach.call(dimensions, function(elem) {
        elem.addEventListener('dragstart', handleDragDimensions, false);
        var categories = document.querySelectorAll('#'+elem.id+'>.div-categories>div');
        /* MS IE9 */
        elem.addEventListener('selectstart', function(){this.dragDrop(); return false;});
    });
    
    [].forEach.call(dimensionContainers, function(elem) {
    	elem.addEventListener('dragenter', handleDragEnterDimensions, false);
    	elem.addEventListener('dragover', handleDragOverDimensions, false);
    	elem.addEventListener('dragleave', handleDragLeaveDimensions, false);
    	elem.addEventListener('dragend', handleDragEndDimensions, false);
        
        elem.addEventListener('drop', handleDropDimensions, false);
    });
    
    // Categories (Click)
    var categories = document.querySelectorAll('.div-category, .div-category-clicked');
    [].forEach.call(categories, function(elem) {
    	elem.addEventListener('click', handleClickCategory, false);
    });
    
    // Categories Triangles (Click)
    var triangles = document.querySelectorAll('.div-dimension-short>.triangle-right');
    [].forEach.call(triangles, function(elem) {
    	elem.addEventListener('click', handleClickCategoriesTriangles, false);
    });
}
