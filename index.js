/**
 * @file index.js
 * @brief mofron-tag command
 * @author simparts
 */
const fs    = require('fs');
const parse = require('./src/parse/ctrl.js');
const conv  = require('./src/conv/ctrl.js');

let write = (js) => {
    try {
        if (4 > process.argv.length) {
            console.log(js);
        } else if (4 === process.argv.length) {
            fs.writeFile(
                process.argv[3],
                js,
                (err) => {
                    if (null !== err)  {
                        console.log(err);
                    }
                }
            );
        }
    } catch (e) {
        console.error(e.stack);
        throw e;
    }
};

fs.readFile(
    (3 > process.argv.length) ?  './tag/index.mof' : process.argv[2],
    'utf8',
    function (err, tag) {
        try {
            let prs_tag = parse.main(tag);
            setTimeout(
                () => {
                    try {
                        parse.sort(prs_tag);
                        //console.log(conv(prs_tag));
                        write(conv(prs_tag));
                    } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                },
                1000
            );
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
);
/* end of file */
