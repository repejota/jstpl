(function (window) {


    var jstpl = new function() {

        // Strict mode
        "use strict";

        // Tag and Variable Definitions
        this.TAG_START = '{%';
        
        this.TAG_END = '%}';
        
        this.VAR_START = '{{';
        
        this.VAR_END = '}}';

        // Type VAR_TOKEN = 0
        this.VAR_TOKEN = 0;

        // Type TAG_TOKEN = 1
        this.TAG_TOKEN = 1;

        // Type TEXT_TOKEN = 2
        this.TEXT_TOKEN = 2;

        /**
         * Build regexp based on tag and variable start/end
         *
         * @this jstpl template engine.
         * @return {String} regexp.
         */
        var regx = '(';
        regx += this.TAG_START.replace(/(\(|\)|\{|\})/g, '\\$1');
        regx += '.*?';
        regx += this.TAG_END.replace(/(\(|\)|\{|\})/g, '\\$1');
        regx += '|';
        regx += this.VAR_START.replace(/(\(|\)|\{|\})/g, '\\$1');
        regx += '.*?';
        regx += this.VAR_END.replace(/(\(|\)|\{|\})/g, '\\$1');
        regx += '|$)';
        console.debug(regx);
        var tag_re = new RegExp(regx, 'g');

        /*
         * Create a token from single template bit
         *
         * @param bit Template source portion
         */
        this.createToken = function(bit) {
            if (bit.indexOf(jstpl.TAG_START)===0) {
                return new jstpl.token(jstpl.TAG_TOKEN,
                    bit.slice(
                        jstpl.TAG_START.length,
                        -jstpl.TAG_END.length
                    )
                );
            }
            else if (bit.indexOf(jstpl.VAR_START)===0) {
                    return new jstpl.token(jstpl.VAR_TOKEN,
                        bit.slice(
                            jstpl.VAR_START.length,
                            -jstpl.VAR_END.length
                        )
                    );
                }
            else {
                return new jstpl.token(jstpl.TEXT_TOKEN, bit);
            }
        };

        /**
         * Compiles a template
         *
         * @this jstpl engine.
         * @param {String} template source.
         * @return {Array} template nodelist.
         */
        this.compile = function(template) {
            var bits = jstpl.stringBuilder.bsplit(template,tag_re);
            bits = jstpl.arrayBuilder.filter(bits,'');
            var tokens = bits.map(this.createToken);
            return new jstpl.parser(tokens).parse();
        };

        /**
         * Renders a template with a given context
         *
         * @this jstpl engine.
         * @param {String} template source.
         * @param {Object} context Object with context data to use with
         *                 template.
         * @return {String} result after parsing and merging context and
         *                  template source.
         */
        this.render = function(template, context) {
            var result = [];
            this.compile(template).map(function(node) {
                if (typeof(node) == 'object') {
                    if (typeof(node.render) == 'function') {
                        result.push(node.render(context));
                    }
                    else result.push(node.toString());
                }
                else result.push(node.toString());
            });
            return result.join('');
        };

        /**
         * Gets a variable value from context based on its key
         *
         * @param {Object} context Javascript object.
         * @param {String} varstr Variable key.
         * @return {Object} context processed.
         */
        this.getVar = function(context, varstr) {
            varstr.split('.').map(function(i) {
                context = context[i];
            });
            return context;
        };

        /**
         * Renders a list filling variables from context
         *
         * @param {Object} context Context Javascript object.
         * @param {Array} nodelist List of tokens to parse.
         * @return {String} rendered list.
         */
        this.listRender = function(context, nodelist) {
            return nodelist.map(function(node) {
                return node.render(context);
            }).join('');
        };

    }


    /**
 * array utilities
 *
 * @constructor
 * @param {Array} arr Array initialization.
 */
jstpl.arrayBuilder = {

    filter: function(arr,con) {
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != con) {
                ret.push(arr[i]);
            }
        }
        return ret;
    }
    
};


    /**
 * string utilities
 *
 * @constructor
 * @param {String} str String initialization.
 */
jstpl.stringBuilder = {

    bsplit: function(str, pat) {
        var cursor = 0;
        var result = [];
        str.replace(pat, function(m1, m2, n) {
            result.push(str.slice(cursor, n));
            result.push(m1);
            cursor = n + m1.length;
        });
        return result;
    }
    
};


    /**
 * Filters
 *
 */
jstpl.filter = {};


    /**
  * Parser
  *
  * @constructor
  * @param {Array} tokens Tokens array.
  */
jstpl.parser = function(tokens) {
    this.tokens = tokens;
};

jstpl.parser.prototype = {

    parse: function(parse_until) {
        if (!parse_until) parse_until = [];
        if (!(parse_until instanceof Array)) parse_until = [parse_until];
        var nodelist = [];
        var token = null;
        var tagFuncName = null;
        var tagFunc = null;
        while (this.tokens.length) {
            var token = this.tokens.shift();
            if (token.tokentype == jstpl.TEXT_TOKEN) {
                nodelist.push(new jstpl.TextNode(token.content));
            }
            else if (token.tokentype == jstpl.VAR_TOKEN) {
                nodelist.push(new jstpl.VarNode(token.content));
            }
            else if (token.tokentype == jstpl.TAG_TOKEN) {
                if (parse_until.indexOf(token.content)!=-1) {
                    this.prependToken(token);
                    return nodelist;
                }
                tagFuncName = "_"+token.content.split(/\s+/)[0];
                if (!tagFuncName)throw (new Error('Empty Tag ' + tagFuncName));
                tagFunc = jstpl.tag[tagFuncName];
                if (!tagFunc)throw (new Error('Unknow Tag ' + tagFuncName));
                nodelist.push(tagFunc(this, token));
            }
        }
        return nodelist;
    },

    skipPast: function(endtag) {
        while (this.tokens.length) {
            var token = this.tokens.shift();
            if (token.tokentype == jstpl.TAG_TOKEN && token.content == endtag) {
                return;
            }
        }
        throw (new Error('Not Closed Tag'));
    },

    prependToken: function(token) {
        this.tokens.unshift(token);
    },

    nextToken: function() {
        return this.tokens.shift();
    },

    deleteFirstToken: function() {
        this.tokens.shift();
        return true;
    }
};


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


    /**
 * Token
 *
 * @constructor
 *
 * @param {Integer} tokentype Type of token.
 * @param {Object} content Token content.
 */
jstpl.token = function(tokentype, content) {
    this.tokentype = tokentype;
    this.content = content;
};


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


    /**
 * CommentNode
 *
 * @constructor
 */
jstpl.CommentNode = {

    render: function() {
        return '';
    }

};


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



// Expose webjs to the global object
window.jstpl = jstpl;

})(window);