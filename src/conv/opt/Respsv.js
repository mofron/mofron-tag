/**
 * @file Respsv.js
 * @brief component respsv generator
 * @author simparts
 */
const Base = require('../BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    constructor (opt, gen) {
        try {
            opt.optgen = gen;
            super(opt);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (prm) {
        try {
            let ret = "{";
            for (let atr in prm.attrs) {
                ret += atr + ':' + this.gencnf().optgen._optgen(prm.attrs[atr]) + ',';
            }
            ret = ret.substring(0, ret.length-1);
            
            ret += "}";
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
