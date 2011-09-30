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
