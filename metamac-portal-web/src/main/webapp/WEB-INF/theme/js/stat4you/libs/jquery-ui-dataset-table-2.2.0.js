/*
 * jQuery UI Dataset Table 2.1.0
 *
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function($) {

    $.widget("ui.datasetTable", {
        version : "2.0.0",
        options : {
            width : 500,
            height : 500,
            title: {
                text: '',
                style: {
                }
            },
            columnTop : {
                width : 150,
                height : 25,
                dimensions: [ {
                    id : "",
                    name : "",
                    toolTip : null,
                    cssClass : null,
                    representations : [ {
                        id : "",
                        name : "",          
                    } ],
                } ],
            },
            columnLeft : {
                width : 150,
                height : 25,
                dimensions: [ {
                    id : "",
                    name : "",
                    toolTip : null,
                    cssClass : null,
                    representations : [ {
                        id : "",
                        name : "",          
                    } ],
                } ],
            },
            data : [ {
                id : "",
                value : ""
            } ],
            datasource : null,
        },

        /********************************************************************************
         * STANDARD JQUERY UI FUNCTIONS
         *******************************************************************************/
        _create : function() {
            var self = this;

            // Create Attributes
            self._initializeAttributes();

            // DATA SET
            self._initializeStructure();
            
            //Disabling text selection
            self.$dataset.disableTextSelect();
            
            // EventListeners
            self._initializeEventListeners();
            
            // vertical cells and cells may have different padding/border skewing width calculations (box-sizing, hello?)
            // calculate the diff so we can set consistent sizes
            self._measureCellPaddingAndBorder();

            /* Computing the structure */
            self._computeColumnTopAttributes();
            self._computeColumnLeftAttributes();
            
            // DATA
            // Compute Size
            self._initializeSizes();
            // Scroll Bars
            self._initializeScrollBars();
            // Setting further sizes
            self._settingFurtherSizes(); 
            
            // Creating the grid
            self._createDataGrid();
            
            /* CREATING STRUCTURE */
            self._createColumnTop();
            self._createColumnLeft();
            
            /* SPINNER */
            //self.$scrollBottom.hide();
            self.$scrollRight.hide();
            
            /* SPINNER */
            var tempTop = self.dataHeight / 2 - self.$dataSpinner.height() / 2;
            var tempLeft = self.dataWidth / 2 - self.$dataSpinner.width() / 2;
            self.$dataSpinner.css("top", tempTop);
            self.$dataSpinner.css("left", tempLeft);
            self.$dataShadow.width(self.$data.width() - 2);
            self.$dataShadow.height(self.$data.height() - 2);
            
        },

        
        destroy : function() {
            var self = this;
            var rootDiv = self.$root.get(0);
            // Removing
            while(rootDiv.children.length > 0) {
                rootDiv.removeChild(rootDiv.firstChild);
            }
            rootDiv.parentNode.removeChild(rootDiv);
            // Unbinding
            self.$dataset.unbind('mousewheel', self._mouseWheelMove);
            self.$scrollRightTrack.unbind('click', self._stepRightScroll);
            self.$scrollRightDrag.unbind('click');
            self.$scrollBottomTrack.unbind('click', self._stepBottomScroll);
            self.$scrollBottomDrag.unbind('click');
            // widget destroy
            $.Widget.prototype.destroy.call(this);
        },
        
        
        _setOption : function(key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);

            if (key === "value") {
                this.options.value = value;
                this._refreshValue();
                if (this._value() === this.options.max) {
                    this._trigger("complete");
                }
            }
            $.Widget.prototype._setOption.apply( this, arguments );
        },
        

        
        /********************************************************************************
         * PUBLIC FUNCTIONS
         *******************************************************************************/
        setData : function() {
            var self = this;
            /* LOADING THE DATA*/
            self._createData();

            /* SPINNER */
            self.$dataShadow.hide();
            self.$scrollBottom.show();
            self.$scrollRight.show();
        },
        


        /********************************************************************************
         * TABLE CREATION FUNCTIONS (TOP, LEFT and DATA)
         *******************************************************************************/
        _createColumnTop : function() {
            var self = this;
            
            /* TOP */
            var options = self.options,
                columnTop = options.columnTop,
                numDims = columnTop.dimensions.length,
                gridWidth = self.$grid.width();
            
            // Needed for the computeCells functions
            self.dimensionWidth = {};
            self.dimensionHeight = {};
            
            for (var i=0; i<numDims; i++) {
                var $currentTopDimContainer = $("<div id='topContainerDim"+i+"' class='columnsTopDimContainer'>").appendTo(self.$columnsTopCells);
                var j=0;
                // The properties of the cells of the current dimension
                var element = {
                        dim: columnTop.dimensions[i],
                        dimPos: i,
                        representation: null,
                        representationPos: -1,
                    };
                var height = self._computeCellHeightTop(element, columnTop);
                var heightContainer = height - self.cellContainerHeightDiff;
                var width = self._computeCellWidthTop(element, columnTop);
                var widthContainer =  width - self.cellContainerWidthDiff;
                currentcontainerWidth = 0;
                while (currentcontainerWidth < gridWidth) {
                    // Append a new cell
                    var id = "top-" + i +"-"+ j;
                    $("<div class='dataset-cell' id='"+id+"' style='width: " + width + "px; height: " + height + "px' />")
                    .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'></span></div>")
                    //.addClass(col.cssClass || "")
                    .appendTo($currentTopDimContainer);
                    self._populateTopSectionElement(id);
                    // Updating operations
                    currentcontainerWidth += width;
                    j++;
                }
                while ($currentTopDimContainer.children().length < 3) {
                    // Append a new cell
                    var id = "top-" + i +"-"+ j;
                    $("<div class='dataset-cell' id='"+id+"' style='width: " + width + "px; height: " + height + "px' />")
                    .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'></span></div>")
                    //.addClass(col.cssClass || "")
                    .appendTo($currentTopDimContainer);
                    self._populateTopSectionElement(id);
                    // Updating operations
                    currentcontainerWidth += width;
                    j++;
                }
                // Updating current container width
                $currentTopDimContainer.width(currentcontainerWidth);
            }
        },
        

        _createColumnLeft : function() {
            var self = this;
            
            /* LEFT */
            var options = self.options,
                columnLeft = options.columnLeft,
                numDims = columnLeft.dimensions.length,
                gridHeight = self.$grid.height();
            
            for (var i=0; i<numDims; i++) {
                var $currentLeftDimContainer = $("<div id='leftContainerDim"+i+"' class='columnsLeftDimContainer'>").appendTo(self.$columnsLeftCells);
                $currentLeftDimContainer.width(columnLeft.width);
                var j=0;
                // The properties of the cells of the current dimension
                var element = {
                        dim: columnLeft.dimensions[i],
                        dimPos: i,
                        representation: null,
                        representationPos: -1,
                    };
                var height = self._computeCellHeightLeft(element, columnLeft);
                var heightContainer = height - self.cellContainerHeightDiff;
                var width = self._computeCellWidthLeft(element, columnLeft);
                var widthContainer =  width - self.cellContainerWidthDiff;
                currentcontainerHeight = 0;
                while (currentcontainerHeight < gridHeight) {
                    // Append a new cell
                    var id = "left-" + i +"-"+ j;
                    $("<div class='dataset-cell' id='"+id+"' style='width: " + width + "px; height: " + height + "px' />")
                    .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'></span></div>")
                    //.addClass(col.cssClass || "")
                    .appendTo($currentLeftDimContainer);
                    self._populateLeftSectionElement(id);
                    // Updating operations
                    currentcontainerHeight += height;
                    j++;
                }
                while ($currentLeftDimContainer.children().length < 3) {
                    // Append a new cell
                    var id = "left-" + i +"-"+ j;
                    $("<div class='dataset-cell' id='"+id+"' style='width: " + width + "px; height: " + height + "px' />")
                    .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'></span></div>")
                    //.addClass(col.cssClass || "")
                    .appendTo($currentLeftDimContainer);
                    self._populateLeftSectionElement(id);
                    // Updating operations
                    currentcontainerHeight += height;
                    j++;
                }
                // Updating current container width
                $currentLeftDimContainer.height(currentcontainerHeight);
            }
        },
        
        
        _createData : function() {
            var self = this,
                options = self.options;
            
            // Time counter
//            var initialTime = new Date().getTime();
            
            var gridOffset = self._getGridOffset();
            // Values
            self.numCellsPerGridElemWidth = parseInt(self.$gridElement.width() / options.columnTop.width);
            self.numCellsPerGridElemHeight = parseInt(self.$gridElement.height() / options.columnLeft.height);
            // Loop
            var k=1;
            // For each row of grid elements
            while (k <=self.numGridsElementsPerGridHeight) {
                self.numCurrentGridElemPerHeight = parseInt((gridOffset.top + (self.$gridElement.height() * (k - 1))) / self.$gridElement.height());
                self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight; // Starting in 0, if starting in 1: +1 needed
                var j = 1;
                // for each element of the row of grid elements
                while(j <= self.numGridsElementsPerGridWidth) {
                    self.numCurrentGridElemPerWidth = parseInt((gridOffset.left + (self.$gridElement.width() * (j - 1)))/ self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth; // Starting in 0, if starting in 1: +1 needed
                    self._createDataGridCellDivs(self.$gridElement[self.numGridsElementsPerGridWidth*(k-1)+j-1]);
                    // Populate a grid
                    self._populateGridElement(self.$gridElement[self.numGridsElementsPerGridWidth*(k-1)+j-1]);
                    j++;
                }
                k++;
            }
            self.$dataCells.appendTo(self.$dataContainer);

            // Time counter
//            var finalTime = new Date().getTime();
//            console.log("Tiempo (ms): %s", finalTime-initialTime);
        },
        

        _createDataGridCellDivs : function(div) {
            var self = this,
            options = self.options;
            cellWidth = options.columnTop.width - self.cellContainerWidthDiff,
            cellHeight = options.columnLeft.height - self.cellContainerHeightDiff,
            temp = "";
            
            var idNumPerHeight = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
            var idNumPerWidth = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
            for (var i=0; i<self.numCellsPerGridElemHeight; i++) {
                for (var j=0; j<self.numCellsPerGridElemWidth; j++) {
                    // We must insert in the CURRENT GRID ELEMENT
                    temp += "<div class='dataset-data-cell' id='" + (idNumPerHeight + i) + "-" + (idNumPerWidth + j) + "' style='width: " + options.columnTop.width + "px; height: " + options.columnTop.height + "px' >" +
                            "<div class='dataset-data-cell-container' style='width: " + cellWidth + "px; height: " + cellHeight + "px;'><span class='dataset-data-value'></span></div>" +
                            "</div>";
                }
            }
            
            // Append temp
            $(div).append(temp);
        },
        
        
        /********************************************************************************
         *  TOP GRID FUNCTIONS
         *******************************************************************************/
        _populateTopSectionElement : function(idCell) {
            var self = this,
                options = self.options,
                columnTop = options.columnTop;
            
            idCell = '#'+idCell;
            
            var $cell = $(idCell);
            var $cellSpan = $(".dataset-cell-name", $cell);
            var dim = parseInt(idCell.substr(5,1));
            var rep =  parseInt(idCell.substr(7));
            
            // We only have length valueas, but it is cyclic
            var numOfRepresentations = columnTop.dimensions[dim].representations.length
            if (rep >= numOfRepresentations)
                rep = rep % numOfRepresentations;
            
            var text = columnTop.dimensions[dim].representations[rep].name;
            $cell.attr("title", text);
            $cellSpan.text(text);
        },
        
        _movingTopCells : function(step) {
            var self = this,
                options = self.options,
                columnTop = options.columnTop,
                numDims = columnTop.dimensions.length;
            
//            console.log("--- Step:", step);
            for (var i=0; i<numDims; i++) {
                var $topContainerDim = $("#topContainerDim"+i);
                var dimContainerLeftOffset = self._parseIntFromCss($topContainerDim.css("left")); 
                var dimCellsWidth = self.dimensionWidth[columnTop.dimensions[i].id];
                // Step can be positive or negative
                var diffPixels = 0;
                // RIGHT OFFSET
                var rightBorderOfGrid = self.gridLeftOffset + self.$grid.width(); 
                var gridRightOffset = self.dataCellsWidth - rightBorderOfGrid;
                var rightBorderOfDimContainer = dimContainerLeftOffset + $topContainerDim.width();
                var dimContainerRightOffset = self.dataCellsWidth - rightBorderOfDimContainer;
                var cellsToMove = -1;
                // Direction of the movement
                if (step > 0) {
                    diffPixels = self.gridLeftOffset - dimContainerLeftOffset;
                }
                else {
                    diffPixels = gridRightOffset - dimContainerRightOffset;
                }
                cellsToMove = parseInt(diffPixels / dimCellsWidth);
                // ** Moving **
                var movedPixels = 0;
                for (var j=0; j<cellsToMove; j++) {
                    if (step>0) {
                        if (dimContainerRightOffset >= (dimCellsWidth * (j+1))) {
                            var $tempDiv = $topContainerDim.children(":first-child");
                            var $lastCurrentDiv = $topContainerDim.children(":last-child");
                            // We have to change the id of the new element
                            var tempDivId = self._calculateNextId("top", $lastCurrentDiv.attr('id'));
                            $tempDiv.attr('id', tempDivId);
                            self._populateTopSectionElement(tempDivId);
                            $topContainerDim.append($tempDiv);
                            // Number of pixels moved
                            movedPixels += dimCellsWidth;
                        }
                    }
                    else {
                        if (dimContainerLeftOffset >= (dimCellsWidth * (j+1))) {
                            var $tempDiv = $topContainerDim.children(":last-child");
                            var $firstCurrentDiv = $topContainerDim.children(":first-child");
                            // We have to change the id of the new element
                            var tempDivId = self._calculatePreviousId("top", $firstCurrentDiv.attr('id'));
                            $tempDiv.attr('id', tempDivId);
                            self._populateTopSectionElement(tempDivId);
                            $tempDiv.insertBefore($firstCurrentDiv);
                            // Number of pixels moved
                            movedPixels -= dimCellsWidth;
                        }
                    }
                        
                }
                
                
                // Applying the movement
                var oldLeft = self._parseIntFromCss($topContainerDim.css("left"));
//                console.log("En %s: oldLeft > %s, newLeft > %s.", i, oldLeft, oldLeft + movedPixels);
                var newLeft = oldLeft + movedPixels;
                $topContainerDim.css("left", newLeft+"px");
//                var oldLeft = self._parseIntFromCss($topContainerDim.css("left"));
//                console.log("AFTER..... oldLeft %s", oldLeft);
            }
        },
        
        
        /********************************************************************************
         *  LEFT GRID FUNCTIONS
         *******************************************************************************/
        _populateLeftSectionElement : function(idCell) {
            var self = this,
                options = self.options,
                columnLeft = options.columnLeft;
            
            idCell = '#'+idCell;
            
            var $cell = $(idCell);
            var $cellSpan = $(".dataset-cell-name", $cell);
            var dim = parseInt(idCell.substr(6,1));
            var rep =  parseInt(idCell.substr(8));
            
            // We only have length valueas, but it is cyclic
            var numOfRepresentations = columnLeft.dimensions[dim].representations.length
            if (rep >= numOfRepresentations)
                rep = rep % numOfRepresentations;
            
            var text = columnLeft.dimensions[dim].representations[rep].name;
            $cell.attr("title", text);
            $cellSpan.text(text);
        },
        
        _movingLeftCells : function(step) {
            var self = this,
                options = self.options,
                columnLeft = options.columnLeft,
                numDims = columnLeft.dimensions.length;
            
//            console.log("--- Step:", step);
            for (var i=0; i<numDims; i++) {
                var $leftContainerDim = $("#leftContainerDim"+i);
                var dimContainerTopOffset = self._parseIntFromCss($leftContainerDim.css("top")); 
                var dimCellsHeight = self.dimensionHeight[columnLeft.dimensions[i].id];
                // Step can be either positive or negative
                var diffPixels = 0;
                // BOTTOM OFFSET
                var bottomBorderOfGrid = self.gridTopOffset + self.$grid.height(); 
                var gridBottomOffset = self.dataCellsHeight - bottomBorderOfGrid;
                var bottomBorderOfDimContainer = dimContainerTopOffset + $leftContainerDim.height();
                var dimContainerBottomOffset = self.dataCellsHeight - bottomBorderOfDimContainer;
                var cellsToMove = -1;
                // Direction of the movement
                if (step > 0) {
                    diffPixels = self.gridTopOffset - dimContainerTopOffset;
                }
                else {
                    diffPixels = gridBottomOffset - dimContainerBottomOffset;
                }
                cellsToMove = Math.abs(parseInt(diffPixels / dimCellsHeight));
                // ** Moving **
                var movedPixels = 0;
                for (var j=0; j<cellsToMove; j++) {
                    /* Going to the bottom */
                    if (step>0) {
                        if (dimContainerBottomOffset >= (dimCellsHeight * (j+1))) {
                            var $tempDiv = $leftContainerDim.children(":first-child");
                            var $lastCurrentDiv = $leftContainerDim.children(":last-child");
                            // We have to change the id of the new element
                            var tempDivId = self._calculateNextId("left", $lastCurrentDiv.attr('id'));
                            $tempDiv.attr('id', tempDivId);
                            self._populateLeftSectionElement(tempDivId);
                            $leftContainerDim.append($tempDiv);
                            // Number of pixels moved
                            movedPixels += dimCellsHeight;
                        }
                    }
                    /* Going to the top */
                    else {
                        if (dimContainerTopOffset >= (dimCellsHeight * (j+1))) {
                            var $tempDiv = $leftContainerDim.children(":last-child");
                            var $firstCurrentDiv = $leftContainerDim.children(":first-child");
                            // We have to change the id of the new element
                            var tempDivId = self._calculatePreviousId("left", $firstCurrentDiv.attr('id'));
                            $tempDiv.attr('id', tempDivId);
                            self._populateLeftSectionElement(tempDivId);
                            $tempDiv.insertBefore($firstCurrentDiv);
                            // Number of pixels moved
                            movedPixels -= dimCellsHeight;
                        }
                    }
                        
                }
                
                
                // Applying the movement
                var oldTop = self._parseIntFromCss($leftContainerDim.css("top"));
//                console.log("En %s: oldLeft > %s, newLeft > %s.", i, oldLeft, oldLeft + movedPixels);
                var newTop = oldTop + movedPixels;
                $leftContainerDim.css("top", newTop+"px");
//                var oldLeft = self._parseIntFromCss($topContainerDim.css("left"));
//                console.log("AFTER..... oldLeft %s", oldLeft);
            }
        },

        
        /********************************************************************************
         * DATA GRID FUNCTIONS
         *******************************************************************************/
        _createDataGrid : function() {
            var self = this,
                options = self.options;
                
            var grids = "";
            /* Changing the size of the gridElements*/
            var minWidth = self.$dataContainer.width();
            var containerWidth = self.$dataCells.width();
            var gridElementWidth = self._firstPossibleSize(minWidth, containerWidth, options.columnTop.width, true);

            self.numGridsElementsPerGridWidth = containerWidth / gridElementWidth;
            if (self.numGridsElementsPerGridWidth > 3)
                self.numGridsElementsPerGridWidth = 3;
            
            var minHeight = self.$dataContainer.height();
            var containerHeight = self.$dataCells.height();
            var gridElementHeight = self._firstPossibleSize(minHeight, containerHeight, options.columnTop.height, true);

            self.numGridsElementsPerGridHeight = containerHeight / gridElementHeight;
            if (self.numGridsElementsPerGridHeight > 3)
                self.numGridsElementsPerGridHeight = 3;
            
            grids += "<div class='grid'>";
            var i = 0, j = 0, k=0;
            while (i < self.numGridsElementsPerGridHeight) {
                j = 0;
                grids += "<div class='gridRow'>";
                while (j < self.numGridsElementsPerGridWidth) {
                    k++;
                    grids += "<div class='gridElement' />";
                    j++;
                }
                grids += "</div>";
                i++;
            }
            grids += "</div>";
            
            //Append to DOM
            self.$dataCells.append(grids);
            self.$dataCells.appendTo(self.$dataContainer);
            
            // Setting the grid: container, width and height
//            self.$grid = $(".grid");
//            self.$gridElement = $(".gridElement");
//            self.$gridElement.width(gridElementWidth);
//            self.$gridElement.height(gridElementHeight);
//            self.$grid.width(gridElementWidth * self.numGridsElementsPerGridWidth);
//            self.$grid.height(gridElementHeight * self.numGridsElementsPerGridHeight);
            
            
            /*-------------------------------------------------------------------------------------------------------*/
            /*--------------------------------------------------TO-DO------------------------------------------------*/
            /*-------------------------------------------------------------------------------------------------------*/
            
            // Creating the grid structure
            self.dataGridStr = {};
            self.dataGridStr.grid = {};
            self.dataGridStr.grid.$ = $(".grid");
            self.dataGridStr.grid.numGridsElementsPerGridHeight = self.numGridsElementsPerGridHeight;
            self.dataGridStr.grid.numGridsElementsPerGridWidth = self.numGridsElementsPerGridWidth;
            self.dataGridStr.grid.width = null;
            self.dataGridStr.grid.height = null;
            self.dataGridStr.grid.top = null;
            self.dataGridStr.grid.left = null;
            
            self.dataGridStr.rows = {};
            self.dataGridStr.rows.$ = $(".gridRow");
            
            self.dataGridStr.gridElements = {};
            self.dataGridStr.gridElements.$ = $(".gridElement");
            self.dataGridStr.gridElements.width = null;
            self.dataGridStr.gridElements.height = null;
            for (var i=0; i<self.dataGridStr.gridElements.$.length; i++) {
                self.dataGridStr.gridElements[i] = {};
                self.dataGridStr.gridElements[i].$= self.dataGridStr.gridElements.$[i];
                self.dataGridStr.gridElements[i].top = null;
                self.dataGridStr.gridElements[i].left = null;
            }
            
            self.dataGridStr.functions = {};
            self.dataGridStr.functions.getGridElementByRow = function(rowNum, GridElementNumInRow) {
                return self.dataGridStr.gridElements[(rowNum + 1) * (GridElementNumInRow + rowNum)];
            };
            self.dataGridStr.functions.getGridElementByCol = function(colNum, GridElementNumInCol) {
                return self.dataGridStr.gridElements[colNum + self.dataGridStr.grid.numGridsElementsPerGridWidth * i];
            };
            self.dataGridStr.functions.moveRowToBottom = function() {
                for (var i=0; i<self.dataGridStr.grid.numGridsElementsPerGridWidth; i++) {
                    var gridElementObj = self.dataGridStr.functions.getGridElementByRow(0, i);
                    gridElementObj.top += self.dataGridStr.grid.height;
                }
                // Reordering the array
                var temp = null;
                //var lastNotMovedElement = self.dataGridStr.gridElements.$.length - self.dataGridStr.grid.numGridsElementsPerGridWidth;
                for (var i=self.dataGridStr.grid.numGridsElementsPerGridWidth; i<self.dataGridStr.gridElements.$.length; i++) {
                    var temp = self.dataGridStr.gridElements[i];
                    self.dataGridStr.gridElements[i-self.dataGridStr.grid.numGridsElementsPerGridWidth] = null;
                    self.dataGridStr.gridElements[i] = null;
                }
                self.dataGridStr.grid.top += self.dataGridStr.gridElements.height;
            };
            self.dataGridStr.functions.moveRowToTop = function() {
                for (var i=0; i<self.dataGridStr.grid.numGridsElementsPerGridWidth; i++) {
                    var gridElementObj = self.dataGridStr.functions.getGridElementByRow(2, i);
                    gridElementObj.top -= self.dataGridStr.grid.height;
                }
                self.dataGridStr.grid.top -= self.dataGridStr.gridElements.height;
            };
            self.dataGridStr.functions.moveColToRight = function() {
                for (var i=0; i<self.dataGridStr.grid.numGridsElementsPerGridHeight; i++) {
                    var gridElementObj = self.dataGridStr.functions.getGridElementByCol(0, i);
                    gridElementObj.left += self.dataGridStr.grid.width;
                }
                self.dataGridStr.grid.top -= self.dataGridStr.gridElements.width;
            };
            self.dataGridStr.functions.moveColToLeft = function() {
                for (var i=0; i<self.dataGridStr.grid.numGridsElementsPerGridHeight; i++) {
                    var gridElementObj = self.dataGridStr.functions.getGridElementByCol(2, i);
                    gridElementObj.left -= self.dataGridStr.grid.width;
                }
                self.dataGridStr.grid.top -= self.dataGridStr.gridElements.width;
            };
            
            //Setting widths and heights
            self.dataGridStr.gridElements.$.width(gridElementWidth);
            self.dataGridStr.gridElements.$.height(gridElementHeight);
            self.dataGridStr.gridElements.$.width(gridElementWidth * self.numGridsElementsPerGridWidth);
            self.dataGridStr.gridElements.$.height(gridElementHeight * self.numGridsElementsPerGridHeight);
            
            //self.dataGridStr.numGridRows = self.dataGridStr.$gridRows.length;
            //self.dataGridStr.numGridElements = self.dataGridStr.$gridElements.length / self.dataGridStr.$gridRows.length;
            //self.dataGridStr.numCellsPerGridElemWidth = parseInt(self.$gridElement.width() / options.columnTop.width);
            //self.dataGridStr.numCellsPerGridElemHeight = parseInt(self.$gridElement.height() / options.columnLeft.height);
            
        },
        
        
        /*--+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++--*/
        /*------------------------------------------------TO-DO--------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------------*/
        _createDataGridStructure : function() {
            var self = this;
            self.dataGridStr = {};
            self.dataGridStr.$grid = $(".grid");
            
            self.dataGridStr.$gridRows = $(".gridRow");
            self.dataGridStr.$gridElements = $(".gridElement");
            self.dataGridStr.numGridRows = self.dataGridStr.$gridRows.length;
            self.dataGridStr.numGridElements = self.dataGridStr.$gridElements.length / self.dataGridStr.$gridRows.length;
            self.dataGridStr.numCellsPerGridElemWidth = parseInt(self.$gridElement.width() / options.columnTop.width);
            self.dataGridStr.numCellsPerGridElemHeight = parseInt(self.$gridElement.height() / options.columnLeft.height);
            
            //self.numCellsPerGridElemWidth = parseInt(self.$gridElement.width() / options.columnTop.width);
            //self.numCellsPerGridElemHeight = parseInt(self.$gridElement.height() / options.columnLeft.height);
            
            self.dataGridStr.rows = {};
            
            for (var i=0; i<self.dataGridStr.numGridRows; i++) {
                self.dataGridStr.rows[i] = {};
                self.dataGridStr.rows[i].$row = self.dataGridStr.$gridRows[i];
                self.dataGridStr.rows[i].elements = {};
                for (var j=0; j<self.dataGridStr.numGridElements; j++) {
                    self.dataGridStr.rows[i].elements[j] = {};
                    self.dataGridStr.rows[i].elements[j].$element = self.dataGridStr.$gridElements[(i+1) * (j+1)];
                    self.dataGridStr.rows[i].elements[j].cells = {};
                    for (var k=0; k<self.dataGridStr.numCellsPerGridElemWidth*self.dataGridStr.numCellsPerGridElemHeight; k++) {
                        self.dataGridStr.rows[i].elements[j].cells[k] = $();
                    }
                }
            } 
        },
        
        
        _populateGridElement : function(gridElement) {
            var self = this,
            options = self.options,
            datasource = options.datasource,
            tempCellIdStr = gridElement.firstElementChild.id,
            newId = [self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight, 
                     self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth];
            var tempCellId =  tempCellIdStr.split('-');
            
            var v = 1;
            // A CONCRETE GRID
            while (v <= self.numCellsPerGridElemHeight) {
                var h = 1;
                while (h <= self.numCellsPerGridElemWidth) {
                    // A concrete cell
                    var idElements = {};
                    var numCurrentCellPerGridWidth = self.numCurrentCellPerGridWidthInit + h - 1;
                    for (var i=options.columnTop.dimensions.length-1; i>=0; i--) {
                        var categoryIndex = numCurrentCellPerGridWidth % options.columnTop.dimensions[i].representations.length;
                        numCurrentCellPerGridWidth = parseInt(numCurrentCellPerGridWidth / options.columnTop.dimensions[i].representations.length);
                        idElements[options.columnTop.dimensions[i].id] = options.columnTop.dimensions[i].representations[categoryIndex].id;
                    }
                    var numCurrentCellPerGridHeight = self.numCurrentCellPerGridHeightInit + v - 1;
                    for (var i=options.columnLeft.dimensions.length-1; i>=0; i--) {
                        var categoryIndex = numCurrentCellPerGridHeight % options.columnLeft.dimensions[i].representations.length;
                        numCurrentCellPerGridHeight = parseInt(numCurrentCellPerGridHeight / options.columnLeft.dimensions[i].representations.length);
                        idElements[options.columnLeft.dimensions[i].id] = options.columnLeft.dimensions[i].representations[categoryIndex].id;
                    }
                    // Value
                    var value = datasource(idElements);
                    // UPDATING THE ID AND THE VALUE OF THE CELL
                    // Creating the string corresponding to the old Id of the element
                    tempCellIdStr = tempCellId.join('-');
                    var $currentCell = $(gridElement).find('#'+tempCellIdStr);
                    var newIdStr = newId.join('-');
                    $currentCell.attr("id", newIdStr);
                    var $valueSpan = $currentCell.find('.dataset-data-value');
                    $valueSpan.empty();
                    $valueSpan.append(value);
                    // Obtaining the old Id of the next element (X axis) and also calculating the new one
                    tempCellId[1]++;
                    newId[1]++;
                    h++;
                }
                // Reseting
                tempCellId[1] -= self.numCellsPerGridElemWidth;
                newId[1] -= self.numCellsPerGridElemWidth;
                // Obtaining the old Id of the next element (Y axis) and also calculating the new one                
                tempCellId[0]++;
                newId[0]++;
                v++;
            }
        },
        
        
        _getGridOffset : function() {
            var self = this;
            var templeft = self.$grid.css("left");
            if (templeft == "auto")
                templeft = "0px";
            templeft = templeft.substr(0, templeft.length -2);
            var temptop = self.$grid.css("top");
            if (temptop == "auto")
                temptop = "0px";
            temptop = temptop.substr(0, temptop.length -2);
            
            return {"left" : parseInt(templeft), "top": parseInt(temptop)};
        },

        
        _gridMoveStepRepopulate : function() {
            var self = this;
            var rows = $(".gridRow", self.$grid);
            for (var i=0; i<rows.length; i++) {
                var gridElements = $(".gridElement", $(rows[i]));
                for (var j=0; j<gridElements.length; j++) {
                    // Populating the DIV
                    self.numCurrentGridElemPerWidth = parseInt((self.gridLeftOffset + self.$gridElement.width() * 2) / self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
                    self.numCurrentGridElemPerHeight = parseInt((self.gridTopOffset + self.$gridElement.height() * i) / self.$gridElement.height());
                    self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
                    self._populateGridElement(gridElements[j]);
                }
            }
        },
        
        
        /* --------------------------------------------------------------------
         * GRID MOVEMENT FUNCTIONS
         * ----------------------------------------------------------------- */
        _gridMoveStepLeftRight : function(leftDataNew) {
            var self = this;
            var oldstep = leftDataNew - self.gridLeftOffset;
            var step = self._firstMultipleElement(Math.abs(oldstep), self.$grid.width());
            if ((oldstep < 0) && (step > 0)) step *= -1;
            // New grid offset
            self.gridLeftOffset += step;
            self.$grid.css("left", self.gridLeftOffset);
            // Updating
            self._gridMoveStepRepopulate();
            
            return step;
        },
        
        
        _gridMoveStepTopBottom : function(topDataNew) {
            var self = this;
            var oldstep = topDataNew - self.gridTopOffset;
            var step = self._firstMultipleElement(Math.abs(oldstep), self.$grid.height());
            if ((oldstep < 0) && (step > 0)) step *= -1;
            // New grid offset
            self.gridTopOffset += step;
            self.$grid.css("top", self.gridTopOffset);
            // Updating
            self._gridMoveStepRepopulate();
            
            return step;
        },
        
        
        _gridMoveLeftRight : function(leftDataNew) {
            var self = this;
            /** Normal movement **/
            var leftDiffContainerGrid = leftDataNew - self.gridLeftOffset;
            var movingRightThreshold = self.$gridElement.width() * 1.5;
            var movingLeftThreshold = self.$gridElement.width() * 0.5;
            var step = 0;
            // RIGHT
            if ((leftDiffContainerGrid > movingRightThreshold) && self._isEnoughSpaceInTheRight()) {
                step += self.$gridElement.width();
                self.gridLeftOffset += step;
                self.$grid.css("left", self.gridLeftOffset);
                var rows = $(".gridRow", self.$grid);
                var row = null;
                for (var i=0; i<rows.length; i++) {
                    row = rows.get(i);
                    // Now the elements is the last one
                    row.appendChild(row.firstElementChild);
                    // Populate
                    self.numCurrentGridElemPerWidth = parseInt((self.gridLeftOffset + self.$gridElement.width() * 2) / self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
                    self.numCurrentGridElemPerHeight = parseInt((self.gridTopOffset + self.$gridElement.height() * i) / self.$gridElement.height());
                    self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
                    self._populateGridElement(row.lastElementChild);
                }
            }
            // LEFT
            else if ((leftDiffContainerGrid <= movingLeftThreshold) && self._isEnoughSpaceInTheLeft()) {
                step -= self.$gridElement.width();
                self.gridLeftOffset += step;
                self.$grid.css("left", self.gridLeftOffset);
                var rows = $(".gridRow", self.$grid);
                var row = null;
                for (var i=0; i<rows.length; i++) {
                    row = rows.get(i);
                    // Now the element is the first one
                    row.insertBefore(row.lastElementChild, row.firstElementChild);
                    // Populate
                    self.numCurrentGridElemPerWidth = parseInt((self.gridLeftOffset + 0) / self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
                    self.numCurrentGridElemPerHeight = parseInt((self.gridTopOffset + self.$gridElement.height() * i) / self.$gridElement.height());
                    self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
                    self._populateGridElement(row.firstElementChild);
                }
            }
            
            return step;
        },
        
        
        _gridMoveTopBottom : function(topDataNew) {
            var self = this;
            /** Normal Movement **/
            var topDiffContainerGrid = topDataNew - self.gridTopOffset;
            var movingBottomThreshold = self.$gridElement.height() * 1.5;
            var movingTopThreshold = self.$gridElement.height() * 0.5;
            var step = 0;
            // BOTTOM
            if ((topDiffContainerGrid > movingBottomThreshold) && self._isEnoughSpaceInTheBottom()) {
                step += self.$gridElement.height();
                self.gridTopOffset += step;
                self.$grid.css("top", self.gridTopOffset);
                var grid = self.$grid.get(0);
                // Now the row is the last one
                grid.appendChild(grid.firstElementChild);
                // Populate
                self.numCurrentGridElemPerHeight = parseInt((self.gridTopOffset + self.$gridElement.height() * 2) / self.$gridElement.height());
                self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
                for (var i=0; i<grid.lastElementChild.children.length; i++) {
                    self.numCurrentGridElemPerWidth = parseInt((self.gridLeftOffset + self.$gridElement.width() * i) / self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
                    self._populateGridElement(grid.lastElementChild.children[i]);
                }
            }
            // TOP
            else if ((topDiffContainerGrid <= movingTopThreshold) && self._isEnoughSpaceInTheTop()) {
                step -= self.$gridElement.height();
                self.gridTopOffset += step;
                self.$grid.css("top", self.gridTopOffset);
                var grid = self.$grid.get(0);
                grid.insertBefore(grid.lastElementChild, grid.firstElementChild);
                // Populate
                self.numCurrentGridElemPerHeight = parseInt((self.gridTopOffset + 0) / self.$gridElement.height());
                self.numCurrentCellPerGridHeightInit = self.numCurrentGridElemPerHeight * self.numCellsPerGridElemHeight;
                for (var i=0; i<grid.firstElementChild.children.length; i++) {
                    self.numCurrentGridElemPerWidth = parseInt((self.gridLeftOffset + self.$gridElement.width() * i) / self.$gridElement.width());
                    self.numCurrentCellPerGridWidthInit = self.numCurrentGridElemPerWidth * self.numCellsPerGridElemWidth;
                    self._populateGridElement(grid.firstElementChild.children[i]);
                }
            }
            
            return step;
        },
        
        
        /********************************************************************************
         * MOVEMENT FUNCTIONS
         *******************************************************************************/
        _applyingMovementTopBottom : function(topDataNew) {
            // Time counter
          var initialTime = new Date().getTime();
            
            
            var self = this;
            var step = 0;
            if (self._isStepHigherThanGridHeight(topDataNew)) {
                step = self._gridMoveStepTopBottom(topDataNew);
                // Moving the LEFT section
                if (step != 0) self._movingLeftCells(step);
            }
            /* If the movement was small or was not multiple of the gridHeight
             * we move a maximum of three times */
            var i = 0;
            do {
                step = self._gridMoveTopBottom(topDataNew);
                if (step != 0) self._movingLeftCells(step);
                i++;
            } while ((step != 0) && (i < 3));
            
            
            
            // Time counter
          var finalTime = new Date().getTime();
          console.log("_applyingMovementTopBottom >> Tiempo (ms): %s", finalTime-initialTime);
        },
        
        
        _applyingMovementLeftRight : function(leftDataNew) {
            // Time counter
          var initialTime = new Date().getTime();

            
            var self = this;
            var step = 0;
            if (self._isStepWiderThanGridWidth(leftDataNew)) {
                step = self._gridMoveStepLeftRight(leftDataNew);
                // Moving the TOP section
                if (step != 0) self._movingTopCells(step);
            }
            /* If the movement was small or was not multiple of the gridWidth:
             * We move a maximum of three times */
            var i = 0;
            do {
                step = self._gridMoveLeftRight(leftDataNew);
                if (step != 0) self._movingTopCells(step);
                i++;
            } while ((step != 0) && (i < 3));
            
            
            // Time counter
          var finalTime = new Date().getTime();
          console.log("_applyingMovementLeftRight >> Tiempo (ms): %s", finalTime-initialTime);
        },
        
        
        _mouseWheelMove : function(event, delta) {
            var self = event.data.self,
                moveState = self.moveState,
                pace = 10;
            var vel = Math.abs(delta);
            var pixelsToMove = pace * vel;
            // Going up
            if (delta > 0) {
                pixelsToMove *= -1;
            }
            // Going down
            else if (delta < 0) {
                pixelsToMove *= 1;
            }
            
            var topDataNew = 0;
            var topDataMax = self.dataCellsHeight - self.dataHeight;
            var topScrollNew = 0;   
            var topScroll = self._parseIntPositive(self.scrollRightDragTop);
            
            topScrollNew = topScroll + pixelsToMove;
            if (topScrollNew < 0) {
                topScrollNew = 0;
            } else if (topScrollNew > self.scrollRightMaxTop) {
                topScrollNew = self.scrollRightMaxTop;
            }

            var percentScrolled = topScrollNew / self.scrollRightMaxTop;
            topDataNew = percentScrolled * topDataMax;

            /* Moving the dinamic grid */
            self._applyingMovementTopBottom(topDataNew);
            
            /* Updating */
            self.columnsLeftCellsTop = topDataNew;
            self.scrollRightDragTop = topScrollNew;
            
            topDataNew = -1*topDataNew + "px";
            topScrollNew = topScrollNew + "px";
            
            self.$columnsLeftCells.css("top", topDataNew);
            self.$dataCells.css("top", topDataNew);
            self.$scrollRightDrag.css("top", topScrollNew);
            
            moveState.moveStartY = event.pageY;
            moveState.moveStartX = event.pageX;
            
            return false;
            
        },
        
        
        _stepRightScroll : function(event) {
            var self = event.data.self,
                moveState = self.moveState;
            
            var topScroll = self._parseIntPositive(self.scrollRightDragTop);
            var pace = self.dataHeight / 4;
            // The pace should not be greater than the scroll "drag" element 
            if (pace > self.scrollRightDragHeight)
                pace = self.scrollRightDragHeight;
            var diff = event.pageY - self.$scrollRightDrag.offset().top;
            
            if (diff > 0)
                pixelsToMove = pace;
            else if (diff < 0)
                pixelsToMove = -pace;
                
            var topDataNew = 0;
            var topDataMax = self.dataCellsHeight - self.dataHeight;
            
            var topScrollNew = topScroll + pixelsToMove;
            if (topScrollNew < 0) {
                topScrollNew = 0;
            } else if (topScrollNew > self.scrollRightMaxTop) {
                topScrollNew = self.scrollRightMaxTop;
            }
            
            var percentOfPixelsInTheTop = topScrollNew / self.scrollRightMaxTop;
            topDataNew = percentOfPixelsInTheTop * topDataMax;
            
            /* Moving the dinamic grid */
            self._applyingMovementTopBottom(topDataNew);
            
            /* Updating */
            self.columnsLeftCellsTop = topDataNew;
            self.scrollRightDragTop = topScrollNew;
            
            topDataNew = -1*topDataNew + "px";
            topScrollNew = topScrollNew + "px";
            
            self.$columnsLeftCells.css("top", topDataNew);
            self.$dataCells.css("top", topDataNew);
            self.$scrollRightDrag.css("top", topScrollNew);
            
            moveState.moveStartY = event.pageY;
        },
        
        
        _stepBottomScroll : function(event) {
            var self = event.data.self,
                moveState = self.moveState;
            
            var leftScroll = self._parseIntPositive(self.scrollBottomDragLeft);
            // We will move 1/4 of the width of the visible table
            var pace = self.dataWidth / 4;
            // but the pace should not be greater than the scroll "drag" element 
            if (pace > self.scrollBottomDragWidth)
                pace = self.scrollBottomDragWidth;
            var diff = event.pageX - self.$scrollBottomDrag.offset().left;
            
            var pixelsToMove = 0;
            if (diff > 0)
                pixelsToMove = pace;
            else if (diff < 0)
                pixelsToMove = -pace;
                
            var leftDataNew = 0;
            var leftDataMax = self.dataCellsWidth - self.dataWidth;
            
            var leftScrollNew = leftScroll + pixelsToMove;
            if (leftScrollNew < 0) {
                leftScrollNew = 0;
            } else if (leftScrollNew > self.scrollBottomMaxLeft) {
                leftScrollNew = self.scrollBottomMaxLeft;
            }
            
            var percentOfPixelsInTheLeft = leftScrollNew / self.scrollBottomMaxLeft;
            leftDataNew = percentOfPixelsInTheLeft * leftDataMax;
            
            /* Moving the dinamic grid */
            self._applyingMovementLeftRight(leftDataNew);
            
            /* Updating */
            self.columnsTopCellsLeft = leftDataNew;
            self.scrollBottomDragLeft = leftScrollNew;
            
            leftDataNew = -1*leftDataNew + "px";
            leftScrollNew = leftScrollNew + "px";
            
            self.$columnsTopCells.css("left", leftDataNew);
            self.$dataCells.css("left", leftDataNew);
            self.$scrollBottomDrag.css("left", leftScrollNew);
            
            moveState.moveStartX = event.pageX;
        },
        
        
        /********************************************************************************
         * EVENT LISTENERS FUNCTIONS
         *******************************************************************************/
        _mouseDown : function(e) {
            var self = this,
                moveState = self.moveState;
            
            moveState.moveEnable = true;
            
            var mouseUp = function (e) {
                self._mouseUp(e);
            };
            var mouseMove = function (e) {
                self._mouseMove(e);
            };
            
            $(document).bind("mouseup.dataset", mouseUp)
                            .bind("mousemove.dataset", mouseMove);

            if (moveState.moveTop && moveState.moveLeft) {
                self.$dataCells.css("cursor", "move");
            } else if (moveState.moveTop) {
                self.$columnsLeftCells.css("cursor", "n-resize");
            } else if (moveState.moveLeft) {
                self.$columnsTopCells.css("cursor", "e-resize");
            }

            moveState.moveStartX = e.pageX;
            moveState.moveStartY = e.pageY;
        },

        _mouseUp : function(e) {
            var self = this,
                moveState = self.moveState;
            
            moveState.moveEnable = false;

            $(document).enableTextSelect()           
                            .unbind("mouseup.dataset mousemove.dataset");

            if (moveState.moveTop && moveState.moveLeft) {
                self.$dataCells.css("cursor", "default");
            } else if (moveState.moveTop) {
                self.$columnsLeftCells.css("cursor", "default");
            } else if (moveState.moveLeft) {
                self.$columnsTopCells.css("cursor", "default");
            }

            self._resetMoveState();
        },

        _mouseMove : function(e) {
            var self = this,
                moveState = self.moveState;
            
            if (!moveState.moveEnable) {
                return;
            }
            
            if (moveState.moveMoving) {
                return;
            }

            moveState.moveMoving = true;

            // LEFT
            if (moveState.moveLeft) {
                var leftDataNew = 0;
                var leftDataMax = self.dataCellsWidth - self.dataWidth;
                var leftScrollNew = 0;  
                
                if (self.dataWidth < self.dataCellsWidth) {
                    var diffX = e.pageX - moveState.moveStartX;
                    var leftData = self._parseIntPositive(self.columnsTopCellsLeft);
                    var leftScroll = self._parseIntPositive(self.scrollBottomDragLeft);
                    
                    if (moveState.pressedScroll) {
                        leftScrollNew = leftScroll + diffX;
                        if (leftScrollNew < 0) {
                            leftScrollNew = 0;
                        } else if (leftScrollNew > self.scrollBottomMaxLeft) {
                            leftScrollNew = self.scrollBottomMaxLeft;
                        }

                        var percentScrolled = leftScrollNew / self.scrollBottomMaxLeft;
                        leftDataNew = percentScrolled * leftDataMax;
                    } else {
                        leftDataNew = leftData - diffX;
                        if (leftDataNew < 0) {
                            leftDataNew = 0;
                        } else if (leftDataNew > leftDataMax) {
                            leftDataNew = leftDataMax;
                        }
                        
                        var percentScrolled = leftDataNew / leftDataMax;
                        leftScrollNew = percentScrolled * self.scrollBottomMaxLeft;
                    }

                    /* Moving the dinamic grid */
                    self._applyingMovementLeftRight(leftDataNew);
                }
                
                
                /* Setting the changes in the CONTAINER DIV */
                self.columnsTopCellsLeft = leftDataNew;
                self.scrollBottomDragLeft = leftScrollNew;
                
                leftDataNew = -1*leftDataNew + "px";
                leftScrollNew = leftScrollNew + "px";
                
                self.$columnsTopCells.css("left", leftDataNew);
                self.$dataCells.css("left", leftDataNew);
                self.$scrollBottomDrag.css("left", leftScrollNew);
                
            }

            // TOP
            if (moveState.moveTop) {
                var topDataNew = 0;
                var topDataMax = self.dataCellsHeight - self.dataHeight;
                var topScrollNew = 0;                
                
                if (self.dataHeight < self.dataCellsHeight) {
                    var diffY = e.pageY - moveState.moveStartY;
                    var topData = self._parseIntPositive(self.columnsLeftCellsTop);
                    var topScroll = self._parseIntPositive(self.scrollRightDragTop);
                    
                    
                    if (moveState.pressedScroll) {
                        topScrollNew = topScroll + diffY;
                        if (topScrollNew < 0) {
                            topScrollNew = 0;
                        } else if (topScrollNew > self.scrollRightMaxTop) {
                            topScrollNew = self.scrollRightMaxTop;
                        }

                        var percentScrolled = topScrollNew / self.scrollRightMaxTop;
                        topDataNew = percentScrolled * topDataMax;
                    } else {
                        topDataNew = topData - diffY;

                        if (topDataNew < 0) {
                            topDataNew = 0;
                        } else if (topDataNew > topDataMax) {
                            topDataNew = topDataMax;
                        }
                        
                        var percentScrolled = topDataNew / topDataMax;
                        topScrollNew = percentScrolled * self.scrollRightMaxTop;
                    }
                    
                    /* Moving the dinamic grid */
                    self._applyingMovementTopBottom(topDataNew);
                }
                
                self.columnsLeftCellsTop = topDataNew;
                self.scrollRightDragTop = topScrollNew;
                
                topDataNew = -1*topDataNew + "px";
                topScrollNew = topScrollNew + "px";
                
                self.$columnsLeftCells.css("top", topDataNew);
                self.$dataCells.css("top", topDataNew);
                self.$scrollRightDrag.css("top", topScrollNew);   
                
            }

            // RESTART
            moveState.moveStartX = e.pageX;
            moveState.moveStartY = e.pageY;
            
            moveState.moveMoving = false;
        },

        
        
        /********************************************************************************
         * AUX FUNCTIONS
         *******************************************************************************/
        /* ------------------------------------------------
         * GRID
         * --------------------------------------------- */
        _isEnoughSpaceInTheBottom : function() {
            var self = this;
            var pxTop = self.gridTopOffset + self.$grid.height();
            var pxMaxTop = self.dataCellsHeight - self.$gridElement.height();
            
            return pxTop <= pxMaxTop;
        },

        _isEnoughSpaceInTheTop : function() {
            var self = this;
            
            return Math.abs(self.gridTopOffset) >= self.$gridElement.height();
        },
        
        _isEnoughSpaceInTheRight : function() {
            var self = this;
            var pxleft = self.gridLeftOffset + self.$grid.width();
            var pxMaxLeft = self.dataCellsWidth - self.$gridElement.width();
            
            return pxleft <= pxMaxLeft;
        },
        
        _isEnoughSpaceInTheLeft : function() {
            var self = this;
            
            return Math.abs(self.gridLeftOffset) >= self.$gridElement.width();
        },
        
        _isStepWiderThanGridWidth : function(leftDataNew) {
            var self = this;
            var step = Math.abs(leftDataNew - self.gridLeftOffset);
            return step >= self.$grid.width();
        },
        
        _isStepHigherThanGridHeight : function(topDataNew) {
            var self = this;
            var step = Math.abs(topDataNew - self.gridTopOffset);
            return step > self.$grid.height();
        },
        
        _calculateNextId : function(section, lastId) {
            var self = this;
            var dim = -1;
            var rep = -1;
            switch (section) {
                case "top":
                    dim = parseInt(lastId.substr(4,1));
                    rep =  parseInt(lastId.substr(6));
                break;
                case "left":
                    dim = parseInt(lastId.substr(5,1));
                    rep =  parseInt(lastId.substr(7));
                break;
            }
            rep++;
            
            return section+"-"+dim+"-"+rep;
        },
        
        _calculatePreviousId : function(section, firstId) {
            var self = this;
            var dim = -1;
            var rep = -1;
            switch (section) {
                case "top":
                    dim = parseInt(firstId.substr(4,1));
                    rep =  parseInt(firstId.substr(6));
                break;
                case "left":
                    dim = parseInt(firstId.substr(5,1));
                    rep =  parseInt(firstId.substr(7));
                break;
            }
            rep--;
            
            return section+"-"+dim+"-"+rep;
        },
        
        
        /* ------------------------------------------------
         * OTHERS
         * --------------------------------------------- */
        _value : function() {
            var val = this.options.value;
            // normalize invalid value
            if (typeof val !== "number") {
                val = 0;
            }
            return Math.min(this.options.max, Math.max(this.min, val));
        },

        _measureCellPaddingAndBorder : function() {
            var self = this,
                h = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ],
                v = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ],
                size = 4;

            var tempDivContainer = $("<div style='visibility:hidden'></div>").appendTo(self.$dataset);
            var tempDivCell = $("<div class='dataset-cell-container'>-</div>").appendTo(tempDivContainer);
            var tempDivLeft = $("<div class='dataset-columns-left'></div>").appendTo(tempDivContainer);
            var tempDivLeftContainer = $("<div class='dataset-columns-container'>-</div>").appendTo(tempDivLeft);
            var tempDivTop = $("<div class='dataset-columns-top'></div>").appendTo(tempDivContainer);
            var tempDivTopContainer = $("<div class='dataset-columns-container'>-</div>").appendTo(tempDivTop);
            self.cellContainerWidthDiff = self.cellContainerHeightDiff = self.columnsLeftContainerWidthDiff = self.columnsLeftContainerHeightDiff = self.columnsTopContainerWidthDiff = self.columnsTopContainerHeightDiff = 0;
            for (var i = 0; i < size; i++) {
                self.cellContainerWidthDiff += parseFloat(tempDivCell.css(h[i])) || 0;                
                self.cellContainerHeightDiff += parseFloat(tempDivCell.css(v[i])) || 0;
                
                self.columnsLeftContainerWidthDiff += parseFloat(tempDivLeftContainer.css(h[i])) || 0;                
                self.columnsLeftContainerHeightDiff += parseFloat(tempDivLeftContainer.css(v[i])) || 0;
                
                self.columnsTopContainerWidthDiff += parseFloat(tempDivTopContainer.css(h[i])) || 0;                
                self.columnsTopContainerHeightDiff += parseFloat(tempDivTopContainer.css(v[i])) || 0;
            }
            tempDivContainer.remove();
        },
        
        _resetMoveState : function() {
            var self = this,
                moveState = self.moveState;
            
            moveState.moveEnable = false;
            moveState.moveMoving = false;
            moveState.moveStartX = 0;
            moveState.moveStartY = 0;
            moveState.moveTop = false;
            moveState.moveLeft = false;
            moveState.pressedScroll = false;
        },
        
        _computeCellHeightLeft: function(element, columnOption) {
            var self = this;

            var height = self.dimensionHeight[element.dim.id];
            if (height == undefined) {                
                var sizeDimension = columnOption.dimensions.length;
                
                height = columnOption.height;
                if (element.dimPos != sizeDimension - 1) { // IF NOT IS LAST
                    var total = 1;
                    for (var i = sizeDimension - 1; i > element.dimPos; i--) {
                        total = total * columnOption.dimensions[i].representations.length;
                    }
                    height = total * columnOption.height;
                }
                self.dimensionHeight[element.dim.id] = height;
            }            
            return height;
        },
        
        _computeCellHeightTop: function(element, columnOption) {
            //var self = this;
            return columnOption.height;
        },
        
        _computeCellWidthLeft: function(element, columnOption) {
            return columnOption.width;
        },

        _computeCellWidthTop: function(element, columnOption) {
            var self = this;
            
            var width = self.dimensionWidth[element.dim.id];
            if (width == undefined) {                
                var sizeDimension = columnOption.dimensions.length;
                
                width = columnOption.width;
                if (element.dimPos != sizeDimension - 1) { // IF NOT IS LAST
                    var total = 1;
                    for (var i = sizeDimension - 1; i > element.dimPos; i--) {
                        total = total * columnOption.dimensions[i].representations.length;
                    }
                    width = total * columnOption.width;
                }
                self.dimensionWidth[element.dim.id] = width;
            }            
            return width;
        },
        
        _computeColumnTopAttributes: function() {
            var self = this,
                columnTop = self.options.columnTop,
                numDimensions = columnTop.dimensions.length,
                total = 1;
                
            // Initialization
            self.columnsTopMaxRows = numDimensions;
            self.columnsTopMaxColumns = 0;
            
            // Maximum number of columns
            for (var i = numDimensions - 1; i >= 0; i--) {
                total = total * columnTop.dimensions[i].representations.length;
            }
            self.columnsTopMaxColumns = total;
        },
        
        
        _computeColumnLeftAttributes: function() {
            var self = this,
                columnLeft = self.options.columnLeft,
                numDimensions = columnLeft.dimensions.length,
                total = 1;
                
            // Initialization
            self.columnsLeftMaxRows = 0;
            self.columnsLeftMaxColumns = numDimensions;
                
            
            // Maximum number of rows
            for (var i = numDimensions - 1; i >= 0; i--) {
                total = total * columnLeft.dimensions[i].representations.length;
            }
            self.columnsLeftMaxRows = total;
        },
        
        
        /********************************************************************************
         * AUX EXTERNAL FUNCTIONS
         *******************************************************************************/
        _firstPossibleSize : function(initialDivisibleNumber, numberToDivide, restriction, forward) {
            if (initialDivisibleNumber > numberToDivide) {
                return numberToDivide; // The initialDivisible number must be smaller
            }
            else {
                var toret = Math.round(initialDivisibleNumber);
                var temp = -1;
                var temp2 = -1;
                var found = false;
                while (!found) {
                    temp = parseInt(numberToDivide % toret);
                    temp2 = parseInt(toret % restriction);
                    if ((temp == 0) && (temp2 == 0)) {
                        found = true;
                    }
                    else
                        if (forward)
                            toret++;
                        else
                            toret--;
                };
                
                return toret;
            }
        },
        
        // We try to find the first number that divides enterely "numberToDivide"
        // starting in "initialDivisibleNumber"
        _firstDivisibleElement : function(numberToDivide, initialDivisibleNumber, forward) {
            if (initialDivisibleNumber > numberToDivide) {
                return numberToDivide; // The initialDivisible number must be smaller
            }
            else {
                var temp = -1;
                var found = false;
                while (!found) {
                    temp = numberToDivide % initialDivisibleNumber;
                    if (temp == 0) {
                        found = true;
                    }
                    else
                        if (forward)
                            initialDivisibleNumber++;
                        else
                            initialDivisibleNumber--;
                };
                
                return initialDivisibleNumber;
            }
        },

        // We will find the first multiple of initialNumber which is bigger than numberToReach
        // then, we will return the former one
        _firstMultipleElement : function(numberToReach, initialNumber) {
            var tempNumber = initialNumber;
            var i = 1;
            while (tempNumber < numberToReach) {
                tempNumber = initialNumber * i;
                i++;
            }
            
            return initialNumber * (i - 2);
        },
        
        _parseIntPositive : function(number) {
            number = parseInt(number, 10);
            if (isNaN(number)) {
                number = 0;
            }
            if (number < 0) {
                number = -1*number;
            }
            return number;
        },
        
        
        _parseIntNanIs0 : function(number) {
            number = parseInt(number, 10);
            if (isNaN(number)) {
                number = 0;
            }
            return number;
        },
        
        
        _parseIntFromCss : function(cssPx) {
            var intToRet = cssPx;
            if (intToRet == "auto")
                intToRet = "0px";
            intToRet = intToRet.substr(0, intToRet.length -2);
            
            intToRet = parseInt(intToRet, 10);
            if (isNaN(intToRet)) {
                intToRet = 0;
            }
            return intToRet;
        },
        
        
        sleep : function(ms) {
            var inicio = new Date().getTime();
            while ((new Date().getTime() - inicio) < ms){};
        },
        
        
        /********************************************************************************
         * INITIALIZING FUNCTIONS
         *******************************************************************************/
        _initializeAttributes : function() {
            var self = this;
            
            self.cellContainerWidthDiff = 0;
            self.cellContainerHeightDiff = 0;
            self.columnsLeftContainerWidthDiff = 0;                
            self.columnsLeftContainerHeightDiff = 0;
            self.columnsTopContainerWidthDiff = 0;                
            self.columnsTopContainerHeightDiff = 0;
            self.absoluteCellMinWidth = 0;

            self.uid = "dataset_" + Math.round(1000000 * Math.random());
            self.columnsLeftWidth = 0;
            self.columnsLeftHeight = 0;
            self.columnsLeftCellsHeight = 0;
            self.columnsLeftCellsWidth = 0;
            self.columnsLeftMaxRows = 0;
            self.columnsLeftMaxColumns = 0;
            
            self.columnsTopHeight = 0;
            self.columnsTopWidth = 0;
            self.columnsTopCellsWidth = 0;
            self.columnsTopCellsHeight = 0;
            self.columnsTopMaxRows = 0;
            self.columnsTopMaxColumns = 0;
            
            self.dataHeight = 0;
            self.dataWidth = 0;
            self.dataCellsHeight = 0;
            
            self.scrollRightWidth = 10;
            self.scrollRightDragHeight = 0;
            self.scrollRightMaxTop = 0;
            
            self.scrollBottomHeight = 10;
            self.scrollBottomDragWidth = 0;
            self.scrollBottomMaxLeft = 0;
            
            self.columnsLeftCellsTop = 0;
            self.columnsTopCellsLeft = 0;
            
            self.scrollRightDragTop = 0;
            self.scrollBottomDragLeft = 0;

            self.gridTopOffset = 0;
            self.gridLeftOffset = 0;
            self.gridBorder = true;
            self.numGridsElementsPerGridHeight = 0;
            self.numGridsElementsPerGridWidth = 0;
            self.numCurrentGridElemPerWidth = 0;
            self.numCurrentGridElemPerHeight = 0;
            

            self.moveState = {
                moveEnable: false,
                moveMoving: false,
                moveStartX: 0,
                moveStartY: 0,
            
                moveTop: false,
                moveLeft: false,
                pressedScroll: false,
            };
        },
        
        
        _initializeStructure : function() {
            var self = this;
            var el = self.element;
            
            self.$root = $("<div class='dataset' />").appendTo(el);
            self.$root.addClass("ui-widget");

            self.$title = $("<h3 class='left'>"+self.options.title.text+"</h3>").appendTo(self.$root);
            
            self.$root.append("<div class='clearfix'></div>");
            self.$root.append("<div class='sep-2'></div>");
            
            self.$fieldset = $("<fieldset class='left'/>").appendTo(self.$root);
            self.$dataset = $("<div />").appendTo(self.$fieldset);
            
            self.$root.append("<div class='clearfix'></div>");

            self.$separator = $("<div class='dataset-separator'><div class='dataset-separator-container'>&nbsp;</div></div>").appendTo(self.$dataset);

            self.$columnsTop = $("<div class='dataset-columns-top' />").appendTo(self.$dataset);
            self.$columnsTopContainer = $("<div class='dataset-columns-container' />").appendTo(self.$columnsTop);
            self.$columnsTopCells = $("<div class='dataset-columns-cells' />").appendTo(self.$columnsTopContainer);

            self.$columnsLeft = $("<div class='dataset-columns-left' />").appendTo(self.$dataset);
            self.$columnsLeftContainer = $("<div class='dataset-columns-container' />").appendTo(self.$columnsLeft);
            self.$columnsLeftCells = $("<div class='dataset-columns-cells' />").appendTo(self.$columnsLeftContainer);

            self.$data = $("<div class='dataset-data' />").appendTo(self.$dataset);
            self.$dataShadow = $("<div class='shadow' />").appendTo(self.$data);
            self.$dataSpinner = $("<div class='spinner'><img src='" + STAT4YOU.resourceContext + "images/loadingSpinner.gif' /></div>").appendTo(self.$dataShadow);
            self.$dataContainer = $("<div class='dataset-data-container' />").appendTo(self.$data);
            self.$dataCells = $("<div class='dataset-data-cells' />");
            
            self.$scrollRight = $("<div class='dataset-scroll-right'/>").appendTo(self.$dataset);
            self.$scrollRightCapTop = $("<div class='dataset-scroll-cap dataset-scroll-cap-top'/>").appendTo(self.$scrollRight);
            self.$scrollRightTrack = $("<div class='dataset-scroll-track'/>").appendTo(self.$scrollRight);
            self.$scrollRightDrag = $("<div class='dataset-scroll-right-drag'><div class='dataset-scroll-right-drag-top'></div><div class='dataset-scroll-right-drag-bottom'></div></div>").appendTo(self.$scrollRightTrack);
            self.$scrollRightCapLeft = $("<div class='dataset-scroll-cap dataset-scroll-cap-bottom'/>").appendTo(self.$scrollRight);
            
            self.$scrollBottom = $("<div class='dataset-scroll-bottom'/>").appendTo(self.$dataset);
            self.$scrollBottomCapTop = $("<div class='dataset-scroll-cap dataset-scroll-cap-left'/>").appendTo(self.$scrollBottom);
            self.$scrollBottomTrack = $("<div class='dataset-scroll-track'/>").appendTo(self.$scrollBottom);
            self.$scrollBottomDrag = $("<div class='dataset-scroll-bottom-drag'><div class='dataset-scroll-bottom-drag-left'></div><div class='dataset-scroll-bottom-drag-right'></div></div>").appendTo(self.$scrollBottomTrack);
            self.$scrollBottomCapLeft = $("<div class='dataset-scroll-cap dataset-scroll-cap-right'/>").appendTo(self.$scrollBottom);
        },
        
        
        _initializeSizes : function() {
            var self = this;
            var options = self.options;
            
            self.columnsLeftWidth = options.columnLeft.width * self.columnsLeftMaxColumns;
            self.columnsLeftHeight = options.height - options.columnTop.height;
            self.columnsLeftCellsWidth = options.columnLeft.width * self.columnsLeftMaxColumns;
            self.columnsLeftCellsHeight = options.columnLeft.height * self.columnsLeftMaxRows;            
            
            // Si el width de tus hijos es menor -> width de los hijos
            self.columnsTopWidth = options.width - self.columnsLeftWidth;
            self.columnsTopHeight = options.columnTop.height * options.columnTop.dimensions.length;
            self.columnsTopCellsWidth = options.columnTop.width * self.columnsTopMaxColumns;
            self.columnsTopCellsHeight = options.columnTop.height * self.columnsTopMaxRows;
            
            self.dataHeight = self.columnsLeftHeight;
            self.dataWidth = self.columnsTopWidth;
            self.dataCellsHeight = self.columnsLeftCellsHeight;
            self.dataCellsWidth = self.columnsTopCellsWidth;
            
            self.scrollRightWidth = 10;
            self.scrollBottomHeight = 10;
        },
        
        
        _initializeEventListeners : function() {
            var self = this;
            
            // DataSet: Column Left
            self.$columnsLeftCells.mousedown(function(e) {                
                self._resetMoveState();
                self.moveState.moveTop = true;
                
                self._mouseDown(e);
            });

            // DataSet: Column Top
            self.$columnsTopCells.mousedown(function(e) {
                self._resetMoveState();
                self.moveState.moveLeft = true;
                
                self._mouseDown(e);
            });

            // DataSet: Data
            self.$data.mousedown(function(e) {
                self._resetMoveState();
                self.moveState.moveTop = true;
                self.moveState.moveLeft = true;
                
                self._mouseDown(e);
            });
            
            // DataSet: Scroll (Right)
            self.$scrollRightDrag.mousedown(function(e) {
                self._resetMoveState();
                self.moveState.moveTop = true;
                self.moveState.pressedScroll = true;
                
                self._mouseDown(e);
            });
            
            
            // DataSet: Scroll (Bottom)
            self.$scrollBottomDrag.mousedown(function(e) {
                self._resetMoveState();
                self.moveState.moveLeft = true;
                self.moveState.pressedScroll = true;
                
                self._mouseDown(e);
            });
        },
        
        
        _initializeScrollBars : function() {
            var self = this;

            // scroll right
            if (self.dataHeight < self.dataCellsHeight) {
                self.scrollRightDragHeight = self.dataHeight * (self.dataHeight / self.dataCellsHeight);
                // Mouse wheel
                self.$dataset.bind('mousewheel', {self: self}, self._mouseWheelMove);
                self.$scrollRightTrack.bind('click', {self: self}, self._stepRightScroll);
                self.$scrollRightDrag.bind('click', function (e) {
                                                        e.stopPropagation();
                                                    });
            }
            else {
                self.$scrollRight.hide();
            }
            if (self.scrollRightDragHeight < 20) {
                self.scrollRightDragHeight  = 20;
            }
            self.scrollRightMaxTop = self.dataHeight - self.scrollRightDragHeight - self.scrollBottomHeight;
            
            self.dataWidth = self.dataWidth -  self.scrollRightWidth;
            self.columnsTopWidth = self.columnsTopWidth -  self.scrollRightWidth;

            // scroll bottom
            if (self.dataWidth < self.dataCellsWidth) {
                self.scrollBottomDragWidth = self.dataWidth * (self.dataWidth / self.dataCellsWidth);
                // Mouse wheel
                self.$scrollBottomTrack.bind('click', {self: self}, self._stepBottomScroll);
                self.$scrollBottomDrag.bind('click', function (e) {
                    e.stopPropagation();
                });
            }
            else {
                self.$scrollBottom.hide();
            }
            if (self.scrollBottomDragWidth < 20) {
                self.scrollBottomDragWidth = 20;
            }
            // Probably we will need to change the margin-right in the bottom scroll CSS and then uncomment the
            // following line
            self.scrollBottomMaxLeft = self.dataWidth - self.scrollBottomDragWidth;
        },
        
        
        _settingFurtherSizes : function() {
            var self = this;
            var options = self.options;
            
            self.dataHeight = self.dataHeight -  self.scrollBottomHeight;
            self.columnsLeftHeight = self.columnsLeftHeight -  self.scrollBottomHeight;
            
            // Set Size
            self.$dataset.width(options.width);
            self.$dataset.height(options.height);
            
            self.$separator.width(self.columnsLeftWidth);
            self.$separator.height(self.columnsTopHeight);
            
            self.$columnsTop.width(self.columnsTopWidth);
            self.$columnsTop.height(self.columnsTopHeight);
            self.$columnsTopCells.width(self.columnsTopCellsWidth);
            self.$columnsTopCells.height(self.columnsTopCellsHeight);
            self.$columnsTopContainer.width(self.columnsTopWidth - self.columnsTopContainerWidthDiff);
            self.$columnsTopContainer.height(self.columnsTopCellsHeight - self.columnsTopContainerHeightDiff);
            
            self.$columnsLeft.width(self.columnsLeftWidth);
            self.$columnsLeft.height(self.columnsLeftHeight);
            self.$columnsLeftCells.width(self.columnsLeftCellsWidth);
            self.$columnsLeftCells.height(self.columnsLeftCellsHeight);
            self.$columnsLeftContainer.width(self.columnsLeftWidth - self.columnsLeftContainerWidthDiff);
            self.$columnsLeftContainer.height(self.columnsLeftHeight - self.columnsLeftContainerHeightDiff);
            
            self.$data.width(self.dataWidth);
            self.$data.height(self.dataHeight);
            self.$dataCells.width(self.columnsTopCellsWidth);
            self.$dataCells.height(self.columnsLeftCellsHeight);            
            self.$dataContainer.width(self.dataWidth - self.columnsTopContainerWidthDiff);
            self.$dataContainer.height(self.dataHeight - self.columnsLeftContainerHeightDiff);
            

            self.$scrollRight.width(self.scrollRightWidth);
            self.$scrollRight.height(self.dataHeight);
            
            self.$scrollRightTrack.height(self.dataHeight);
            self.$scrollRightDrag.height(self.scrollRightDragHeight);
            self.$scrollRightDrag.width(self.scrollRightWidth);
            

            self.$scrollBottom.height(self.scrollBottomHeight);
            self.$scrollBottom.width(self.dataWidth);
            
            self.$scrollBottomTrack.width(self.dataWidth);
            self.$scrollBottomDrag.width(self.scrollBottomDragWidth);
            self.$scrollBottomDrag.height(self.scrollBottomHeight);
        },
        
    });

}(jQuery));