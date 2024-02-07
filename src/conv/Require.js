/**
 * @file Require.js
 * @brief module declare genelator
 * @author simparts
 */
const Base = require('./base/BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            
	    this.gencnf().defidt  = 0;
            this.gencnf().comment = "require";
            this.m_mofron = true;

            /* set config */
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    mofron_flag (prm) {
        try {
            this.m_mofron = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    toScript () {
        try {
	    super.toScript();
            if (true === this.m_mofron) {
                this.add("require('mofron');",0);
            }

	    let prm = this.param();
            
	    /* const XXX = require('xxx') */
	    let line = "";
            for (let pidx in prm) {
	        line = (null === prm[pidx].text) ? "" : "const " + prm[pidx].text + "=";
                line += "require(";
		
                if (true === util.isComment(prm[pidx].attrs.load)) {
                    line += prm[pidx].attrs.load + ");";
                } else {
                    line += "'" + prm[pidx].attrs.load + "');";
                }
                this.add(line, 0);
            }

            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
