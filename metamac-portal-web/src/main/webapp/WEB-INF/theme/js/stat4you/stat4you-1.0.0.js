(function( window, undefined ) {

    var STAT4YOU =  {
        context : "",
        apiContext : "",
        resourceContext : "",

        namespace : function(namespaceString) {

            if(!namespaceString){
                return null;
            }

            var parts = namespaceString.split('.'),
                parent = window,
                currentPart = '',
                i,
                length = parts.length;

            for(i = 0; i < length; i++) {
                currentPart = parts[i];
                parent[currentPart] = parent[currentPart] || {};
                parent = parent[currentPart];
            }

            return parent;
        }
    };

    window.STAT4YOU = STAT4YOU;

}(window));