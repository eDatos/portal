STAT4YOU.namespace("STAT4YOU.libs");

STAT4YOU.libs.navigationSearch = function(form){
    var $form = (form instanceof $) ? form : $(form);
    var $iconSearch = $form.find('.icon-search');

    $iconSearch.click(function(){
        $form.trigger('submit');
    });
};
