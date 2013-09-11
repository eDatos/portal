App.namespace("App.libs");

App.libs.navigationSearch = function(form){
    var $form = (form instanceof $) ? form : $(form);
    var $iconSearch = $form.find('.icon-search');

    $iconSearch.click(function(){
        $form.trigger('submit');
    });
};
