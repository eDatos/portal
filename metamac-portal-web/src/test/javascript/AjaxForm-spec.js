describe("ajax form", function(){
    it("should intercept form submit and change location with #!/", function(){
        var $form, ajaxForm;
        $form = $('<form action="formDestination"><input name="q" value="query"></form>');
        ajaxForm = new STAT4YOU.libs.AjaxForm($form);
        expect(ajaxForm.url).toEqual("formDestination#!/?q=query");
    });

    it("should encode spaces as +", function(){
        var $form, ajaxForm;
        $form = $('<form action="formDestination"><input name="q" value="periodo anual"></form>');
        ajaxForm = new STAT4YOU.libs.AjaxForm($form);
        expect(ajaxForm.url).toEqual("formDestination#!/?q=periodo+anual");
    });

});