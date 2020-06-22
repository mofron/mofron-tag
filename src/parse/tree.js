/**
 * @file tree.js
 * @brief build tag tree object
 * @author simparts
 */
const attrs = require('./attrs.js');
const util  = require('../util.js');

/**
 * build tag tree object
 */
let tree = (prm, pnt) => {
    try {
        let ret = [];
        for (let pidx in prm) {
             if (undefined === prm[pidx].tagName) {
                 continue;
             }
             let buf = {};
             buf.tag = util.getCamel(prm[pidx].tagName);

	     /*** set attributes ***/
	     buf.attrs = {};

	     /* convert to array if attrs is overrided */
	     let set_atr = attrs.rawtxt2kv(prm[pidx].rawAttrs);
	     for (let set_idx in set_atr) {
                 if (undefined !== buf.attrs[set_idx]) {
                     if (false === Array.isArray(buf.attrs[set_idx])) {
                         buf.attrs[set_idx] = [buf.attrs[set_idx]];
                     }
                     buf.attrs[set_idx].push(set_atr[set_idx]);
		 } else {
                     buf.attrs[set_idx] = set_atr[set_idx];
		 }
             }
             buf.child   = [];
	     buf.cmp_cnt = 0;  // count of child in attrs 
             
             /* get text */
             buf.text   = null;
             if (0 < prm[pidx].childNodes.length) {
                 let txt = prm[pidx].childNodes[0].toString().split('\n');
                 if (1 === txt.length) {
                     buf.text = attrs.rawval2type(txt[0]);
                 } else {
                     let set_txt = "";
                     for (let tidx in txt) {
                         let sp_txt = txt[tidx].split(/^\s+/g);
                         for (let sp_idx in sp_txt) {
                             set_txt += sp_txt[sp_idx];
                         }
                     }
                     if ("" !== set_txt) {
		         if ("script" === prm[pidx].tagName) {
                             buf.text = prm[pidx].childNodes[0].toString();
			     if ("\n" === buf.text[0]) {
			         buf.text = buf.text.substring(1);
			     }
			     if ("\n" === buf.text[buf.text.length-1]) {
                                 buf.text = buf.text.substring(0, buf.text.length-1);
			     }
			 } else {
                             buf.text = attrs.rawval2type(set_txt);
			 }
                     }
                     
                 }
             }

	     buf.parent = (undefined === pnt) ? null : pnt;
             ret.push(buf);
             if (0 !== prm[pidx].childNodes.length) {
	         let prm_pnt = ret[ret.length-1];
                 buf.child = tree(prm[pidx].childNodes, prm_pnt);
             }
             
	     if (-1 !== buf.tag.indexOf(':')) {
                 let chd_buf = buf.child;
		 buf.child = [];
		 buf.child.push({
                     tag     : buf.tag.substring(buf.tag.indexOf(':')+1),
		     attrs   : buf.attrs,
		     cmp_cnt : buf.cmp_cnt,
		     text    : buf.text,
		     child   : chd_buf,
		     parent  : buf
		 });
		 buf.tag     = buf.tag.substring(0,buf.tag.indexOf(':'));
		 buf.attrs   = {};
		 buf.cmp_cnt = 0;
		 buf.text    = null;
	     }

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
