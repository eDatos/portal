describe("Number Formatter", function () {

    var NumberFormatter = App.dataset.data.NumberFormatter;

    beforeEach(function () {
        SpecUtils.configureI18n('es');
    });

    describe('strToNumber', function () {

        it("should return null when no param", function () {
            expect(NumberFormatter.strToNumber()).to.be.null;
        });

        it("should return null with empty str", function () {
            expect(NumberFormatter.strToNumber('')).to.be.null;
        });

        it("should return null when input is invalid", function () {
            expect(NumberFormatter.strToNumber('abc')).to.be.null;
        });

        it("should parse integer numbers", function () {
            expect(NumberFormatter.strToNumber('123')).to.equal(123);
        });

        it("should parse float numbers with , separator", function () {
            expect(NumberFormatter.strToNumber('123,983')).to.equal(123.983);
        });

        it("should parse float numbers with thousand separator", function () {
            expect(NumberFormatter.strToNumber('12123.983')).to.equal(12123.983);
        });

    });

    describe('strNumberToLocalizedString', function () {

        var strNumberToLocalizedString = App.dataset.data.NumberFormatter.strNumberToLocalizedString;

        describe('format using locale', function () {

            it('spanish', function () {
                I18n.locale = 'es';
                expect(strNumberToLocalizedString("3954.6821602645277")).to.eql("3.954,6821602645277");
            });

            it('english', function () {
                I18n.locale = 'en';
                expect(strNumberToLocalizedString("3954.6821602645277")).to.eql("3,954.6821602645277");
            });

        });

        describe('fixed decimals', function () {

            it('should truncate value', function () {
                expect(strNumberToLocalizedString("3954.6821602645277", {decimals : 2})).to.eql("3.954,68");
            });

        });

        it('should return same value if not a number', function () {
            expect(strNumberToLocalizedString()).to.be.undefined;
            expect(strNumberToLocalizedString('..')).to.eql('..');
        });

    });

});
