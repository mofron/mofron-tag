/**
 * @file util.js
 * @brief util functions
 * @author simparts
 */
let thisobj = null;
let dec_cnt = 0;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }
    
    thisobj = {
        isComment: (prm) => {
            try {
                if (("'" === prm[0]) && ("'" === prm[prm.length-1])) {
                    return true;
                } else if (('"' === prm[0]) && ('"' === prm[prm.length-1])) {
                    return true;
                }
                return false;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        
        isNumStr: (str) => {
            try {
                if ('string' !== typeof str) {
                    return false;
                } else if ('-' === str[0]) {
                    str = str.substring(1);
		}

                let chk = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
                let num = false;
                for (let sidx=0;sidx < str.length; sidx++) {
                    for (let cidx in chk) {
                        if (str[sidx] === chk[cidx]) {
                            num = true;
                            break;
                        }
                    }
                    if (false === num) {
                        return false;
                    }
                    num = false;
                }
                return true;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        
        getCamel: (txt) => {
            try {
                /* check parameter */
                if ( ('string' !== (typeof txt)) ||
                     ((txt.length-1) === txt.lastIndexOf('-')) ) {
                    throw new Error('invalid parameter');
                } else if (-1 === txt.indexOf('-')) {
                    return txt;
                }
                let ret    = "";
                let sp_txt = txt.split('-');
                for (let sp_idx in sp_txt) {
                    if (0 == sp_idx) {
                         ret += sp_txt[sp_idx];
                         continue;
                    }
                    ret += sp_txt[sp_idx].charAt(0).toUpperCase();
                    ret += sp_txt[sp_idx].substr(1);
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },

        getParam: (prm,mod) => {
            try {
	        let ret = "";
                if ("string" === typeof prm) {
		    return thisobj.getStrParam(prm);
		} else if (true === Array.isArray(prm)) {
                    ret += "[";
		    for (let pidx in prm) {
                        ret += thisobj.getParam(prm[pidx]) + ',';
		    }
		    ret = ret.substring(0, ret.length-1) + "]";
		} else if ("object" === typeof prm) {
                    return thisobj.getObjParam(prm,mod);
		} else {
		    return "" + prm;
		}
		return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },

	getStrParam: (prm) => {
            try {
                if (true === global.req.isExists(prm)) {
                    return "new " + prm + "()";
                } else if ( (true === thisobj.isComment(prm)) || (true === thisobj.isNumStr(prm)) ) {
                    return prm;
                } else if ("@" === prm[0]) {
                    return  prm.substr(1);
                } else if ( ("true" === prm) || ("false" === prm) || ("null" === prm) ) {
                    return prm;
                } else {
                    return  '"' + prm + '"';
                }
	    } catch (e) {
                console.error(e.stack);
                throw e;
            }
	},
	
	getObjParam: (prm,mod) => {
	    try {
	        let ret = "";
                if ("Object" !== prm.constructor.name) {
		    /* class parameter */
                    return thisobj.getClassParam(prm);
		} else if (true === thisobj.isParseTag(prm)) {
                    if ( (true === global.req.isExists(prm.tag)) || ("div" === prm.tag) ) {
                        /* user defined tag */
//console.log(prm);
                        let set_mod = new global.gen.Module().toScript([prm]);
			if (undefined === mod) {
                            global.module.add(set_mod.substring(4, set_mod.length-1));
			} else {
                            mod.add(set_mod.substring(4, set_mod.length-1));
			}
                        return prm.name;
                    } else if (null !== prm.text) {
		        throw new Error("unknown route");
		    }
                } else if ((1 === Object.keys(prm).length) && (undefined !== prm.mfPull)) {
		    ret += "new mofron.class.PullConf(";
                    if ( (true === thisobj.isParseTag(prm.mfPull)) ||
		         (true === Array.isArray(prm.mfPull)) && (true === thisobj.isParseTag(prm.mfPull[0])) ) {
                        ret += "{child:"+ thisobj.getParam(prm.mfPull) +"}";
		    } else if ("ConfArg" === prm.mfPull.constructor.name) {
		        ret += "{";
                        let ca     = prm.mfPull.value();
			let ca_chd = [];
			let ca_atr = [];
			for (let ca_idx in ca) {
                            if (true === thisobj.isParseTag(ca[ca_idx])) {
                                ca_chd.push(ca[ca_idx]);
			    } else if ( (true === Array.isArray(ca[ca_idx])) &&
			                (true === thisobj.isParseTag(ca[ca_idx][0])) ) {
                                for (let ca_idx_2 in ca[ca_idx]) {
                                    ca_chd.push(ca[ca_idx][ca_idx_2]);
				}
			    } else {
                                ca_atr.push(ca[ca_idx]);
			    }
			}
			if (0 < ca_chd.length) {
                            ret += "child:" + thisobj.getParam(ca_chd) + ",";
			}

			for (let atr_idx in ca_atr) {
			    ret += new global.gen.Config().cnfcode({attrs:ca_atr[atr_idx]}) + ",";
			}
			ret = ret.substring(0, ret.length-1);
			ret += "}";
		    } else {
                        ret += "{" + new global.gen.Config().cnfcode({attrs:prm.mfPull}) + "}";
		    }
                    return ret + ")";
                } else if ( (undefined !== prm.attrs) && (0 < Object.keys(prm.attrs).length) ) {
                    return thisobj.getParam(prm.attrs);
                } else {
		    /* key value object */
                    if (undefined !== prm.template) {
		        return thisobj.template(prm.template);
                    } else {
		        let kv_ret = "";
                        for (let pidx in prm) {
                            kv_ret += pidx + ":" + thisobj.getParam(prm[pidx]) + ",";
                        }
		        return "{" + kv_ret.substring(0, kv_ret.length-1) + "}";
		    }
                }
                return ret;
	    } catch (e) {
                console.error(e.stack);
                throw e;
            }
	},

	getClassParam: (prm) => {
	    try {
	        let ret = "";
	        let cname = prm.constructor.name;
	        if ("ConfArg" === cname) {
                    ret += "new mofron.class.ConfArg(";
		    let ac_val = prm.value();
                    for (let aidx in ac_val) {
                        ret += thisobj.getParam(ac_val[aidx]) + ",";
                    }
                    ret = ret.substring(0, ret.length-1) + ")";
                } else if ("Type" === cname) {
                    return thisobj.getParam(prm.value());
                } else if ("ModValue" === cname) {
		    ret += "new " + prm.name();
		    let md_val = null;
                    if ("ConfArg" === prm.value().constructor.name) {
		        md_val = thisobj.getParam(prm.value().value());
			md_val = md_val.substring(1,md_val.length-1);
                    } else {
                        md_val = thisobj.getParam(prm.value());
                    }
		    ret += "(" + md_val + ")";
                } else if ("FuncList" === cname) {
                    let fnc_vals = prm.value();
                    for (let fidx in fnc_vals) {
                        let add_cnf = prm.attrName() + ":" + thisobj.getParam(fnc_vals[fidx]);
                        global.module.add(prm.tag().name + ".config({" + add_cnf + "});");
                    }
                    return;
                }
		return ret;
	    } catch (e) {
                console.error(e.stack);
                throw e;
            }
	},

	template: (prm,mod) => {
            try {
                let ret = "";
                if ("object" === typeof prm) {
                    if (true === Array.isArray(prm)) {
		        ret += "[";
		        for (let arr in prm) {
                            ret += thisobj.template(prm[arr]) + ",";
			}
			return ret.substring(0,ret.length-1) + "]";
		    } else if (undefined === prm.name) {
                        throw new Error("could not find name attribute at 'template' tag");
		    }
		    ret = prm.name + "({";
		    for (let tidx in prm) {
                        if ("name" === tidx) {
                            continue;
			}
			ret += tidx + ":" + thisobj.getParam(prm[tidx]);
		    }
		    ret += "})";
		}

	        return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        
	getParentComp: (prm) =>{
            try {
                if (undefined === prm.parent["name"]) {
                    return thisobj.getParentComp(prm.parent);
		}
		return prm.parent;
	    } catch (e) {
                console.error(e.stack);
                throw e;
	    }
	},

	isParseTag: (prm) => {
            try {
                if (undefined === prm.tag) {
                    return false;
		} else if (undefined === prm.attrs) {
                    return false;
		} else if (undefined === prm.child) {
                    return false;
		} else if (undefined === prm.text) {
                    return false;
		}
		return true;
	    } catch (e) {
                console.error(e.stack);
                throw e;
	    }
	},
	isObjType: (prm, onm) => {
            try {
                if ("object" !== typeof prm) {
                    return false;
		} else if (true === Array.isArray(prm)) {
                    return false;
		} else if (onm !== prm.constructor.name) {
                    return false;
		}
		return true;
	    } catch (e) {
                console.error(e.stack);
                throw e;
            }
	}
    }
    module.exports = thisobj;
} catch (e) {
    console.error(e.stack);
    throw e;
}
/* end of file */
