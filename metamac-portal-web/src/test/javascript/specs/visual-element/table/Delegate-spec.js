describe("[TableCanvas] Delegate", function () {

    describe("formatter", function () {
        var delegate;

        beforeEach(function () {
            I18n.defaultLocale = "es";
            I18n.locale = "es";

            I18n.translations = {
                es : {
                    number : {
                        format : {
                            separator : ',',
                            delimiter : '.'
                        }
                    }
                },
                en : {
                    number : {
                        format : {
                            separator : '.',
                            delimiter : ','
                        }
                    }
                }
            };

            delegate = new STAT4YOU.Table.Delegate();
        });

        it("should return undefined if the value if undefined", function () {
            expect(delegate.format(undefined)).be.undefined;
        });

        it("should return value if the value is not a number", function () {
            var value = '.';
            expect(delegate.format(value)).to.eql(value);
        });


        // TODO ver qué se hace con el formateo
        it("should format with thousand separator using the current locale if is a Number", function () {
            expect(delegate.format("12")).to.eql("12");
            expect(delegate.format("12.5")).to.eql("12,5");
            expect(delegate.format("1234")).to.eql("1.234");
            expect(delegate.format("1234.5")).to.eql("1.234,5");
            expect(delegate.format("1234,5")).to.eql("1.234,5");
            expect(delegate.format("123456789,987654321")).to.eql("123.456.789,987654321");
            expect(delegate.format("-123456789,987654321")).to.eql("-123.456.789,987654321");

            I18n.locale = "en";

            expect(delegate.format("12")).to.eql("12");
            expect(delegate.format("12.5")).to.eql("12.5");
            expect(delegate.format("1234")).to.eql("1,234");
            expect(delegate.format("1234.5")).to.eql("1,234.5");
            expect(delegate.format("1234,5")).to.eql("1,234.5");
            expect(delegate.format("123456789,987654321")).to.eql("123,456,789.987654321");
            expect(delegate.format("-123456789,987654321")).to.eql("-123,456,789.987654321");
        });


    });

    describe("Headers", function () {

        var view = {};

        it("left zone width = 200 if viewport width is lower or equal than 800", function () {
            var delegate = new STAT4YOU.Table.Delegate();
            view.getSize = function () { return {width : 722}; };

            var width = delegate.leftHeaderColumnWidth(1, view);
            expect(width).to.eql(100);
        });

    });
});