/**
 * @file index.js
 */
const parse5 = require('parse5')
const req = require('./require.js');
const cmp = require('./component.js');

let filter = (prm) => { 
    try {
        let ret = [];
        for (let pidx in prm) {
             if (undefined === prm[pidx].tagName) {
                  continue;
             }
             let buf = {};
             buf.tag   = prm[pidx].tagName;
             buf.attrs = prm[pidx].attrs;
             buf.child = (0 === prm[pidx].childNodes.length) ? prm[pidx].childNodes : filter(prm[pidx].childNodes); 
             ret.push(buf);
        }
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

module.exports = (txt) => {
    try {
        let prs_ret = parse5.parse(txt);
        prs_ret = prs_ret.childNodes[0].childNodes[1].childNodes;
        prs_ret = filter(prs_ret);
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
