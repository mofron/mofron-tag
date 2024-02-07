/**
 * @file Config.js
 * @brief config script generator
 * @author simparts
 */
const Base   = require('./../base/BaseGen.js');
const util   = require('../../util.js');
const Spkeys = require('./Spkeys.js');

module.exports = class extends Base {
    
    cnfcode (prm) {
        try {
            let ret = "";
	    let buf = null;
	    let atr = null;
            
	    for (let aidx in prm.attrs) {
                atr = prm.attrs[aidx];
                /* check special key */
                buf = new Spkeys(this, prm).toScript(aidx, atr);
		if (null !== buf) {
		    ret += buf;
                    continue;
		}
                
		buf = util.getParam(atr);
		if (undefined !== buf) {
		    ret += aidx + ":" + buf + ","
		}
	    }
            
	    return ("," === ret[ret.length-1]) ? ret.substring(0, ret.length-1) : ret;
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }

    toScript () {
        try {
	    let prm = this.param();
            this.add(prm.name + ".config({" + this.cnfcode(prm) + "});");
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
