/**
 * @file Template.js
 * @brief declare template generator
 * @author simparts
 */
const Declare   = require('./Declare.js');
const Component = require('./Component.js');
const Child     = require('../Child.js');
const Options   = require('./TagOpt.js');

module.exports = class extends Declare {
    
    constructor (opt) {
        try {
            super(opt);
            this.gencnf().bsnm = 'tmpl';
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getGen () {
        try {
            return {
                comp    : new Component({ minify: true, bsnm: 'tcmp' }),
                child   : new Child({ minify: true }),
                options : new Options({ minify: true })
            };
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    toScript (cnt) {
        try {
            let val = "(p)=>{";
            for (let cidx in cnt) {
                let gen = this.getGen();
                val += gen.comp.toScript(cnt[cidx]);
                val += gen.child.toScript(cnt[cidx]);
                val += gen.options.toScript(cnt[cidx]);
            }
            
            val += "return [";
            for (let cidx2 in cnt) {
                val += cnt[cidx2].name + ","
            }
            val = val.substring(0, val.length-1);
            val += "];};";
            
            return super.toScript(val);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
}
/* end of file */
