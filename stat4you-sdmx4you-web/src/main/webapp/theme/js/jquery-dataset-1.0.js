/*
 * jQuery UI Dataset 1.0.0
 *
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */

(function($) {

    $.widget("ui.dataset", {
        version : "1.0.0",
        options : {
            width : 500,
            height : 500,
            columnTop : {
                width : 150,
                height : 25,
                categories: [ {
                    id : "",
                    name : "",
                    toolTip : null,
                    cssClass : null,
                } ]
            },
            columnLeft : {
                width : 150,
                height : 25,
                categories: [ {
                    id : "",
                    name : "",
                    toolTip : null,
                    cssClass : null,
                } ]
            },
            data : [ {
                id : "",
                value : ""
            } ],
        },

        _create : function() {
            var self = this;
            var el = self.element;
            var options = self.options;

            // Create Attributes
            self.verticalCellWidthDiff = 0;
            self.verticalCellHeightDiff = 0;
            self.absoluteCellMinWidth = 0;

            self.uid = "dataset_" + Math.round(1000000 * Math.random());
            self.columnsLeftWidth = 0;
            self.columnsLeftHeight = 0;
            self.columnsLeftCellsHeight = 0;
            self.columnsLeftCellsWidth = 0;
            
            self.columnsTopHeight = 0;
            self.columnsTopWidth = 0;
            self.columnsTopCellsWidth = 0;
            self.columnsTopCellsHeight = 0;
            
            self.dataHeight = 0;
            self.dataWidth = 0;
            self.dataCellsHeight = 0;
            
            self.scrollRightWidth = 10;
            self.scrollRightDragHeight = 0;
            self.scrollRightMaxTop = 0;
            
            
            
            self.columnsLeftCellsTop = 0;
            self.scrollRightDragTop = 0;
            
            
            
            
            
            

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
            self.$dataset = $("<div class='dataset' />").appendTo(el);
            self.$dataset.addClass("ui-widget");

            self.$separator = $("<div class='dataset-separator'><div class='dataset-separator-container'>&nbsp;</div></div>").appendTo(self.$dataset);

            self.$columnsTop = $("<div class='dataset-columns-top' />").appendTo(self.$dataset);
            self.$columnsTopContainer = $("<div class='dataset-columns-top-container' />").appendTo(self.$columnsTop);
            self.$columnsTopCells = $("<div class='dataset-columns-top-cells' />").appendTo(self.$columnsTopContainer);

            self.$columnsLeft = $("<div class='dataset-columns-left' />").appendTo(self.$dataset);
            self.$columnsLeftContainer = $("<div class='dataset-columns-left-container' />").appendTo(self.$columnsLeft);
            self.$columnsLeftCells = $("<div class='dataset-columns-left-cells' />").appendTo(self.$columnsLeftContainer);

            self.$data = $("<div class='dataset-data' />").appendTo(self.$dataset);
            self.$dataContainer = $("<div class='dataset-data-container' />").appendTo(self.$data);
            self.$dataCells = $("<div class='dataset-data-cells' />").appendTo(self.$dataContainer);
            
            self.$scrollRight = $("<div class='dataset-scroll-right'/>").appendTo(self.$dataset);
            self.$scrollRightCapTop = $("<div class='dataset-scroll-cap dataset-scroll-cap-top'/>").appendTo(self.$scrollRight);
            self.$scrollRightTrack = $("<div class='dataset-scroll-track'/>").appendTo(self.$scrollRight);
            self.$scrollRightDrag = $("<div class='dataset-scroll-drag'><div class='dataset-scroll-drag-top'></div><div class='dataset-scroll-drag-bottom'></div></div>").appendTo(self.$scrollRightTrack);
            self.$scrollRightCapLeft = $("<div class='dataset-scroll-cap dataset-scroll-cap-bottom'/>").appendTo(self.$scrollRight);
            self.$scrollBottom = $("<div class='dataset-scroll-bottom'>&nbsp;</div").appendTo(self.$dataset);

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
            
            // DataSet: Scroll
            self.$scrollRightDrag.mousedown(function(e) {
                self._resetMoveState();
                self.moveState.moveTop = true;
                self.moveState.pressedScroll = true;
                
                self._mouseDown(e);
            });

            self._createColumnTop();
            self._createColumnLeft();
            self._createData();

            // vertical cells and cells may have different padding/border skewing width calculations (box-sizing, hello?)
            // calculate the diff so we can set consistent sizes
            self._measureCellPaddingAndBorder();
            
            // DATA
            // Compute Size
            self.columnsLeftWidth = options.columnLeft.width;
            self.columnsLeftHeight = options.height - options.columnTop.height;
            self.columnsLeftCellsWidth = options.columnLeft.width;
            self.columnsLeftCellsHeight = options.columnLeft.categories.length * options.columnLeft.height;            
            
            self.columnsTopWidth = options.width - options.columnLeft.width;
            self.columnsTopHeight = options.columnTop.height;
            self.columnsTopCellsWidth = options.columnTop.categories.length * options.columnTop.width;
            self.columnsTopCellsHeight = options.columnTop.height;
            
            self.dataHeight = self.columnsLeftHeight;
            self.dataWidth = self.columnsTopWidth;            
            self.dataCellsHeight = self.columnsLeftCellsHeight;
            self.dataCellsWidth = self.columnsTopCellsWidth;
            
            self.scrollRightWidth = 10;

            // scroll
            if (self.dataHeight < self.dataCellsHeight) {
                self.scrollRightDragHeight = self.dataHeight * (self.dataHeight / self.dataCellsHeight);
            }            
            if (self.scrollRightDragHeight < 20) {
                self.scrollRightDragHeight  = 20;
            }
            self.scrollRightMaxTop = self.dataHeight - self.scrollRightDragHeight;

            
            self.dataWidth = self.dataWidth -  self.scrollRightWidth;
            self.columnsTopWidth = self.columnsTopWidth -  self.scrollRightWidth;
            
            
            // Set Size
            self.$dataset.width(options.width);
            self.$dataset.height(options.height);
            
            self.$separator.width(self.columnsLeftWidth);
            self.$separator.height(self.columnsTopHeight);
            
            self.$columnsTop.width(self.columnsTopWidth);
            self.$columnsTop.height(self.columnsTopHeight);
            self.$columnsTopCells.width(self.columnsTopCellsWidth);
            self.$columnsTopCells.height(self.columnsTopCellsHeight);
            
            self.$columnsLeft.width(self.columnsLeftWidth);
            self.$columnsLeft.height(self.columnsLeftHeight);
            self.$columnsLeftCells.width(self.columnsLeftCellsWidth);
            self.$columnsLeftCells.height(self.columnsLeftCellsHeight);
            self.$columnsLeftContainer.height(self.columnsLeftHeight - self.verticalCellHeightDiff);
            
            self.$data.width(self.dataWidth);
            self.$data.height(self.dataHeight);            
            self.$dataContainer.height(self.dataHeight - self.verticalCellHeightDiff);

            self.$scrollRight.width(self.scrollRightWidth);
            self.$scrollRight.height(self.dataHeight);
            
            self.$scrollRightTrack.height(self.dataHeight);
            self.$scrollRightDrag.height(self.scrollRightDragHeight);
            self.$scrollRightDrag.width(self.scrollRightWidth);
        },

        _destroy : function() {
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
            this._super("_setOption", key, value);
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

            var tempDiv = $("<div class='dataset-columns-left-container' style='visibility:hidden'>-</div>").appendTo(self.$dataset);
            self.verticalCellWidthDiff = self.verticalCellHeightDiff = 0;
            for (var i = 0; i < size; i++) {
                self.verticalCellWidthDiff += parseFloat(tempDiv.css(h[i])) || 0;
                
                self.verticalCellHeightDiff += parseFloat(tempDiv.css(v[i])) || 0;
            }
            tempDiv.remove();
        },

        _createColumnTop : function() {
            var self = this,
                options = self.options,
                size = options.columnTop.categories.length;

            self.$columnsTopCells.empty();

            for (var i = 0; i < size; i++) {
                var col = options.columnTop.categories[i];

                $("<div class='dataset-columns-top-cell' id='" + self.uid + col.id + "' />")
                    .html("<div class='dataset-columns-top-cell-container'><span class='dataset-cell-name'>" + col.name + "</span></div>")
                    .width(options.columnTop.width).height(options.columnTop.height).attr("title", col.toolTip || col.name || "")
                    .data("fieldId", col.id)
                    .addClass(col.cssClass || "")
                    .appendTo(self.$columnsTopCells);
            }

        },

        _createColumnLeft : function() {
            var self = this,
                options = self.options,
                size = options.columnLeft.categories.length;

            self.$columnsLeftCells.empty();
            
            for (var i = 0; i < size; i++) {
                var col = options.columnLeft.categories[i];

                $("<div class='dataset-columns-left-cell' id='" + self.uid + col.id + "' />")
                    .html("<div class='dataset-columns-left-cell-container'><span class='dataset-cell-name'>" + col.name + "</span></div>")
                    .width(options.columnLeft.width).height(options.columnLeft.height).attr("title", col.toolTip || col.name || "")
                    .data("fieldId", col.id)
                    .addClass(col.cssClass || "")
                    .appendTo(self.$columnsLeftCells);
            }
        },

        _createData : function() {
            var self = this,
                options = self.options,
                i = 0,
                j = 0,
                k = 0,
                colH = null,
                colV = null,
                partialId = "",
                observation = null,
                value = null,
                sizeLeft = options.columnLeft.categories.length,
                sizeTop = options.columnTop.categories.length,
                cellWidth = options.columnTop.width,
                cellHeight = options.columnLeft.height;

            
            self.$dataCells.empty();

            var data = $.evalJSON($.toJSON(options.data));

            for (i = 0; i < sizeLeft; i++) {
                colH = options.columnLeft.categories[i];

                for (j = 0; j < sizeTop; j++) {
                    colV = options.columnTop.categories[j];
                    partialId = colH.id + "#" + colV.id;

                    for (k = 0; k < data.length; k++) {
                        observation = data[k];
                        if (partialId == observation.id) {
                            break;
                        }
                    }

                    if (k != data.length) { // Found It
                        value = observation.value;
                        data.splice(k, 1); // Remove old
                    } else {
                        value = "";
                    }

                    var col = $("<div class='dataset-data-cell' id='" + self.uid + "#" + colH.id + "#" + colV.id + "' + />")
                                .html("<div class='dataset-data-cell-container'><span class='dataset-data-value'>" + value + "</span></div>")
                                .width(cellWidth).height(cellHeight)
                                .appendTo(self.$dataCells);

                    if (j == 0) {
                        col.addClass("dataset-data-cell-first");
                    }
                    if (j == options.columnTop.categories.length - 1) {
                        col.addClass("dataset-data-cell-last");
                    }
                }
            }
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
            
            $(document.body).disableTextSelect()            
                            .bind("mouseup.dataset", mouseUp)
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

            $(document.body).enableTextSelect()           
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
                var leftNew = 0;
                var columnsTopWidth = self.columnsTopWidth;
                var columnsTopCellsWidth = self.columnsTopCellsWidth;
                if (self.columnsTopWidth < columnsTopCellsWidth) {
                    var diffX = moveState.moveStartX - e.pageX;

                    var leftMax = columnsTopWidth - columnsTopCellsWidth; // Negativo
                    var left = parseInt(self.$columnsTopCells.css("left"));
                    if (isNaN(left)) {
                        left = 0;
                    }
                    
                    leftNew = left - diffX;

                    if (leftNew > 0) {
                        leftNew = 0;
                    } else if (leftNew < leftMax) { // Negativo
                        leftNew = leftMax;
                    }
                }
                leftNew = leftNew + "px";
                self.$columnsTopCells.css("left", leftNew);
                self.$dataCells.css("left", leftNew);
            }

            // TOP
            if (moveState.moveTop) {
                var topDataNew = 0;
                var topScrollNew = 0;
                var dataLeftMaxTop = self.dataCellsHeight - self.dataHeight;
                
                if (self.dataHeight < self.dataCellsHeight) {
                    var diffY = e.pageY - moveState.moveStartY;
                    
                    //var topData = self._parseIntPositive(self.$columnsLeftCells.css("top"));
                    //var topScroll = self._parseIntPositive(self.$scrollRightDrag.css("top"));
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
                        topDataNew = percentScrolled * dataLeftMaxTop;
                    } else {
                        topDataNew = topData - diffY;

                        if (topDataNew < 0) {
                            topDataNew = 0;
                        } else if (topDataNew > dataLeftMaxTop) {
                            topDataNew = dataLeftMaxTop;
                        }
                        
                        var percentScrolled = topDataNew / dataLeftMaxTop;
                        topScrollNew = percentScrolled * self.scrollRightMaxTop;
                    }
                }
                
                topDataNew = -1*topDataNew + "px";
                topScrollNew = topScrollNew + "px";
                
                self.columnsLeftCellsTop = topDataNew;
                self.scrollRightDragTop = topScrollNew;
                
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
    });

}(jQuery));