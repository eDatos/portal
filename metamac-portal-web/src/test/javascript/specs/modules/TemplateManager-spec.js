/**
 *
 */
describe("Template manager", function(){

    describe("dev", function () {

        beforeEach(function(){
            STAT4YOU.templateManager.config.mode = 'dev';
            STAT4YOU.templateManager.disabled = false;
        });

        afterEach(function(){
            STAT4YOU.templateManager.config.mode = 'prod';
            STAT4YOU.templateManager.disabled = true;
        });

        STAT4YOU.resourceContext = 'fakeContext';

        function fakeAjaxResponse(templateName, templateContent){
            return function(params){
                expect(params.url).toEqual(STAT4YOU.resourceContext  + "js/stat4you/views/" + templateName + ".html");
                params.success(templateContent);
            };
        }

        function fakeTemplateFile(templateName, templateContent){
            spyOn($, "ajax").andCallFake(fakeAjaxResponse(templateName, templateContent));
        }

        it("should get template by name", function(){
            fakeTemplateFile("template1", "fakeTemplate");
            var template1 = STAT4YOU.templateManager.get("template1");
            expect(template1()).toEqual("fakeTemplate");
        });

        it("should get a handlebars function as a template", function(){
            fakeTemplateFile("template2", "template : {{a}}");
            var template2 = STAT4YOU.templateManager.get("template2");
            expect(template2({a : "hola"})).toEqual("template : hola");
        });

        it("should cache templates by name", function(){
            var ajaxSpy = spyOn($, "ajax").andCallFake(fakeAjaxResponse("template", "content"));
            var template1call = STAT4YOU.templateManager.get("template");
            template1call();
            var template2call = STAT4YOU.templateManager.get("template");
            template2call();

            expect(ajaxSpy.callCount).toEqual(1);
            expect(template1call).toEqual(template2call);
        });
    });

    describe("prod", function () {
        it("should get template by name", function(){
            Handlebars.templates.template1prod = function () {};
            var template1 = STAT4YOU.templateManager.get("template1prod", { mode : 'prod' });
            expect(template1).toBe(Handlebars.templates.template1prod);
        });

    });
});