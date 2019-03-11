/**
 * @file template.js
 * @brief
 * @author 
 */
let thisobj = null;

let list = [];

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        add : (atr) => {
            try {
                if ((null === atr) || (2 !== atr.length)) {
                    throw new Error('invalid parameter');
                }
                /* check tag */
                if (('tag' !== atr[0].name) && ('tag' !== atr[1].name)) {
                    throw new Error('could not find "tag" attribute');
                }
                /* check name */
                if (('name' !== atr[0].name) && ('name' !== atr[1].name)) {
                    throw new Error('could not find "name" attribute');
                }
                
                list.push({
                    tag: ('tag' === atr[0].name) ? atr[0].value : atr[1].value,
                    name: ('name' === atr[0].name) ? atr[0].value : atr[1].value,
                });
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
        script : () => {
            try {
                let ret = '';
                for (let lidx in list) {
                    ret += 'const ' + list[lidx].tag + ' = ';
                    ret += "require('" + list[lidx].name + "');\n";
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        }
    }
    module.exports = thisobj;
} catch (e) {
    console.error(e.stack);
    throw e;
}
/* end of file */
