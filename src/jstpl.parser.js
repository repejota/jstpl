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
