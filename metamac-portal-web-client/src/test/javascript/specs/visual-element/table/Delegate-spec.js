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

            delegate = new App.Table.Delegate();
        });

        it("should return undefined if the value if undefined", function () {
            expect(delegate.format(undefined)).be.undefined;
        });

        it("should return value if the value is not a number", function () {
            var value = '.';
            expect(delegate.format(value)).to.eql(value);
        });

    });

    describe("Headers", function () {

        var view = {};

        it("left zone width = 200 if viewport width is lower or equal than 800", function () {
            var delegate = new App.Table.Delegate();
            view.getSize = function () { return {width : 722}; };

            var width = delegate.leftHeaderColumnWidth(1, view);
            expect(width).to.eql(100);
        });

    });
});