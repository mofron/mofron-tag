/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Require  = require('./Require.js');
const Access   = require('./Access.js');
const Template = require('./Template.js');
const Script   = require('./Script.js');

global.req  = null;
global.gen  = {
    Declare: require('./base/Declare.js'),
    Module: require('./module/Module.js'),
    Config: require('./module/Config.js')
}
global.mod = { dec: [], conf: [], child: [], count: 0 };

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require */
	global.req = prs.require;
        let ret = new Require(prs.require.module()).toScript();
        ret += "const comutl=mofron.util.common;\n";
	ret += "const cmputl=mofron.util.component;\n";
        ret += "try {\n";
        
        /* access */
	if (null !== prs.access) {
	    ret += new Access(prs.access).toScript();
        }
        
        /* script (init[default]) */
	let scp = new Script(prs.script);
	scp.gencnf().type = "init";
	ret += "\n" + scp.toScript();
        
        /* template */
        ret += "\n" + new Template(prs.template).toScript();
        
	/* component */
        ret += "\n" + new global.gen.Module(prs.component).toScript();
        
        /* script (before) */
	scp.gencnf().type = "before";
        ret += "\n" + scp.toScript();
        
	ret += "\n    /* start visible */\n";
	ret += "    let root_cmp = new mofron.class.Component([";
	for (let cidx in prs.component) {
	    ret += prs.component[cidx].name + ",";
	}
	ret = ret.substring(0, ret.length-1) + "]);\n";

	scp.gencnf().type = "after";
	ret += "    root_cmp.visible(true,() => {try{\n\n" + scp.toScript();
	ret += "\n    }catch(e){console.error(e.stack);}});\n";
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";

	return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
