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
            let txt2kv = (txt) => {
                try {
                    let ret = "{";
                    /* format string */
                    if (true === util.isComment(txt)) {
                        txt = txt.substring(1, txt.length-1);
                    }
                    /* delete space */
                    let nsp     = txt.split(' ');
                    let nsp_str = "";
                    for (let nsp_idx in nsp) {
                        nsp_str += nsp[nsp_idx];
                    }
                    /* set every element */
                    let sp_txt = nsp_str.split(';');
                    sp_txt.pop();
                    let sp_elm = null;
                    let buf    = "";
                    for (let sp_idx in sp_txt) {
                        sp_elm = sp_txt[sp_idx].split(':');
                        if (2 !== sp_elm.length) {
                            throw new Error('invalid style');
                        }
                        buf += "'" + sp_elm[0] + "':";
                        let quot = (-1 === sp_elm[1].indexOf('"')) ? '"' : "'";
			
                        buf += quot + sp_elm[1] + quot + ",";
                    }
                    ret += buf.substring(0, buf.length-1) + "}";
                    
                    return ret;
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };

            if ("string" === typeof val) {
                ret += txt2kv(val);
	    } else if ( ("object" === typeof val) &&
	                (false === Array.isArray(val)) &&
	                ("ConfArg" === val.constructor.name) ) {
	        ret += "new mofron.class.ConfArg(" + txt2kv(val.value()[0]) + "," + util.getParam(val.value()[1]) + ")";
            } else if ( ("object" === typeof val) &&
	                (false === Array.isArray(val)) ) {
                let buf = txt2kv(val.text);
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
            if (("object" === typeof val) && (undefined !== val.constructor) && ("ConfArg" === val.constructor.name)) {
                return this.theme(key, val.value());
	    }
            val = (false === Array.isArray(val)) ? [val] : val;
            let ret = key + ":{";
            
	    for (let vidx in val) {
	        let tag = null;
	        if (undefined !== val[vidx].tag) {
                    tag = val[vidx].tag;
		} else {
                    for (let tag_idx in val[vidx]) {
                        tag = tag_idx;
			break;
		    }
		}
	        /* set theme component name */
                ret += tag + ":{";
		let chk_type = (undefined !== val[vidx].attrs) ? val[vidx].attrs : val[vidx][tag];

		if (undefined !== chk_type.replace) {
		    ret += "replace:";
                    this.m_cnfgen.gencnf().module.toScript([chk_type.replace]);
		    ret += chk_type.replace.name
		} else if (undefined !== chk_type.config) {
                    ret += "config:" + util.getParam(chk_type.config);
		} else {
                    throw new Error("could not find theme type");
		}
                
		ret += "},"
	    }
//            
            return ret.substring(0, ret.length-1) + "}";
	} catch (e) {
            throw e;
	}
    }
    
    
    accessConf (val) {
        try {
	    let ret = "";
	    if ("FuncList" === val.constructor.name) {
                let fnc_val = val.value();
		for (let fnc_idx in fnc_val) {
                    ret += this.accessConf(fnc_val[fnc_idx]) + ",";
		}
		return ret.substring(0, ret.length-1);
	    }
            
	    let acc = {};
	    let cnf = {};
	    for (let vidx in val) {
                if ( ("orientation" === vidx) || ("device" === vidx) ||
                     ("os" === vidx) || ("browser" === vidx) ) {
                    acc[vidx] = val[vidx];
		} else {
                    cnf[vidx] = val[vidx];
		}
	    }
            ret += "{config:";
            ret += util.getParam(cnf);
	    if (0 < Object.keys(acc).length) {
                ret += ",access:" + util.getParam(acc);
	    }
            return ret + "}";
	} catch (e) {
            throw e;
	}
    }
    
    template (key, val) {
        try {
            if ((undefined !== val.constructor) && ("FuncList" === val.constructor.name)) {
                let fval = val.value();
		for (let fidx in fval) {
                    this.template(key, fval[fidx]);
		}
		return "";
	    }

	    let opt = "";
	    for (let oidx in val) {
                if ("name" == oidx) {
                    continue;
		}
		opt += '"' + oidx + '":' + util.getParam(val[oidx]) + ",";
	    }
            let set = this.m_prm.name + ".child("+ val.name+ "({"+ opt.substring(0,opt.length-1) +"})" +");";

	    this.m_cnfgen.gencnf().module.add(set);
	    return "";
	} catch (e) {
            throw e;
	}
    }

    toScript (key, val) {
        try {

            let ret = "";
            
	    if ("accessConf" === key) {
	        let acc_ret = this.accessConf(val);
		return key + ":new mofron.class.ConfArg(" + acc_ret + "),";
            } else if ( ("toScript" !== key) &&
	         ("constructor" !== key) &&
		 ("function" === typeof this[key]) ) {
                ret += this[key](key, val);
	    } else if ("mfParam" === key) {
	        ret += this.m_cnfgen.cnfcode({ attrs: val });
            } else {
                return null;
            }
            
            return ret + ",";
        } catch (e) {
            console.warn("*** warning: unknown " + e.message + " value");
            return e.message + ":undefined,";
        }
    }
}
/* end of file */
