/**
 *
 */

STAT4YOU.namespace("STAT4YOU.libs");

STAT4YOU.libs.AjaxForm = function ($el) {
    var action = $el.attr('action'),
        params = $el.serialize();
    this.url = action + "#!/?" + params;
};

STAT4YOU.libs.AjaxForm.prototype.redirect = function () {
    window.location = this.url;
};

STAT4YOU.libs.AjaxForm.eventCallback = function () {
    new STAT4YOU.libs.AjaxForm($(this)).redirect();
    return false;
};

STAT4YOU.libs.AjaxForm.captureAllForms = function () {
    $(document).on('submit', 'form.ajax-form', STAT4YOU.libs.AjaxForm.eventCallback);
};

$(function () {
    STAT4YOU.libs.AjaxForm.captureAllForms();
});




