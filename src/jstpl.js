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
