STAT4YOU.namespace("STAT4YOU.Dataset");

STAT4YOU.Dataset = (function() {

    // constructor
    function constructor(dataset) {
        this._dataset = null;
        
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
        
        
        return this;
    }
            
    constructor.prototype = {
        /*** SETTERS ***/
        setStructure: function (structure) {
            var self = this;
            // TO-DO: We must have two attributes "structure" y "data" 
            self._dataset = structure;
            
            // PREPROCESSED functions: Once we have the structure we can run this method
            this._createMult();
            this._setUpTransformIdToPos();
            this._setUpTransformPosToPosArray();
        },
        
        setData: function (data) {
            var self = this;
            // TO-DO: We must have two attributes "structure" y "data" 
            self._dataset = data;
        },
        
        /*** GETTERS ***/
        getTitle: function() {
        	var self = this;
            return self._dataset.metadata.title[0];
        },

        getPublisher: function() {
        	var self = this;
            return self._dataset.metadata.publisher;
        },

        getSelectedLanguages: function() {
            var self = this;
            return self._dataset.selectedLanguages;
        },

        getDimensions: function(lang) {
            var self = this,
                ds = self._dataset;
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }            
            
            var langIndex = ds.selectedLanguages.indexOf(lang);
                dimension = ds.metadata.dimension,
                dims = dimension.id.length;                
            var labels = [];
            for ( var i = 0; i < dims; i++ ) {
                labels.push(dimension.label[dimension.id[i]][langIndex]);
            }
            
            return {"id": dimension.id, "label": labels};
        },

        getRepresentations: function(dimID, lang) {
            var self = this,
                ds = self._dataset;
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }            
            
            var langIndex = ds.selectedLanguages.indexOf(lang);
                representationIDs = ds.metadata.dimension.representation.id[dimID],
                representationLabels = ds.metadata.dimension.representation.label[dimID],
                size = representationIDs.length;                
            var labels = [];
            for ( var i = 0; i < size; i++ ) {
                labels.push(representationLabels[representationIDs[i]][langIndex]);
            }
            
            return {"id": representationIDs, "label": labels};
        },
        
        getDataById: function(ids) {
            // Common
            var self = this,
            ds = self._dataset;
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }
            var pos = [];
            var idArray = [];
            // Id Object
            if (typeof(ids) == "object") {
                var ds = self._dataset;
                var dimension = ds.metadata.dimension;
                var dims = dimension.id.length;
                for (var i = 0; i < dims; i++) {
                    idArray[i] = ids[dimension.id[i]];
                }
            }
            // Id Array
            else {
                idArray = ids;
            }
            // Common

            pos = self._transformIdToPos.apply(self, [idArray]); // Use "apply" method to pass actual context 
            return self.getDataByPos(pos);
        },
        
        getDataByPos: function(pos) {
            var self = this,
                ds = self._dataset,
                posArray=0;
            
            if (ds === undefined) {
                return false; // TODO: Ver como devolver estos errores
            }            

            posArray = self._transformPosToPosArrays.apply(self, [pos]); // Use "apply" method to pass actual context
            return { "value" : ds.data.observation[posArray] };
        },
        
        /*** OTHER METHODS ***/
        _createMult: function() {
            var self = this,
                ds = self._dataset,
                m = [],
                mult = 1,
                n = ds.data.format[1],
                dims = n.length;

            for ( var i = 0; i < dims; i++) {
                if (i > 0) {
                    mult *= n[(dims - i)];
                } else {
                    mult *= 1;
                }
                m.push(mult);
            }
            self._mult = m;
        },
        
        _setUpTransformIdToPos: function() {
            var self = this,
                body = "",
                ds = self._dataset,
                dims = ds.data.format[0].length ;
            
            body += "var ds = this._dataset, pos = [];\n";
            for (var i=0; i < dims; i++) {
                body += "pos.push(ds.data.dimension[ds.data.format[0]["+i+"]].representationIndex[id["+i+"]]);\n";
            }
            body += "return pos"; 
            
            // Creating the function
            self._transformIdToPos = new Function("id", body);
        },
        
        _setUpTransformPosToPosArray: function() {
            var self = this,
                body = "",
                ds = self._dataset,
                mult = self._mult,
                dims = ds.data.format[0].length;

            body += "var ds = this._dataset, res = 0;\n";
            body += "res = ";
            for (var i=0; i < dims; i++) {
                body += mult[i] + "*pos[" + (dims-i-1) + "]";
                if (i < dims - 1) {
                    body += " + ";
                }
            }
            body += ";\n";
            body += "return res;"; 
            
            // Creating the function
            self._transformPosToPosArrays = new Function("pos", body);
        },
    };

    return constructor;
})();