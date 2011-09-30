/**
  * TextNode
  *
  * @constructor
  * @param {String} text Text.
  */
jstpl.TextNode = function(text) {
    this.text = text;
};

jstpl.TextNode.prototype = {

    render: function(context) {
        return this.text;
    }

};
