/**
 * @file template.js
 * @brief
 * @author 
 */

let list = [
    { tag: 'mf', mod: '"mofron"' }
];
module.exports = {
    add : (tag) => {
        try {
            /* check attrs */
            for (let aidx in tag.attrs) {
                if ('module' === aidx) {
                    list.push({
                        tag: tag.text,
                        mod: tag.attrs[aidx]
                    });
                    continue;
                }
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    isExists : (tag) => {
        try {
            for (let lidx in list) {
                if (tag === list[lidx].tag) {
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    },
    toScript : () => {
        try {
            let ret = '';
            for (let lidx in list) {
                ret += 'const ' + list[lidx].tag + ' = ';
                ret += "require(" + list[lidx].mod + ");\n";
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
