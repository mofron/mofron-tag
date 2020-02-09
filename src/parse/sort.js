/**
 * @file sort.js
 * 
 */
const Module = require('./ModValue.js');
const attrs  = require('./attrs.js');

let req = null;
let sort = (cmp) => {
    try {
        /* check attrs value */
	for (let aidx in cmp.attrs) {

	    let atr_val = cmp.attrs[aidx];
	    if (('string' !== typeof cmp.attrs[aidx]) || (-1 === atr_val.indexOf(':'))) {
                continue;
	    }
	    let mod_nm  = atr_val.substring(0, atr_val.indexOf(':'));
            if (true === req.isExists(mod_nm)) {
	        let mod_val = '';
	        if ('' !== atr_val) {
                    mod_val = attrs.rawval2type(atr_val.substr(atr_val.indexOf(':')+1));
		}
                /* attrs value is module */
		cmp.attrs[aidx] = new Module(mod_nm, mod_val);
	    }
	}

        for (let chd_idx=0; chd_idx < cmp.child.length ; chd_idx++) {

	    /* check child tag name */
	    let chd_tag = cmp.child[chd_idx].tag;
	    if ( (false === req.isExists(chd_tag)) && ("div" !== chd_tag) ) {
                /* this child is attrs, move to attrs */
		sort(cmp.child[chd_idx]);
                if (undefined !== cmp.attrs[chd_tag]) {
                    cmp.attrs[chd_tag] = [cmp.attrs[chd_tag]];
		    cmp.attrs[chd_tag].push(cmp.child[chd_idx]);
		} else {
                    cmp.attrs[chd_tag] = cmp.child[chd_idx];
		}
                cmp.child.splice(chd_idx, 1);
		chd_idx--;
            } else {
	        sort(cmp.child[chd_idx]);
            }
            
        }
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}

module.exports = (prm) => {
    try {
        req = prm.require;
	for (let cidx in prm.component) {
            sort(prm.component[cidx]);
	}
	for (let tidx in prm.template) {
            sort(prm.template[tidx]);
	}
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}

/* end of file */
