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
             if ("@" === prm[pidx].rawAttrs[0]) {
	         let spatr = prm[pidx].rawAttrs.split(" ");
                 buf.tag += spatr[0];
                 prm[pidx].rawAttrs = prm[pidx].rawAttrs.substring(spatr[0].length+1);
	     }

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
             
             let sp_tag = buf.tag.split(':');
	     if (1 < sp_tag.length) {
	         let set_buf = { attrs: buf.attrs, cmp_cnt: buf.cmp_cnt, text: buf.text, child: buf.child };
	         let add_tgt = buf;
                 for (let sp_idx=1; sp_idx < sp_tag.length ;sp_idx++) {
                     add_tgt.child = [];
		     let add       = {
                         tag     : sp_tag[sp_idx],
                         attrs   : set_buf.attrs,
                         cmp_cnt : set_buf.cmp_cnt,
                         text    : set_buf.text,
                         child   : set_buf.child,
                         parent  : add_tgt
		     }
                     add_tgt.tag     = sp_tag[sp_idx-1];
		     add_tgt.attrs   = {};
		     add_tgt.cmp_cnt = 0;
		     add_tgt.text    = null;
		     add_tgt.child.push(add);
		     add_tgt = add;
		 }
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
