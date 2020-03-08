/**
 * @file Config.js
 * @brief config script generator
 * @author simparts
 */
const Base   = require('./../base/BaseGen.js');
const util   = require('../../util.js');
const Spkeys = require('./Spkeys.js');
const style  = require('./style.js');

module.exports = class extends Base {
    
    child (prm) {
        try {
	    let ret  ="";
            if (0 === prm.child.length) {
	        return "";
            }
	    ret += "child:[";

	    let elm = null;
            for (let chd_idx in prm.child) {
	        elm = prm.child[chd_idx];
                
		ret += "new " + elm.tag + "({";
	        ret += this.child(elm);
                ret += this.cnfcode(elm) + "}),";
	    }
	    ret = ret.substring(0,ret.length-1);
            
            return ret + "],";
	} catch (e) {
            console.error(e.stack);
	    throw e;
	}
    }
    
    objval (prm) {
        try {
	    let ret = "";
	    if ( ("ConfArg" === prm.constructor.name) ||
	         ("ModValue" === prm.constructor.name) ) {
                return util.getParam(prm);
	    } else if ("FuncList" === prm.constructor.name) {
                let fnc_vals = prm.value();
                for (let fidx in fnc_vals) {
		    let add_cnf = prm.tag().name + ".config({" + prm.attrName() + ":" + util.getParam(fnc_vals[fidx]) + "});";
		    global.mod.conf.push("    " + add_cnf + "\n");
		}
		return;
	    } else if (0 < prm.child.length) {
                ret += (1 < prm.child.length) ? "[" : "";
		for (let cidx in prm.child) {
		    ret += "new " + prm.child[cidx].tag + "({";
                    if (null !== prm.child[cidx].text) {
		        ret += "config:" + util.getParam(prm.child[cidx].text) + ",";
                    }
		    ret += this.child(prm.child[cidx]);
		    ret += this.cnfcode(prm.child[cidx])
		    ret += "}),";
		}
		ret = ret.substring(0, ret.length-1);
		ret += (1 < prm.child.length) ? "]" : "";
	    } else if (null !== prm.text) {
	        /* exp. style tag */
                ret += util.getParam(prm.text);
                prm.text = null;
	    } else if (0 < Object.keys(prm.attrs).length) {
                return "{" + this.cnfcode(prm) + "}";
	    }
            
	    return ret;
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    cnfcode (prm) {
        try {
            let ret = "";
	    let buf = null;
	    let atr = null;
	    let val = "";
	    for (let aidx in prm.attrs) {
	        //val = "";
                atr = prm.attrs[aidx];
                
                buf = new Spkeys(this).toScript(aidx, atr);
		if (null !== buf) {
		    ret += buf;
                    continue;
		}

	        /* set key */
                //ret += aidx + ":";
                
		/* set value */
                if (false === Array.isArray(atr)) {
		    if ("object" === typeof atr) {
                        val = this.objval(atr);
		    } else {
                        val = util.getParam(atr);
		    }
		} else {
		    val = "[";
		    for (let aidx in atr) {
                        if ("object" === typeof atr[aidx]) {
                            val += this.objval(atr[aidx]);
			} else {
                            val += util.getParam(atr[aidx]);
			}
			val += ",";
		    }
		    val = ret.substring(0, ret.length-1) + "]";
		}
		/* set key value */
		if (undefined === val) {
                    continue;
		}
		ret += aidx + ":" + val + ",";
	    }
	    
	    return ret.substring(0, ret.length-1);
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