$(document).ready(function(){

    module("Variable");

    test("test variable node", function() {
    var tpl = "Variable value : {{varname}}";
    var c = {varname : 'varvalue'};
        if ( typeof console == "object" ) console.profile();
        equals(jstpl.render(tpl,c), "Variable value : varvalue", "Should render a variable value");
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
