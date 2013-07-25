describe("PermalinkBuilder", function () {
    "use strict";

    var PermalinkBuilder = App.modules.dataset.PermalinkBuilder;
    var OptionsModel = App.modules.dataset.OptionsModel;

    var provider = "INE";
    var identifier = "PARO";
    var type = "table";
    var selection = "abc";
    var uri = "App:abc";

    beforeEach(function () {

        var filterOptions = {
            metadata : {
                getProvider : function () {
                    return provider;
                },
                getIdentifier : function () {
                    return identifier;
                },
                getUri : function () {
                    return uri;
                }
            }
        };

        var optionsModel = new OptionsModel({type : 'table'});

        App.context = "/App-web/";

        var mockPermalink = new Backbone.Model({identifier : selection});
        mockPermalink.save = function () {
            var result = $.Deferred();
            result.resolve();
            return result.promise();
        };

        this.permalinkBuilder = new PermalinkBuilder({filterOptions : filterOptions, optionsModel : optionsModel});
        this.permalinkBuilder._createPermalinkModel = function () {
            return mockPermalink;
        };
    });

    it("should create a share url", function () {

        var expectedUrl = window.location.protocol +
            "//" +
            window.location.host +
            App.context +
            "/providers/" + provider +
            "/datasets/" + identifier +
            "/#" +
            "type/" + type +
            "/selection/" + selection;


        this.permalinkBuilder.createPermalink().always(function (url) {
            expect(expectedUrl).to.equal(url);
        });

    });

    it("should create a relative share url", function () {

        var expectedUrl = "/providers/" + provider +
            "/datasets/" + identifier +
            "/#" +
            "type/" + type +
            "/selection/" + selection;

        this.permalinkBuilder.createPermalink({relative : true}).always(function (url) {
            expect(expectedUrl).to.equal(url);
        });

    });

});