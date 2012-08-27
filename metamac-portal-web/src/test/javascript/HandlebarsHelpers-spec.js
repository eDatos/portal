/**
 * HandlebarsHelper Spec
 */

describe("Handlebars helpers", function(){

    describe("iString helper", function(){
        var iStringHelper, iString;

        iStringHelper = Handlebars.helpers.iString;
        iString = {
            texts : [
                {
                    label : "hola",
                    locale : "es"
                },
                {
                    label : "hi",
                    locale : "en"
                },
                {
                    label : "bonjour",
                    locale : "fr"
                }
            ]
        };

        it("should be defined", function(){
            expect(iStringHelper).toBeDefined();
        });

        it("should return the first string when currentLocale and defaultLocale undefined", function(){
            I18n.locale = undefined;
            I18n.defaultLocale = undefined;
            expect(iStringHelper(iString)).toEqual("hola");
        });

        it("should return the locale label when currentLocale defined", function(){
            I18n.defaultLocale = 'rs';

            I18n.locale = 'en';
            expect(iStringHelper(iString)).toEqual('hi');

            I18n.locale = 'es';
            expect(iStringHelper(iString)).toEqual('hola');

            I18n.locale = 'fr';
            expect(iStringHelper(iString)).toEqual('bonjour');
        });

        it("should return the default locale label when currentLocale undefined", function(){
            I18n.locale = undefined;
            I18n.defaultLocale = 'en';
            expect(iStringHelper(iString)).toEqual("hi");
        });
    });

    describe("date helper", function(){
        var dateHelper = Handlebars.helpers.date;

        it("should be defined", function(){
            expect(dateHelper).toBeDefined();
        });

        it("should format dates locale format", function(){
            var date = 1298290320000;

            I18n.translations  = {
                "en": {
                    date: {
                        formats: {
                            "default": "%m/%d/%Y",
                            "short": "%d de %B",
                            "long": "%d de %B de %Y"
                        },
                        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                        meridian: ["am", "pm"]
                    }
                },
                "es": {
                    date: {
                        formats: {
                            "default": "%d/%m/%Y",
                            "short": "%d de %B",
                            "long": "%d de %B de %Y"
                        },
                        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        month_names: [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        abbr_month_names: [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                        meridian: ["am", "pm"]
                    }
                }
            };

            I18n.locale = "en";
            expect(dateHelper(date)).toEqual("02/21/2011");

            I18n.locale = "es";
            expect(dateHelper(date)).toEqual("21/02/2011");
        });

        it("should return empty string when date is undefined", function(){
            expect(dateHelper(undefined)).toEqual("");
        });
    });

    describe("join", function(){
        var joinHelper = Handlebars.helpers.join,
            context = {
                pokemons : [
                    {name : 'bulbasur'},
                    {name : 'charmander'},
                    {name : 'pikachu'}
                ]
            };

        it("should separe with ', ' if no separator", function(){
            var template,
                compiledTemplate,
                result;

            template = "{{#join pokemons}}{{name}}{{/join}}";
            compiledTemplate = Handlebars.compile(template);
            result = compiledTemplate(context);
            expect("bulbasur, charmander, pikachu").toEqual(result);
        });

        it("should separe with separator if especified", function(){
            var template,
                compiledTemplate,
                result;

            template = '{{#join pokemons separator="|"}}{{name}}{{/join}}';
            compiledTemplate = Handlebars.compile(template);
            result = compiledTemplate(context);
            expect("bulbasur|charmander|pikachu").toEqual(result);
        });

        it("should trim the block", function(){
            var template,
                compiledTemplate,
                result;

            template = "{{#join pokemons}}   \n\n          {{name}}        \n\n\n       {{/join}}";
            compiledTemplate = Handlebars.compile(template);
            result = compiledTemplate(context);
            expect("bulbasur, charmander, pikachu").toEqual(result);
        });

        it("should return empty string if no elements passed", function(){
            var template,
                compiledTemplate,
                result;

            template = "{{#join pokemons}}{{name}}{{/join}}";
            compiledTemplate = Handlebars.compile(template);
            result = compiledTemplate({pokemons : []});
            expect("").toEqual(result);
        });

        it("should return empty strif if undefined array passed", function(){
            var template,
                compiledTemplate,
                result;

            template = "{{#join pokemons}}{{name}}{{/join}}";
            compiledTemplate = Handlebars.compile(template);
            result = compiledTemplate({pokemons : undefined});
            expect("").toEqual(result);
        });

    });

});