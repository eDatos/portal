/*
 * jQuery UI Dataset Table 1.0.0
 *
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function($) {

    $.widget("ui.datasetTable", {
        version : "1.0.0",
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

        _create : function() {
            var self = this;
            var el = self.element;
            var options = self.options;

            // Create Attributes
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
            self.scrollRightDragTop = 0;
            self.scrollbottomDragLeft = 0;
            
            

            self.moveState = {
                moveEnable: false,
                moveMoving: false,
                moveStartX: 0,
                moveStartY: 0,
            
                moveTop: false,
                moveLeft: false,
                pressedScroll: false,
            };


            // DATA SET
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
            self.$dataSpinner = $("<div class='spinner'><img src='" + App.resourceContext + "images/loadingSpinner.gif' /></div>").appendTo(self.$dataShadow);
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

            
            //Disabling text selection
            self.$dataset.disableTextSelect();
            
            
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
            

            // vertical cells and cells may have different padding/border skewing width calculations (box-sizing, hello?)
            // calculate the diff so we can set consistent sizes
            self._measureCellPaddingAndBorder();

            /* CREATING STRUCTURE */
            self._createColumnTop();
            self._createColumnLeft();
            
            /* SPINNER */
            self.$scrollBottom.hide();
            self.$scrollRight.hide();
            


            
            // DATA
            // Compute Size
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
            
            // scroll right
            if (self.dataHeight < self.dataCellsHeight) {
                self.scrollRightDragHeight = self.dataHeight * (self.dataHeight / self.dataCellsHeight);
                // Mouse wheel
                self.$dataset.bind('mousewheel', {self: self}, self._mouseWheelMove);
                self.$scrollRightTrack.bind('click', {self: self}, self._stepScrollRight);
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
                self.$scrollBottomTrack.bind('click', {self: self}, self._stepScrollBottom);
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
            self.scrollBottomMaxLeft = self.dataWidth - self.scrollBottomDragWidth /*- self.scrollRightWidth*/;
            
            
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
            
            
            /* SPINNER */
            var tempTop = self.dataHeight / 2 - self.$dataSpinner.height() / 2;
            var tempLeft = self.dataWidth / 2- self.$dataSpinner.width() / 2;
            self.$dataSpinner.css("top", tempTop);
            self.$dataSpinner.css("left", tempLeft);
            self.$dataShadow.width(self.$data.width() - 2);
            self.$dataShadow.height(self.$data.height() - 2);
            
        },

        
        setData : function() {
            var self = this;
            /* LOADING THE DATA*/
            self._createData();

            /* SPINNER */
            self.$dataShadow.hide();
            self.$scrollBottom.show();
            self.$scrollRight.show();
        },
        
        sleep : function(ms) {
            var inicio = new Date().getTime();
            while ((new Date().getTime() - inicio) < ms){};
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
            self.$scrollRightTrack.unbind('click', self._stepScrollRight);
            self.$scrollRightDrag.unbind('click');
            self.$scrollBottomTrack.unbind('click', self._stepScrollBottom);
            self.$scrollBottomDrag.unbind('click');
            // widget destroy
            $.Widget.prototype.destroy.call(this);
        },

        _init : function() {
        },

        value : function(newValue) {
            if (newValue === undefined) {
                return this._value();
            }

            this._setOption("value", newValue);
            return this;
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

        _createColumnTop : function() {

            var self = this,
                options = self.options,
                columnTop = options.columnTop,
                sizeDimension = columnTop.dimensions.length,
                queue = [];

            self.$columnsTopCells.empty();
            self.columnsTopMaxRows = sizeDimension;
            self.columnsTopMaxColumns = 0;
            self.dimensionWidth = {};
            self.dimensionHeight = {};
            
            var element = {
                dim: null,
                dimPos: -1,
                representation: null,
                representationPos: -1,
            };
                
                // Init Element
            queue.push(element);
                
            while (queue.length > 0) {
                // SHIFT
                element = queue.shift();
                var dimPos = element.dimPos;
                    
                if (dimPos != -1) {
                    var col = element.representation;
                        
                    // DIMS
                    var height = self._computeCellHeightTop(element, columnTop);
                    heightContainer = height - self.cellContainerHeightDiff;
                        
                    var width = self._computeCellWidthTop(element, columnTop);
                    var widthContainer =  width - self.cellContainerWidthDiff; 

                    // HTML
                    $("<div class='dataset-cell' id='" + self.uid + col.id + "' style='width: " + width + "px; height: " + height + "px' />")
                        .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'>" + col.name + "</span></div>")
                        .attr("title", col.toolTip || col.name || "")
                        .addClass(col.cssClass || "")
                        .appendTo(self.$columnsTopCells);
                        
                    if (dimPos ==  sizeDimension - 1) {
                        self.columnsTopMaxColumns++;
                    }
                }

                // APPEND
                dimPos++;
                if (dimPos < sizeDimension) {
                    var dim = columnTop.dimensions[dimPos];
                    for (var i = 0; i < dim.representations.length; i++) {
                        var representation = dim.representations[i];    
                        element = $.extend({}, element);
                        element.dim = dim;
                        element.dimPos = dimPos;
                        element.representation = representation;
                        element.representationPos = i;
                        queue.push(element);        
                    }
                }
            }
        },

        _createColumnLeft : function() {
            var self = this,
                options = self.options,
                columnLeft = options.columnLeft,
                sizeDimension = columnLeft.dimensions.length,
                stack = [];
            
            self.$columnsLeftCells.empty();
            self.columnsLeftMaxRows = 0;
            self.columnsLeftMaxColumns = sizeDimension;
            self.dimensionHeight = {};
            
            var element = {
                dim: null,
                dimPos: -1,
                representation: null,
                representationPos: -1,
            };
            
            // Init Element
            stack.push(element);
            
            while (stack.length > 0) {
                // POP
                element = stack.pop();
                var dimPos = element.dimPos;
                
                if (dimPos != -1) {
                    var col = element.representation;
                    
                    // DIMS
                    var height = self._computeCellHeightLeft(element, columnLeft);
                    heightContainer = height - self.cellContainerHeightDiff;
                    
                    var width = columnLeft.width;
                    var widthContainer =  width - self.cellContainerWidthDiff; 

                    // HTML
                    $("<div class='dataset-cell' id='" + self.uid + col.id + "' style='width: " + width + "px; height: " + height + "px' />")
                        .html("<div class='dataset-cell-container'  style='width: " + widthContainer + "px; height: " + heightContainer + "px'><span class='dataset-cell-name'>" + col.name + "</span></div>")
                        .attr("title", col.toolTip || col.name || "")
                        .addClass(col.cssClass || "")
                        .appendTo(self.$columnsLeftCells);
                    
                    if (dimPos ==  sizeDimension - 1) {
                        self.columnsLeftMaxRows++;
                    }
                }

                // PUSH
                dimPos++;
                if (dimPos < sizeDimension) {
                    var dim = columnLeft.dimensions[dimPos];
                    for (var i = dim.representations.length - 1; i >= 0 ; i--) {
                        var representation = dim.representations[i];    
                        element = $.extend({}, element);
                        element.dim = dim;
                        element.dimPos = dimPos;
                        element.representation = representation;
                        element.representationPos = i;
                        stack.push(element);        
                    }
                }
            }
        },

        _createData : function() {
            var self = this,
                options = self.options,
                stack = [],            
                cellWidth = options.columnTop.width - self.cellContainerWidthDiff,
                cellHeight = options.columnLeft.height - self.cellContainerHeightDiff,
                datasource = options.datasource;
            
            var temp = "";

            // Time counter
            var initialTime = new Date().getTime();
            
            self.$dataCells.empty();
            
            var dimensions = options.columnLeft.dimensions.concat(options.columnTop.dimensions);
            var dimensionsSize = dimensions.length;

            var element = {
                dim: null,
                dimPos: -1,
                representation: null,
                representationPos: -1,
            };
            
            // Init Element
            stack.push(element);
            
            var idElements = {};
            var dimPos = null;
            var dimId = null;
            var catId = null;
            var value = null;
            while (stack.length > 0) {
                // POP
                element = stack.pop();
                dimPos = element.dimPos;
                
                if (dimPos != -1) {
                    dimId = element.dim.id;
                    catId = element.representation.id;
                    value = -1;
                    //idElements.splice(dimPos, 1, element.representation.id);
                    idElements[dimId] = catId;
                    if (dimPos == dimensionsSize - 1) {
                        //Calling the dataSource with the idElements
                        value = datasource(idElements);
                        
                        // Creating the ID
                        var id = "";
                        for (elem in idElements)
                            id += elem+"#";

                        
                        temp += "<div class='dataset-data-cell' id='" + self.uid + "#" + id + "' style='width: " + options.columnTop.width + "px; height: " + options.columnTop.height + "px' >" +
                        		"<div class='dataset-data-cell-container' style='width: " + cellWidth + "px; height: " + cellHeight + "px;'><span class='dataset-data-value'>" + value + "</span></div>" +
                        		"</div>";
                        /*
                        $("<div class='dataset-data-cell' id='" + self.uid + "#" + id + "' + />")
                              .html("<div class='dataset-data-cell-container' style='width: " + cellWidth + "px; height: " + cellHeight + "px;'><span class='dataset-data-value'>" + value + "</span></div>")
                              .width(options.columnTop.width).height(options.columnTop.height)
                              .appendTo(self.$dataCells);
                        */                       
                    }
                }

                // PUSH
                dimPos++;
                if (dimPos < dimensionsSize) {
                    var dim = dimensions[dimPos];
                    for (var i = dim.representations.length - 1; i >= 0 ; i--) {
                        var representation = dim.representations[i];    
                        element = $.extend({}, element);
                        element.dim = dim;
                        element.dimPos = dimPos;
                        element.representation = representation;
                        element.representationPos = i;
                        stack.push(element);        
                    }
                }
            }
            
            /* ADDING the temporal DOM to the real DOM tree */
            //self.$dataCells.appendTo(self.$dataContainer);
            $(temp).appendTo(self.$dataCells);
            self.$dataCells.appendTo(self.$dataContainer);

            // Time counter
            var finalTime = new Date().getTime();
            
            console.log("Tiempo (ms): %s", finalTime-initialTime);
        
        },

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
                }
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
        
        
        _stepScrollRight : function(event) {
            var self = event.data.self,
                moveState = self.moveState;
            
            var topScroll = self._parseIntPositive(self.scrollRightDragTop);
            var pace = self.scrollRightMaxTop / 4;
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
            
            var percentScrolled = topScrollNew / self.scrollRightMaxTop;
            topDataNew = percentScrolled * topDataMax;
            
            
            self.columnsLeftCellsTop = topDataNew;
            self.scrollRightDragTop = topScrollNew;
            
            topDataNew = -1*topDataNew + "px";
            topScrollNew = topScrollNew + "px";
            
            self.$columnsLeftCells.css("top", topDataNew);
            self.$dataCells.css("top", topDataNew);
            self.$scrollRightDrag.css("top", topScrollNew);
            
            moveState.moveStartY = event.pageY;
        },
        
        
        _stepScrollBottom : function(event) {
            var self = event.data.self,
                moveState = self.moveState;
            
            var leftScroll = self._parseIntPositive(self.scrollBottomDragLeft);
            var pace = self.scrollBottomMaxLeft / 4;
            // The pace should not be greater than the scroll "drag" element 
            if (pace > self.scrollBottomDragWidth)
                pace = self.scrollBottomDragWidth;
            var diff = event.pageX - self.$scrollBottomDrag.offset().left;
            
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
            
            var percentScrolled = leftScrollNew / self.scrollBottomMaxLeft;
            leftDataNew = percentScrolled * leftDataMax;
            
            
            self.columnsTopCellsLeft = leftDataNew;
            self.scrollBottomDragLeft = leftScrollNew;
            
            leftDataNew = -1*leftDataNew + "px";
            leftScrollNew = leftScrollNew + "px";
            
            self.$columnsTopCells.css("left", leftDataNew);
            self.$dataCells.css("left", leftDataNew);
            self.$scrollBottomDrag.css("left", leftScrollNew);
            
            moveState.moveStartX = event.pageX;
        }
        
    });

}(jQuery));