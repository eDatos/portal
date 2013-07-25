/**
 * Template Manager
 */
STAT4YOU.templateManager = {

    config : {
        mode : 'prod'   // dev | prod
    },

    get : function (name, options) {
        options = options || {};
        var mode = options.mode || this.config.mode;

        if(mode === 'dev'){
            return this._getDev(name);
        }else if(mode === 'prod'){
            return this._getProd(name);
        }else{
            throw "Invalid mode";
        }
    },

    _getDev : function (name) {
        var self = this,
            result,
            resourceContext = STAT4YOU.resourceContext,
            initialized = false,
            compiledTemplate = function () {
            };

        return function () {
            if (!initialized) {
                $.ajax({
                    url : resourceContext + 'js/stat4you/views/' + name + ".html",
                    async : false,
                    cache : false,
                    success : function (data) {
                        result = data;
                    }
                });
                if (result && result.length > 0) {
                    compiledTemplate = Handlebars.compile(result);
                }
                initialized = true;
            }
            var args = Array.prototype.slice.call(arguments);
            return compiledTemplate.apply(null, args);
        };
    },

    _getProd : function (name) {
        return Handlebars.templates[name];
    }
};

// Caching templates
STAT4YOU.templateManager.get = _.memoize(STAT4YOU.templateManager.get);