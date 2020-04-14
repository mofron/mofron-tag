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
let child = (cmp) => {
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
                child(cmp.child[chd_idx]);
                let set_val = null;
		if (null !== cmp.child[chd_idx].text) {
		    set_val = cmp.child[chd_idx].text;
		} else if (1 === cmp.child[chd_idx].child.length) {
		    set_val = cmp.child[chd_idx].child[0];
		} else if (1 < cmp.child[chd_idx].child.length) {
                    set_val = cmp.child[chd_idx].child;
		} else {
		    set_val = null;
		}

                
		if (0 !== Object.keys(cmp.child[chd_idx].attrs).length) {
		    if (null === set_val) {
                        set_val = cmp.child[chd_idx].attrs;
		    } else {
                        set_val = new ConfArg([set_val, cmp.child[chd_idx].attrs]);
		    }
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
	        child(cmp.child[chd_idx]);
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
	return (1 < hit) ? true : false;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};


let parse = null;
module.exports = (prm) => {
    try {
        parse = prm;
        req = prm.require;
	/* sort component children */
	for (let cidx in prm.component) {
            child(prm.component[cidx]);
	}
	/* sort template children */
	for (let tidx in prm.template) {
            child(prm.template[tidx]);
	}
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}

/* end of file */
