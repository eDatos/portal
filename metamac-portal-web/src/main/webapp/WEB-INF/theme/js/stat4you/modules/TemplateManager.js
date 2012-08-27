/**
 * Template Manager
 */
STAT4YOU.templateManager = {

     get : function(name){
        var self = this,
            result,
            resourceContext = STAT4YOU.resourceContext,
            initialized = false,
            compiledTemplate = function(){};

        return function() {
            if (!initialized) {
                $.ajax({
                    url : resourceContext + 'js/stat4you/views/' + name + ".html",
                    async : false,
                    cache : false,
                    success : function(data){
                        result = data;
                    }
                });
                if (result && result.length > 0){
                    compiledTemplate = Handlebars.compile(result);
                }
                initialized = true;
            }
            var args = Array.prototype.slice.call(arguments);
            return compiledTemplate.apply(null, args);
        };
    }
};

// Caching templates
STAT4YOU.templateManager.get = _.memoize(STAT4YOU.templateManager.get);