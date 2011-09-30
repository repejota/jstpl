$(document).ready(function(){

    module("Loops");

    test("test for node", function() {
        var tpl = "{%for item in list%}{{forloop.counter}} {{item.value}}, {%endfor%}";
        var c = {
            list : [
                {value: 'value1'},
                {value: 'value2'},
                {value: 'value3'}
            ]
        };
        if ( typeof console == "object" ) console.profile();
        equals(jstpl.render(tpl,c), "1 value1, 2 value2, 3 value3, ", "Should render a list");
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
