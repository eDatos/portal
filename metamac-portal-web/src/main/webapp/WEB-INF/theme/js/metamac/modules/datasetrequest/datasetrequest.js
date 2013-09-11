App.namespace("App.modules.datasetrequest");

App.modules.datasetrequest.View = Backbone.View.extend({
    template : App.templateManager.get('datasetrequest/datasetrequest-form'),

    initialize : function(options){
        options || (options = {});
        this.success = options.success;
        this.error = options.error;
        this.formdata = options.formdata;
    },

    render : function(){
        var context = {
            success : this.success,
            error : this.error,
            formdata : this.formdata
        };

        this.$el.html(this.template(context));

        this.form = $('form', this.$el);
        this.form.validate({
            errorElement : 'span',
            errorClass : 'help-inline'});
    }
});