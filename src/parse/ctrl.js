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
                let atr = attr.object(cmp.child[cidx]);
                if ('template' === atr.name) {
                    if (false === Array.isArray(cmp.attrs[atr.name])) {
                        cmp.attrs[atr.name] = [];
                    }
                    cmp.attrs[atr.name].push(atr.value);
                } else {
                    cmp.attrs[atr.name] = atr.value;
                }
                
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
            template: {},
            component: []
        };
        
        /* init require */
        let cmp = [];
        let tmp = {};
        for (let pidx in prs_ret) {
            if ('require' === prs_ret[pidx].tag) {
                for (let req_idx in prs_ret[pidx].child) {
                    req.add(prs_ret[pidx].child[req_idx]);
                }
            } else if ('template' === prs_ret[pidx].tag) {
                if (undefined === prs_ret[pidx].attrs.name) {
                    throw new Error('could not find template name');
                }
                tmp[prs_ret[pidx].attrs.name] = prs_ret[pidx].child;
            } else {
                cmp.push(prs_ret[pidx]);
            }
        }
        ret.require = req;
        
        /* init component */
        for (let cidx in cmp) {
            ret.component.push(initAttrs(req, cmp[cidx]));
        }
        /* init template */
        for (let tidx in tmp) {
            let tmp_buf = [];
            for (let tc_idx in tmp[tidx]) {
                tmp_buf.push(initAttrs(req, tmp[tidx][tc_idx]));
            }
            ret.template[tidx] = tmp_buf;
        }
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
