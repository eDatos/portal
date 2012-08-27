describe("[TableCanvas] Delegate", function () {

    describe("formatter", function () {

        I18n.defaultLocale = "es";
        I18n.locale = null;

        I18n.translations = {
            es : {
                number : {
                    format : {
                        precision : 3,
                        separator : ',',
                        delimiter : '.',
                        strip_insignificant_zeros : true
                    }
                }
            }
        };

        var delegate = new STAT4YOU.Table.Delegate();

        it("should return undefined if the value if undefined", function () {
            expect(delegate.format(undefined)).toBeUndefined();
        });

        it("should return value if the value is not a number", function () {
            var value = '.';
            expect(delegate.format(value)).toEqual(value);
        });

        /*
        // TODO ver qué se hace con el formateo
        it("should format with thousand separator using the current locale if is a Number", function () {
            expect(delegate.format("12")).toEqual("12");
            expect(delegate.format("12.5")).toEqual("12,5");
            expect(delegate.format("1234")).toEqual("1.234");
            expect(delegate.format("1234.5")).toEqual("1.234,5");
            expect(delegate.format("1234,5")).toEqual("1.234,5");
        });
        */

    });

    describe("Headers", function () {

        var view = {};

        it("left zone width = 200 if viewport width is lower or equal than 800", function () {
            var delegate = new STAT4YOU.Table.Delegate();
            view.getSize = function () { return {width : 722}; };

            var width = delegate.leftHeaderColumnWidth(1, view);
            expect(width).toEqual(100);
        });

        it("left zone width = 200 if viewport is greater than 800", function () {
            var delegate = new STAT4YOU.Table.Delegate();

            view.getSize = function () { return {width : 822}; };
            var width = delegate.leftHeaderColumnWidth(1, view);
            expect(width).toEqual(200);
        });
    });
});