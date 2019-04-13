/**
 * @file Component.js
 * @brief component script generator
 * @author simparts
 */
const Base    = require('./BaseGen.js');
const DecComp = require('./dec/Component.js');
const DecTmpl = require('./dec/Template.js');
const Options = require('./Options.js');
const Child   = require('./Child.js');

module.exports = class extends Base {
    
    toScript (cmp_lst, tmpl) {
        try {
            let ret = "";
            /* declare component */
            let dec_cmp = new DecComp({ minify: this.gencnf().minify });
            for (let cidx in cmp_lst) {
                ret += dec_cmp.toScript(cmp_lst[cidx]);
            }
            
            /* declare template */
            let dec_tmp = new DecTmpl({ minify: this.gencnf().minify });
            for (let tm_idx in tmpl) {
                dec_tmp.gencnf().name = tm_idx;
                ret += dec_tmp.toScript(tmpl[tm_idx]);
            }
            
            /* struct area */
            let chd_gen = new Child({ minify: this.gencnf().minify });
            for (let cidx2 in cmp_lst) {
                ret += chd_gen.toScript(cmp_lst[cidx2]);
            }
            /* option area */
            let opt_gen = new Options({ minify: this.gencnf().minify });
            for (let cidx3 in cmp_lst) {
                ret += opt_gen.toScript(cmp_lst[cidx3]);
                //ret += options.toScript(cmp_lst[cidx3]);
            }
            
            /* return area */
            ret += (false === this.gencnf().minify) ? "    " : "";
            ret += "module.exports=[";
            for (let cidx4 in cmp_lst) {
                ret += cmp_lst[cidx4].name + ",";
            }
            ret = ret.substring(0, ret.length-1);
            ret += "];";
            ret += (false === this.gencnf().minify) ? "\n" : "";
            
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
