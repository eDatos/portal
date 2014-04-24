(function () {
    "use strict";

    App.namespace("App.Table.DataSource");

    App.Table.DataSource = function (data) {
        this.data = data;

        //TODO pass as parameter
        this._leftHeaderValues = [
            ['a', 'b', 'c', 'd', 'e'],
            ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            ['aa', 'bb']
        ];

        this._topHeaderValues = [
            ['a', 'b', 'c', 'd', 'e'],
            ['0', '1', '2', '3', '4'],
            ['aa', 'bb', 'cc', 'dd']
        ];
    };

    App.Table.DataSource.factory = function (rows, columns) {
        var i, j, total = 0;
        var data = new Array(rows);
        for (i = 0; i < rows; i++) {
            data[i] = new Array(columns);
            for (j = 0; j < columns; j++) {
                data[i][j] = total.toString();
                total = total + 1;
            }
        }
        return new App.Table.DataSource(data);
    };

    App.Table.DataSource.prototype.cellAtIndex = function (cell) {
        var data;
        if (this.cellExists(cell)) {
            data = this.data[cell.y][cell.x];
        }
        return data;
    };

    App.Table.DataSource.prototype.cellExists = function (cell) {
        return (cell.y >= 0 && cell.x >= 0) &&
            (this.data.length > cell.y && this.data[cell.y].length > cell.x);
    };

    App.Table.DataSource.prototype.rows = function () {
        return this.data.length;
    };

    App.Table.DataSource.prototype.columns = function () {
        return this.data[0].length;
    };

    App.Table.DataSource.prototype.leftHeaderColumns = function () {
        return this._leftHeaderValues.length;
    };

    App.Table.DataSource.prototype.leftHeaderValues = function () {
        return this._leftHeaderValues;
    };

    App.Table.DataSource.prototype.topHeaderRows = function () {
        return this._topHeaderValues.length;
    };

    App.Table.DataSource.prototype.topHeaderValues = function () {
        return this._topHeaderValues;
    };

    App.Table.DataSource.prototype.leftHeaderTooltipValues = function () {
        return this._leftHeaderValues;
    };

    App.Table.DataSource.prototype.topHeaderTooltipValues = function () {
        return _.map(this._topHeaderValues, function (topHeaderValue) { return { title : topHeaderValue, attributes : ''}});
    };
    
    App.Table.DataSource.prototype.isBlankRow = function (row) {
        return false;
    };
    
    App.Table.DataSource.prototype.blankRowsOffset = function () {
        return 0;
    }; 

    App.Table.DataSource.prototype.cellHasAttributes = function(cell) {
        return false;
    };   

    


}());