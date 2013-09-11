jQuery.extend(jQuery.validator.messages, {
    required: I18n.translations[I18n.currentLocale()].form.validator.required,
    remote: I18n.translations[I18n.currentLocale()].form.validator.remote,
    email: I18n.translations[I18n.currentLocale()].form.validator.email,
    url: I18n.translations[I18n.currentLocale()].form.validator.url,
    date: I18n.translations[I18n.currentLocale()].form.validator.date,
    dateISO: I18n.translations[I18n.currentLocale()].form.validator.dateISO,
    number: I18n.translations[I18n.currentLocale()].form.validator.number,
    digits: I18n.translations[I18n.currentLocale()].form.validator.digits,
    creditcard: I18n.translations[I18n.currentLocale()].form.validator.creditcard,
    equalTo: I18n.translations[I18n.currentLocale()].form.validator.equalTo,
    accept: I18n.translations[I18n.currentLocale()].form.validator.accept,
    maxlength: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.maxlength),
    minlength: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.minlength),
    rangelength: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.rangelength),
    range: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.range),
    max: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.max),
    min: jQuery.validator.format(I18n.translations[I18n.currentLocale()].form.validator.min)
});