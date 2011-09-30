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
