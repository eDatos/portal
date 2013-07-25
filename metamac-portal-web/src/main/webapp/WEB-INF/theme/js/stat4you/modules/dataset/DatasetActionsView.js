(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.modules.dataset.DatasetActionsView");

    STAT4YOU.modules.dataset.DatasetActionsView = Backbone.View.extend({

        template : STAT4YOU.templateManager.get('dataset/dataset-actions'),
        modalTemplate : STAT4YOU.templateManager.get('dataset/dataset-share-modal'),

        initialize : function (options) {
            this.filterOptions = options.filterOptions;
            this.permalinkBuilder = options.permalinkBuilder;

            if (STAT4YOU.user && STAT4YOU.user.favourites) {
                this.favourites = STAT4YOU.user.favourites;
                this.favourites.on('add remove reset', this.render, this);
                this.favourites.fetch();
            }

            this.datasetUri = this.filterOptions.metadata.getUri();

            _.bindAll(this, 'showModal');
        },

        events : {
            "click .share" : "clickShare",
            "click .favourite" : "clickFavourite"
        },

        render : function () {
            var isFavourite = false;
            if (this.favourites) {
                isFavourite = this.favourites.isFav({ uri : this.datasetUri });
            }

            var context = {
                user : STAT4YOU.user,
                isFavourite : isFavourite
            };

            this.$el.html(this.template(context));
            this.$modal = this.$el.find('#shareDatasetModel');
            this.$modalBody = this.$modal.find('.modal-body');
        },

        clickShare : function (e) {
            e.preventDefault();

            var self = this;
            var createPermalinkPromise = this.permalinkBuilder.createPermalink();

            createPermalinkPromise.done(function (permalinkUrl) {
                self.showModal(permalinkUrl);
            });
        },

        clickFavourite : function (e) {
            e.preventDefault();

            var self = this;
            STAT4YOU.doActionIfRegistered(function () {
                if (self.favourites) {
                    self.favourites.toggle(self.datasetUri);
                }
            });
        },

        showModal : function (permalinkUrl) {
            STAT4YOU.track({event : 'dataset.share.showModal', datasetUri : this.datasetUri });

            this.renderModalBody(permalinkUrl);
            this.$modal.modal('show');
        },

        renderModalBody : function (permalinkUrl) {
            var context = {
                url : permalinkUrl,
                title : this.filterOptions.metadata.getTitle()
            };

            this.$modalBody.html(this.modalTemplate(context));

            var config = {
                data_track_addressbar : true
            };

            var share = {
                url : context.url,
                title : context.title,
                templates : {
                    twitter : context.title + ' ' + context.url + ' (via @stat4you)'
                }
            };
            addthis.toolbox(".addthis_toolbox", config, share);
        }

    });

}());