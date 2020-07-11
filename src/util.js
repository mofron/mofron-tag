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

	kv2txt: (prm) => {
            try {
	        let ret = "{";
                for (let key in prm) {
                    ret += "'" + key + "':" + thisobj.getParam(prm[key]) + ",";
		}
		return ret.substring(0,ret.length-1) + "}";
	    } catch (e) {
                console.error(e.stack);
                throw e;
            }
	},
        
        getParam: (prm) => {
            try {
	        let ret = "";
                if (true === Array.isArray(prm)) {
                    ret += "[";
		    for (let pidx in prm) {
                        ret += thisobj.getParam(prm[pidx]) + ',';
		    }
		    ret = ret.substring(0, ret.length-1) + "]";
		} else if ("string" === typeof prm) {
		    ret += thisobj.getStringParam(prm);
		} else if ("object" === typeof prm) {
		    if ("ConfArg" === prm.constructor.name) {
		        ret += "new mofron.class.ConfArg(";
                        let arg = prm.value();
                        for (let aidx in arg) {
                            ret += thisobj.getParam(arg[aidx]) + ",";
                        }
                        ret = ret.substring(0, ret.length-1);
		        return ret + ")";
                    } else if ("Type" === prm.constructor.name) {
		        ret += thisobj.getParam(prm.value());
		    } else if ((true === global.req.isExists(prm.tag)) || ("div" === prm.tag)) {
                        throw new Error("support is already finished");
//		        /* module object */
//			let pnt_cmp = thisobj.getParentComp(prm);
//			prm.name = pnt_cmp.name + "_" + pnt_cmp.cmp_cnt++;
//	                new global.gen.Module([prm]);
//	                return prm.name;
		    } else {
                        /* key-value object */
			ret += "{";
			for (let pidx in prm) {
			    ret += pidx + ":";
                            if (("string" === typeof prm[pidx]) && ("@" !== prm[pidx][0]) && (1 !== prm[pidx].split("@").length)) {
                                ret += str2dict(prm[pidx]);
			    } else {
                                ret += thisobj.getParam(prm[pidx]);
			    }
			    ret += ",";
			}
			ret = ret.substring(0, ret.length-1);
			ret += "}";
		    }
		} else {
		    ret += prm;
		}
		return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },

	getStringParam: (prm) => {
            try {
	        let ret = "";
                if (true === global.req.isExists(prm)) {
                    ret += "new " + prm + "()";
                } else if ( (true === thisobj.isComment(prm)) || (true === thisobj.isNumStr(prm)) ) {
                    ret += prm;
                } else if ("@" === prm[0]) {
                    ret += prm.substr(1);
                } else if ( ("true" === prm) || ("false" === prm) || ("null" === prm) ) {
                    ret += prm;
                } else {
                    ret += '"' + prm + '"';
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

	isModTag: (prm) => {
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
                
		if ((false === global.req.isExists(prm.tag)) && ("div" !== prm.tag)) {
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

let str2dict = (prm) => {
    try {
        let sp_kv  = null;
        let sp_mlt = prm.split(",");
        if (1 === sp_mlt.length) {
            sp_kv = prm.split("@");
	    return "{'" + sp_kv[0] + "':" + thisobj.getParam(sp_kv[1]) + "}";
	} else {
	}
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
