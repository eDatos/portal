/**
 * HandlebarsHelper Spec
 */

describe("Handlebars helpers", function () {

    describe("iString helper", function () {
        var iStringHelper = Handlebars.helpers.iString;

        it("should be defined", function () {
            expect(iStringHelper).to.exists;
        });

        describe("with InternationalStringParameter", function () {

            var iString = {
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

            it("should return a string string when currentLocale and defaultLocale undefined", function () {
                I18n.locale = undefined;
                I18n.defaultLocale = undefined;
                var result = iStringHelper(iString);
                var assert = result === "hola" || result === "hi" || result === "bonjour";
                expect(assert).to.be.true;
            });

            it("should return the locale label when currentLocale defined", function () {
                I18n.defaultLocale = 'rs';

                I18n.locale = 'en';
                expect(iStringHelper(iString)).to.equal('hi');

                I18n.locale = 'es';
                expect(iStringHelper(iString)).to.equal('hola');

                I18n.locale = 'fr';
                expect(iStringHelper(iString)).to.equal('bonjour');
            });

            it("should return the default locale label when currentLocale undefined", function () {
                I18n.locale = undefined;
                I18n.defaultLocale = 'en';
                expect(iStringHelper(iString)).to.equal("hi");
            });

        });

        describe("with localized hash parameter", function () {

            var localizedString = {
                en : "Hello",
                es : "Hola"
            };

            it("should return a string when currentLocale and defaultLocale is undefined", function () {
                I18n.locale = "ru";
                I18n.defaultLocale = "ch";

                var result = iStringHelper(localizedString);
                var assertion = result === "Hello" || result === "Hola";
                expect(assertion).to.be.true;
            });

            it("should return the localized label when current locale is defined", function () {
                I18n.locale = "es";
                I18n.defaultLocale = "en";
                expect(iStringHelper(localizedString)).to.equal("Hola");
            });

            it("should return the label in the default locale when current locale is undefined", function () {
                I18n.locale = undefined;
                I18n.defaultLocale = "en";

                expect(iStringHelper(localizedString)).to.equal("Hello");
            });

        });

        describe("with string parameter", function () {

        });

        it("if a string is passed it should return the string", function () {
            var str = "this is a simple stupid string";
            expect(iStringHelper(str)).to.equal(str);
        });

    });

    describe("date helper", function () {
        var dateHelper = Handlebars.helpers.date;

        it("should be defined", function () {
            expect(dateHelper).to.exists;
        });

        it("should format dates locale format", function () {
            var date = 1298290320000;

            I18n.translations = {
                "en" : {
                    date : {
                        formats : {
                            "default" : "%m/%d/%Y",
                            "short" : "%d de %B",
                            "long" : "%d de %B de %Y"
                        },
                        day_names : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        abbr_day_names : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        month_names : [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        abbr_month_names : [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                        meridian : ["am", "pm"]
                    }
                },
                "es" : {
                    date : {
                        formats : {
                            "default" : "%d/%m/%Y",
                            "short" : "%d de %B",
                            "long" : "%d de %B de %Y"
                        },
                        day_names : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        abbr_day_names : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        month_names : [null, "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        abbr_month_names : [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
                        meridian : ["am", "pm"]
                    }
                }
            };

            I18n.locale = "en";
            expect(dateHelper(date)).to.equal("02/21/2011");

            I18n.locale = "es";
            expect(dateHelper(date)).to.equal("21/02/2011");
        });

        it("should return empty string when date is undefined", function () {
            expect(dateHelper(undefined)).to.equal("");
        });
    });

//    describe("join", function () {
//        var joinHelper = Handlebars.helpers.join,
//            context = {
//                pokemons : [
//                    {name : 'bulbasur'},
//                    {name : 'charmander'},
//                    {name : 'pikachu'}
//                ]
//            };
//
//        it("should separe with ', ' if no separator", function () {
//            var template,
//                compiledTemplate,
//                result;
//
//            template = "{{#join pokemons}}{{name}}{{/join}}";
//            compiledTemplate = Handlebars.compile(template);
//            result = compiledTemplate(context);
//            expect("bulbasur, charmander, pikachu").to.equal(result);
//        });
//
//        it("should separe with separator if especified", function () {
//            var template,
//                compiledTemplate,
//                result;
//
//            template = '{{#join pokemons separator="|"}}{{name}}{{/join}}';
//            compiledTemplate = Handlebars.compile(template);
//            result = compiledTemplate(context);
//            expect("bulbasur|charmander|pikachu").to.equal(result);
//        });
//
//        it("should trim the block", function () {
//            var template,
//                compiledTemplate,
//                result;
//
//            template = "{{#join pokemons}}   \n\n          {{name}}        \n\n\n       {{/join}}";
//            compiledTemplate = Handlebars.compile(template);
//            result = compiledTemplate(context);
//            expect("bulbasur, charmander, pikachu").to.equal(result);
//        });
//
//        it("should return empty string if no elements passed", function () {
//            var template,
//                compiledTemplate,
//                result;
//
//            template = "{{#join pokemons}}{{name}}{{/join}}";
//            compiledTemplate = Handlebars.compile(template);
//            result = compiledTemplate({pokemons : []});
//            expect("").to.equal(result);
//        });
//
//        it("should return empty strif if undefined array passed", function () {
//            var template,
//                compiledTemplate,
//                result;
//
//            template = "{{#join pokemons}}{{name}}{{/join}}";
//            compiledTemplate = Handlebars.compile(template);
//            result = compiledTemplate({pokemons : undefined});
//            expect("").to.equal(result);
//        });
//
//    });

    describe("toLowerCase", function () {
        var lowerCaseHelper = Handlebars.helpers.toLowerCase;

        it("should return undefined when undefined passed", function () {
            expect(lowerCaseHelper()).to.equal(undefined);
        });

        it("should return undefined when not passing string", function () {
            expect(lowerCaseHelper([123, 'abc'])).to.equal(undefined);
        });

        it("should convert to lower case", function () {
            expect(lowerCaseHelper('ABC')).to.equal("abc");
        });
    });

    describe("iter: each plus loop index", function () {
//        var joinHelper = Handlebars.helpers.join,
//            context = {
//                pokemons : [
//                    {name : 'bulbasur'},
//                    {name : 'charmander'},
//                    {name : 'pikachu'}
//                ]
//            };

        var iterHeleper = Handlebars.helpers.iter,
            context = {
                list : [
                    "< 20 ",
                    "> 20 < 40 ",
                    "> 40 < 60 "
                ]
            };

//        it("show", function () {
//            var template = "{{#iter list}}{{i}}:{{value}}{{/iter}}";
//            var compiledTemplate = Handlebars.compile(template);
//            var result = compiledTemplate(context);
//            expect("0:&lt; 20 1:&gt; 20 &lt; 40 2:&gt; 40 &lt; 60 ").to.equal(result);
//        });
    });

});