/**
 * @file sort.js
 * 
 */
let req = null;
let sort = (cmp) => {
    try {

        for (let chd_idx=0; chd_idx < cmp.child.length ; chd_idx++) {
            
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
