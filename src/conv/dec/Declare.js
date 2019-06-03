/**
 * @file Declare.js
 * @brief declare base class
 * @author simparts
 */
const Base = require('../BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().count = 0;
            this.gencnf().bsnm = ((undefined !== opt) && (undefined !== opt.bsnm)) ? opt.bsnm : '';
            this.gencnf().name = ((undefined !== opt) && (undefined !== opt.name)) ? opt.name : '';
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (val) {
        try {
            let buf  = "let ";
            let name = "";
            if ('' !== this.gencnf().name) {
                name = this.gencnf().name;
                this.gencnf().name = '';
            } else {
                this.gencnf().count++;
                name = this.gencnf().bsnm + this.gencnf().count;
            }
            buf += name;
            
            if ((undefined === val) || ("" === val)) {
                throw new Error('null value');
            }
            buf += "=" + val;
            this.add(buf);
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
}
/* end of file */
