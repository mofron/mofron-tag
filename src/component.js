/**
 * @file component.js
 * @brief convert tag to js for component
 * @author simparts
 */
let thisobj = null;

let list = [];

let isNumStr = (str) => {
    try {
        if ('string' !== typeof str) {
            return false;
        }
        let chk = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let num = false;
        for (let sidx=0;sidx < str.length; sidx++) {
            for (let cidx in chk) {
                if (str[sidx] === chk[cidx]) {
                    num = true;
                    break;
                }
            }
            if (false === num) {
                return false;
            }
            num = false;
        }
        return true;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};

let getValue = (prm) => {
    try {
        let sp_str = prm.split(',');
        if (1 === sp_str.length) {
            return (true === isNumStr(sp_str[0])) ? sp_str[0] : "'" + sp_str[0] + "'";
        } else {
            let ret = '[';
            for (let sidx in sp_str) {
                ret += (true === isNumStr(sp_str[0])) ? sp_str[0] : "'" + sp_str[0] + "'";
                //ret += "'" + sp_str[sidx] + "',";
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
        config: (prm) => {
            try {
                let ret = "";
                if ( ('effect' !== prm.tag) &&
                     ('layout' !== prm.tag) &&
                     ('event'  !== prm.tag) ) {
                    return ret;
                }
                ret += prm.tag + ': [';
                for (let cidx in prm.child) {
                    ret += 'new ' + prm.child[cidx].tag + '({' + thisobj.option(prm.child[cidx].attrs) + '}),'
                }
                ret += '],';
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
                    ret += 'new ' + list[lidx].tag + '({'+ thisobj.option(list[lidx].attrs);
                    if (0 === list[lidx].child) {
                        ret += '}),';
                        continue;
                    }
                    for (let cidx in list[lidx].child) {
                        /* check config */
                        ret += thisobj.config(list[lidx].child[cidx]);
                    }
                    ret += '}),';
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
