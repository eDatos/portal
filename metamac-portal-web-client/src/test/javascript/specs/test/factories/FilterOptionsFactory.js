(function () {
    "use strict";

    App.namespace("App.test.factories");

    App.test.factories.filterOptionsFactory = function () {
        var metadata = {
            getDimensionsAndRepresentations : function () {
                return [
                    {
                        id : 'id1',
                        label : 'enid1',
                        type : 'DIMENSION',
                        representations : [
                            {id : 'id1a', label : 'enid1a'},
                            {id : 'id1b', label : 'enid1b'}
                        ]
                    },
                    {
                        id : 'id2',
                        label : 'enid2',
                        type : 'GEOGRAPHIC_DIMENSION',
                        representations : [
                            {id : 'id2a', label : 'enid2a'},
                            {id : 'id2b', label : 'enid2b'}
                        ]
                    },
                    {
                        id : 'id3',
                        label : 'enid3',
                        type : 'TIME_DIMENSION',
                        representations : [
                            {id : 'id3a', label : 'enid3a', normCode : 'TIME1'},
                            {id : 'id3b', label : 'enid3b', normCode : 'TIME2'},
                            {id : 'id3c', label : 'enid3c', normCode : null}
                        ]
                    }
                ];
            },
            getDimensionsPosition : function () {
                return {top : ['id3'], left : ['id1', 'id2']};
            }
        };
        return new App.widget.FilterOptions({metadata : metadata});
    };

}());