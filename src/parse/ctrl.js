/**
 * @file ./parse/ctrl.js
 * @brief tag parse controler
 */
const tag_prs = require('node-html-parser');
const tree    = require('./tree.js');
const req     = require('./require.js');
const attr    = require('./attrs.js');

/**
 * check attribute and restrucure tree
 */
let initAttrs = (req, cmp) => {
    try {
        for (let cidx=0; cidx < cmp.child.length ; cidx++) {
            if ( (false === req.isExists(cmp.child[cidx].tag)) &&
                 ('Component' !== cmp.child[cidx].tag)) {
                /* this child is attrs, replace object */
                /* add attr */
                cmp.attrs.push(attr.object(cmp.child[cidx]));
                
                /* remove child */
                cmp.child.splice(cidx, 1);
                cidx--;
            } else {
                cmp.child[cidx] = initAttrs(req, cmp.child[cidx]);
            }
        }
        return cmp;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

/**
 * parse tag string
 */
module.exports = (txt) => {
    try {
        let prs_ret = tag_prs.parse(
            txt,
            { script: true, style: true }
        ).childNodes;
        
        prs_ret = tree(prs_ret);

        let ret = {
            require: null,
            component: []
        };
        
        /* init require */
        let cmp = [];
        for (let pidx in prs_ret) {
            if ('require' === prs_ret[pidx].tag) {
                for (let req_idx in prs_ret[pidx].child) {
                    req.add(prs_ret[pidx].child[req_idx]);
                }
            } else {
                cmp.push(prs_ret[pidx]);
            }
        }
        ret.require = req;
        
        /* init component */
        for (let cidx in cmp) {
            ret.component.push(initAttrs(req, cmp[cidx]));
        }

        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
