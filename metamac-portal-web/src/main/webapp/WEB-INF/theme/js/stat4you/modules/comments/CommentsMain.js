(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.comments.CommentsMain");

    var Comments = STAT4YOU.modules.comments.Comments,
        Comment = STAT4YOU.modules.comments.Comment,
        CommentsView = STAT4YOU.modules.comments.CommentsView;

    STAT4YOU.modules.comments.CommentsMain = function (options) {
        this.initialize(options);
    };

    STAT4YOU.modules.comments.CommentsMain.prototype = {
        initialize : function (options) {
            this.comments = new Comments([], {resourceUri : options.resource });
            this.view = new CommentsView({collection : this.comments, el : options.el});
            this.view.render();
            this.comments.fetch();
        }
    };

}());