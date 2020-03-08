/**
 * @file Declare.js
 * @brief declare base class
 * @author simparts
 */
const Base = require('./BaseGen.js');
const util = require('../../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);

	    /* default config */
            this.gencnf().count = 0;
            this.gencnf().bsnm  = '';
            this.gencnf().name  = '';

            /* set config */
	    this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    name () {
        try {
            if ('' !== this.gencnf().name) {
                return this.gencnf().name;
            } else {
                return this.gencnf().bsnm + (this.gencnf().count+1);
            }
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    value (prm) {
        try {
            return super.param(prm);
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    toScript () {
        try {
            let val  = this.value();
            if ((undefined === val) || ("" === val)) {
                throw new Error('null value');
            }
            this.add("let " + this.name() + "=" + val);

            let ret = this.m_script;

            /* configure for next declare */
	    this.m_script = "";
	    if ('' !== this.gencnf().name) {
	        this.gencnf().name = '';
	    } else {
                this.gencnf().count++;

	    }
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
}
/* end of file */
