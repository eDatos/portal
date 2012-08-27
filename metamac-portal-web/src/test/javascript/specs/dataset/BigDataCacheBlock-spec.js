describe("BigDataCacheBlock", function () {

    var BigDataCacheBlock =  STAT4YOU.dataset.data.BigDataCacheBlock,
        Cell = STAT4YOU.Table.Cell,
        Size = STAT4YOU.Table.Size;

    it("should get region", function () {
        var options = {
            origin : new Cell(0, 0),
            size : new Size(300, 400)
        };
        var block = new BigDataCacheBlock(options);
        expect(block.getRegion()).toEqual({left : {begin : 0, end : 300}, top : { begin: 0, end : 400 }});


        var options = {
            origin : new Cell(100, 150),
            size : new Size(300, 400)
        };
        var block = new BigDataCacheBlock(options);
        expect(block.getRegion()).toEqual({left : {begin : 100, end : 400}, top : { begin: 150, end : 550 }});
    });

    it("should get state", function () {
        var block = new BigDataCacheBlock({});
        expect(block.isReady()).toBeFalsy();
        expect(block.isFetching()).toBeFalsy();

        block.apiRequest = {
            isFetching : function () {
                return true;
            }
        };

        expect(block.isReady()).toBeFalsy();
        expect(block.isFetching()).toBeTruthy();

        block.apiResponse = "mock";
        expect(block.isReady()).toBeTruthy();
        expect(block.isFetching()).toBeFalsy();
    });

});
