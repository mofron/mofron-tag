/**
 * @file Media.js
 * @brief media script generator
 * @author simparts
 */
const Base = require('./base/BaseGen.js');
const util = require('../util.js');

module.exports = class extends Base {
    
    constructor (prm, cnf) {
        try {
            super(prm);
            this.gencnf().comment = "access";
            this.gencnf(cnf);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    access (prm) {
        try {
            let chk = "{";
	    chk += "device:";
            chk += ("default" === prm.attrs.device) ? "'display'" : "'" + prm.attrs.device + "'";
	    chk += ",";
            
            if (undefined !== prm.attrs.os) {
                chk += "os:" + "'" + prm.attrs.os + "',"
            }
            if (undefined !== prm.attrs.browser) {
                chk += "browser:" + "'" + prm.attrs.browser + "',";
            }
            chk = chk.substring(0, chk.length-1) + "}";
            return "mofron.util.common.chkacc("+chk+")";
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    style (prm) {
        try {
	    if (undefined === prm.attrs.target) {
                prm.attrs.target = "html";
	    }
            if ( ("html" !== prm.attrs.target) &&
	         ("body" !== prm.attrs.target)) {
                throw new Error("invalid target:" + prm.attrs.target);
	    }
	    let tgt = "document.documentElement.setAttribute";
	    if ("html" !== prm.attrs.target) {
	        tgt ="document.body.setAttribute";
	    }
	    tgt += "('style','" + prm.text + "');";
	    return tgt;
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    toScript () {
        try {
	    super.toScript();
            let prm = this.param();

	    for (let chd_idx in prm.child) {
	        let chd = prm.child[chd_idx];
                this.add("if(true===" + this.access(chd) + "){");
		if (undefined !== chd.attrs.orientation) {
		    let orit = chd.attrs.orientation; 
		    if (("landscape" !== orit) && ("portrait" !== orit)) {
                        throw new Error("invalid orientation:"+orit);
		    }
		    let chk_orit = "is"+orit.toUpperCase()[0] + orit.substr(1);
		    this.add("if(true===mofron.window." + chk_orit + "()){",2);
                    this.add(    this.style(chd),3);
		    this.add("}",2);
                    this.add(    "mofron.window." + orit + "Event(()=>{"+ this.style(chd) +"});", 2);
		} else {
                    this.add(this.style(chd),2);
		}
                this.add("}");
	    }
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
