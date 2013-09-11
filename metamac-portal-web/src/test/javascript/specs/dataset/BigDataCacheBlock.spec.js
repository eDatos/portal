describe("BigDataCacheBlock", function () {

    var BigDataCacheBlock =  App.dataset.data.BigDataCacheBlock,
        Cell = App.Table.Cell,
        Size = App.Table.Size;

    it("should get region", function () {
        var options = {
            origin : new Cell(0, 0),
            size : new Size(300, 400)
        };
        var block = new BigDataCacheBlock(options);
        expect(block.getRegion()).to.deep.equal({left : {begin : 0, end : 300}, top : { begin: 0, end : 400 }});


        var options = {
            origin : new Cell(100, 150),
            size : new Size(300, 400)
        };
        var block = new BigDataCacheBlock(options);
        expect(block.getRegion()).to.deep.equal({left : {begin : 100, end : 400}, top : { begin: 150, end : 550 }});
    });

    it("should get state", function () {
        var block = new BigDataCacheBlock({});
        expect(block.isReady()).to.be.false;
        expect(block.isFetching()).to.be.false;

        block.apiRequest = {
            isFetching : function () {
                return true;
            }
        };

        expect(block.isReady()).to.be.false;
        expect(block.isFetching()).to.be.true;

        block.apiResponse = "mock";
        expect(block.isReady()).to.be.true;
        expect(block.isFetching()).to.be.false;
    });

});
