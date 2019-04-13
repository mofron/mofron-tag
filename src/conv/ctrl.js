/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Comp = require('./Component.js');


/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        let ret = "";
        /* require area */
        ret += prs.require.toScript();
        //comp.add(prs.component);
        
        /* component area */
        let cmp_gen = new Comp();
        ret += 'try {\n';
        ret += cmp_gen.toScript(prs.component, prs.template);
        ret += '\n} catch (e) {\n    console.error(e.stack);\n    throw e;\n}';
        
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
