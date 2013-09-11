describe("CommentsView", function () {

    var CommentsView = App.modules.comments.CommentsView;
    var Comments = App.modules.comments.Comments;
    var view, collection;

    beforeEach(function () {
        collection = new Comments([], {});
        view = new CommentsView({collection : collection});
    });

    it("templates should be defined", function () {
        expect(view.template).to.exists;
        expect(view.counterTemplate).to.exists;
        expect(view.paginationTemplate).to.exists;
    });

    describe("pagination", function () {
        var $paginationContainer;

        beforeEach(function () {
            $paginationContainer = $('<div class="comments-list-pagination"></div>');
            view.$el.append($paginationContainer);

            sinon.stub(Backbone, "ajax");
        });

        afterEach(function () {
            Backbone.ajax.restore();
        });

        it("should not render pagination if total = 0", function () {
            collection.total = 0;
            view.renderPagination();
            expect($paginationContainer.html()).to.equal("");
        });

        it("should set active items rendering the first page", function () {
            view.collection.total = 27;
            sinon.stub(view.collection, "currentPage").returns(0);
            sinon.stub(view.collection, "lastPage").returns(2);

            view.renderPagination();
            expect($paginationContainer.find('.pagination-page').length).to.equal(3);
            expect($paginationContainer.find('.active > a').text()).to.equal("0");
            expect($paginationContainer.find('.disabled > .pagination-next').length).to.equal(0);
            expect($paginationContainer.find('.disabled > .pagination-previous').length).to.equal(1);
        });

        it("should set active items rendering the last page", function () {
            view.collection.total = 27;
            sinon.stub(view.collection, "currentPage").returns(2);
            sinon.stub(view.collection, "lastPage").returns(2);

            view.renderPagination();
            expect($paginationContainer.find('.pagination-page').length).to.equal(3);
            expect($paginationContainer.find('.active > a').text()).to.equal("2");
            expect($paginationContainer.find('.disabled > .pagination-next').length).to.equal(1);
            expect($paginationContainer.find('.disabled > .pagination-previous').length).to.equal(0);
        });

        describe("clicks", function () {
            beforeEach(function () {
                view.collection.total = 27;
                sinon.stub(view.collection, "currentPage").returns(1);
                sinon.spy(view.collection, "fetchPage");
                view.renderPagination();
            });

            it("should fetch previous page on click <<", function () {
                $paginationContainer.find(".pagination-previous").click();
                expect(view.collection.fetchPage.calledWith(0)).to.be.true;
            });

            it("should fetch previous page on click >>", function () {
                $paginationContainer.find(".pagination-next").click();
                expect(view.collection.fetchPage.calledWith(2)).to.be.true;
            });

            it("should fetch a page", function () {
                $paginationContainer.find(".pagination-page:eq(2)").click();
                expect(view.collection.fetchPage.calledWith(2)).to.be.true;
            });

        });

    });

    describe("counter", function () {

        var $counterContainer;

        beforeEach(function () {
            $counterContainer = "<div class='comments-counter'></div>";
            view.$el.append($counterContainer);
        });

        it("should render counter", function () {
            collection.total = 20;
            sinon.spy(view, "counterTemplate");
            view.renderCounter();
            expect(view.counterTemplate.calledWith({total : collection.total })).to.be.true;
        });
    });

    describe("render", function () {

        it("should show login message if not logged user", function () {
            App.user = undefined;
            view.render();
            expect(view.$el.find('.new-comment-text').length).to.equal(0);
        });

        it("should show the textarea if the users is logged", function () {
            App.user = {};
            view.render();
            expect(view.$el.find('.new-comment-text').length).to.equal(1);
        });
    });

    describe("submit", function () {
        it("should send new comment", function () {
            sinon.stub($, "ajax").returns({
                success : function () {

                },
                fail : function () {

                }
            });

            App.user = {
                get : function () {
                    return "axelhzf";
                }
            };
            view.render();
            view.$textarea.val('nuevo comentario');

            view.submit();

            var ajaxParams = $.ajax.lastCall.args[0];
            expect(ajaxParams.data).to.equal('{"user":{"identifier":"axelhzf"},"content":"nuevo comentario"}');
        });

        it("when success should fetch the last page", function () {
            view.$textarea = $('<textarea>comentario</textarea>');
            sinon.spy(view.collection, "fetchPage");
            view.collection.total = 30;
            view.submitSuccess();
            expect(view.$textarea.val()).to.equal("");
            expect(view.collection.fetchPage.calledWith(3)).to.be.true;
        });
    });
});
