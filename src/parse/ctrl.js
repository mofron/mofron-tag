/**
 * @file ./parse/ctrl.js
 * @brief tag parse controler
 */
const fs      = require('fs');
const tag_prs = require('node-html-parser');
const tree    = require('./tree.js');
const req     = require('./require.js');
const attr    = require('./attrs.js');
const util    = require('../util.js');

/**
 * check attribute and restrucure tree
 */
let sortChild = (prs, cmp) => {
    try {
        if ("div" === cmp.tag) {
            cmp.tag = "Component";
        }
        
        for (let cidx=0; cidx < cmp.child.length ; cidx++) {
            
            let chk = false;
            for (let st_idx in prs.srctag) {
                if (st_idx === cmp.child[cidx].tag) {
                    chk = true;
                    cmp.child[cidx].src   = true;
                    cmp.child[cidx].child = prs.srctag[st_idx];
                    for (let st_idx2 in cmp.child[cidx].child.component) {
                        sortChild(prs, cmp.child[cidx].child.component[st_idx2]);
                    }
                    break;
                }
            }
            if (true === chk) {
                continue;
            }
            
            if ( (false === req.isExists(cmp.child[cidx].tag)) &&
                 ("div" !== cmp.child[cidx].tag) & ("Component" !== cmp.child[cidx].tag)) {
                /* this child is attrs, replace object */
                let atrbuf = cmp.attrs[cmp.child[cidx].tag];
                if (true === Array.isArray(atrbuf)) {
                    cmp.attrs[cmp.child[cidx].tag].push(cmp.child[cidx]);
                } else if (undefined !== atrbuf) {
                    cmp.attrs[cmp.child[cidx].tag] = [atrbuf, cmp.child[cidx]];
                } else {
                    cmp.attrs[cmp.child[cidx].tag] = cmp.child[cidx];
                }
                sortChild(prs, cmp.child[cidx]);
                /* remove child */
                cmp.child.splice(cidx, 1);
                cidx--;
            } else {
                cmp.child[cidx] = sortChild(prs, cmp.child[cidx]);
            }
        }
        return cmp;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}


let main = (txt) => {
    try {
        let prs_ret = tag_prs.parse(
            txt,
            { script: true, style: true }
        ).childNodes;
        
        prs_ret = tree(prs_ret);
        
        let ret = {
            require   : [],
            srctag    : {},
            script    : [],
            responsive: [],
            template  : {},
            component : []
        };
        
        /* init require */
        for (let pidx in prs_ret) {
            if ('require' === prs_ret[pidx].tag) {
                for (let req_idx in prs_ret[pidx].child) {
                    if (undefined !== prs_ret[pidx].child[req_idx].attrs.module) {
                        req.add(prs_ret[pidx].child[req_idx]);
                        ret.require.push(prs_ret[pidx].child[req_idx]);
                    } else if (undefined !== prs_ret[pidx].child[req_idx].attrs.src) {
                        let src = prs_ret[pidx].child[req_idx].attrs.src;
                        fs.readFile(
                            util.isComment(src) ? src.substring(1, src.length-1) : src,
                            'utf8',
                            function (err, tag) {
                                try {
                                    ret.srctag[prs_ret[pidx].child[req_idx].text] = main(tag);
                                } catch (e) {
                                    console.error(e.stack);
                                    throw e;
                                }
                            }
                        );
                    }
                }
            } else if ('template' === prs_ret[pidx].tag) {
                ret.template[prs_ret[pidx].attrs.name] = prs_ret[pidx].child;
            } else if ('responsive' === prs_ret[pidx].tag) {
                for (let res_idx in prs_ret[pidx].child) {
                    ret[prs_ret[pidx].tag].push(prs_ret[pidx].child[res_idx]);
                }
            } else if ('script' === prs_ret[pidx].tag) {
                ret[prs_ret[pidx].tag].push(prs_ret[pidx]);
            } else {
                if ( (false === req.isExists(prs_ret[pidx].tag)) &&
                     ("div" !== prs_ret[pidx].tag) &&
                     ("Component" !== prs_ret[pidx].tag) ) {
                    throw new Error("unknown component:" + prs_ret[pidx].tag);
                }// else if ("div" === prs_ret[pidx].tag) {
                 //   prs_ret[pidx].tag = "Component";
                //}
                ret.component.push(prs_ret[pidx]);
            }
        }
        
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

/**
 * parse tag string
 */
module.exports = {
    main : main,
    sort : (p) => {
        try {
            let cmp = [];
            for (let cidx in p.component) {
                cmp.push(sortChild(p, p.component[cidx]));
            }
            p.component = cmp;
            
            for (let tidx in p.template) {
                let tmp = [];
                for (let tc_idx in p.template[tidx]) {
                    tmp.push(sortChild(p, p.template[tidx][tc_idx]));
                }
                p.template[tidx] = tmp;
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
};
/* end of file */
