(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.comments.CommentView");

    STAT4YOU.modules.comments.CommentView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('comments/comments-comment'),

        templatePopover : STAT4YOU.templateManager.get('comments/comments-comment-delete-popover'),

        initialize : function () {
            _.bindAll(this, "deleteComment", "hideAllPopovers");
        },

        render : function () {
            var userIdentifier;
            if (STAT4YOU.user) {
                userIdentifier = STAT4YOU.user.get('identifier');
            }

            var context = {
                comment : this.model.toJSON()
            };

            context.isSelfComment = userIdentifier === context.comment.user.identifier;
            context.comment.contentHtml = this._getTextHtml(context.comment.content);
            this.$el.html(this.template(context));

            var commentDelete = this.$el.find('.comment-delete');

            var self = this;
            commentDelete
                .popover({
                    content : this.templatePopover(),
                    trigger : 'manual'
                })
                .click(function (e) {
                    var $this = $(this);
                    $this.popover('show');
                    var $popover = $this.data('popover').tip();
                    $popover.find('.comment-delete-verify-cancel').click(self.hideAllPopovers);
                    $popover.find('.comment-delete-verify-ok').click(self.deleteComment);

                    return false;
                });

            return this;
        },

        _getTextHtml : function (text) {
            var result = this._replaceUrlLinks(text);
            return result;
        },

        _replaceUrlLinks : function (text) {
            return linkify(text);
        },

        deleteComment : function () {
            this.hideAllPopovers();
            var collection = this.model.collection;
            var request = this.model.destroy();
            request.success(function () {
                collection.fetch();
            });
            return false;
        },

        hideAllPopovers : function () {
            $('.comment-delete').popover('hide');
            return false;
        }

    });

}());