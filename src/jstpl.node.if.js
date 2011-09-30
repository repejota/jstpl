/**
  * If node
  *
  * @constructor
  * @param {Integer} link_type Type.
  * @param {Array} boolpairs Boolean pairs.
  * @param {Array} nodelist_true True portion.
  * @param {Array} nodelist_false False portion.
  */
jstpl.ifNode = function(link_type, boolpairs, nodelist_true, nodelist_false) {
    this.link_type = link_type;
    this.boolpairs = boolpairs;
    this.nodelist_true = nodelist_true;
    this.nodelist_false = nodelist_false;
};

/**
  * If and operator flag.
  */
jstpl.ifNode._and = 0;

/**
  * If or operator flag.
  */
jstpl.ifNode._or = 0;

jstpl.ifNode.prototype = {

    render: function(context) {
        var flag;
        if (this.link_type == jstpl.ifNode._and) {
            flag = true;
            if (this.mapBoolPair(false, context)) flag = false;
        }
        else {
            flag = false;
            if (this.mapBoolPair(true, context)) flag = true;
        }
        if (flag) {
            return jstpl.listRender(context, this.nodelist_true);
        }
        else {
            return jstpl.listRender(context, this.nodelist_false);
        }
    },

    mapBoolPair: function(tc, context) {
        for (var i = 0; i < this.boolpairs.length; i++) {
            var tmpbp = this.boolpairs[i].split(' ');
            if (tmpbp.length == 2 && tmpbp[0] == 'not') {
                if (tc != !!jstpl.getVar(context, tmpbp[1])) return true;
            }
            else {
                if (tc == !!jstpl.getVar(context, tmpbp[0])) return true;
            }
        }
        return false;
    }
};
