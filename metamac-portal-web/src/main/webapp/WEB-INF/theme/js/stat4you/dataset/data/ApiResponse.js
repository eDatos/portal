(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.dataset.data.ApiResponse");

    STAT4YOU.dataset.data.ApiResponse = function (response) {
        this.response = response;

        // Mult Factor
        this._mult = null;

        // This functions are created dinamically
        // Receives as parameters the id to transform (["LL", "M"])
        // Returns the position ([1, 3])
        this._transformIdToPos = null;

        // This functions are created dinamically
        // Receives as parameters the pos to transform (["1", "1"])
        // Returns the array position (5)
        this._transformPosToPosArrays = null;

        this._createMult();
        this._setUpTransformIdToPos();
        this._setUpTransformPosToPosArray();

        return this;
    };

    STAT4YOU.dataset.data.ApiResponse.prototype = {

        getDataById : function (ids) {
            var ds = this.response;
            var idArray;
            // Id Object
            if (_.isObject(ids)) {
                idArray = _.map(ds.data.format[0], function(dimension){
                    return ids[dimension];
                });
            } else {
                idArray = ids;
            }

            var pos = this._transformIdToPos.apply(this, [idArray]);
            return this.getDataByPos(pos);
        },

        getDataByPos : function (pos) {
            var self = this,
                ds = self.response,
                posArray = 0;

            posArray = self._transformPosToPosArrays.apply(self, [pos]); // Use "apply" method to pass actual context
            return { "value" : ds.data.observation[posArray] };
        },

        /*** OTHER METHODS ***/
        _createMult : function () {
            var self = this,
                ds = this.response,
                m = [],
                mult = 1,
                n = ds.data.format[1],
                dims = n.length;

            for (var i = 0; i < dims; i++) {
                if (i > 0) {
                    mult *= n[(dims - i)];
                } else {
                    mult *= 1;
                }
                m.push(mult);
            }
            self._mult = m;
        },

        _setUpTransformIdToPos : function () {
            var self = this,
                body = "",
                ds = this.response,
                dims = ds.data.format[0].length;

            body += "var ds = this.response, pos = [];\n";
            for (var i = 0; i < dims; i++) {
                body += "pos.push(ds.data.dimension[ds.data.format[0][" + i + "]].representationIndex[id[" + i + "]]);\n";
            }
            body += "return pos";

            // Creating the function
            self._transformIdToPos = new Function("id", body);
        },

        _setUpTransformPosToPosArray : function () {
            var self = this,
                body = "",
                ds = this.response,
                mult = self._mult,
                dims = ds.data.format[0].length;

            body += "var ds = this.response, res = 0;\n";
            body += "res = ";
            for (var i = 0; i < dims; i++) {
                body += mult[i] + "*pos[" + (dims - i - 1) + "]";
                if (i < dims - 1) {
                    body += " + ";
                }
            }
            body += ";\n";
            body += "return res;";

            // Creating the function
            self._transformPosToPosArrays = new Function("pos", body);
        }

    };

}());