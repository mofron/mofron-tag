/**
 * @file Declare.js
 * @brief declare base class
 * @author simparts
 */
const Base = require('../BaseGen.js');

module.exports = class extends Base {
    
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().count = 0;
            this.gencnf().bsnm = (undefined !== opt.bsnm) ? opt.bsnm : '';
            this.gencnf().name = (undefined !== opt.name) ? opt.name : '';
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (val) {
        try {
            let ret = "";
            ret += (false === this.gencnf().minify) ? "    " : "";
            ret += "let ";
            if ('' !== this.gencnf().name) {
                ret += this.gencnf().name;
                this.gencnf().name = '';
            } else {
                this.gencnf().count++;
                ret += this.gencnf().bsnm + this.gencnf().count;
            }
            if ((undefined === val) || ("" === val)) {
                throw new Error('null value');
            }
            ret += "=" + val;
            ret += (false === this.gencnf().minify) ? "\n" : "";
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
}
/* end of file */
