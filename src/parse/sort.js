/**
 * @file sort.js
 * 
 */
const FuncList = require('./tdata/FuncList.js');
const Module   = require('./tdata/ModValue.js');
const ConfArg  = require('./tdata/ConfArg.js');
const attrs    = require('./attrs.js');
const util     = require('../util.js');

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
                let set_val = null;
		if (null !== cmp.child[chd_idx].text) {
		    set_val = cmp.child[chd_idx].text;
		} else if (null !== cmp.child[chd_idx].child) {
                    set_val = cmp.child[chd_idx].child;
		} else {
                    throw new Error("unknown data type");
		}
                
		if (0 !== Object.keys(cmp.child[chd_idx].attrs).length) {
                    set_val = new ConfArg([set_val, cmp.child[chd_idx].attrs]);
		}
                
		let tag_atr = cmp.attrs[chd_tag];
                if (undefined !== tag_atr) {
		    if (true === util.isObjType(tag_atr,"FuncList")) {
		        /* add function list */
		        tag_atr.addValue(set_val);
		    } else {
		        cmp.attrs[chd_tag].push(set_val);
		    }
		} else {
                    /* set attrs */
                    if (true === is_redund(cmp,chd_tag)) {
                        cmp.attrs[chd_tag] = new FuncList(set_val,cmp,chd_tag);
		    } else {
                        cmp.attrs[chd_tag] = set_val;
		    }
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

let is_redund = (cmp,aidx) => {
    try {
        let hit = 0;
        for (let chd_idx=0; chd_idx < cmp.child.length ; chd_idx++) {
	    /* check child tag name */
            if (aidx === cmp.child[chd_idx].tag) {
                hit++;
            }
	}
	return (0 < hit) ? true : false;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};

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
