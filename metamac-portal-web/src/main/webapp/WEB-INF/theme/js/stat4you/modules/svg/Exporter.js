(function () {
    "use strict";

    STAT4YOU.namespace("STAT4YOU.svg.Exporter");

    STAT4YOU.svg.Exporter = function () {
    };

    STAT4YOU.svg.Exporter.prototype = {

        sanitizeSvg : function (svg) {
            // sanitize
            svg = svg
                .replace(/zIndex="[^"]+"/g, '')
                .replace(/isShadow="[^"]+"/g, '')
                .replace(/symbolName="[^"]+"/g, '')
                .replace(/jQuery[0-9]+="[^"]+"/g, '')
                .replace(/isTracker="[^"]+"/g, '')
                .replace(/url\([^#]+#/g, 'url(#')
                .replace(/ href=/g, ' xlink:href=')
                .replace(/\n/, ' ')
                .replace(/<\/svg>.*?$/, '</svg>') // any HTML added to the container after the SVG (#894)
                .replace(/&nbsp;/g, '\u00A0') // no-break space
                .replace(/&shy;/g, '\u00AD') // soft hyphen
                .replace(/fill="#F5F5F5"/g, 'fill="#FFFFFF"'); //set background to white, this is a very bad hack
            return svg;
        },

        submitInDynamicForm : function (options) {
            var $form = $('<form action="' + options.url + '" method="POST">');
            _.each(options.data, function (value, key) {
                var $input = $('<input type="hidden">');
                $input.attr('name', key);
                $input.attr('value', value);
                $form.append($input);
            });
            $form.submit();
        },

        _insertStyleInSvg : function (svg, css) {
            var firstCloseIndex = svg.indexOf(">") + 1;
            var style = '<defs><style type="text/css"><![CDATA[' + css + ']]></style></defs>';
            return svg.substring(0, firstCloseIndex) + style + svg.substring(firstCloseIndex);
        },

        addStyleAsync : function (svg) {
            var self = this;
            var response = new $.Deferred();
            var request = $.get(STAT4YOU.resourceContext + "/assets/css/map.css");
            $.when(request).done(function (css) {
                var stiledSvg = self._insertStyleInSvg(svg, css);
                response.resolveWith(null, [stiledSvg]);
            });
            return response.promise();
        },

        mimeTypeFromType : function (type) {
            var mime;
            if (type === "svg") {
                mime = "image/svg+xml";
            } else if (type === "pdf") {
                mime = "application/pdf";
            } else {
                mime = "image/png";
            }
            return mime;
        },

        processSvgElement : function (svgEl, type) {
            var $el = $(svgEl).parent();
            var svgContent = $el.html();
            var sanitizedSvg = this.sanitizeSvg(svgContent);

            var self = this;
            this.addStyleAsync(sanitizedSvg).done(function (svg) {
                self.submitInDynamicForm({
                    url : STAT4YOU.context + "/chart/export",
                    data : {
                        filename : 'chart',
                        type : self.mimeTypeFromType(type),
                        width : $el.width(),
                        scale : 2,
                        svg : svg
                    }
                });
            });

        }

    };

}());