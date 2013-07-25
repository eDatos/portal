(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.comments.CommentsView");

    var CommentView = STAT4YOU.modules.comments.CommentView,
        Comment = STAT4YOU.modules.comments.Comment;

    STAT4YOU.modules.comments.CommentsView = Backbone.View.extend({

        initialize : function () {
            _.bindAll(this, "submitSuccess", "submitFail");
            this.collection.on('reset', this.renderReset, this);
        },

        template : STAT4YOU.templateManager.get('comments/comments-page'),
        counterTemplate : STAT4YOU.templateManager.get('comments/comments-counter'),
        paginationTemplate : STAT4YOU.templateManager.get('comments/comments-pagination'),

        events : {
            "click .pagination-previous" : 'clickPrevious',
            "click .pagination-next" : 'clickNext',
            "click .pagination-page" : "clickPage",
            "submit form" : "submit"
        },

        render : function () {
            var context = {
                user : STAT4YOU.user
            };
            this.$el.html(this.template(context));
            this.$textarea = this.$el.find('.new-comment-text');
            this.renderReset();
        },

        renderReset : function () {
            this.renderCounter();
            this.renderPagination();

            this.$el.find('.comments-list').empty();
            this.collection.each(this.renderComment, this);
        },

        renderCounter : function () {
            var context = {
                total : this.collection.total
            };
            this.$el.find('.comments-counter').html(this.counterTemplate(context));
        },

        renderPagination : function () {
            var $paginationContainer = this.$el.find('.comments-list-pagination');
            if (this.collection.total > 0) {
                var i;
                var pages = [];
                var currentPage = this.collection.currentPage();
                var lastPage = this.collection.lastPage();
                for (i = 0; i <= lastPage; i++) {
                    var active = i === currentPage;
                    pages.push({
                        number : i,
                        cssClass : active ? 'active' : '',
                        active : active
                    });
                }

                var hasPrevious = currentPage > 0;
                var hasNext = currentPage < lastPage;
                var context = {
                    pages : pages,
                    previousCssClass : hasPrevious ? '' : 'disabled',
                    nextCssClass : hasNext ? '' : 'disabled'
                };

                $paginationContainer.html(this.paginationTemplate(context));
            } else {
                $paginationContainer.empty();
            }
        },

        renderComment : function (comment) {
            var $commentsList = this.$el.find('.comments-list');
            var view = new CommentView({model : comment});
            view.render();
            $commentsList.append(view.$el);
        },

        submit : function () {
            var self = this;
            var content = this.$textarea.val();
            var comment = new Comment({
                user : {
                    identifier : STAT4YOU.user.get('identifier')
                },
                content : content,
                resourceUri : this.collection.resourceUri
            });
            var response = comment.save();
            response.success(this.submitSuccess);
            response.fail(this.submitFail);
            return false;
        },

        submitSuccess : function () {
            this.collection.total++;
            this.collection.fetchPage(this.collection.lastPage());
            this.$textarea.val('');
            var $label = this.$el.find('.label-success');
            this._fadeInOut($label);
        },

        submitFail : function () {
            var $label = this.$el.find('.label-important');
            this._fadeInOut($label);
        },

        _fadeInOut : function ($el) {
            $el.fadeIn();
            setTimeout(function () {
                $el.fadeOut();
            }, 3000);
        },

        clickPrevious : function () {
            this.collection.fetchPage(this.collection.currentPage() - 1);
            return false;
        },

        clickNext : function () {
            this.collection.fetchPage(this.collection.currentPage() + 1);
            return false;
        },

        clickPage : function (e) {
            var $target = $(e.target);
            var page = $target.data('page');
            if (page !== this.collection.currentPage()) {
                this.collection.fetchPage(page);
            }
            return false;
        }

    });

}());