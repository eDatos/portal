(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.View");

    var Cell = STAT4YOU.Table.Cell,
        Size = STAT4YOU.Table.Size,
        Point = STAT4YOU.Table.Point,
        BodyZone = STAT4YOU.Table.BodyZone,
        RightScrollZone = STAT4YOU.Table.RightScrollZone,
        BottonScrollZone = STAT4YOU.Table.BottomScrollZone,
        LeftHeaderZone = STAT4YOU.Table.LeftHeaderZone,
        TopHeaderZone = STAT4YOU.Table.TopHeaderZone,
        Rectangle = STAT4YOU.Table.Rectangle,
        SpinnerZone = STAT4YOU.Table.SpinnerZone,
        Tooltip = STAT4YOU.Table.Tooltip;

    STAT4YOU.Table.View = function (options) {
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
            columns : []
        };

        this.initializeZones();
        this.initializeTooltip();
    };

    STAT4YOU.Table.View.prototype.initializeZones = function () {

        // TODO must be a delegate parameter
        this.scrollSize = 10;
        this.spinnerSize = new Size(70, 30);

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

    STAT4YOU.Table.View.prototype.getSize = function () {
        return new Size(this.canvas.width, this.canvas.height);
    };

    STAT4YOU.Table.View.prototype.setZonesViewPorts = function () {

        var canvasSize = this.getSize();

        // Volver a calcular los tamaño para permitir la redimensión de la cabecera en fullscreen
        this.leftHeaderZone.calculateIncrementalSize();
        this.topHeaderZone.calculateIncrementalSize();

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

    STAT4YOU.Table.View.prototype.initializeTooltip = function () {
        this.tooltip = new Tooltip({view : this});
    };

    // Limpia el cambas completo
    STAT4YOU.Table.View.prototype.clear = function () {
        var canvasSize = this.getSize();
        this.ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    STAT4YOU.Table.View.prototype.repaint = function () {
        _.each(this.zones, function (zone) {
            if (zone.needRepaint) {
                zone.repaint();
            }
        });
        this.updateTooltip();
    };

    STAT4YOU.Table.View.prototype.forceRepaintBody = function () {
        this.bodyZone.repaint();
    };

    STAT4YOU.Table.View.prototype.move = function (distance) {
        var self = this;

        // window.requestAnimationFrame(function () {
        _.each(self.zones, function (zone) {
            zone.move(distance);
        });
        self.repaint();
        // });
    };

    STAT4YOU.Table.View.prototype.moveToBegin = function () {
        var self = this;
        var distance = new Point(0, this.bodyZone.origin.y);
        this.move(distance);
    };

    STAT4YOU.Table.View.prototype.moveToEnd = function () {
        var distance = new Point(0, -this.bodyZone.size.height);
        this.move(distance);
    };

    STAT4YOU.Table.View.prototype.pagedown = function () {
        var distance = new Point(0, -this.bodyZone.viewPort.height);
        this.move(distance);
    };

    STAT4YOU.Table.View.prototype.pageup = function () {
        var distance = new Point(0, this.bodyZone.viewPort.height);
        this.move(distance);
    };

    STAT4YOU.Table.View.prototype.scrollDistance = function (distance) {
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

    STAT4YOU.Table.View.prototype.stepScroll = function (point) {
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

    STAT4YOU.Table.View.prototype.zoneFromPoint = function (point) {
        var zone, scrollRectangle;
        if (this.leftHeaderZone.viewPort.containsPoint(point)) {
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

    STAT4YOU.Table.View.prototype.resize = function (size) {
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.setZonesViewPorts();
        this.repaint();
        this.tooltip.updateContainer();
    };

    STAT4YOU.Table.View.prototype.isSelectionActive = function (selection) {
        return (!_.difference(selection.rows, this.selection.rows).length) &&
            (!_.difference(selection.columns, this.selection.columns).length);
    };

    STAT4YOU.Table.View.prototype.toggleArrays = function (a, b) {
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

    STAT4YOU.Table.View.prototype.toggleSelection = function (newSelection) {
        this.selection.rows = this.toggleArrays(this.selection.rows, newSelection.rows);
        this.selection.rows.sort();

        this.selection.columns = this.toggleArrays(this.selection.columns, newSelection.columns);
        this.selection.columns.sort();
    };

    STAT4YOU.Table.View.prototype.setActiveCell = function (arg) {
        var cell;

        if (arg instanceof Cell) {
            cell = arg;
        } else if (arg instanceof Point) {
            var zone = this.zoneFromPoint(arg);

            if (zone === "bodyZone" || zone === "leftHeaderZone" || zone === "topHeaderZone") {
                if (zone === "bodyZone") {
                    cell = this.bodyZone.relativePoint2Cell(arg);
                    var isOnlyACellSelected = this.selection.rows.length === 1 && this.selection.columns.length === 1;
                    var firstCellSelectedEqSelectedCell = this.selection.rows[0] === cell.y && this.selection.columns[0] === cell.x;

                    if (isOnlyACellSelected && firstCellSelectedEqSelectedCell) {
                        this.selection = {rows : [], columns : []};
                    } else {
                        this.selection = {rows : [cell.y], columns : [cell.x]};
                    }

                } else if (zone === "leftHeaderZone") {
                    var rows = this.leftHeaderZone.rowsAtPoint(arg);
                    this.toggleSelection({rows : rows});
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

    STAT4YOU.Table.View.prototype.setMousePosition = function (point, e) {
        this.mouseInCanvas = e.target === this.canvas;
        this.mousePosition = point;
        this.setMouseZone(point);
        this.updateTooltip();
    };

    STAT4YOU.Table.View.prototype.setMouseZone = function (point) {
        var newZone = this.zoneFromPoint(point);

        var needRepaint = this.mouseZone !== newZone;
        this.mouseZone = newZone;
        if (needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

    STAT4YOU.Table.View.prototype.updateTooltip = function () {
        if (this.mouseInCanvas) {
            this.tooltip.update(this.mousePosition);
        } else {
            this.tooltip.update();
        }
    };

    STAT4YOU.Table.View.prototype.getTitleAtMousePosition = function (point) {
        if (this.mouseZone === "leftHeaderZone") {
            return this.leftHeaderZone.titleAtPoint(point);
        } else if (this.mouseZone === "topHeaderZone") {
            return this.topHeaderZone.titleAtPoint(point);
        }
    };

    STAT4YOU.Table.View.prototype.setLastClickZone = function (zone) {
        var needRepaint = this.lastClickZone !== zone;
        this.lastClickZone = zone;
        if(needRepaint) {
            this.rightScrollZone.repaint();
            this.bottomScrollZone.repaint();
        }
    };

}());

