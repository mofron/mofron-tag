/**
 * @file Spkeys.js
 * @brief generator of special keys
 * @author simparts
 */
const util = require('../../util.js');

module.exports = class Spkeys {

    constructor (cnf,prm) {
        try {
	    this.m_cnfgen = cnf;
	    this.m_prm    = prm;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    param (val) {
        try {
            if ( ("object" !== typeof val) || (false !== Array.isArray(val)) ) {
	        throw new Error(key);
            }
	    let set_val = {};
	    set_val.attrs = val;
	    return new global.gen.Config().cnfcode(set_val);
	} catch (e) {
	    throw e;
	}
    }
    
    style (key, val) {
        try {
            let ret = key + ":";
            if ("string" === typeof val) {
                ret += util.style2kv(val);
	    } else if ( ("object" === typeof val) &&
	                (false === Array.isArray(val)) &&
	                ("ConfArg" === val.constructor.name) ) {
	        ret += "new mofron.class.ConfArg(" + util.style2kv(val.value()[0]) + "," + util.getParam(val.value()[1]) + ")";
            } else if ( ("object" === typeof val) &&
	                (false === Array.isArray(val)) ) {
                let buf = util.style2kv(val.text);
                val.text = null;
                if (0 < Object.keys(val.attrs).length) {
                    buf = "[" + sty_buf + ",{" + this.m_cnfgen.optcode(val) + "}]";
                }
                ret += buf;
            } else {
                throw new Error(key);
            }
            
	    return ret;
        } catch (e) {
            throw e;
        }
    }
    
    color (key, val) {
        try {
            let sp_key = key.split("color");
	    if ("1" === sp_key[1]) {
                return "mainColor:" + util.getParam(val);
	    } else if ("2" === sp_key[1]) {
                return "baseColor:" + util.getParam(val);
	    } else if ("3" === sp_key[1]) {
                return "accentColor:" + util.getParam(val);
	    } else if ("" === sp_key[1]) {
                return key + ":" + util.getParam(val);
	    }
            return "";
	} catch (e) {
            throw e;
	}
    }
    
    theme (key, val) {
        try {
            let set_val = [];
	    if ( ("object" === typeof val) &&
	         (undefined !== val.constructor) &&
		 ("ConfArg" === val.constructor.name) ) {
                let ca_val = val.value();
                if (true === Array.isArray(ca_val[0])) {
                    for (let ca_idx1 in ca_val[0]) {
                        set_val.push(ca_val[0][ca_idx1]);
		    }
		} else {
                    set_val.push(ca_val[0]);
		}
                
                for (let ca_idx2 in ca_val[1]) {
		    let add_val = {};
		    add_val[ca_idx2] = ca_val[1][ca_idx2];
                    set_val.push(add_val);
		}
	    } else if (true === Array.isArray(val)) {
                for (let vidx in val) {
                    set_val.push(val[vidx]);
		}
	    } else if ("object" === typeof val) {
	        if (undefined !== val.tag) {
                    set_val.push(val);
		} else {
		    for (let vidx in val) {
                        let add_val = {};
		        add_val[vidx] = val[vidx];
		        set_val.push(add_val);
		    }
		}
	    } else {
                throw new Error('unknown route');
	    }

            let ret = "";
	    for (let set_idx in set_val) {
                ret += this.themeParam(set_val[set_idx]) + ",";
	    }
	    ret = ret.substring(0,ret.length-1);

            return key + ":{" + ret + "}";

	} catch (e) {
            throw e;
	}
    }
    
    themeParam (val,ign) {
        try {
            let ret = "";
            let tag = (undefined !== val.tag) ? val.tag : Object.keys(val)[0];

            /* set theme component name */
            ret += tag + ":{";
            let thm_cnt = (undefined !== val.attrs) ? val.attrs : val[tag];
            if (undefined !== ign) {
                thm_cnt.ignore = ign;
            }

            for (let thm_idx in thm_cnt) {
                if ("replace" === thm_idx) {
                    let rep_cnt = thm_cnt.replace;
		    if (("'" === thm_cnt.replace[0]) || ('"' === thm_cnt.replace[0])) {
                        rep_cnt = thm_cnt.replace.substring(1,thm_cnt.replace.length-1);
		    }
                    ret += "replace:" + rep_cnt;
                } else if ("config" === thm_idx) {
		    for (let thm_cidx in thm_cnt.config) {
                        if (('event' === thm_cidx) || (('effect' === thm_cidx) || ('layout' === thm_cidx))) {
			    if (false === Array.isArray(thm_cnt.config[thm_cidx])) {
			        /* module config of theme config must be array */
                                thm_cnt.config[thm_cidx] = [thm_cnt.config[thm_cidx]];
                            }
		        }
                    }
                    ret += "config:" + util.getParam(thm_cnt.config);
                } else if ("ignore" === thm_idx) {
                    ret += "ignore:";
                    if (true === Array.isArray(thm_cnt.ignore)) {
                        ret += "[";
                        for (let ign_idx in thm_cnt.ignore) {
                            ret += util.getParam(thm_cnt.ignore[ign_idx]) + ",";
                        }
                        ret = ret.substring(0,ret.length-1) + "]";
                    } else {
                        ret += util.getParam(thm_cnt.ignore);
                    }
                }
                ret += ",";
            }
            return ret.substring(0,ret.length-1) + "}";
	} catch (e) {
            throw e;
        }
    }

    
    
    accessConf (val) {
        try {
            let mfacc = val.mfAccess;
            let ret = "";
            
            if (true === Array.isArray(mfacc)) {
                for (let aidx in mfacc) {
                    ret += this.accessConf({ mfAccess: mfacc[aidx]}) + ",";
		}
		return ret.substring(0, ret.length-1);
	    }

	    let acc = {};
	    let cnf = {};

	    for (let acc_idx in mfacc) {
                if ( ("orientation" === acc_idx) || ("device" === acc_idx) ||
                     ("os" === acc_idx) || ("browser" === acc_idx) ) {
		    if ("string" === typeof mfacc[acc_idx]) {
                        acc[acc_idx] = mfacc[acc_idx];
                    } else if ("object" === typeof mfacc[acc_idx]) {
                        acc[acc_idx] = mfacc[acc_idx].value();
		    }
                } else {
                    cnf[acc_idx] = mfacc[acc_idx];
                }
	    }

            return "{config:" + util.getParam(cnf) + ",access:" + util.getParam(acc) + "}";
	} catch (e) {
            throw e;
	}
    }
    
    mfTmpl (key, val) {
        try {
            if (true === Array.isArray(val)) {
                for (let vidx in val) {
                    this.mfTmpl(key,val[vidx]);
                }
                return "";
            } else if ((undefined !== val.constructor) && ("FuncList" === val.constructor.name)) {
                let fval = val.value();
		for (let fidx in fval) {
                    this.mfTmpl(key, fval[fidx]);
		}
		return "";
	    } else {
	        let set     = "";
	        let set_prm = "";
                for (let vidx2 in val) {
                    if ("ref" == vidx2) {
                        continue;
                    }
                    set_prm += '"' + vidx2 + '":' + util.getParam(val[vidx2]) + ",";
                }
                
                set += val.ref+ "({"+ set_prm.substring(0,set_prm.length-1) + "})";
                this.m_cnfgen.gencnf().module.add(
                    this.m_prm.name + ".child(" + set + ");"
                );
            }
	    return "";
	} catch (e) {
            throw e;
	}
    }

    toScript (key, val) {
        try {
            let ret = "";
            
	    if ("accessConf" === key) {
	        ret += key + ":new mofron.class.ConfArg(" + this.accessConf(val) + ")";
            } else if ( ("toScript" !== key) &&
	         ("constructor" !== key) &&
		 ("function" === typeof this[key]) ) {
                ret += this[key](key, val);
	    } else if ("mfParam" === key) {
	        ret += this.m_cnfgen.cnfcode({ attrs: val });
            } else if ("mfDefinition" === key) {
	        return "";
            } else {
                return null;
            }
            return ret + ",";
        } catch (e) {
            console.warn("*** warning: unknown " + e.message + " value");
	    throw e;
            return e.message + ":undefined,";
        }
    }
}
/* end of file */
