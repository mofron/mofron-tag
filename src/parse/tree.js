/**
 * @file tree.js
 * @brief build tag tree object
 * @author simparts
 */
const attrs = require('./attrs.js');

/**
 * build tag tree object
 */
let tree = (prm) => {
    try {
        let ret = [];
        for (let pidx in prm) {
             if (undefined === prm[pidx].tagName) {
                 continue;
             }
             let buf    = {};
             buf.tag    = prm[pidx].tagName;
             buf.src    = false;
             buf.attrs  = attrs.text(prm[pidx].rawAttrs);
             buf.child  = [];
             
             /* get text */
             buf.text   = null;
             if (0 < prm[pidx].childNodes.length) {
                 let txt = prm[pidx].childNodes[0].toString().split('\n');
                 if (1 === txt.length) {
                     buf.text = ('' === txt[0]) ? null : txt[0];
                 } else {
                     let set_txt = "";
                     for (let tidx in txt) {
                         let sp_txt = txt[tidx].split(/^\s+/g);
                         for (let sp_idx in sp_txt) {
                             set_txt += sp_txt[sp_idx];
                         }
                     }
                     if ("" !== set_txt) {
                         buf.text = set_txt;
                     }
                     
                 }
             }
             
             if (0 !== prm[pidx].childNodes.length) {
                 buf.child = tree(prm[pidx].childNodes);
             }
             ret.push(buf);
        }
        
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

/**
 * get tag tree object
 *
 * @param[in] ptag: parsed object by node-html-parser
 * @return tag tree object
 * @note element object structure
 *   {
 *     tag   : (string) tag name,
 *     attrs : (array) attributes { name: (string) attr key, value: (object) attr val },
 *     child : (array) child tree elements,
 *     text  : (string) tag contents,
 *   }
 */
module.exports = (ptag) => {
    try { return tree(ptag); } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
