/**
 * @file index.js
 * @brief mofron-tag command
 * @author simparts
 */
const fs = require('fs');
const Parser = require('./src/parse/Parser.js');
const sort = require('./src/parse/sort.js');
const mfconverter = require('./src/conv/controller.js');

let exec_load = (src) => {
    try {
        return new Promise(resolve => {
	    fs.readFile(src, 'utf8',
                (err,tag) => {
                    try {
                        if (undefined === tag) {
                            throw new Error("read file is failed:" + src);
                        }
                        resolve(new Parser(tag).parse());
		    } catch (e) {
                        console.error(e.stack);
			throw e;
		    }
		}
	    );
	});
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
}


let exec = async () => {
    try {
        /* load mofron tag */
	let mof = null
        await exec_load(
	    (3 > process.argv.length) ? './index.mof' : process.argv[2]
	).then(
	    result => { mof = result; }
	);
        sort(mof);

	let js = mfconverter(mof);
        
	/* write converted js code */
	if (4 > process.argv.length) {
	    console.log(js);
	} else if (4 === process.argv.length) {
            fs.writeFile(
	        process.argv[3], js,
		(err) => { if (null !== err) console.log(err); }
	    );
	}
    } catch (e) {
        console.error(e.stack);
	throw e;
    }
};

exec();
/* end of file */
