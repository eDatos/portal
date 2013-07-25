describe("BigDataCache", function () {

    var Cache = App.dataset.data.BigDataCache,
        Cell = App.Table.Cell,
        CacheBlock = App.dataset.data.BigDataCacheBlock;

    it("should initialize the cache matrix", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100, capacity : 2});
        expect(cache.cache.length).to.equal(4);

        for (var i = 0; i < cache.cache.length; i++) {
            var cacheRow = cache.cache[i];
            expect(cacheRow.length).to.equal(3);
            for (var j = 0; j < cacheRow.length; j++) {
                var cacheCell = cacheRow[j];
                expect(cacheCell).to.exists;
                expect(cacheCell.index.x).to.equal(j);
                expect(cacheCell.index.y).to.equal(i);
            }
        }
    });

    it("should get a cacheBlock for a cell", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100});

        var block = cache.cacheBlockForCell(new Cell(0, 0));
        expect(block.origin).to.deep.equal({x : 0, y : 0});
        expect(block.index).to.deep.equal({x : 0, y : 0});

        block = cache.cacheBlockForCell(new Cell(250, 120));
        expect(block.origin).to.deep.equal({x : 200, y : 100});
        expect(block.index).to.deep.equal({x : 2, y : 1});

        block = cache.cacheBlockForCell(new Cell(-10, -10));
        expect(block).to.be.undefined;

        block = cache.cacheBlockForCell(new Cell(351, 100));
        expect(block).to.be.undefined;
    });

    it("should get neighbour cache blocks", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100});

        var block = cache.cacheBlockForCell(new Cell(0, 0));
        var neighbours = cache.neighbourCacheBlocks(block);

        expect(neighbours.length).to.equal(3);
        expect(neighbours[0].index).to.deep.equal({x : 1, y : 0});
        expect(neighbours[1].index).to.deep.equal({x : 1, y : 1});
        expect(neighbours[2].index).to.deep.equal({x : 0, y : 1});

        block = cache.cacheBlockForCell(new Cell(110, 215));
        neighbours = cache.neighbourCacheBlocks(block);

        expect(neighbours.length).to.equal(8);
        expect(neighbours[0].index).to.deep.equal({x : 1, y : 1});
        expect(neighbours[1].index).to.deep.equal({x : 2, y : 1});
        expect(neighbours[2].index).to.deep.equal({x : 2, y : 2});
        expect(neighbours[3].index).to.deep.equal({x : 2, y : 3});
        expect(neighbours[4].index).to.deep.equal({x : 1, y : 3});
        expect(neighbours[5].index).to.deep.equal({x : 0, y : 3});
        expect(neighbours[6].index).to.deep.equal({x : 0, y : 2});
        expect(neighbours[7].index).to.deep.equal({x : 0, y : 1});
    });

    function mockCacheReady (cache) {
        cache.apiRequest = 1;
        cache.apiResponse = 1;
    }

    it("should update the lru", function () {
        var cache = new Cache({rows : 1000, columns : 1000, size : 100, capacity : 3});

        var cache0 = cache.cache[0][0],
            cache1 = cache.cache[0][1],
            cache2 = cache.cache[0][2],
            cache3 = cache.cache[0][3];

        mockCacheReady(cache0);
        mockCacheReady(cache1);
        mockCacheReady(cache2);
        mockCacheReady(cache3);

        cache.cacheBlockForCell(new Cell(0, 0));
        expect(cache0.isReady()).to.be.true;

        cache.cacheBlockForCell(new Cell(100, 0));
        expect(cache1.isReady()).to.be.true;
        expect(cache2.isReady()).to.be.true;

        cache.cacheBlockForCell(new Cell(200, 0));
        expect(cache0.isReady()).to.be.true;
        expect(cache1.isReady()).to.be.true;
        expect(cache2.isReady()).to.be.true;

        cache.cacheBlockForCell(new Cell(300, 0));
        expect(cache0.isReady()).to.be.false;
        expect(cache1.isReady()).to.be.true;
        expect(cache2.isReady()).to.be.true;
        expect(cache3.isReady()).to.be.true;
    });

    it("should initialize cache block sizes", function () {
        var cache = new Cache({rows : 300, columns : 300, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 30, columns : 30});

        var cache = new Cache({rows : 1000, columns : 1, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 900, columns : 1});

        var cache = new Cache({rows : 1000, columns : 2, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 450, columns : 2});

        var cache = new Cache({rows : 2, columns : 1000, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 2, columns : 450});

        var cache = new Cache({rows : 300, columns : 2, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 300, columns : 2});

        var cache = new Cache({rows : 2, columns : 300, size : 30});
        expect(cache.cacheBlockSize).to.deep.equal({rows : 2, columns : 300});
    });

    it("should check if a cache block is ready", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100, capacity : 2});

        expect(cache.isBlockReady()).to.be.false;

        var cacheBlock = new CacheBlock({});
        sinon.stub(cacheBlock, "isReady").returns(false);
        expect(cache.isBlockReady(cacheBlock)).to.be.false;

        cacheBlock = new CacheBlock({});
        sinon.stub(cacheBlock, "isReady").returns(true);
        expect(cache.isBlockReady(cacheBlock)).to.be.true;
    });
});