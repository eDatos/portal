describe("PaginableCollection", function () {
    describe("_extendFetchOptionsWithPagination", function () {

        var obj;

        beforeEach(function () {
            obj = {
                fetch : sinon.spy()
            };
            _.extend(obj, App.mixins.PaginableCollection);
        });

        it("fetchCurrentPage", function () {
            obj.fetchCurrentPage({data : { q : 'q'}});
            expect(obj.fetch.calledWith({
                data : {
                    q : "q",
                    limit : 10,
                    offset : 0
                },
                traditional : true,
                remove : true,
                reset : true
            })).to.be.true;
        });

        it("should set default pagination if no attribute defined", function () {
            obj.fetchNextPage({data : { q : 'q'}});
            expect(obj.fetch.calledWith({
                data : {
                    q : "q",
                    limit : 10,
                    offset : 10
                },
                traditional : true,
                remove : false,
                reset : false
            })).to.be.true;
        });

    });
});