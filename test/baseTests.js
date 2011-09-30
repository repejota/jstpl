$(document).ready(function(){

    test("dummy test case", function() {
        ok( true, "this test is fine" );
    });

    module("Base");

    test("test simple template", function() {
        var tpl = "Name";
        var c = {};
        if ( typeof console == "object" ) console.profile();
            equals(jstpl.render(tpl,c), "Name", "Should render Name");
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

