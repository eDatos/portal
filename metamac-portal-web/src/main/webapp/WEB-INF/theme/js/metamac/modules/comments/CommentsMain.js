(function () {
    "use strict";

    App.namespace("App.modules.comments.CommentsMain");

    var Comments = App.modules.comments.Comments,
        Comment = App.modules.comments.Comment,
        CommentsView = App.modules.comments.CommentsView;

    App.modules.comments.CommentsMain = function (options) {
        this.initialize(options);
    };

    App.modules.comments.CommentsMain.prototype = {
        initialize : function (options) {
            this.comments = new Comments([], {resourceUri : options.resource });
            this.view = new CommentsView({collection : this.comments, el : options.el});
            this.view.render();
            this.comments.fetch();
        }
    };

}());