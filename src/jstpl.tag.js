/**
 * Tags.
 *
 * @constructor
 * @param {Object} parser Parser.
 * @param {Object} token Token.
 */
jstpl.tag = {

    /**
     * Tag comment
     *
     * @param {Object} parser Parser.
     * @param {Object} token Token.
     * @return {Object} Comment node.
     */
    _comment: function(parser, token) {
        parser.skipPast('endcomment');
        return jstpl.CommentNode;
    },

    /**
     * Tag if
     *
     * @param {Object} parser Parser.
     * @param {Object} token Token.
     * @return {Object} If node.
     */
    _if : function(parser, token) {
        var bits = token.content.split(/\s+/);
        var link_type;
        var nodelist_true;
        var nodelist_false;
        bits.shift();
        if (!bits) {
            throw (new Error('If node need at least one args'));
        }
        var bitstr = bits.join(' '), boolpairs = bitstr.split(' or ');
        if (boolpairs.length === 1) {
            link_type = jstpl.ifNode._and;
            boolpairs = bitstr.split(' and ');
        }
        else {
            link_type = jstpl.ifNode._or;
            if (bitstr.indexOf(' and ') != -1) {
                throw (new Error('If node do not alow mix "and" & "or"'));
            }
        }
        nodelist_true = parser.parse(['else', 'endif']);
        token = parser.nextToken();
        if (token.content.indexOf('else') != -1) {
            nodelist_false = parser.parse('endif');
            parser.deleteFirstToken();
        }
        else {
            nodelist_false = [];
        }
        return new jstpl.ifNode(link_type,
                                boolpairs,
                                nodelist_true,
                                nodelist_false);
    },

    /**
     * Tag for
     *
     * @param {Object} parser Parser.
     * @param {Object} token Token.
     * @return {Object} For node.
     */
    _for: function(parser, token) {
        var bits = token.content.split(/\s+/);
        if (bits.length == 5 && bits[4] !== 'reversed') {
            throw (new Error('The 4 arg of for tag must be reversed'));
        }
        if ((bits.length<4) || (bits.length>5)) {
            throw (new Error('The for tag should have 4 or 5 args'));
        }
        if (bits[2] !== 'in') {
            throw (new Error('The 2nd arg of for tag must be "in"'));
        }
        var loopvar = bits[1];
        var sequence = bits[3];
        var reversed = (bits.length === 5);
        var nodelist_loop = parser.parse('endfor');
        parser.deleteFirstToken();
        return new jstpl.forNode(loopvar,
                                 sequence,
                                 reversed,
                                 nodelist_loop);
    }
};
