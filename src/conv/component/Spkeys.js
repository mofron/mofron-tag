/**
 * @file Spkeys.js
 * @brief generator of special keys
 * @author simparts
 */
const util = require('../../util.js');

module.exports = class Spkeys {

    constructor (cnf) {
        try {
	    this.m_cnfgen = cnf;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    param (key, val) {
        try {
            if ( ("object" !== typeof val) || (false !== Array.isArray(val)) ) {
	        throw new Error(key);
            }
            return this.m_cnfgen.optcode(val);
	} catch (e) {
	    throw e;
	}
    }
    
    style (key, val) {
        try {
            let ret = key + ":";
            let txt2array = (txt) => {
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
                        buf += "'" + sp_elm[1] + "',";
                    }
                    ret += buf.substring(0, buf.length-1) + "}";
                    
                    return ret;
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            };
            if ("string" === typeof val) {
                ret += txt2array(val);
            } else if ( ("object" === typeof val) &&
	                (false === Array.isArray(val)) ) {
                let buf = txt2array(val.text);
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
	    }
	} catch (e) {
            throw e;
	}
    }
    
    name (key, val) {
        try {
            return "objkey:" + util.getParam(val);
	} catch (e) {
            throw e;
	}
    }
    
    theme (key, val) {
        try {
            if ( ("object" !== typeof val)      ||
                 (false !== Array.isArray(val)) ||
                 (0 === val.child.length) ) {
                throw new Error(key);
            }
            let ret = key + ":{";
            let chd_elm = null;
            for (let chd_idx in val.child) {
                chd_elm = val.child[chd_idx];
                ret += chd_elm.tag + ":";
                if (undefined === chd_elm.attrs.replace) {
                    /* replace type is option */
                    ret += "{" + this.m_cnfgen.optcode(chd_elm) + "}";
                } else if (1 === Object.keys(val.attrs).length) {
                    /* replace type is class */
                    ret += val.attrs.replace;
                } else {
                    /* replace type is class with option */
                    ret += "["+ val.attrs.replace+ ",";
                    delete val.attrs.replace;
                    ret += "{" + this.m_cnfgen.optcode(chd_elm) + "}]"
                }
            }
            ret += "}";
	    return ret;
	} catch (e) {
            throw e;
	}
    }
    
    
    accessConfig (key, val) {
        try {
            let cnf_elm = (prm) => {
                try {
                    let ce_ret = "{";
                    ce_ret += 'media:"' + prm.tag + '",';
                    if ( (undefined !== prm.attrs.os) &&
		         ("string" === typeof prm.attrs.os) ) {
                        ce_ret += 'os:"' + prm.attrs.os + '",';
			delete prm.attrs.os;
		    }
		    if ( (undefined !== prm.attrs.browser) &&
		         ("string" === typeof prm.attrs.browser) ) {
                        ce_ret += 'browser:"' + prm.attrs.browser + '",';
			delete prm.attrs.browser;
		    }
		    ce_ret += "config:{" + this.m_cnfgen.cnfcode(prm) + "}";
		    return ce_ret + "}";
		} catch (e) {
		    console.error(e.stack);
                    throw e;
		}
	    };
            let ret = key + ":[";
            for (let atr_idx in val.attrs) {
                
                if (true === Array.isArray(val.attrs[atr_idx])) {
		    for (let atr_idx2 in val.attrs[atr_idx]) {
                        ret += cnf_elm(val.attrs[atr_idx][atr_idx2]) + ",";
		    }
		    ret = ret.substring(0, ret.length-1);
		} else {
                    ret += cnf_elm(val.attrs[atr_idx]);
		}
            }
            ret += "]";
	    return ret;
	} catch (e) {
            throw e;
	}
    }
    
    modkey (type, val) {
        try {
	    let ret  = "";
            if ("pull" === type) {
                ret += "new mofron.class.PullConf({";
                if ( ("object" === typeof val) && (false === Array.isArray(val)) ) {
                    ret += this.m_cnfgen.objval(val);
                }
                ret += "})";
            } else if ("args" === type) {
                ret += "new mofron.class.ConfArg(";
                if (true === Array.isArray(val)) {
                    for (let vidx in val) {
                        ret += util.getParam(val[vidx]) + ",";
                    }
                    ret = ret.substring(0, ret.length-1);
                } else if ("object" === typeof val) {
                    if (true === Array.isArray(val.text)) {
		        for (let vt_idx in val.text) {
                            ret += util.getParam(val.text[vt_idx]) + ",";
			}
			ret = ret.substring(0, ret.length-1);
		    } else if (null !== val.text) {
		        ret += util.getParam(val.text);
                    } else if (0 < val.child.length) {
		        
                    }
                } else {
                    ret += util.getParam(val);
                }
                ret += ")";
            } else {
                /* invalid type */
                throw new Error(tgt);
            }
	    return ret;
	} catch (e) {
            throw e;
	}
    }

    toScript (key, val) {
        try {
            let ret = "";
            
            if ( ("toScript" !== key) && ("function" === typeof this[key]) ) {
                ret += this[key](key, val);
            } else if (2 === key.split(':').length) {
	        let sp =  key.split(':');
	        ret += sp[0] + ":" + this.modkey(sp[1], val);
	    } else if (2 === key.split("color").length) {
	        ret += this.color(key, val);
		if ("" === ret) {
                    return null;
		}
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
