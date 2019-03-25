/**
 * @file index.js
 */
const parse = require('node-html-parser');
const cmp   = require('./component.js');
const req   = require('./require.js');

let mytree = (prm) => { 
    try {
        let ret = [];
        for (let pidx in prm) {
             if (undefined === prm[pidx].tagName) {
                 continue;
             }
             let buf    = {};
             buf.tag    = prm[pidx].tagName;
             buf.attrs  = get_attr(prm[pidx].rawAttrs);
             buf.atrobj = [];
             buf.child  = [];
             buf.text   = null;
             if (0 < prm[pidx].childNodes.length) {
                 buf.text = prm[pidx].childNodes[0].toString();
             }

             if (0 !== prm[pidx].childNodes.length) {
                 buf.child = mytree(prm[pidx].childNodes);
             }
             ret.push(buf);
        }
        
        for (let ridx in ret) {
            for (let cidx in ret[ridx].child) {
                if (false === req.isExists(ret[ridx].child[cidx].text)) {
                    ret[ridx].atrobj.push(ret[ridx].child[cidx]);
                }
            }
        }

        /* delete option child */
        for (let ridx2 in ret) {
            for (let cidx2=0; cidx2 < ret[ridx2].child.length ;cidx2++) {
                if (false === req.isExists(ret[ridx2].child[cidx2].tag)) {
                    ret[ridx2].child.splice(cidx2, 1); 
                    cidx2 = -1;
                    continue;
                }
            }
        }

        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

let get_attr = (atr) => {
    try {
        if ('' === atr) {
            return null;
        }
        let fil_cmt = (fp) => {
            try {
                if ( (fp[0] === fp[fp.length-1]) && ((fp[0] === '"') || (fp[0] === "'")) ) {
                    return fp.substring(1, fp.length-1);
                }
                return fp;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        }
        
        let ret    = [];
        let attrs  = atr.split(' ');
        let buf    = null;
        let isharf = false;
        for (let aidx in attrs) {
            if (true === isharf) {
                if ( ('"' === attrs[aidx][attrs[aidx].length-1]) ||
                     ("'" === attrs[aidx][attrs[aidx].length-1]) ) {
                    /* end harf */
                    isharf = false;
                }
                buf[1] += " " + attrs[aidx];
            } else {
                buf = attrs[aidx].split('=');
                if ( (('"' === buf[1][0]) && ('"' !== buf[1][buf[1].length-1])) ||
                     (("'" === buf[1][0]) && ("'" !== buf[1][buf[1].length-1]))) {
                    /* harf attr value */
                    isharf = true;
                    continue;
                }
            }
            let ret_hit = false;
            for (let ridx in ret) {
                if (fil_cmt(buf[0]) === ret[ridx].name) {
                    ret[ridx].value = fil_cmt(buf[1]);
                    ret_hit = true;
                    break;
                }
            }
            if (false === ret_hit) {
                ret.push({ name: fil_cmt(buf[0]), value: fil_cmt(buf[1]) });
            }
        }
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

module.exports = (txt) => {
    try {
        let prs_ret = parse.parse(txt).childNodes;
        prs_ret = mytree(prs_ret);
        /* check require */
        for (let pidx in prs_ret) {
            if ('require' === prs_ret[pidx].tag) {
                for (let tidx in prs_ret[pidx].atrobj) {
                    if ('tag' !== prs_ret[pidx].atrobj[tidx].tag) {
                        throw new Error('unknown tag');
                    }
                    req.add(prs_ret[pidx].atrobj[tidx]);
                }
            }
        }
        /* remake tree */
        prs_ret = parse.parse(txt).childNodes;
        prs_ret = mytree(prs_ret);
        
        /* parse tag */
        for (let pidx in prs_ret) {
            if (true === req.isExists(prs_ret[pidx].tag)) {
                cmp.add(prs_ret[pidx]);
            } else if ('require' !== prs_ret[pidx].tag) {
                console.warn('unknown component:' + prs_ret[pidx].tag);
            }
        }
        /* convert to js */
        let js = req.script() + '\n';
        js += 'try {\n    module.exports=[' + cmp.script() + '];\n';
        js += '} catch (e) {\n    console.error(e.stack);\n    throw e;\n}';
        return js;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
