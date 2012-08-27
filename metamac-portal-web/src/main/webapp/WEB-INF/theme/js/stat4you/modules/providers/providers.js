STAT4YOU.namespace("STAT4YOU.modules.Providers");

STAT4YOU.modules.Providers.Model = Backbone.Model.extend({
    getDatasets : function(){
        var self = this;
        $.get(STAT4YOU.apiContext + 'providers/' + this.get('acronym') + '/datasets')
            .success(function(datasets){
                self.set('datasets', datasets);
            });
    }
});

STAT4YOU.modules.Providers.Collection = Backbone.Collection.extend({
    model : STAT4YOU.modules.Providers.Model,

    initialize : function(){
        _.bindAll(this);
    },

    findByName : function(query){
        var filtered = this.filter(function(provider){
            var name = provider.get('name');
            return STAT4YOU.libs.strings.containsLowerCase(name, query);
        });
        return filtered;
    },

    findByAcronym : function(acronym){
        var providers = this.where({
            acronym : acronym
        });

        if (providers.length > 0) {
            return providers[0];
        } else {
            return null;
        }
    }
});

STAT4YOU.modules.Providers.View = Backbone.View.extend({
    template : STAT4YOU.templateManager.get("providers/providers"),

    events : {
        "click #provider-list a" : "navigate"
    },

    render : function(){
        var context = {
            providers : this.collection.toJSON()
        };

        this.$el.html(this.template(context));
        return this;
    },

    navigate : function(evt){
        // Prevent new tab http://dev.tenfarms.com/posts/proper-link-handling
        if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
            // Get the anchor href and protcol
            var $target = $(evt.currentTarget),
                href = $target.attr("href"),
                protocol = this.protocol + "//";

            // Ensure the protocol is not part of URL, meaning its relative.
            if (href && href.slice(0, protocol.length) !== protocol) {
                evt.preventDefault();
                Backbone.history.navigate(href, true);
            }
            return false;
        }
    }
});

STAT4YOU.namespace("STAT4YOU.modules.Providers.Detail");
STAT4YOU.modules.Providers.Detail.View = Backbone.View.extend({

    initialize : function(options){
        this.provider = this.options.provider;
        this.acronym = this.options.acronym;
    },



    render : function(){
        var template, context;

        if (this.provider) {
            template = STAT4YOU.templateManager.get('providers/provider-page');

            context = {
                provider : this.provider.toJSON()
            };

            $(this.el).html(template(context));

            this.renderProviderLogo();
            this.renderProviderMetadata();
            if (this.provider.get('datasets')) {
                this.renderDatasets();
            } else {
                this.provider.bind("change:datasets", this.renderDatasets, this);
                this.provider.getDatasets();
            }
        } else {
            template = STAT4YOU.templateManager.get('alerts/error');
            context = {
                msg : I18n.t('page.providers.notFound', {acronym : this.acronym})
            };
            $(this.el).html(template(context));
        }
    },

    renderProviderLogo : function(){
        var template = STAT4YOU.templateManager.get('providers/provider-active-provider'),
            context = this.provider.toJSON();

        $('.search-active-provider', this.el).html(template(context));
    },
    
    renderProviderMetadata : function(){
        var template = STAT4YOU.templateManager.get('providers/provider'),
            context = this.provider.toJSON();

        $('.provider', this.el).html(template(context));
    },

    renderDatasets : function(){
        var template = STAT4YOU.templateManager.get('providers/provider-datasets'),
            context = {
                datasets : this.provider.get('datasets')
            };

        $('.datasets-list', this.el).html(template(context));

        $('.dataset-list-el-title').dotdotdot({watch: window});
    }

});

STAT4YOU.modules.Providers.Router = Backbone.Router.extend({

    initialize : function(options){
        this.collection = options.collection;
        this.el = options.el;
    },

    routes : {
        ":acronym" : "detail",
        "" : "defaultRoute"
    },

    defaultRoute : function(){
        this.list();
    },

    list : function(){
        this.providersView = new STAT4YOU.modules.Providers.View({
            el : this.el,
            collection : this.collection
        });
        this.providersView.render();
    },

    detail : function(acronym){
        var provider = this.collection.findByAcronym(acronym);
        this.providersDetailView = new STAT4YOU.modules.Providers.Detail.View({
            el : this.el,
            provider : provider,
            acronym : acronym
        });
        this.providersDetailView.render();
    }
});