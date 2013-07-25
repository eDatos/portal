(function () {

    STAT4YOU.namespace('STAT4YOU.Map.CredistView');

    var SVGNode = STAT4YOU.svg.SVGNode;

    STAT4YOU.Map.CredistView = Backbone.View.extend({

        render : function () {
            var creditsNode = new SVGNode('text');
            creditsNode.node.textContent = "stat4you.com";
            creditsNode.set({"class" : "credits"});

            var elNode = new SVGNode(this.el);
            elNode.append(creditsNode);

            var frame = {
                width : $(this.options.container).width(),
                height : $(this.options.container).height()
            };
            creditsNode.alignBottomRight(frame, 0, 0);
        }

    });

}());