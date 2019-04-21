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
            /* declare component */
            for (let cidx in cmp_lst) {
                let dec_cmp = new DecComp({
                    minify: this.gencnf().minify,
                    bsnm: 'cmp' + cidx + '_'
                });
                this.add(dec_cmp.toScript(cmp_lst[cidx]),0);
            }
            
            /* declare template */
            let dec_tmp = new DecTmpl({ minify: this.gencnf().minify });
            for (let tm_idx in tmpl) {
                dec_tmp.gencnf().name = tm_idx;
                this.add(dec_tmp.toScript(tmpl[tm_idx]),0);
            }
            
            /* struct area */
            let chd_gen = new Child({ minify: this.gencnf().minify });
            for (let cidx2 in cmp_lst) {
                this.add(chd_gen.toScript(cmp_lst[cidx2]),0);
            }
            /* option area */
            let opt_gen = new Options({ minify: this.gencnf().minify });
            for (let cidx3 in cmp_lst) {
                this.add(opt_gen.toScript(cmp_lst[cidx3]),0);
            }
            
            /* return area */
            let buf = "";
            buf += "let set_comp=[";
            for (let cidx4 in cmp_lst) {
                buf += cmp_lst[cidx4].name + ",";
            }
            buf = buf.substring(0, buf.length-1);
            buf += "];";
            this.add(buf);
            
            return this.m_script;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
