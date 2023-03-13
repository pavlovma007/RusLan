module.exports.constants = {
    'canvasMargin':	100,
    'nodeSize':		100,
    'messageSize':	20
}





/** Returns 1 if the value is > 0, -1 if the value is < 0, or 0 if the value is exactly 0 */
module.exports.sign = function(value) {
    return (value > 0 ? 1 : (value < 0 ? -1 : 0));
}

/** Returns a random integer in the range [0, value) */
module.exports.randIntUnder = function(value) {
    return Math.floor(Math.random()*value);
}

/** Returns a random integer in the range [value1, value2] */
module.exports.randIntIn = function(value1, value2) {
    return value1 + randIntUnder(value2 + 1 - value1);
}

/** Given a dictionary and a value, find the first key that maps to that value */
const getKeyFromValue = function(dict, value) {
    for (let key in dict) {
        if (dict[key] == value)
            return key;
    }
    return null;
}

/** Turn a simple dictionary (i.e. height = 1) into a string */
const dumbStringify = function(dict) {
    if (!dict) return '(null)';
    let s = '{';
    for (let key in dict) {
        s += key + ': ' + dict[key] + '; ';
    }
    s += '}';
    return s;
}

/** Read an array and see if a common value exists */
module.exports.commonValue = function(arr) {
    const thresh = .500000001;
    let n = -1;
    const vals = {};
    for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        if (!vals[val]) vals[val] = 0;
        vals[val]++;
        n++;
    }
    for (let key in vals) {
        if (n == 0 || vals[key] / n > thresh)
            return key;
    }
    return null;
}

/** Remove all matching values from an array */
// http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
const removeA = function(arr) {
    let what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

Array.prototype.contains = function(obj){
    for (let i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
