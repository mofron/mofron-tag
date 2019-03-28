/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const comp = require('./component.js');

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        let ret = "";
        /* require area */
        ret += prs.require.toScript();
        
        /* component area */
        ret += 'try {\n    module.exports=[\n';
        ret += '        ' + comp.toScript(prs.component) + '\n';
        ret += '    ];\n} catch (e) {\n    console.error(e.stack);\n    throw e;\n}';
        
        return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
