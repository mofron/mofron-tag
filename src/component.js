/**
 * @file template.js
 * @brief
 * @author 
 */
let thisobj = null;

let list = [];

let getValue = (prm) => {
    try {
        let sp_str = prm.split(',');
        if (1 === sp_str.length) {
            return "'" + sp_str[0] + "'";
        } else if (("[" === prm[0]) && ("]" === prm[prm.length-1])) {
            return prm;
        } else {
            let ret = '[';
            for (let sidx in sp_str) {
                ret += "'" + sp_str[sidx] + "',";
            }
            return ret + "]";
        }
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}

try {
    if (null !== thisobj) {
        module.exports = thisobj;
    }

    thisobj = {
        add: (prm) => {
            try {
                list.push(prm);
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        option: (attr) => {
            try {
                let ret = "";
                for (let aidx in attr) {
                    ret += attr[aidx].name + ':';
                    ret += getValue(attr[aidx].value) + ',';
                }
                return ret;
            } catch (e) {
                console.error(e.stack);
                throw e;
            }
        },
        script: () => {
            try {
                let ret = '';
                for (let lidx in list) {
                    ret += 'new ' + list[lidx].tag + '({'+ thisobj.option(list[lidx].attrs) +'}),'
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
