/**
 * @file Style.js
 * @brief component style method generator
 * @author simparts
 */
const util = require('../../util.js');

module.exports = {
    
    txt2array: (txt) => {
        try {
            let ret = "{";
            /* format string */
            if (true === util.isComment(txt)) {
                txt = txt.substring(1, txt.length-1);
            }
            /* delete space */
            let nsp     = txt.split(' ');
            let nsp_str = "";
            for (let nsp_idx in nsp) {
                nsp_str += nsp[nsp_idx];
            }
            /* set every element */
            let sp_txt = nsp_str.split(';');
            sp_txt.pop();
            let sp_elm = null;
            let buf    = "";
            for (let sp_idx in sp_txt) {
                sp_elm = sp_txt[sp_idx].split(':');
                if (2 !== sp_elm.length) {
                    throw new Error('invalid style');
                }
                buf += "'" + sp_elm[0] + "':";
                buf += "'" + sp_elm[1] + "',";
            }
	    ret += buf.substring(0, buf.length-1) + "}";
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
