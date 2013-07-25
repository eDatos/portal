(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.Table.DataSource");

    STAT4YOU.Table.DataSource = function (data) {
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

    STAT4YOU.Table.DataSource.factory = function (rows, columns) {
        var i, j, total = 0;
        var data = new Array(rows);
        for (i = 0; i < rows; i++) {
            data[i] = new Array(columns);
            for (j = 0; j < columns; j++) {
                data[i][j] = total.toString();
                total = total + 1;
            }
        }
        return new STAT4YOU.Table.DataSource(data);
    };

    STAT4YOU.Table.DataSource.prototype.cellAtIndex = function (cell) {
        var data;
        if (this.cellExists(cell)) {
            data = this.data[cell.y][cell.x];
        }
        return data;
    };

    STAT4YOU.Table.DataSource.prototype.cellExists = function (cell) {
        return (cell.y >= 0 && cell.x >= 0) &&
            (this.data.length > cell.y && this.data[cell.y].length > cell.x);
    };

    STAT4YOU.Table.DataSource.prototype.rows = function () {
        return this.data.length;
    };

    STAT4YOU.Table.DataSource.prototype.columns = function () {
        return this.data[0].length;
    };

    STAT4YOU.Table.DataSource.prototype.leftHeaderColumns = function () {
        return this._leftHeaderValues.length;
    };

    STAT4YOU.Table.DataSource.prototype.leftHeaderValues = function () {
        return this._leftHeaderValues;
    };

    STAT4YOU.Table.DataSource.prototype.topHeaderRows = function () {
        return this._topHeaderValues.length;
    };

    STAT4YOU.Table.DataSource.prototype.topHeaderValues = function () {
        return this._topHeaderValues;
    };

    STAT4YOU.Table.DataSource.prototype.leftHeaderTooltipValues = function () {
        return this._leftHeaderValues;
    };

    STAT4YOU.Table.DataSource.prototype.topHeaderTooltipValues = function () {
        return this._topHeaderValues;
    };


}());