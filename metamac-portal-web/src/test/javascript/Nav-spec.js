describe("Menu", function(){

    var Nav = STAT4YOU.modules.Nav;

    function createMenu(elements){
        var $menu = $('<ul class="nav links"></ul>');
        $.each(elements, function(index, element){
            $menu.append('<li><a href="' + element + '">' + index + '</a></li>');
        });

        var $container = $('<div class="nav"></div>').append($menu);
        return $container;
    }

    it("should set active class to links with href to location", function(){
        var el, firstA;

        el = createMenu(["/stat4you/a", "/stat4you/b"]);
        var menu = new Nav({el : el, location : "/stat4you/a"});

        firstA = el.find('li:eq(0)');
        expect(firstA.hasClass('active')).toBeTruthy();
    });

    it("should set active class to links with href to partial location", function(){
        var el, firstA;

        el = createMenu(["/stat4you/providers", "/stat4you/b", "/stat4you/c"]);
        var menu = new Nav({el : el, location : "/stat4you/providers/123"});
        firstA = el.find('li:eq(0)');

        expect(firstA.hasClass('active')).toBeTruthy();
    });

    it("should not set active class in dataset page", function(){
        var el = createMenu(["/stat4you/providers", "/stat4you/b", "/stat4you/c"]);
        var menu = new Nav({el : el, location : "/stat4you/providers/123/datasets"});
        var actives = $('.active', el);
        expect(actives.length).toEqual(0);
    });



});