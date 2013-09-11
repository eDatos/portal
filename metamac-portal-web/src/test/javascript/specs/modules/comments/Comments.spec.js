describe("Comments", function () {
    "use strict";

    var Comments = App.modules.comments.Comments;
    var comments;
    var resourceUri = "uri:123";

    beforeEach(function () {
        comments = new Comments([], {resourceUri : resourceUri});
        comments.limit = 10;
        sinon.stub(Backbone, "ajax").returns();
    });

    afterEach(function () {
        Backbone.ajax.restore();
    });

    var expectAjaxDataEquals = function (data) {
        expect(Backbone.ajax.called).to.be.true;
        var ajaxData = Backbone.ajax.lastCall.args[0].data;
        expect(ajaxData).to.deep.equal(data);
    };

    it("should fetch comments by resource", function () {
        comments.fetch();
        expectAjaxDataEquals({
            query : "resource='" + resourceUri + "'",
            limit : 10
        });
    });

    it("should parse an api response", function () {
        var response = {
            total : 100,
            offset : 10,
            limit : 1,
            items : ['a', 'b', 'c']
        };
        var items = comments.parse(response);
        expect(items).to.equal(response.items);
        expect(comments.total).to.equal(response.total);
        expect(comments.offset).to.equal(response.offset);
        expect(comments.limit).to.equal(response.limit);
    });

    it("should convert an offset to a page", function () {
        expect(comments._offsetToPage(0)).to.equal(0);
        expect(comments._offsetToPage(9)).to.equal(0);
        expect(comments._offsetToPage(10)).to.equal(1);
    });

    it("should get current page", function () {
        comments.offset = 9;
        expect(comments.currentPage()).to.equal(0);
        comments.offset = 10;
        expect(comments.currentPage()).to.equal(1);
    });

    it("should get last page", function () {
        comments.total = 10;
        expect(comments.lastPage()).to.equal(0);
        comments.total = 11;
        expect(comments.lastPage()).to.equal(1);
    });

    it("should fetch page", function () {
        comments.total = 31;
        comments.fetchPage(1);
        expectAjaxDataEquals({
            offset : 10,
            query : "resource='" + resourceUri + "'",
            limit : 10
        });
        comments.fetchPage(3);
        expectAjaxDataEquals({
            offset : 30,
            query : "resource='" + resourceUri + "'",
            limit : 10
        });
    });

    it("should not fetch if page < 0", function () {
        comments.fetchPage(-1);
        expect(Backbone.ajax.called).to.be.false;
    });

    it("should not fetch if page > total", function () {
        comments.total = 27;
        expect(comments.lastPage()).to.equal(2);
        comments.fetchPage(3);
        expect(Backbone.ajax.called).to.be.false;
    });

    it("should fetch page 0", function () {
        comments.total = 27;
        comments.fetchPage(0);
        expect(Backbone.ajax.called).to.be.true;
    });

});
