describe("BigDataCache", function () {

    var Cache = STAT4YOU.dataset.data.BigDataCache,
        Cell = STAT4YOU.Table.Cell;

    it("should initialize the cache matrix", function (){
        var cache = new Cache({rows : 350, columns : 250, size : 100});
        expect(cache.cache.length).toEqual(4);
        expect(cache.cache[0].length).toEqual(3);
    });

    it("should get a cacheBlock for a cell", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100});

        var block = cache.cacheBlockForCell(new Cell(0, 0));
        expect(block.origin).toEqual({x : 0, y : 0});
        expect(block.index).toEqual({x : 0, y : 0});

        block = cache.cacheBlockForCell(new Cell(250, 120));
        expect(block.origin).toEqual({x : 200, y : 100});
        expect(block.index).toEqual({x : 2, y : 1});

        block = cache.cacheBlockForCell(new Cell(-10, -10));
        expect(block).toBeUndefined();

        block = cache.cacheBlockForCell(new Cell(351, 100));
        expect(block).toBeUndefined();
    });

    it("should get neighbour cache blocks", function () {
        var cache = new Cache({rows : 350, columns : 250, size : 100});

        var block = cache.cacheBlockForCell(new Cell(0, 0));
        var neighbours = cache.neighbourCacheBlocks(block);

        expect(neighbours.length).toEqual(3);
        expect(neighbours[0].index).toEqual({x : 1 , y : 0});
        expect(neighbours[1].index).toEqual({x : 1 , y : 1});
        expect(neighbours[2].index).toEqual({x : 0 , y : 1});

        block = cache.cacheBlockForCell(new Cell(110, 215));
        neighbours = cache.neighbourCacheBlocks(block);

        expect(neighbours.length).toEqual(8);
        expect(neighbours[0].index).toEqual({x : 1 , y : 1});
        expect(neighbours[1].index).toEqual({x : 2 , y : 1});
        expect(neighbours[2].index).toEqual({x : 2 , y : 2});
        expect(neighbours[3].index).toEqual({x : 2 , y : 3});
        expect(neighbours[4].index).toEqual({x : 1 , y : 3});
        expect(neighbours[5].index).toEqual({x : 0 , y : 3});
        expect(neighbours[6].index).toEqual({x : 0 , y : 2});
        expect(neighbours[7].index).toEqual({x : 0 , y : 1});
    });

    it("should update the lru", function () {
        var cache = new Cache({rows : 1000, columns : 1000, size : 100, capacity : 3});

        cache.cacheBlockForCell(new Cell(0, 0));
        expect(cache.cache[0][0]).toBeDefined();

        cache.cacheBlockForCell(new Cell(100, 0));
        expect(cache.cache[0][0]).toBeDefined();
        expect(cache.cache[0][1]).toBeDefined();

        cache.cacheBlockForCell(new Cell(200, 0));
        expect(cache.cache[0][0]).toBeDefined();
        expect(cache.cache[0][1]).toBeDefined();
        expect(cache.cache[0][2]).toBeDefined();

        cache.cacheBlockForCell(new Cell(300, 0));
        expect(cache.cache[0][0]).toBeUndefined();
        expect(cache.cache[0][1]).toBeDefined();
        expect(cache.cache[0][2]).toBeDefined();
        expect(cache.cache[0][3]).toBeDefined();
    });

    it("should initialize cache block sizes", function () {
        var cache = new Cache({rows : 300, columns : 300, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 30, columns : 30});

        var cache = new Cache({rows : 1000, columns : 1, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 900, columns : 1});

        var cache = new Cache({rows : 1000, columns : 2, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 450, columns : 2});

        var cache = new Cache({rows : 2, columns : 1000, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 2, columns : 450});

        var cache = new Cache({rows : 300, columns : 2, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 300, columns : 2});

        var cache = new Cache({rows : 2, columns : 300, size : 30});
        expect(cache.cacheBlockSize).toEqual({rows : 2, columns : 300});
    });
});