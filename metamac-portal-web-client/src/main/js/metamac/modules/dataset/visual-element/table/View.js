(function () {
    "use strict";

    App.namespace("App.Table.View");

    var Cell = App.Table.Cell,
        Size = App.Table.Size,
        Point = App.Table.Point,
        BodyZone = App.Table.BodyZone,
        RightScrollZone = App.Table.RightScrollZone,
        BottonScrollZone = App.Table.BottomScrollZone,
        LeftHeaderZone = App.Table.LeftHeaderZone,
        TopHeaderZone = App.Table.TopHeaderZone,
        Rectangle = App.Table.Rectangle,
        SpinnerZone = App.Table.SpinnerZone,
        Tooltip = App.components.tooltip.Tooltip;

    App.Table.View = function (options) {
        if (_.isString(options.el)) {
            this.canvas = document.getElementById(options.el);
        } else if (options.canvas) {
            this.canvas = options.canvas;
        }
        this.$canvas = $(this.canvas);
        this.dataSource = options.dataSource;
        this.delegate = options.delegate;

        if (this.canvas && this.canvas.getContext) {
            this.ctx = this.canvas.getContext('2d');
        }

        this.selection = {
            rows : [],
            rowsCells : [],
            columns : []
        };

        this.initializeZones();
        this.initializeMouseOverTooltip();
        this.initializeClickTooltip();
    };

    App.Table.View.prototype.initializeZones = function () {

        this.scrollSize = this.delegate.scrollSize;
        this.spinnerSize = this.delegate.spinnerSize;

        this.bodyZone = new BodyZone({context : this.ctx, dataSource : this.dataSource, delegate : this.delegate, view : this});

        this.leftHeaderZone = new LeftHeaderZone({context : this.ctx, bodyZone : this.bodyZone, dataSource : this.dataSource, delegate : this.delegate, view : this});
        this.topHeaderZone = new TopHeaderZone({context : this.ctx, bodyZone : this.bodyZone, dataSource : this.dataSource, delegate : this.delegate, view : this});
        this.rightScrollZone = new RightScrollZone({context : this.ctx, bodyZone : this.bodyZone, delegate : this.delegate, view : this});
        this.bottomScrollZone = new BottonScrollZone({context : this.ctx, bodyZone : this.bodyZone, delegate : this.delegate, view : this});

        if (this.spinnerZone) {
            this.spinnerZone.destroy();
        }

        this.spinnerZone = new SpinnerZone({context : this.ctx});
        this.spinnerZone.setSize(this.spinnerSize);

        this.setZonesViewPorts();

        this.zones = [this.bodyZone, this.rightScrollZone, this.bottomScrollZone, this.leftHeaderZone, this.topHeaderZone];
    };

    App.Table.View.prototype.getSize = function () {
        return new Size(this.canvas.width, this.canvas.height);
    };

    App.Table.View.prototype.setZonesViewPorts = function () {

        var canvasSize = this.getSize();

        // Volver a calcular los tamaño para permitir la redimensión de la cabecera en fullscreen
        this.leftHeaderZone.calculateIncrementalSize();
        this.topHeaderZone.calculateIncrementalSize();
        this.bodyZone.calculateIncrementalSize();

        //Configurar los viewports
        this.leftHeaderZone.setViewPort(
            new Rectangle(
                0,
                this.topHeaderZone.size.height,
                this.leftHeaderZone.size.width,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.topHeaderZone.setViewPort(
            new Rectangle(
                this.leftHeaderZone.size.width,
                0,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                this.topHeaderZone.size.height
            )
        );

        this.bodyZone.setViewPort(
            new Rectangle(
                this.leftHeaderZone.size.width,
                this.topHeaderZone.size.height,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.rightScrollZone.setViewPort(
            new Rectangle(
                canvasSize.width - this.scrollSize,
                this.topHeaderZone.size.height,
                this.scrollSize,
                canvasSize.height - this.topHeaderZone.size.height - this.scrollSize - this.spinnerZone.size.height
            )
        );

        this.bottomScrollZone.setViewPort(
            new Rectangle(
                this.leftHeaderZone.size.width,
                this.bodyZone.viewPort.bottomLeftPoint().y,
                canvasSize.width - this.leftHeaderZone.size.width - this.scrollSize,
                this.scrollSize
            )
        );

        this.spinnerZone.setViewPort(
            new Rectangle(
                this.bodyZone.viewPort.bottomRightPoint().x - this.spinnerZone.size.width,
                canvasSize.height - this.spinnerZone.size.height,
                this.spinnerZone.size.width,
                this.spinnerZone.size.height
            )
        );
    };

    App.Table.View.prototype.initializeMouseOverTooltip = function () {
        var self = this;
        this.mouseOverTooltipDelegate = {
            getTitleAtMousePosition : function (position) {
                return self.getTitleAtMousePosition(position);
            }
        };
        this.mouseOverTooltip = new Tooltip({el : this.$canvas, delegate : this.mouseOverTooltipDelegate, trigger : "mouseOver"});
    };
    
    App.Table.View.prototype.initializeClickTooltip = function () {
        var self = this;
        this.clickTooltipDelegate = {
        	getAttributeAtMousePosition : function (position) {
        		return self.getAttributeAtMousePosition(position);
        	} 
        };
        this.clickTooltip = new Tooltip({el : this.$canvas, delegate : this.clickTooltipDelegate, trigger : "click"});
    };
    
    // Limpia el canvas completo
    App.Table.View.prototype.clear = function () {
        var canvasSize = this.getSize();
        this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    App.Table.View.prototype.repaint = function () {
        _.each(this.zones, function (zone) {
            if (zone.needRepaint) {
                zone.repaint();
            }
        });
    };

    App.Table.View.prototype.forceRepaintBody = function () {
        this.bodyZone.repaint();
    };

    App.Table.View.prototype.forceRepaint = function () {
        this.clear();
        this.leftHeaderZone.calculateIncrementalSize();
        this.topHeaderZone.calculateIncrementalSize();

        this.bodyZone.repaint();
        this.leftHeaderZone.repaint();
        this.topHeaderZone.repaint();
        this.bottomScrollZone.repaint();
        this.rightScrollZone.repaint();
    };

    App.Table.View.prototype.move = function (distance) {
        var self = this;

        // window.requestAnimationFrame(function () {
        _.each(self.zones, function (zone) {
            zone.move(distance);
        });
        self.repaint();
        // });
    };

    App.Table.View.prototype.moveToBegin = function () {
        var distance = new Point(0, this.bodyZone.origin.y);
        this.move(distance);
    };

    App.Table.View.prototype.moveToEnd = function () {
        var distance = new Point(0, -this.bodyZone.size.height);
        this.move(distance);
    };

    App.Table.View.prototype.pagedown = function () {
        var distance = new Point(0, -this.bodyZone.viewPort.height);
        this.move(distance);
    };

    App.Table.View.prototype.pageup = function () {
        var distance = new Point(0, this.bodyZone.viewPort.height);
        this.move(distance);
    };

    App.Table.View.prototype.scrollDistance = function (distance) {
        if (distance.x === 0) {
            // rightScroll
            var yDistance = Math.round((this.bodyZone.size.height * distance.y) / this.rightScrollZone.viewPort.height);
            this.move(new Point(0, yDistance));
        } else {
            // bottomScroll
            var xDistance = Math.round((this.bodyZone.size.width * distance.x) / this.bottomScrollZone.viewPort.width);
            this.move(new Point(xDistance, 0));
        }
    };

    App.Table.View.prototype.stepScroll = function (point) {
        var rectangle;
        var direction;
        if (point.x === 0) {
            //rightScroll
            rectangle = this.rightScrollZone.scrollRectangle();
            direction = rectangle.y > point.y ? 1 : -1;
            this.scrollDistance(new Point(0, direction * 10));
        } else {
            //bottonScroll
            rectangle = this.bottomScrollZone.scrollRectangle();
            direction = rectangle.x > point.x ? 1 : -1;
            this.scrollDistance(new Point(direction * 10, 0));
        }
    };

    App.Table.View.prototype.zoneFromPoint = function (point) {
        var zone, scrollRectangle;
        var pointRectangle = Rectangle.createFromPointWithOffset(point);

        if (this.leftHeaderZone.separatorIndexInRectangle(pointRectangle) > 0) {
            zone = "leftHeaderZone-separator";
        } else if (!_.isUndefined(this.topHeaderZone.separatorIndexInRectangle(pointRectangle))) {
            zone = "topHeaderZone-separator";
        } else if (this.leftHeaderZone.viewPort.containsPoint(point)) {
            zone = "leftHeaderZone";
        } else if (this.topHeaderZone.viewPort.containsPoint(point)) {
            zone = "topHeaderZone";
        } else if (this.bodyZone.viewPort.containsPoint(point)) {
            zone = "bodyZone";
        } else if (this.rightScrollZone.viewPort.containsPoint(point)) {
            scrollRectangle = this.rightScrollZone.scrollRectangle();
            if (scrollRectangle.containsPoint(point)) {
                zone = "rightScrollZone-scrollBar";
            } else {
                zone = "rightScrollZone";
            }
        } else if (this.bottomScrollZone.viewPort.containsPoint(point)) {
            scrollRectangle = this.bottomScrollZone.scrollRectangle();
            if (scrollRectangle.containsPoint(point)) {
                zone = "bottomScrollZone-scrollBar";
            } else {
                zone = "bottomScrollZone";
            }
        }
        return zone;
    };

    App.Table.View.prototype.update = function () {
        this.setZonesViewPorts();
        this.forceRepaint();
    };

    App.Table.View.prototype.resize = function (size) {
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.update();
        this.mouseOverTooltip.setEl(this.$canvas);
        this.clickTooltip.setEl(this.$canvas);
    };

    App.Table.View.prototype.isSelectionActive = function (selection) {
        return (!_.difference(selection.rows, this.selection.rows).length) &&
        	(!_.difference(selection.rowsCells, this.selection.rowsCells).length) &&
            (!_.difference(selection.columns, this.selection.columns).length);
    };

    App.Table.View.prototype.toggleArrays = function (a, b) {
        var result;
        var diff = _.difference(b, a);
        if (diff.length) {
            // En la selección nueva hay elementos que no estaban anteriormente, añadir esos elementos nuevos
            result = _.union(a, diff);
        } else {
            // Todos los elementos ya estaban seleccionados, deseleccionar
            result = _.difference(a, b);
        }
        return result;
    };

    App.Table.View.prototype.toggleSelection = function (newSelection) {
        this.selection.rows = this.toggleArrays(this.selection.rows, newSelection.rows);
        this.selection.rows.sort();
        
        this.selection.rowsCells = this.toggleArrays(this.selection.rowsCells, newSelection.rowsCells);
        this.selection.rowsCells.sort();

        this.selection.columns = this.toggleArrays(this.selection.columns, newSelection.columns);
        this.selection.columns.sort();
    };

    App.Table.View.prototype.setActiveCell = function (arg) {
        var cell;

        if (arg instanceof Cell) {
            cell = arg;
        } else if (arg instanceof Point) {
            var zone = this.zoneFromPoint(arg);

            if (zone === "bodyZone" || zone === "leftHeaderZone" || zone === "topHeaderZone") {
                if (zone === "bodyZone") {
                    cell = this.bodyZone.relativePoint2Cell(arg);
                    var isOnlyACellSelected = this.selection.rowsCells.length === 1 && this.selection.columns.length === 1;
                    var firstCellSelectedEqSelectedCell = this.selection.rowsCells[0] === cell.y && this.selection.columns[0] === cell.x;

                    if (isOnlyACellSelected && firstCellSelectedEqSelectedCell) {
                        this.selection = {rowsCells : [], rows : [], columns : []};
                    } else {
                        this.selection = {rowsCells : [cell.y], columns : [cell.x], rows : [cell.y += this.dataSource.blankRowsOffset(cell.y)]};
                    }

                } else if (zone === "leftHeaderZone") {
                    var rows = this.leftHeaderZone.rowsAtPoint(arg);
                    var rowsCells = this.leftHeaderZone.rowsCellsAtPoint(arg);
                    this.toggleSelection({rows : rows, rowsCells : rowsCells});
                } else {
                    //topHeaderZone
                    var columns = this.topHeaderZone.columnsAtPoint(arg);
                    this.toggleSelection({columns : columns});
                }

                this.leftHeaderZone.needRepaint = true;
                this.topHeaderZone.needRepaint = true;
                this.bodyZone.needRepaint = true;
                this.repaint();
            }

        }
    };
        
//    App.Table.View.prototype.showCellAttributes = function (arg) {
//        var cell;
//
//        if (arg instanceof Point) {
//            var zone = this.zoneFromPoint(arg);
//            if (zone === "bodyZone" || zone === "leftHeaderZone" || zone === "topHeaderZone") {
//            	
//            	console.log("uy!");
//            	
//            }
//        }
//    };    

    App.Table.View.prototype.setMousePosition = function (point, e) {
        this.mouseInCanvas = e.target === this.canvas;
        this.mousePosition = point;
        this.setMouseZone(point);
    };

    App.Table.View.prototype.setMouseZone = function (point) {
        var newZone = this.zoneFromPoint(point);

        var needRepaint = this.mouseZone !== newZone;
        this.mouseZone = newZone;
        if (needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

    App.Table.View.prototype.getTitleAtMousePosition = function (point) {
        var title;
        if (this.mouseZone === "leftHeaderZone") {
            title = this.leftHeaderZone.titleAtPoint(point);
        } else if (this.mouseZone === "topHeaderZone") {
            title = this.topHeaderZone.titleAtPoint(point);
        }
        return title;
    };
    
    App.Table.View.prototype.getAttributeAtMousePosition = function (point) {
        var attribute;
        if (this.mouseZone === "bodyZone") {
        	attribute = this.bodyZone.attributesAtPoint(point);
        }
        return attribute;
    };
    
//    App.Table.View.prototype.getAttributesAtMousePosition = function (point) {
//        var attributes;
//        if (this.mouseZone === "leftHeaderZone") {
//            title = this.leftHeaderZone.titleAtPoint(point);
//        } else if (this.mouseZone === "topHeaderZone") {
//            title = this.topHeaderZone.titleAtPoint(point);
//        }
//        return title;
//    };

    App.Table.View.prototype.setLastClickZone = function (zone) {
        var needRepaint = this.lastClickZone !== zone;
        this.lastClickZone = zone;
        if (needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

    App.Table.View.prototype.destroy = function () {
        this.clickTooltip.destroy();
        this.mouseOverTooltip.destroy();
    };

    App.Table.View.prototype.columnSeparatorIndex = function (point) {
        var pointRectangle = Rectangle.createFromPointWithOffset(point);
        return this.topHeaderZone.separatorIndexInRectangle(pointRectangle);
    };

    App.Table.View.prototype.leftColumnHeaderSeparatorIndex = function (point) {
        var pointRectangle = Rectangle.createFromPointWithOffset(point);
        return this.leftHeaderZone.separatorIndexInRectangle(pointRectangle);
    };

    App.Table.View.prototype.resizeColumnWidth = function (separatorIndex, distance) {
        this.delegate.resizeColumnWidth(separatorIndex, distance.x);

        this.clear();
        this.bodyZone.calculateIncrementalSize();
        this.setZonesViewPorts();
        this.repaint();
    };

    App.Table.View.prototype.resizeLeftHeaderColumnWidth = function (separatorIndex, distance) {
        this.delegate.resizeLeftHeaderColumnWidth(separatorIndex, distance.x);

        this.clear();
        this.bodyZone.calculateIncrementalSize();
        this.setZonesViewPorts();
        this.repaint();
    };

}());

