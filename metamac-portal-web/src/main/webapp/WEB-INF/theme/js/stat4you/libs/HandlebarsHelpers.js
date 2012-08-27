/**
 * Handlebars Helpers
 */

/**
 * InternationalString
 *
 * usage:
 *    {{iString title}}
 */
Handlebars.registerHelper("iString", function(iString, options){
    var localizedLabels = {},
        i, text,
        locale = I18n.currentLocale();

    if (iString) {
        for(i = 0; i < iString.texts.length; i++){
            text = iString.texts[i];
            localizedLabels[text.locale] = text.label;
        }

        if(localizedLabels[locale]){
            return localizedLabels[locale];
        }

        // Any locale
        if (iString.texts.size !== 0) {
            return iString.texts[0].label;
        }
    }

    return '';
});

/**
 * Format date
 *
 * usage:
 *      {{date lastPublishedDate}}
 */
Handlebars.registerHelper("date", function(date, options){
    if(date){
        return I18n.l("date.formats.default", date);
    }else{
        return "";
    }
});

/**
 * Get the application context
 *
 * usage:
 *      <a href="{{context}}/providers/1">
 */
Handlebars.registerHelper("context", function(url, options){
    return STAT4YOU.context;
});

/**
 * Get the resource context
 *
 * usage:
 *      <a href="{{context}}/providers/1">
 */
Handlebars.registerHelper("resourceContext", function(url, options){
    return STAT4YOU.resourceContext;
});

/**
 * Get a translated message
 *
 * usage:
 *      <h1>{{ message "entity.dataset.title" }}</h1>
 */
Handlebars.registerHelper("message", function(message, options){
    return I18n.t(message);
});

/**
 * Transforms a string to lowercase
 *
 * usage:
 *      <h1>{{ toLowerCase string }}</h1>
 */
Handlebars.registerHelper("toLowerCase", function(string){
    return string.toLowerCase();
});

/**
 * Draw a field with its value
 *
 * usage:
 *      {{ fieldOutput "entity.dataset.title" }}
 */
Handlebars.registerHelper("fieldOutput", function(label, value, type){
    label = Handlebars.Utils.escapeExpression(label);
    value = Handlebars.Utils.escapeExpression(value);
    
    var result = ''; 
    if (value) {
        result +=
        '<div class="field" >' +
            '<span class="metadata-title">'+I18n.t(label)+'</span>';
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
Handlebars.registerHelper("ulList", function(list, options){
    var result = '',
        i, item;
    if (list) {
        result += '<ul>';

        for (i=0; i<list.length; i++) {
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
Handlebars.registerHelper('join', function(items, options){
    var separator = (options.hash.separator || ', '),
        out = "",
        i, item, itemsLength;

    if(items){
        itemsLength = items.length;

        for(i=0; i < itemsLength; i++) {
            item = items[i];
            out = out +  $.trim(options.fn(item));
            if(i !== (items.length - 1)){
                out += separator;
            }
        }
    }

    return out;
});