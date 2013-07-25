/**
 *
 */

App.namespace("App.libs");

App.libs.AjaxForm = function ($el) {
    var action = $el.attr('action'),
        params = $el.serialize();
    this.url = action + "#!/?" + params;
};

App.libs.AjaxForm.prototype.redirect = function () {
    window.location = this.url;
};

App.libs.AjaxForm.eventCallback = function () {
    new App.libs.AjaxForm($(this)).redirect();
    return false;
};

App.libs.AjaxForm.captureAllForms = function () {
    $(document).on('submit', 'form.ajax-form', App.libs.AjaxForm.eventCallback);
};

$(function () {
    App.libs.AjaxForm.captureAllForms();
});




