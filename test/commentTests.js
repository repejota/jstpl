$(document).ready(function(){
    module("Comments");
    test("test comment node", function() {
        var tpl = "{%comment%}{{no}}{%endcomment%}yes";
        var c = {no : 'no'};
        if ( typeof console == "object" ) console.profile();
        equals(jstpl.render(tpl,c), "yes", "Should render only yes");
        if ( typeof console == "object" ) {
                console.profileEnd();
            if ( typeof fireunit === "object" ) {
                fireunit.getProfile();
                QUnit.log = fireunit.ok;
                QUnit.done = fireunit.testDone;
            };
        };
    });
});
