/**
  * VarNode
  *
  * @constructor
  * @param {String} name Variable name.
  */
jstpl.VarNode = function(name) {
    this.name = name;
};

jstpl.VarNode.prototype = {

    render: function(context) {
        return jstpl.getVar(context, this.name);
    }

};
