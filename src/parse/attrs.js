/**
 * @file attrs.js
 * @brief parse attribute
 * @author simparts
 */
const util = require('../util.js');

let thisobj = null;

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        /**
	 * split attribute key-value and convert value type
	 * 
	 * @param (string) attribute string
	 * @return (object) attribute key-value
	 */
        text: (prm) => {
            try {
                if (0 === prm.length) {
                    return {};
                }
                let ret    = {};
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
		        ret[sp_eql[0]] = sp_eql[1];
                    } else {
		        ret[sp_eql[0]] = '';
                        for (let eql_idx=1; eql_idx < sp_eql.length ;eql_idx++) {
                            ret[sp_eql[0]] += '=' + sp_eql[eql_idx];
			}
		    }
		}

                /* convert array */
                for (let r_idx in ret) {
                    if ( (null === ret[r_idx]) || (0 === ret[r_idx].length) ) {
                        continue;
                    } else if ( ('(' === ret[r_idx][0]) &&
                                (')' === ret[r_idx][ret[r_idx].length-1]) ) {
                        /* array */
                        ret[r_idx] = thisobj.array(ret[r_idx].substring(1,ret[r_idx].length-1));
                    }
		}
                
                /* convert type */
                for (let ridx in ret) {
                    if (true === Array.isArray(ret[ridx])) {
                        for (let aidx in ret[ridx]) {
                            ret[ridx][aidx] = thisobj.datType(ret[ridx][aidx]);
			}
		    } else {
                        ret[ridx] = thisobj.datType(ret[ridx]);
		    }
		}

                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        array: (prm) => {
            try {
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
