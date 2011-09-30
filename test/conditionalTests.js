$(document).ready(function(){

    module("Conditionals");

    test("test if true node", function() {
    var tpl = "{%if condition%}True{%else%}False{%endif%}";
    var c = {condition : true};
    if ( typeof console == "object" ) console.profile();
        equals(jstpl.render(tpl,c), "True", "Should render True");
        if ( typeof console == "object" ) {
                console.profileEnd();
            if ( typeof fireunit === "object" ) {
                fireunit.getProfile();
                QUnit.log = fireunit.ok;
                QUnit.done = fireunit.testDone;
            };
        };
    });

    test("test if false node", function() {
    var tpl = "{%if condition%}True{%else%}False{%endif%}";
    var c = {condition : false};
    if ( typeof console == "object" ) console.profile();
        equals(jstpl.render(tpl,c), "False", "Should render False");
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
