/**
 * @file attrs.js
 * @brief parse tag attribute
 * @author simparts
 */
const util = require('../util.js');
const ConfArg = require('./tdata/ConfArg.js');

let thisobj = null;
let is_harf = (prm) => {
    try {
        let chk = null;
        for (let ihp_idx in prm) {
            if (null === chk) {
                if ( ("'" === prm[ihp_idx]) ||
                     ('"' === prm[ihp_idx]) ||
                     ("(" === prm[ihp_idx]) ) {
                    chk = prm[ihp_idx];
                }
            } else if ( (("'" === chk) || ('"' === chk)) &&
                        (chk === prm[ihp_idx]) ) {
                return false;
            } else if ( ("(" === chk) && (")" === prm[ihp_idx]) ) {
                return false;
            }
        }
        if (null !== chk) {
            return true;
        }
        return false;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}


try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        
	rawtxt2kv: (prm) => {
            try {
	        let ret = {};
                if (0 === prm.length) {
                    return ret;
                }
                let sp_spc = prm.split(' ');
                let buf    = null;
                let isharf = false;
                
                /* split space */
                for (let sp_idx=0; sp_idx < sp_spc.length ;sp_idx++) {
                    if (null === sp_spc[sp_idx].match(/[a-zA-Z0-9]+=.+/)) {
                        /* isn't match key=value */
                        /* concatenate with previous element */
                        sp_spc[sp_idx-1] = sp_spc[sp_idx-1] + ' ' + sp_spc[sp_idx];
                        sp_spc.splice(sp_idx, 1);
                        sp_idx--;
                    }
                }
                /* split equal */
                let sp_eql
                for (let sp_idx2 in sp_spc) {
                    sp_eql = sp_spc[sp_idx2].split('=');
                    if (null === sp_eql) {
                        ret[sp_spc[sp_idx2]] = null;
                    } else if (2 === sp_eql.length) {
                        ret[util.getCamel(sp_eql[0])] = sp_eql[1];
                    } else {
                        ret[sp_eql[0]] = '';
                        for (let eql_idx=1; eql_idx < sp_eql.length ;eql_idx++) {
                            ret[sp_eql[0]] += '=' + sp_eql[eql_idx];
                        }
                    }
                }
                /* convert value to every data type */
                for (let ridx in ret) {
                    ret[ridx] = thisobj.rawval2type(ret[ridx]);
		}
                
		return ret;
	    } catch (e) {
	        console.error(e.stack);
                throw e;
            }
	},
        rawval2type: (val) => {
            try {
	        let ret = null;
		if ( ("string" === typeof val) &&
		     (-1 !== val.indexOf(',')) &&
		     ( !(('(' === val[0]) && (')' === val[val.length-1])) && !(('[' === val[0]) && (']' === val[val.length-1])) ) ) {
                    
                    let chk_mod = val.split(':');
		    if ((2 === chk_mod.length) && (chk_mod[0][0] === chk_mod[0][0].toUpperCase())) {
                        return val;
		    }
                    
		    /* check short form style confarg */
                    let sp_val = val.split(',');
		    let hrf    = false;
                    for (let sidx in sp_val) {
                        if (true === is_harf(sp_val[sidx])) {
                            hrf = true;
			    break;
			}
		    }
		    if (false === hrf) {
                        val = '(' + val + ')';
		    }
		}
                
		if ( (null === val) || (0 === val.length) ) {
                    ret = val;
                } else if ( ('(' === val[0]) && (')' === val[val.length-1]) ) {
                    /* config-args */
		    var arg = thisobj.array(val.substring(1, val.length-1));
		    for (let aidx in arg) {
                        arg[aidx] = thisobj.rawval2type(arg[aidx]);
		    }
		    ret = new ConfArg(arg);
		} else if ( ('[' === val[0]) && (']' === val[val.length-1]) ) {
		    /* array */
                    ret = thisobj.array(val.substring(1,val.length-1));
                    for (let ridx in ret) {
                        ret[ridx] = thisobj.rawval2type(ret[ridx]);
		    }
		} else {
                    ret = thisobj.datType(val);
		}
		return ret;
	    } catch (e) {
                console.error(e.stack);
		throw e;
	    }
	},
        
        array: (prm) => {
            try {
		let sp_prm = prm.split(',');
		if (1 === sp_prm.length) {
                    return prm;
		}
		for (let sp_idx=0; sp_idx < sp_prm.length ;sp_idx++) {
                    /* check harf */
		    if ( (true === is_harf(sp_prm[sp_idx])) && (sp_idx < sp_prm.length-1) ) {
		        sp_prm[sp_idx] = sp_prm[sp_idx] + ',' + sp_prm[sp_idx+1];
                        sp_prm.splice(sp_idx+1, 1);
			sp_idx--;
		    }
		}
		let ret = [];
		for (let sp_idx2 in sp_prm) {
                    ret.push(sp_prm[sp_idx2]);
		}
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        datType: (prm) => {
            try {
                let ret = prm;
                if (true === util.isNumStr(prm)) {
                    if (1 < prm.split('.').length) {
                        /* float */
                        ret = parseFloat(prm);
                    } else {
                        /* integer */
                        ret = parseInt(prm);
                    }
                } else if ("true" === prm) {
                    ret = true;
                } else if ("false" === prm) {
                    ret = false;
                } else if (true === Array.isArray(prm)) {
                    ret = [];
                    for (let p_idx in prm) {
                        ret.push(thisobj.datType(prm[p_idx]));
                    }
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        object: (prm) => {
            try {
                let chd_atr = null;
                for (let cidx in prm.child) {
                    chd_atr = thisobj.object(prm.child[cidx]);
                    if (false === Array.isArray(prm.attrs)) {
                        prm.attrs = [];
                    }
                    prm.attrs.push(chd_atr.value);
                }
                prm.child = [];
                return { name: prm.tag, value: prm };
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
