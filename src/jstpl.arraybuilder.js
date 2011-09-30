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
