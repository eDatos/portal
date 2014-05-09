(function () {

    App.namespace('App.Map.CredistView');

    var SVGNode = App.svg.SVGNode;

    App.Map.CredistView = Backbone.View.extend({

        render : function () {
            var creditsNode = new SVGNode('text');
            creditsNode.node.textContent = I18n.t("credits.text");
            creditsNode.set({"class" : "credits"});

            var elNode = new SVGNode(this.el);
            elNode.append(creditsNode);

            var frame = {
                width : $(this.options.container).width(),
                height : $(this.options.container).height()
            };
            creditsNode.alignBottomRight(frame, 0, 10);
        }

    });

}());