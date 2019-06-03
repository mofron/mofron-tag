/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Req   = require('./Require.js');
const Res   = require('./Respsv.js');
const Comp  = require('./Component.js');
const Scrpt = require('./Script.js');

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require area */
        let ret = "require('expose-loader?app!../conf/namesp.js');\n";
        let req_gen = new Req();
        ret += req_gen.toScript(prs.require);
        
        ret += "try {\n";
        
        /* responsiv area */
        let res_gen = new Res();
        ret += res_gen.toScript(prs.responsive);
        
        let scp_gen = null;
        /* init script */
        for (let scp_idx in prs.script) {
            if ("init" === prs.script[scp_idx].attrs.run) {
                scp_gen = new Scrpt();
                ret += scp_gen.toScript(prs.script[scp_idx]);
            }
        }
        
        /* component area */
        let cmp_gen = new Comp({ parse: prs });
        ret += cmp_gen.toScript(prs.component, prs.template);
        ret += "    app.root.child(set_comp)\n";
        
        /* hurry script */
        for (let scp_idx2 in prs.script) {
            if ("hurry" === prs.script[scp_idx2].attrs.run) {
                scp_gen = new Scrpt();
                ret += scp_gen.toScript(prs.script[scp_idx3]);
            }
        }
        ret += "    app.root.visible(true);\n\n";
        
        /* defer script */
        for (let scp_idx3 in prs.script) {
            if ( (undefined === prs.script[scp_idx3].attrs.run) ||
                 ("defer" === prs.script[scp_idx3].attrs.run)) {
                scp_gen = new Scrpt();
                ret += scp_gen.toScript(prs.script[scp_idx3]);
            }
        }
        
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
