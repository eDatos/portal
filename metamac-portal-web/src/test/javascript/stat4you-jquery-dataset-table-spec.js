describe("stat4you-jquery-dataset-table", function() {


/*    it("Initially the table cells are located in the right order using the grids", function() {
        // Adding the neccessary DIVs
        $("body").append('<div id="dataset-content-right" class="right form"><div id="visual-element"><div id="visual-element-container"></div><div id="visual-element-options"></div></div><div id="change-visual-element"></div></div>');
        
        *//* Options *//*
        var options = {};
        // Rest options
        options.rest = {};
        options.rest.providerId = null;
        options.rest.datasetId = null;
        options.rest.response = $.parseJSON(TestResponses.datasetPoblacion.success);
        options.datasetManager = new STAT4YOU.Dataset();
        // Containers
        options.container = {};
        options.container.external = document.getElementById("dataset-content-right");
        options.container.ve = document.getElementById("visual-element");
        options.container.vecontainer = document.getElementById("visual-element-container");
        options.container.options = document.getElementById("visual-element-options");
        options.container.change = document.getElementById("change-visual-element");
        options.container.filter = null;
        // Visual elements
        options.ve = {};
        options.ve.table = new STAT4YOU.VisualElement.Table();
        options.fullScreen = new STAT4YOU.FullScreen();
        
        veManager = new STAT4YOU.VisualElementManager(options);
        // Init has been called and so, the table has been created.
        
        *//** TEST 1: Comparing the value of the first cell of the first grid (0,0) with the expected one **//*
        var $grid = $(".grid");
        var $gridElement = $(".gridElement:first-child", $grid).first();
        var value = parseInt($gridElement.find('span').first().text());
        expect(value).toEqual(841669);

        *//** TEST 2: Comparing the value of the last cell of the last grid (2,2) with the expected one **//*
        var $grid = $(".grid");
        var $gridElement = $(".gridRow:nth-child(3) .gridElement:nth-child(3)", $grid); 
        var $datasetDataValue = $(".dataset-data-cell:nth-child(105) .dataset-data-value", $gridElement); // 21 * 5 = 105
        var value = parseInt($datasetDataValue.text());
        expect(value).toEqual(27);
        
        // Cleaning the DOM
        $("#dataset-content-right").empty();
        $("#dataset-content-right").remove();
    });
    
    
    
    it("Moving rigth down once, the table cells remain located in the right order after the first grid change", function() {
        // Adding the neccessary DIVs
        $("body").append('<div id="dataset-content-right" class="right form"><div id="visual-element"><div id="visual-element-container"></div><div id="visual-element-options"></div></div><div id="change-visual-element"></div></div>');
        
        *//* Options *//*
        var options = {};
        // Rest options
        options.rest = {};
        options.rest.providerId = null;
        options.rest.datasetId = null;
        options.rest.response = $.parseJSON(TestResponses.datasetPoblacion.success);
        options.datasetManager = new STAT4YOU.Dataset();
        // Containers
        options.container = {};
        options.container.external = document.getElementById("dataset-content-right");
        options.container.ve = document.getElementById("visual-element");
        options.container.vecontainer = document.getElementById("visual-element-container");
        options.container.options = document.getElementById("visual-element-options");
        options.container.change = document.getElementById("change-visual-element");
        options.container.filter = null;
        // Visual elements
        options.ve = {};
        options.ve.table = new STAT4YOU.VisualElement.Table();
        options.fullScreen = new STAT4YOU.FullScreen();
        
        veManager = new STAT4YOU.VisualElementManager(options);
        // Init has been called and so, the table has been created.
        
        
        var $grid = $(".grid");
        var $gridFirstElement = $(".gridElement:first-child", $grid).first();
        var $gridLastElement = $(".gridRow:nth-child(3) .gridElement:nth-child(3)", $grid);
        // Event
        var e = jQuery.Event("mousedown");
        e.pageX = $gridFirstElement.width() * 1.6;
        e.pageY = $gridFirstElement.height() * 1.6;
        jQuery(".dataset-data").trigger( e );
        
        e = jQuery.Event("mousemove");
        e.pageX = 0;
        e.pageY = 0;
        jQuery("body").trigger( e );
        
        jQuery(".dataset-data").trigger("mouseup");
        
        // What should have happened is that there was a movement: the first row is now the last one.
        // But there was no movement in the Y axis due to the short length of the dataset -> this must be the correct behavior
        
        
        *//** TEST 1: Checking the content of the first cell of the gridElement that was the first one, and now is the first of the last row  **//*
        var value = parseInt($gridFirstElement.find('span').first().text());
        expect(value).toEqual(6221);

        *//** TEST 2: Comparing the value of the last cell of the last grid (2,2) with the expected one **//*
        var $datasetDataValue = $(".dataset-data-cell:nth-child(105) .dataset-data-value", $gridLastElement); // 21 * 5 = 105
        var value = parseInt($datasetDataValue.text());
        expect(value).toEqual(27);
        
        // Cleaning the DOM
        $("#dataset-content-right").empty();
        $("#dataset-content-right").remove();
    });
    
    
    
    it("the grid must have only two columns and one row", function() {
        // Adding the neccessary DIVs
        $("body").append('<div id="dataset-content-right" class="right form"><div id="visual-element"><div id="visual-element-container"></div><div id="visual-element-options"></div></div><div id="change-visual-element"></div></div>');
        
        *//* Options *//*
        var options = {};
        // Rest options
        options.rest = {};
        options.rest.providerId = null;
        options.rest.datasetId = null;
        options.rest.response = $.parseJSON(TestResponses.datasetPoblacion.success);
        options.datasetManager = new STAT4YOU.Dataset();
        // Containers
        options.container = {};
        options.container.external = document.getElementById("dataset-content-right");
        options.container.ve = document.getElementById("visual-element");
        options.container.vecontainer = document.getElementById("visual-element-container");
        options.container.options = document.getElementById("visual-element-options");
        options.container.change = document.getElementById("change-visual-element");
        options.container.filter = null;
        // Visual elements
        options.ve = {};
        options.ve.table = new STAT4YOU.VisualElement.Table();
        options.fullScreen = new STAT4YOU.FullScreen();
        
        veManager = new STAT4YOU.VisualElementManager(options);
        
        // Obtaining the gridRows
        var $grid = $(".grid");
        var $gridRows = $(".gridRow", $grid);
        *//** TEST: there must be 3 rows **//*
        expect($gridRows.length).toEqual(3);
        for (var i=0; i<$gridRows.length; i++) {
            var row = $gridRows.get(i);
            *//** TEST: the Rows must have 3 gridElements (3 columns) *//*
            expect(row.children.length).toEqual(3);
        }
        
        // Cleaning the DOM
        $("#dataset-content-right").empty();
        $("#dataset-content-right").remove();
    });
      */
    
//    it("Prueba de rapidez", function() {
        // Time counter
//        var initialTime = new Date().getTime();
      
//        $prueba = $('<div class="prueba" />').appendTo('body');
        
        //$prueba.width(76);
        
//        $prueba.css("position", "absolute");
//        $prueba.css("left", "76px");
        
        //var prueba = $prueba.get(0);
        
//        var x=0;
//        for (var i=0; i<1000000; i++)
            //x += $prueba.width();
            //x += parseInt(prueba.style.width);
//            x += parseInt($prueba.css("left"), 10);
        
        // Time counter
//        var finalTime = new Date().getTime();
//        console.log("Tiempo (ms): %s. X: %s", finalTime-initialTime, x);
//    });

    
});