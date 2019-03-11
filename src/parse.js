/**
 * @file index.js
 */
const parse = require('node-html-parser');
const req   = require('./require.js');
const cmp   = require('./component.js');

let mytree = (prm) => { 
    try {
        let ret = [];
        for (let pidx in prm) {
             if (undefined === prm[pidx].tagName) {
                 continue;
             }
             let buf   = {};
             buf.tag   = prm[pidx].tagName;
             buf.attrs = get_attr(prm[pidx].rawAttrs);
             buf.child = (0 === prm[pidx].childNodes.length) ? prm[pidx].childNodes : mytree(prm[pidx].childNodes);
             ret.push(buf);
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
        let ret   = [];
        let attrs = atr.split(' ');
        let buf   = null;
        for (let aidx in attrs) {
            buf = attrs[aidx].split('=');
            ret.push({ name: fil_cmt(buf[0]), value: fil_cmt(buf[1]) });
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
        /* parse tag */
        for (let pidx in prs_ret) {
            if ('require' === prs_ret[pidx].tag) {
                req.add(prs_ret[pidx].attrs);
            } else if (true === req.isExists(prs_ret[pidx].tag)) {
                cmp.add(prs_ret[pidx]);
            } else {
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
