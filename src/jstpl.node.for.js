/**
  * ForNode
  *
  * @constructor
  *
  * @param {String} loopvar Loop variable.
  * @param {Array} sequence Sequence.
  * @param {Boolean} reversed Reversed.
  * @param {Array} nodelist_loop Node List.
  */
jstpl.forNode = function(loopvar, sequence, reversed, nodelist_loop) {
    this.loopvar = loopvar;
    this.sequence = sequence.split('.');
    this.reversed = reversed;
    this.nodelist_loop = nodelist_loop;
};

jstpl.forNode.prototype = {

    render: function(context) {
        var result = [];
        var parentloop;
        var items = context;
        if (context['forloop']) parentloop = context['forloop'];
        for (var k = 0; k < this.sequence.length; k++) {
            items = items[this.sequence[k]];
        }
        if (!(items instanceof Array)) throw new Error('values is not a array');
        if (this.reversed) items = items.reverse();
        for (var i = 0; i < items.length; i++) {
            context['forloop'] = {
                //shortcuts for current loop iteration number
                'counter0': i,
                'counter': i + 1,
                //reverse counter iteration numbers
                'revcounter': items.length - i,
                'revcounter0': items.length - i - 1,
                //boolean values designating first and last times through loop
                'first': (i == 0),
                'last': (i == items.length - 1),
                'parentloop': parentloop
            };
            context[this.loopvar] = items[i];
            result.push(jstpl.listRender(context, this.nodelist_loop));
        }
        context['forloop'] = undefined;
        return result.join('');
    }

};
