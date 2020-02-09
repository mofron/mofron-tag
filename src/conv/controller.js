/**
 * @file ./conv/ctrl.js
 * @brief converter controller
 */
const Require   = require('./Require.js');
const Access    = require('./Access.js');
const Component = require('./component/Component.js');
const Template  = require('./Template.js');
const Script    = require('./Script.js');

/**
 * convert parsed object to script string
 */
module.exports = (prs) => {
    try {
        /* require */
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
        ret += "\n" + new Component(prs.component).toScript();
        
        /* script (before) */
	scp.gencnf().type = "before";
        ret += "\n" + scp.toScript();
        //ret += "\n" + new Script(prs.script, {type: "before"}).toScript();
        
	ret += "\n    /* start visible */\n";
	ret += "    let root_cmp = new mofron.class.Component([";
	for (let cidx in prs.component) {
	    ret += prs.component[cidx].name + ",";
	}
	ret = ret.substring(0, ret.length-1) + "]);\n";

	scp.gencnf().type = "after";
	ret += "    root_cmp.visible(true,() => {try{\n\n" + scp.toScript();
	//let sp_scp = scp.toScript().split("\n");
	//console.log(sp_scp);
	//for (let sp_idx in sp_scp) {
        //    ret += "    " + sp_scp[sp_idx] + "\n";
	//}
	ret += "\n    }catch(e){console.error(e.stack);}});\n";
        ret += "} catch (e) {\n    console.error(e.stack);\n}\n";

	//ret += "    " + prs.component[(prs.component.length)-1].name + ".visible(true";
        
        
	//scp.gencnf().type = "after";
        //ret += ",() => {try{\n\n" + scp.toScript();
	//ret += "\n    }catch(e){console.error(e.stack);}});\n";
        //ret += "} catch (e) {\n    console.error(e.stack);\n}\n";
        
	return ret;
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
}
/* end of file */
