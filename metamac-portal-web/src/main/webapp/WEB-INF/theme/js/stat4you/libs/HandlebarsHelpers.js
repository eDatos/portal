/**
 * Handlebars Helpers
 */

(function () {
    "use strict";

    /**
     * InternationalString
     *
     * usage:
     *    {{iString title}}
     */
    Handlebars.registerHelper("iString", function (iString) {
        if (_.isString(iString) || _.isUndefined(iString)) {
            return iString;
        }

        var localizedLabels;
        if (iString.hasOwnProperty('texts')) {
            localizedLabels = {};
            _.each(iString.texts, function (text) {
                localizedLabels[text.locale] = text.label;
            });
        } else {
            localizedLabels = iString;
        }

        var locale = I18n.locale;
        var defaultLocale = I18n.defaultLocale;

        var result;
        if (!_.isUndefined(localizedLabels[locale])) {
            result = localizedLabels[locale];
        } else if (!_.isUndefined(localizedLabels[defaultLocale])) {
            result = localizedLabels[defaultLocale];
        } else {
            result = _.values(localizedLabels)[0];
        }
        return result;
    });

    /**
     * Format date
     *
     * usage:
     *      {{date lastPublishedDate}}
     */
    Handlebars.registerHelper("date", function (date, options) {
        if (date) {
            return I18n.l("date.formats.default", date);
        } else {
            return "";
        }
    });

    /**
     * Get the application context
     *
     * usage:
     *      <a href="{{context}}/providers/1">
     */
    Handlebars.registerHelper("context", function (url, options) {
        return STAT4YOU.context;
    });

    /**
     * Get the resource context
     *
     * usage:
     *      <a href="{{resourceContext}}/providers/1">
     */
    Handlebars.registerHelper("resourceContext", function (url, options) {
        return STAT4YOU.resourceContext;
    });

    /**
     * Get a translated message
     *
     * usage:
     *      <h1>{{ message "entity.dataset.title" }}</h1>
     */
    Handlebars.registerHelper("message", function (message, options) {
        return I18n.t(message);
    });

    /**
     * Transforms a string to lowercase
     *
     * usage:
     *      <h1>{{ toLowerCase string }}</h1>
     */
    Handlebars.registerHelper("toLowerCase", function (string) {
        if (_.isString(string)) {
            return string.toLowerCase();
        }
    });

    /**
     * Draw a field with its value
     *
     * usage:
     *      {{ fieldOutput "entity.dataset.title" }}
     */
    Handlebars.registerHelper("fieldOutput", function (label, value, type) {
        label = Handlebars.Utils.escapeExpression(label);
        value = Handlebars.Utils.escapeExpression(value);

        var result = '';
        if (value) {
            result +=
                '<div class="field" >' +
                    '<span class="metadata-title">' + I18n.t(label) + '</span>';
            if (type === "date") {
                result +=
                    '<div class="metadata-value">';
                result += I18n.l("date.formats.default", value) +
                    '</div>';
            }
            else {
                result +=
                    '<div class="metadata-value">';
                //result += Handlebars.helpers.iString(value) +
                result += value +
                    '</div>';
            }
            result +=
                '</div>';
        }

        return new Handlebars.SafeString(result);
    });

    /**
     * Draw a <ul> with each element of the list
     *
     * usage:
     *      {{#ulList list }}
     *          {{ attr1 }}
     *      {{/ulList}}
     *
     * Notice that each list element must have a iString attribute
     * value
     */
    Handlebars.registerHelper("ulList", function (list, options) {
        var result = '',
            i, item;
        if (list) {
            result += '<ul>';

            for (i = 0; i < list.length; i++) {
                item = list[i];
                result += '<li>' + options.fn(item) + '</li>';
            }

            result += '</ul>';
        }

        return new Handlebars.SafeString(result);
    });

    /**
     * Join
     *
     * usage :
     *      {{#join list}}
     *        s  <span>{{attr1}}</span>
     *      {{/join}}
     *
     *      {{#join list separator="|"}}
     *          <span>{{attr1}}</span>
     *      {{/join}}
     */
    Handlebars.registerHelper('join', function (items, options) {
        var separator = (options.hash.separator || ', '),
            out = "",
            i, item, itemsLength;

        if (items) {
            itemsLength = items.length;

            for (i = 0; i < itemsLength; i++) {
                item = items[i];
                out = out + $.trim(options.fn(item));
                if (i !== (items.length - 1)) {
                    out += separator;
                }
            }
        }

        return out;
    });

    /**
     * iter
     *
     * usage :
     *      {{#iter list}}
     *        {{i}} : {{this}}
     *      {{/iter}}

     */
    Handlebars.registerHelper('iter', function (context, options) {
        var ret = "";

        for (var i = 0, j = context.length; i < j; i++) {
            ret = ret + options.fn(_.extend({}, { value : context[i]}, { i : i }));
        }

        return ret;
    });

    /**
     * Format a date showing the timeago
     *
     * usage :
     *  {{#fromNow date}}
     */
    Handlebars.registerHelper('fromNow', function (date, options) {
        if (date) {
            moment.lang(I18n.currentLocale());
            return moment(date).fromNow();
        } else {
            return "";
        }
    });

    Handlebars.registerHelper('errors', function (errors) {
        var result = [];
        _.each(errors, function (error) {
            result.push(I18n.t('form.validator.' + error));
        });
        return result.join(", ");
    });

}());



